/**
 * Cloudflare Pages worker for agentipedia.
 *
 * Everything is served statically except POST /api/add-case, which lets the
 * team add a use case by hand from /admin on the site. The handler validates
 * the draft against the same rule as the curation engine, then commits it to
 * data/manual-cases.json on GitHub — which triggers the deploy workflow, so the
 * fiche is live a couple of minutes later.
 *
 * Manual cases go to their own file because data/entries.json is over GitHub's
 * 1MB Contents API limit; the site and the artifact merge both at build time.
 *
 * Required environment variables (Cloudflare Pages → Settings → Variables,
 * both encrypted):
 *   ADD_CASE_PASSWORD  shared password the form asks for
 *   GITHUB_TOKEN       fine-grained PAT with Contents: read & write on the repo
 * Optional: GITHUB_REPO (default "Rubsss12/agentipedia").
 */

const FILE = "data/manual-cases.json";
const SECTORS = ["Financial Services","Insurance","Healthcare & Life Sciences","Retail & E-commerce","Consumer Goods & Manufacturing","Automotive & Mobility","Technology & Software","Telecommunications","Media & Entertainment","Travel & Transportation","Hospitality & Food","Energy & Utilities","Public Sector & Education","Professional & Business Services"];
const REGIONS = ["North America","Latin America","Europe","Middle East","Africa","South Asia","East Asia","Southeast Asia","Oceania","Antarctica"];
const STAGES = ["pilot","production","announced","unknown"];
const STYPES = ["company_official","earnings_call","news_media","conference_talk","vendor_case_study","press_release","other"];
const CHAINS = ["care","commerce","achats","fonctions","pilotage","ops","fraude","revenue","claims","soin","delivery","science","public","supply","vente"];
const LOCKS = ["data","mandate","supervision","compliance"];
const MARKETING = new Set(["vendor_case_study","press_release"]);

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json; charset=utf-8" } });

const clean = (v) => (typeof v === "string" ? v.trim() : "");

