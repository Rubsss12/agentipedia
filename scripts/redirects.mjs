/**
 * Rebuilds public/redirects.json: the map of entry URLs that once existed and
 * now live at another address.
 *
 * A fiche changes id when its solution_name changes, which the audit does
 * whenever a source turns out not to name the product the fiche named. The
 * page then moves, and the old URL would 404 even though the content is still
 * published. This map is what turns that 404 into a 301.
 *
 * It is rebuilt from the full git history of data/entries.json rather than
 * maintained by hand, so nothing has to be remembered at rename time. A fiche
 * counts as moved, rather than withdrawn, when a current fiche of the same
 * company shares its sources: either most of them, or all of them (the case
 * where two duplicates were merged into one). Everything else stays a 404,
 * which is the honest answer for a fiche the audit removed.
 *
 * Run it after a rename, from a checkout with history:
 *   node scripts/redirects.mjs
 *
 * It is deliberately not part of `npm run build`: CI checks out at depth 1 and
 * would see no history, and silently emit an empty map.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";

const FILE = "data/entries.json";
const OUT = "public/redirects.json";

const git = (cmd) => execSync(cmd, { encoding: "utf8", maxBuffer: 1 << 30 });

const revisions = git(`git log --format=%H -- ${FILE}`).trim().split("\n").filter(Boolean);
if (!revisions.length) {
  console.error("no history for " + FILE + " (shallow clone?), nothing written");
  process.exit(1);
}

const current = JSON.parse(fs.readFileSync(FILE, "utf8")).entries;
const currentIds = new Set(current.map((e) => e.id));
const urlsOf = (e) => new Set((e.sources || []).map((s) => String(s.url).replace(/[#?].*$/, "")));
const byCompany = new Map();
for (const e of current) {
  if (!byCompany.has(e.company)) byCompany.set(e.company, []);
  byCompany.get(e.company).push({ entry: e, urls: urlsOf(e) });
}

// Every id the store has ever carried, with the last shape it had.
const past = new Map();
for (const rev of revisions) {
  let entries;
  try { entries = JSON.parse(git(`git show ${rev}:${FILE}`)).entries; } catch { continue; }
  for (const e of entries) if (!past.has(e.id)) past.set(e.id, e);
}

const map = {};
const kept = [];
for (const [id, old] of past) {
  if (currentIds.has(id)) continue;
  const oldUrls = urlsOf(old);
  if (!oldUrls.size) continue; // nothing to match on
  let best = null, bestScore = 0, subset = false;
  for (const cand of byCompany.get(old.company) || []) {
    const shared = [...oldUrls].filter((u) => cand.urls.has(u)).length;
    const union = new Set([...oldUrls, ...cand.urls]).size;
    const score = shared / Math.max(1, union);
    const isSubset = shared === oldUrls.size;
    if (score > bestScore || (isSubset && !subset && score >= bestScore)) {
      bestScore = score; best = cand.entry; subset = isSubset;
    }
  }
  // Moved: the sources say it is the same fiche. Either they mostly match, or
  // the old set is wholly contained in the new one (a merge of two duplicates).
  if (best && (bestScore >= 0.6 || subset)) {
    map[`/entry/${id}/`] = `/entry/${best.id}/`;
    kept.push(`${id}\n    -> ${best.id}  (overlap ${bestScore.toFixed(2)}${subset ? ", sources contained" : ""})`);
  }
}

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(`${revisions.length} revisions read, ${past.size} ids ever published, ${currentIds.size} live.`);
console.log(`${Object.keys(sorted).length} redirect(s) written to ${OUT}:`);
for (const line of kept) console.log("  " + line);
