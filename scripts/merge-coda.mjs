#!/usr/bin/env node
// Merge CODA scores (from scoring agents) into data/entries.json by entry id.
// Each input file in <dir> is a JSON array of {id, coda}. Validates the coda
// shape (same rules as engine/schema.mjs) before applying; skips invalid.
//   node scripts/merge-coda.mjs <scores-dir> [--dry-run]

import fs from "node:fs";
import path from "node:path";
import { CODA_CHAINS, CODA_LOCKS } from "../engine/schema.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const ENTRIES_PATH = path.join(ROOT, "data", "entries.json");
const DRY = process.argv.includes("--dry-run");
const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) { console.error("usage: node scripts/merge-coda.mjs <scores-dir>"); process.exit(2); }

function validCoda(c) {
  if (!c || typeof c !== "object") return false;
  if (!CODA_CHAINS.includes(c.chain)) return false;
  if (!Array.isArray(c.links) || c.links.length !== 10 || c.links.some((v) => ![0, 1, 2].includes(v)) || !c.links.some((v) => v > 0)) return false;
  if (![1, 2, 3, 4].includes(c.observed)) return false;
  if (!Array.isArray(c.locks) || c.locks.some((k) => !CODA_LOCKS.includes(k))) return false;
  if (!c.basis_en || !c.basis_fr || !String(c.basis_en).trim() || !String(c.basis_fr).trim()) return false;
  return true;
}

const byId = new Map();
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".json")) continue;
  let arr;
  try { arr = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); } catch (e) { console.error(`skip ${f}: ${e.message}`); continue; }
  if (!Array.isArray(arr)) continue;
  for (const r of arr) { if (r && r.id && r.coda) byId.set(r.id, r.coda); }
}
console.log(`merge-coda: ${byId.size} scored id(s) gathered from ${dir}`);

const store = JSON.parse(fs.readFileSync(ENTRIES_PATH, "utf8"));
let applied = 0, invalid = 0, alreadyHad = 0, noScore = 0;
for (const e of store.entries) {
  if (e.coda) { alreadyHad++; continue; }
  const c = byId.get(e.id);
  if (!c) { noScore++; continue; }
  const coda = { chain: c.chain, links: c.links.map(Number), observed: Number(c.observed), locks: Array.isArray(c.locks) ? c.locks : [], basis_en: String(c.basis_en || "").trim(), basis_fr: String(c.basis_fr || "").trim() };
  if (!validCoda(coda)) { invalid++; console.log(`  ✗ invalid coda for ${e.id} (chain=${c.chain})`); continue; }
  e.coda = coda; applied++;
}
store.updated_at = new Date().toISOString();
console.log(`merge-coda: applied ${applied}, invalid ${invalid}, still unscored ${noScore}, already had ${alreadyHad} -> ${store.entries.filter(x=>x.coda).length}/${store.entries.length} scored`);
if (DRY) { console.log("merge-coda: --dry-run, not writing"); process.exit(0); }
fs.writeFileSync(ENTRIES_PATH, JSON.stringify(store, null, 2) + "\n");
console.log("merge-coda: wrote data/entries.json");
