#!/usr/bin/env node
// Ajout manuel d'un cas d'usage dans Agentipedia (cas clients HUB, cas repérés
// à la main, etc.) — sans passer par le moteur de curation.
//
//   npm run add-case                  → saisie guidée, question par question
//   npm run add-case -- fiche.json    → ingestion d'une fiche déjà rédigée
//   npm run add-case -- --template    → écrit un modèle JSON à remplir
//
// La fiche est validée avec EXACTEMENT la même règle que le moteur
// (engine/schema.mjs) : entreprise nommée + solution nommée + au moins une
// source vérifiable. Rien n'est écrit si la validation échoue.
//
// Les fiches ajoutées ici portent provenance:"manual" : elles sont traçables,
// affichées avec un badge sur le site, et le moteur ne les écrasera jamais
// (mergeUpdate ne remplace aucun champ déjà rempli).

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import {
  SECTORS, REGIONS, SOURCE_TYPES, DEPLOYMENT_STAGES,
  CODA_CHAINS, CODA_LOCKS,
  validateEntry, applyConfidencePolicy, makeEntryId,
} from "../engine/schema.mjs";
import { findExisting } from "../engine/dedupe.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const ENTRIES_PATH = path.join(ROOT, "data", "entries.json");
const TODAY = new Date().toISOString().slice(0, 10);

const c = {
  b: (s) => `\x1b[1m${s}\x1b[0m`, dim: (s) => `\x1b[2m${s}\x1b[0m`,
  g: (s) => `\x1b[32m${s}\x1b[0m`, r: (s) => `\x1b[31m${s}\x1b[0m`,
  y: (s) => `\x1b[33m${s}\x1b[0m`, m: (s) => `\x1b[35m${s}\x1b[0m`,
};

const TEMPLATE = {
  company: "Nom exact de l'entreprise (jamais « un grand distributeur »)",
  company_country: "France",
  region: "Europe",
  sector: "Financial Services",
  industry: "Sous-secteur (ex. Banque de détail)",
  department: "Où l'agent travaille (ex. Service client)",
  solution_name: "Nom exact de l'agent / de la solution",
  vendor: "Éditeur, ou In-house, ou vide si non communiqué",
  use_case: "Ce que fait l'agent, tel que la source le décrit.",
  deployment_stage: "production",
  reported_outcomes: [
    { metric: "Ce qui est mesuré", value: "La valeur publiée", source_type: "company_official" },
  ],
  sources: [
    {
      url: "https://exemple.com/la-page-qui-le-prouve",
      title: "Titre de la page",
      publisher: "Éditeur de la page",
      source_type: "company_official",
      retrieved_date: TODAY,
    },
  ],
  coda: {
    chain: "care",
    links: [2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    observed: 2,
    locks: [],
    basis_en: "Proof line in English: what the agent measurably does.",
    basis_fr: "Ligne de preuve en français : ce que l'agent fait de façon mesurable.",
  },
};

function readStore() {
  return JSON.parse(fs.readFileSync(ENTRIES_PATH, "utf8"));
}
function writeStore(store) {
  store.entries.sort((a, b) => a.id.localeCompare(b.id));
  store.updated_at = new Date().toISOString();
  fs.writeFileSync(ENTRIES_PATH, JSON.stringify(store, null, 2) + "\n");
}

/** Complète les champs calculés et applique la politique de confiance. */
function finalize(draft) {
  const e = {
    ...draft,
    id: makeEntryId(draft.company, draft.solution_name),
    first_seen_date: draft.first_seen_date || TODAY,
    provenance: "manual",
    reported_outcomes: draft.reported_outcomes ?? [],
    vendor: draft.vendor ?? "",
    department: draft.department ?? "",
    industry: draft.industry ?? "",
  };
  if (typeof e.confidence !== "number") {
    e.confidence = 0.75;
    e.confidence_reason =
      e.confidence_reason ||
      "Fiche ajoutée à la main par l'équipe HUB Institute, sur la base des sources citées.";
  }
  return applyConfidencePolicy(e);
}

function report(entry) {
  // validateEntry renvoie { ok, errors } — surtout pas un tableau.
  const { ok, errors } = validateEntry(entry);
  if (!ok) {
    console.error(`\n${c.r("✗ Fiche refusée")} — ${errors.length} problème(s) :`);
    for (const e of errors) console.error(`   • ${e}`);
    console.error(c.dim("\nRien n'a été écrit. Corrigez puis relancez."));
    return false;
  }
  return true;
}

function save(entry) {
  const store = readStore();
  const dup = findExisting(store.entries, entry);
  if (dup) {
    console.error(`\n${c.r("✗ Doublon")} : « ${dup.company} × ${dup.solution_name} » existe déjà (${dup.id}).`);
    console.error(c.dim("   Modifiez data/entries.json directement pour enrichir cette fiche."));
    return false;
  }
  store.entries.push(entry);
  writeStore(store);
  console.log(`\n${c.g("✓ Fiche ajoutée")} : ${c.b(entry.company + " × " + entry.solution_name)}`);
  console.log(`   id         : ${entry.id}`);
  console.log(`   confiance  : ${Math.round(entry.confidence * 100)} %`);
  console.log(`   total      : ${store.entries.length} fiches dans l'index`);
  console.log(c.dim(`\n   Page       : /entry/${entry.id}/`));
  console.log(c.dim("   Publication : git add data/entries.json && git commit && git push"));
  console.log(c.dim("                 (le déploiement Cloudflare part tout seul)"));
  return true;
}

// ---------------- mode fichier ----------------
function fromFile(file) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const list = Array.isArray(raw) ? raw : [raw];
  let ok = 0;
  for (const draft of list) {
    const entry = finalize(draft);
    if (report(entry) && save(entry)) ok++;
  }
  console.log(`\n${ok}/${list.length} fiche(s) ajoutée(s).`);
  return ok === list.length;
}

