#!/usr/bin/env node
// Les preuves répondent-elles encore ?
//
//   npm run check-sources            → contrôle toutes les sources de l'index
//   npm run check-sources -- --all   → liste aussi les refus robot et les timeouts
//
// Un lien mort est le pire défaut possible pour un annuaire dont la règle est
// « pas de source, pas de fiche ». On ne retient que les disparitions franches :
// 404, 410, et les domaines qui ne résolvent plus. Un 403 ou un 429 veut dire
// que le site refuse les robots, pas que la page a disparu, et un 5xx qu'il va
// mal aujourd'hui. Le rapport signale à part les fiches qui se retrouveraient
// sans aucune source vivante : celles-là ne tiennent plus la règle.
//
// Réparer : chercher une capture sur https://archive.org/wayback/available,
// vérifier qu'elle montre bien l'article, puis pointer la source dessus. Sans
// capture, retirer la source si la fiche en garde au moins une autre.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const VERBOSE = process.argv.includes("--all");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

const readJson = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback);
const entries = [
  ...readJson(path.join(ROOT, "data", "entries.json"), { entries: [] }).entries,
  ...readJson(path.join(ROOT, "data", "manual-cases.json"), []),
];

const byUrl = new Map();
for (const e of entries)
  for (const s of e.sources) {
    if (!byUrl.has(s.url)) byUrl.set(s.url, []);
    byUrl.get(s.url).push(e.id);
  }

async function probe(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: AbortSignal.timeout(20000),
        headers: { "user-agent": UA },
      });
      // Certains serveurs refusent HEAD sans que la page ait disparu.
      if (method === "HEAD" && (res.status === 405 || res.status === 501)) continue;
      return { status: res.status };
    } catch (err) {
      if (method === "GET") return { status: 0, error: String(err.cause?.code || err.name || err) };
    }
  }
}

const urls = [...byUrl.keys()];
const status = {};
let done = 0;
const queue = [...urls];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const u = queue.shift();
      status[u] = await probe(u);
      if (++done % 100 === 0) process.stderr.write(`${done}/${urls.length}\n`);
    }
  }),
);

const is = (u, f) => f(status[u]);
const dead = urls.filter((u) => is(u, (r) => r.status === 404 || r.status === 410 || r.error === "ENOTFOUND"));
const refused = urls.filter((u) => is(u, (r) => r.status === 403 || r.status === 429));
const unreachable = urls.filter((u) => is(u, (r) => r.status === 0 && r.error !== "ENOTFOUND"));
const ok = urls.filter((u) => is(u, (r) => r.status >= 200 && r.status < 400));

console.log(
  `sources: ${urls.length} | répondent: ${ok.length} | mortes: ${dead.length} | refus robot: ${refused.length} | injoignables: ${unreachable.length}`,
);

const deadSet = new Set(dead);
const orphans = entries.filter((e) => e.sources.length > 0 && e.sources.every((s) => deadSet.has(s.url)));
if (orphans.length) {
  console.log(`\n${orphans.length} fiche(s) sans aucune source vivante, la règle ne tient plus :`);
  for (const e of orphans) console.log(`  ${e.id}`);
}

if (dead.length) console.log("\nsources mortes :");
for (const u of dead) console.log(`  ${status[u].status || status[u].error}  ${u}\n      ${byUrl.get(u).join(", ")}`);

if (VERBOSE) {
  for (const [titre, liste] of [["refus robot", refused], ["injoignables", unreachable]]) {
    if (!liste.length) continue;
    console.log(`\n${titre} :`);
    for (const u of liste) console.log(`  ${status[u].status || status[u].error}  ${u}`);
  }
}

process.exitCode = dead.length ? 1 : 0;
