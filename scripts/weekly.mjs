#!/usr/bin/env node
// La newsletter du lundi, en texte brut, prête à coller.
//
//   npm run weekly                  → les fiches entrées dans l'index depuis 7 jours
//   npm run weekly -- --days 14     → sur une autre fenêtre
//   npm run weekly -- --since 2026-11-01
//   npm run weekly -- --en          → version anglaise
//   npm run weekly -- --out out.txt → écrit dans un fichier plutôt que sur la sortie
//
// La fenêtre se lit sur first_seen_date, la date d'entrée dans l'index : c'est
// ce qui est nouveau pour le lecteur, pas la date de la preuve, qui peut être
// bien plus ancienne. Quand rien n'est entré, le script le dit au lieu de
// fabriquer du contenu : une semaine sans déploiement vérifié est une
// information, pas un trou à combler.
//
// Pas de tiret dans le texte produit : c'est la règle de style de la maison.
import fs from "node:fs";
import path from "node:path";
import { codaDeclared, codaQuadrant, isCapped, QUADRANT } from "../engine/coda.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const SITE = "https://agentipedia.hubinstitute.com";
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
const EN = argv.includes("--en");
const DAYS = Number(flag("--days") || 7);
const OUT = flag("--out");

const readJson = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback);
const entries = [
  ...readJson(path.join(ROOT, "data", "entries.json"), { entries: [] }).entries,
  ...readJson(path.join(ROOT, "data", "manual-cases.json"), []),
];

const today = new Date().toISOString().slice(0, 10);
const since = flag("--since") || new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);
const fresh = entries
  .filter((e) => e.first_seen_date && e.first_seen_date > since && e.first_seen_date <= today)
  .sort((a, b) => b.first_seen_date.localeCompare(a.first_seen_date) || a.company.localeCompare(b.company));

/** Une phrase, pas un paragraphe : la première du use_case, ou une coupe nette. */
const oneSentence = (text, max = 220) => {
  const s = (text || "").trim();
  if (s.length <= max) return s;
  const first = s.match(/^.*?[.!?](?=\s)/)?.[0];
  if (first && first.length <= max) return first;
  const cut = s.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
};

// Les pays sont stockés en anglais dans les fiches. Plutôt que de recopier une
// table de traduction qui dériverait, on reconstruit la correspondance avec
// Intl : nom anglais vers code région, puis code région vers nom français.
const COUNTRY_FR = (() => {
  const en = new Intl.DisplayNames(["en"], { type: "region" });
  const fr = new Intl.DisplayNames(["fr"], { type: "region" });
  const map = new Map();
  for (let a = 65; a <= 90; a++)
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b);
      const name = en.of(code);
      if (name && name !== code) map.set(name, fr.of(code));
    }
  return map;
})();
const countryLabel = (c) => (EN ? c : COUNTRY_FR.get(c) || c);

const SECTOR_FR = {
  "Financial Services": "Services financiers", "Insurance": "Assurance",
  "Retail & E-commerce": "Distribution & e-commerce", "Healthcare, Life Sciences & Luxury": "Santé, sciences du vivant & luxe",
  "Travel & Transportation": "Voyage & transport", "Telecommunications": "Télécommunications",
  "Media & Entertainment": "Médias & divertissement", "Consumer Goods & Manufacturing": "Biens de consommation & industrie",
  "Energy & Utilities": "Énergie & services aux collectivités", "Public Sector & Education": "Secteur public & éducation",
  "Professional & Business Services": "Services professionnels", "Automotive & Mobility": "Automobile & mobilité",
  "Hospitality & Food": "Hôtellerie & restauration", "Real Estate & Construction": "Immobilier & construction",
};
const sectorLabel = (s) => (EN ? s : SECTOR_FR[s] || s);