function slug(s) {
  return clean(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** Same rule as engine/schema.mjs: named company, named solution, real source. */
function validate(d) {
  const errors = [];
  if (!clean(d.company)) errors.push("L'entreprise est obligatoire.");
  if (!clean(d.solution_name)) errors.push("Le nom de l'agent est obligatoire.");
  if (!clean(d.company_country)) errors.push("Le pays est obligatoire.");
  if (!clean(d.use_case)) errors.push("La description de ce que fait l'agent est obligatoire.");
  if (!SECTORS.includes(d.sector)) errors.push("Secteur invalide.");
  if (!REGIONS.includes(d.region)) errors.push("Région invalide.");
  if (!STAGES.includes(d.deployment_stage)) errors.push("Stade invalide.");

  // La source est facultative : une fiche transmise par l'équipe peut être
  // publiée sans trace publique. Si une source est fournie, elle doit être
  // complète et valide.
  const sources = Array.isArray(d.sources) ? d.sources : [];
  sources.forEach((s, i) => {
    let ok = false;
    try { const u = new URL(s?.url); ok = u.protocol === "http:" || u.protocol === "https:"; } catch { ok = false; }
    if (!ok) errors.push(`Source ${i + 1} : l'URL est invalide.`);
    if (!clean(s?.title)) errors.push(`Source ${i + 1} : le titre est obligatoire.`);
    if (!clean(s?.publisher)) errors.push(`Source ${i + 1} : l'éditeur est obligatoire.`);
    if (!STYPES.includes(s?.source_type)) errors.push(`Source ${i + 1} : type invalide.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s?.retrieved_date || "")) errors.push(`Source ${i + 1} : date au format AAAA-MM-JJ.`);
  });

  if (d.coda) {
    const c = d.coda;
    if (!CHAINS.includes(c.chain)) errors.push("Chaîne CODA invalide.");
    if (!Array.isArray(c.links) || c.links.length !== 10 || c.links.some((n) => ![0, 1, 2].includes(n)))
      errors.push("Les maillons doivent être 10 valeurs 0, 1 ou 2.");
    else if (!c.links.some((n) => n > 0)) errors.push("Au moins un maillon doit être instrumenté.");
    if (![1, 2, 3, 4].includes(c.observed)) errors.push("L'autonomie observée doit être 1 à 4.");
    if (!Array.isArray(c.locks) || c.locks.some((k) => !LOCKS.includes(k))) errors.push("Verrous invalides.");
    if (!clean(c.basis_fr)) errors.push("La ligne de preuve CODA est obligatoire.");
  }
  return errors;
}

/** Build the stored entry from a validated draft. */
function toEntry(d) {
  const sources = d.sources.map((s) => ({
    url: clean(s.url), title: clean(s.title), publisher: clean(s.publisher),
    source_type: s.source_type, retrieved_date: s.retrieved_date,
  }));
  const unsourced = sources.length === 0;
  const onlyMarketing = !unsourced && sources.every((s) => MARKETING.has(s.source_type));
  const e = {
    id: `${slug(d.company)}--${slug(d.solution_name)}`,
    company: clean(d.company), company_country: clean(d.company_country),
    region: d.region, sector: d.sector,
    industry: clean(d.industry), department: clean(d.department),
    solution_name: clean(d.solution_name), vendor: clean(d.vendor),
    use_case: clean(d.use_case), deployment_stage: d.deployment_stage,
    reported_outcomes: Array.isArray(d.reported_outcomes)
      ? d.reported_outcomes.filter((o) => clean(o?.metric) && clean(o?.value))
          .map((o) => ({ metric: clean(o.metric), value: clean(o.value), source_type: o.source_type || (sources[0] && sources[0].source_type) || "other" }))
      : [],
    first_seen_date: new Date().toISOString().slice(0, 10),
    sources,
    confidence: unsourced || onlyMarketing ? 0.5 : 0.75,
    confidence_reason: unsourced
      ? "Cas transmis par l'équipe HUB Institute ; pas de source publique à ce jour."
      : onlyMarketing
        ? "Ajoutée à la main par l'équipe HUB Institute ; sources marketing uniquement, confiance plafonnée."
        : "Ajoutée à la main par l'équipe HUB Institute, sur la base des sources citées.",
    provenance: "manual",
  };
  if (d.coda) {
    e.coda = {
      chain: d.coda.chain, links: d.coda.links, observed: d.coda.observed,
      locks: d.coda.locks, basis_fr: clean(d.coda.basis_fr),
      basis_en: clean(d.coda.basis_en) || clean(d.coda.basis_fr),
    };
  }
  return e;
}

const gh = (env, path, init = {}) =>
  fetch(`https://api.github.com/repos/${env.GITHUB_REPO || "Rubsss12/agentipedia"}/${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      accept: "application/vnd.github+json",
      "user-agent": "agentipedia-admin",
      "content-type": "application/json",
      ...(init.headers || {}),
    },
  });

async function addCase(request, env) {
  if (!env.GITHUB_TOKEN || !env.ADD_CASE_PASSWORD) {
    return json({ ok: false, errors: ["Le formulaire n'est pas encore configuré (variables manquantes côté Cloudflare)."] }, 503);
  }
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, errors: ["Requête illisible."] }, 400); }

  if (clean(body.password) !== env.ADD_CASE_PASSWORD) {
    return json({ ok: false, errors: ["Mot de passe incorrect."] }, 401);
  }

  const errors = validate(body);
  if (errors.length) return json({ ok: false, errors }, 422);

  const entry = toEntry(body);

  // Read the current manual file (small by design), append, commit.
  const res = await gh(env, `contents/${FILE}`);
  if (!res.ok) return json({ ok: false, errors: [`Lecture du dépôt impossible (${res.status}).`] }, 502);
  const meta = await res.json();
  let list;
  try {
    const bin = atob(String(meta.content || "").replace(/\n/g, ""));
    const text = new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0)));
    list = JSON.parse(text);
  } catch { list = []; }
  if (!Array.isArray(list)) list = [];

  if (list.some((e) => e.id === entry.id)) {
    return json({ ok: false, errors: ["Cette fiche existe déjà (même entreprise et même solution)."] }, 409);
  }
  list.push(entry);
  list.sort((a, b) => a.id.localeCompare(b.id));

  const bytes = new TextEncoder().encode(JSON.stringify(list, null, 2) + "\n");
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const content = btoa(bin);
  const put = await gh(env, `contents/${FILE}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Ajout du cas ${entry.company} × ${entry.solution_name}`,
      content, sha: meta.sha, branch: "main",
    }),
  });
  if (!put.ok) {
    const detail = await put.text();
    return json({ ok: false, errors: [`Écriture refusée par GitHub (${put.status}). ${detail.slice(0, 160)}`] }, 502);
  }
  return json({ ok: true, id: entry.id, company: entry.company, solution: entry.solution_name });
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/add-case") {
        if (request.method !== "POST") return json({ ok: false, errors: ["Méthode non autorisée."] }, 405);
        return await addCase(request, env);
      }
    } catch (err) {
      return json({ ok: false, errors: [`Erreur interne : ${err && err.message}`] }, 500);
    }
    // Everything else is the statically exported site.
    return env.ASSETS.fetch(request);
  },
};