// ---------------- mode guidé ----------------
async function interactive() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const ask = async (q, { def = "", required = true, choices = null, hint = "" } = {}) => {
    while (true) {
      if (hint) console.log(c.dim("   " + hint));
      if (choices) console.log(c.dim("   Choix : " + choices.join(" · ")));
      const a = (await rl.question(c.b("› " + q) + (def ? c.dim(` [${def}]`) : "") + " ")).trim();
      const v = a || def;
      if (!v && required) { console.log(c.r("   ⚠ Obligatoire.")); continue; }
      if (v && choices && !choices.includes(v)) { console.log(c.r(`   ⚠ Valeur hors liste.`)); continue; }
      return v;
    }
  };

  console.log(c.m("\n━━━ Nouvelle fiche Agentipedia ━━━"));
  console.log(c.dim("Règle : entreprise nommée + solution nommée + au moins une source vérifiable.\n"));

  const company = await ask("Entreprise", { hint: "Nom exact, jamais générique." });
  const solution_name = await ask("Nom de l'agent / de la solution", { hint: "Le nom public du produit ou de l'agent interne." });
  const vendor = await ask("Éditeur", { required: false, hint: "Vide si non communiqué. « In-house » si développé en interne." });
  const sector = await ask("Secteur", { choices: SECTORS });
  const industry = await ask("Industrie (sous-secteur)", { required: false });
  const department = await ask("Département", { required: false, hint: "Où l'agent travaille : Service client, Sinistres…" });
  const company_country = await ask("Pays de l'entreprise", { hint: "En anglais dans les données : France, United States…" });
  const region = await ask("Région", { choices: REGIONS });
  const deployment_stage = await ask("Stade", { choices: DEPLOYMENT_STAGES, def: "production" });
  const use_case = await ask("Ce que fait l'agent", { hint: "1 à 3 phrases, au plus près de la source." });

  console.log(c.m("\n── Résultats rapportés ") + c.dim("(entrée vide pour arrêter)"));
  const reported_outcomes = [];
  while (true) {
    const metric = await ask(`Résultat ${reported_outcomes.length + 1} — ce qui est mesuré`, { required: false });
    if (!metric) break;
    const value = await ask("   valeur publiée");
    const source_type = await ask("   type de source", { choices: SOURCE_TYPES, def: "company_official" });
    reported_outcomes.push({ metric, value, source_type });
  }

  console.log(c.m("\n── Sources ") + c.dim("(au moins une, avec URL)"));
  const sources = [];
  while (true) {
    const url = await ask(`Source ${sources.length + 1} — URL`, { required: sources.length === 0 });
    if (!url) break;
    const title = await ask("   titre de la page");
    const publisher = await ask("   éditeur de la page");
    const source_type = await ask("   type", { choices: SOURCE_TYPES, def: "company_official" });
    const retrieved_date = await ask("   date de consultation", { def: TODAY });
    sources.push({ url, title, publisher, source_type, retrieved_date });
  }

  console.log(c.m("\n── Score CODA™"));
  const chain = await ask("Chaîne de valeur", { choices: CODA_CHAINS, hint: "La frise sur laquelle l'agent travaille." });
  const links = await (async () => {
    while (true) {
      const s = await ask("Les 10 maillons", {
        hint: "10 chiffres collés : 0 = rien, 1 = partiel, 2 = plein. Ex : 2120000000",
      });
      const arr = s.replace(/\D/g, "").split("").map(Number);
      if (arr.length === 10 && arr.every((n) => n <= 2) && arr.some((n) => n > 0)) return arr;
      console.log(c.r("   ⚠ Il faut 10 chiffres (0/1/2), dont au moins un > 0."));
    }
  })();
  const observed = Number(await ask("Autonomie observée N1-4", { choices: ["1", "2", "3", "4"], hint: "Test des 24 h : si l'humain ne fait rien, la décision se prend-elle ?" }));
  console.log(c.dim("   Verrous avec preuve publique (séparés par une virgule, vide si aucun)"));
  const locksRaw = await ask("Verrous", { required: false, hint: CODA_LOCKS.join(", ") });
  const locks = locksRaw.split(",").map((s) => s.trim()).filter((s) => CODA_LOCKS.includes(s));
  const basis_fr = await ask("Ligne de preuve (FR)", { hint: "Ce qui atteste le niveau : volumes, taux, ce que l'agent exécute." });
  const basis_en = await ask("Ligne de preuve (EN)", { def: basis_fr });

  await rl.close();

  const entry = finalize({
    company, company_country, region, sector, industry, department,
    solution_name, vendor, use_case, deployment_stage,
    reported_outcomes, sources,
    coda: { chain, links, observed, locks, basis_en, basis_fr },
  });

  console.log(c.m("\n── Récapitulatif"));
  console.log(JSON.stringify(entry, null, 2));
  return report(entry) && save(entry);
}

// ---------------- entrée ----------------
const arg = process.argv[2];
if (arg === "--template") {
  const out = path.join(ROOT, "nouvelle-fiche.json");
  fs.writeFileSync(out, JSON.stringify(TEMPLATE, null, 2) + "\n");
  console.log(`${c.g("✓")} Modèle écrit : ${c.b("nouvelle-fiche.json")}`);
  console.log(c.dim("  Remplissez-le, puis : npm run add-case -- nouvelle-fiche.json"));
} else if (arg) {
  process.exit(fromFile(arg) ? 0 : 1);
} else {
  interactive().then((ok) => process.exit(ok ? 0 : 1));
}