const T = EN
  ? {
      subject: (n, when) => (n ? `${n} new verified AI agent deployment${n > 1 ? "s" : ""} ${when}` : `No new verified deployment ${when}`),
      intro: (n, total, when) => `${n} new deployment${n > 1 ? "s" : ""} entered Agentipedia ${when}. The index now holds ${total} proofs, each naming the company, naming the solution and linking the public sources behind it.`,
      empty: (total, when) => `Nothing new entered Agentipedia ${when}. The index still holds ${total} verified proofs, and the rule has not moved: no source, no entry. We would rather send you a short week than a padded one.`,
      window: (d) => (d === 7 ? "this week" : `since ${d}`),
      capped: "observed above the autonomy its documented controls allow",
      browse: "Browse the directory",
      outcome: "Reported:",
      sign: "Agentipedia, the proof directory by HUB Institute.",
    }
  : {
      subject: (n, when) => (n ? `${n} nouveau${n > 1 ? "x" : ""} déploiement${n > 1 ? "s" : ""} d'agents IA vérifié${n > 1 ? "s" : ""} ${when}` : `Aucun nouveau déploiement vérifié ${when}`),
      intro: (n, total, when) => `${n} nouveau${n > 1 ? "x" : ""} déploiement${n > 1 ? "s" : ""} ${n > 1 ? "sont entrés" : "est entré"} dans l'Agentipedia ${when}. L'index compte désormais ${total} preuves, chacune nommant l'entreprise, nommant la solution et renvoyant aux sources publiques qui l'attestent.`,
      empty: (total, when) => `Rien de nouveau dans l'Agentipedia ${when}. L'index compte toujours ${total} preuves vérifiées, et la règle n'a pas bougé : pas de source, pas de fiche. Nous préférons une semaine courte à une semaine remplie pour le principe.`,
      window: (d) => (d === 7 ? "cette semaine" : `depuis le ${d}`),
      capped: "observé au-dessus de l'autonomie que ses verrous documentés autorisent",
      browse: "Parcourir l'annuaire",
      outcome: "Résultat publié :",
      sign: "Agentipedia, l'annuaire des preuves du HUB Institute.",
    };

const lines = [];
const total = entries.length;
const when = T.window(flag("--since") || DAYS === 7 ? (flag("--since") ? since : 7) : since);
lines.push(T.subject(fresh.length, when));
lines.push("");

if (!fresh.length) {
  lines.push(T.empty(total, when));
} else {
  lines.push(T.intro(fresh.length, total, when));
  lines.push("");

  const bySector = new Map();
  for (const e of fresh) {
    const k = sectorLabel(e.sector);
    if (!bySector.has(k)) bySector.set(k, []);
    bySector.get(k).push(e);
  }
  for (const [sector, list] of [...bySector].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))) {
    lines.push(sector.toUpperCase());
    lines.push("");
    for (const e of list) {
      const d = e.coda ? codaDeclared(e.coda) : null;
      const q = e.coda ? QUADRANT[codaQuadrant(e.coda)] : null;
      const badge = d ? ` · N${d} ${EN ? q.en : q.fr}` : "";
      lines.push(`${e.company}, ${e.solution_name} (${countryLabel(e.company_country)})${badge}`);
      lines.push(oneSentence(e.use_case));
      const outcome = e.reported_outcomes?.[0];
      if (outcome) lines.push(`${T.outcome} ${outcome.value} (${outcome.metric}).`);
      if (e.coda && isCapped(e.coda)) lines.push(`${EN ? "Flagged" : "Signalé"} : ${T.capped}.`);
      lines.push(`${SITE}/entry/${e.id}/`);
      lines.push("");
    }
  }
}

lines.push(`${T.browse} : ${SITE}/`);
lines.push(T.sign);

const text = lines.join("\n");
if (OUT) {
  fs.writeFileSync(path.join(ROOT, OUT), text + "\n");
  console.error(`${fresh.length} fiche(s) depuis le ${since} → ${OUT}`);
} else {
  process.stdout.write(text + "\n");
  console.error(`\n(${fresh.length} fiche(s) entrée(s) depuis le ${since})`);
}
