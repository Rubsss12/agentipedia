#!/usr/bin/env node
// Date de première preuve publique de chaque fiche.
//
//   npm run evidence-dates                 → date les sources encore inconnues
//   npm run evidence-dates -- --seed f.json → importe un cache {url: {date, how}}
//
// Pour chaque source, on lit la date de publication : dans l'URL (/2025/03/…)
// sinon dans la page (article:published_time, datePublished, <time>…). La date
// d'une fiche est celle de sa source la plus ancienne : c'est le moment où le
// déploiement est devenu public, ce qui permet de trier l'annuaire par preuves
// récentes et de montrer le rythme des déploiements. Incrémental : une source
// déjà datée (ou déjà tentée) n'est jamais refetchée. Résultat dans
// data/evidence-dates.json, lu au build par src/lib/data.ts.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, "data", "evidence-dates.json");
const TODAY = new Date().toISOString().slice(0, 10);
const MIN = "2022-01-01";

const readJson = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback);
const store = readJson(path.join(ROOT, "data", "entries.json"), { entries: [] });
const manual = readJson(path.join(ROOT, "data", "manual-cases.json"), []);
const entries = [...store.entries, ...manual];
const prev = readJson(OUT, { sources: {}, entries: {} });
const sources = prev.sources;

const seedAt = process.argv.indexOf("--seed");
if (seedAt > 0) Object.assign(sources, readJson(process.argv[seedAt + 1], {}));

const norm = (v) => {
  if (!v) return null;
  const m = v.match(/(20[12]\d)-(\d\d)(?:-(\d\d))?/);
  if (m) return `${m[1]}-${m[2]}-${m[3] || "15"}`;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
};
const urlDate = (u) => {
  const m = u.match(/[/_-](20[12]\d)[/-]?(0[1-9]|1[0-2])(?:[/-]?([0-2]\d|3[01]))?(?=[/_.-]|$)/);
  return m ? `${m[1]}-${m[2]}-${m[3] || "15"}` : null;
};
const PATTERNS = [
  /property=["']article:published_time["'][^>]*content=["']([^"']+)/i,
  /content=["']([^"']+)["'][^>]*property=["']article:published_time/i,
  /property=["']og:published_time["'][^>]*content=["']([^"']+)/i,
  /"datePublished"\s*:\s*"([^"]+)"/i,
  /"publishedAt"\s*:\s*"([^"]+)"/i,
  /"uploadDate"\s*:\s*"([^"]+)"/i,
  /name=["'](?:date|pubdate|publish[-_]?date|publication[-_]date|dc\.date|dcterms\.date|citation_publication_date|sailthru\.date|parsely-pub-date)["'][^>]*content=["']([^"']+)/i,
  /<time[^>]*datetime=["']([^"']+)/i,
];
const plausible = (d) => d && d >= MIN && d <= TODAY;

async function dateOf(url) {
  const fromUrl = urlDate(url);
  if (plausible(fromUrl)) return { date: fromUrl, how: "url" };
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36" },
    });
    if (!res.ok) return { date: null, how: `http ${res.status}` };
    const html = (await res.text()).slice(0, 600000);
    for (const p of PATTERNS) {
      const d = norm(html.match(p)?.[1]);
      if (plausible(d)) return { date: d, how: "page" };
    }
    return { date: null, how: "none" };
  } catch {
    return { date: null, how: "fetch failed" };
  }
}

const todo = [...new Set(entries.flatMap((e) => e.sources.map((s) => s.url)))].filter((u) => !(u in sources));
console.log(`${todo.length} source(s) à dater`);
const queue = [...todo];
await Promise.all(
  Array.from({ length: 12 }, async () => {
    while (queue.length) {
      const u = queue.shift();
      sources[u] = await dateOf(u);
    }
  }),
);

const byEntry = {};
for (const e of entries) {
  const d = e.sources.map((s) => sources[s.url]?.date).filter(plausible).sort()[0];
  if (d) byEntry[e.id] = d;
}
fs.writeFileSync(OUT, JSON.stringify({ updated_at: new Date().toISOString(), entries: byEntry, sources }, null, 1) + "\n");
console.log(`${Object.keys(byEntry).length} fiche(s) datée(s) sur ${entries.length} → data/evidence-dates.json`);
