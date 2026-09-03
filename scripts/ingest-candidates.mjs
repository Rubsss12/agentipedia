#!/usr/bin/env node
// Ingest hand-researched candidate entries into data/entries.json, reusing the
// engine's strict validation and duplicate check — same quality bar as the
// curation engine, minus the LLM discovery stage. Candidates come from JSON
// files (each an array of candidate objects) in a directory.
//
//   node scripts/ingest-candidates.mjs <candidates-dir> [--date YYYY-MM-DD] [--dry-run]

import fs from "node:fs";
import path from "node:path";
import {
  validateEntry, applyConfidencePolicy, makeEntryId, normalizeName, onlyMarketingSources,
} from "../engine/schema.mjs";

// Quality gate: a candidate whose ONLY evidence is a bare vendor "customers"/
// "case-studies" INDEX page (no specific customer slug) is a logo-on-a-wall,
// not a documented deployment — reject to keep the bar high.
const BARE_LIST = /\/(customers|case-studies|success-stories|customer-stories|testimonials|examples(-[a-z-]*)?)\/?(\?.*)?$/i;
function isThinListOnly(e) {
  return Array.isArray(e.sources) && e.sources.length === 1 &&
    BARE_LIST.test(e.sources[0]?.url || "") && onlyMarketingSources(e);
}
import { findExisting, mergeUpdate } from "../engine/dedupe.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const ENTRIES_PATH = path.join(ROOT, "data", "entries.json");
const REJECTIONS_PATH = path.join(ROOT, "data", "rejections.json");

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const DRY = process.argv.includes("--dry-run");
const RUN_DATE = arg("date", new Date().toISOString().slice(0, 10));
const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) { console.error("usage: node scripts/ingest-candidates.mjs <candidates-dir>"); process.exit(2); }

function deent(s) {
  return String(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&apos;/g, "'");
}
function deepDecode(o) {
  if (typeof o === "string") return deent(o);
  if (Array.isArray(o)) return o.map(deepDecode);
  if (o && typeof o === "object") { const r = {}; for (const k in o) r[k] = deepDecode(o[k]); return r; }
  return o;
}
function shapeCandidate(rawIn) {
  const raw = deepDecode(rawIn);
  const sources = (Array.isArray(raw.sources) ? raw.sources : []).map((s) => ({
    url: String(s?.url ?? ""),
    title: normalizeName(s?.title),
    publisher: normalizeName(s?.publisher),
    source_type: s?.source_type,
    retrieved_date: RUN_DATE,
  }));
  const shaped = {
    id: makeEntryId(raw.company ?? "", raw.solution_name ?? ""),
    company: normalizeName(raw.company),
    company_country: normalizeName(raw.company_country),
    region: raw.region,
    sector: raw.sector,
    solution_name: normalizeName(raw.solution_name),
    vendor: normalizeName(raw.vendor ?? ""),
    use_case: normalizeName(raw.use_case),
    department: normalizeName(raw.department ?? ""),
    industry: normalizeName(raw.industry ?? ""),
    deployment_stage: raw.deployment_stage ?? "unknown",
    reported_outcomes: Array.isArray(raw.reported_outcomes)
      ? raw.reported_outcomes.map((o) => ({
          metric: normalizeName(o?.metric),
          value: normalizeName(String(o?.value ?? "")),
          source_type: o?.source_type,
        })).filter((o) => o.metric && o.value)
      : [],
    first_seen_date: RUN_DATE,
    sources,
    confidence: typeof raw.confidence === "number" ? raw.confidence : 0.4,
    confidence_reason: normalizeName(raw.confidence_reason) || "Named deployment from public sources.",
  };
  if (raw.solution_named === false) shaped.solution_named = false;
  return applyConfidencePolicy(shaped);
}

const store = JSON.parse(fs.readFileSync(ENTRIES_PATH, "utf8"));
const rejectionLog = JSON.parse(fs.readFileSync(REJECTIONS_PATH, "utf8"));

// Gather candidates from all JSON files in the dir.
const raws = [];
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".json")) continue;
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    if (Array.isArray(parsed)) raws.push(...parsed);
    else if (Array.isArray(parsed.candidates)) raws.push(...parsed.candidates);
  } catch (e) { console.error(`skip ${f}: ${e.message}`); }
}
console.log(`ingest: ${raws.length} raw candidate(s) from ${dir}`);

const run = { run_id: `ingest-${RUN_DATE}-${Date.now().toString(36)}`, date: RUN_DATE, operator: "ingest", candidates_seen: raws.length, accepted: 0, updated: 0, rejections: [] };
const seenIds = new Set(store.entries.map((e) => e.id));
let dupInBatch = 0;

for (const raw of raws) {
  const candidate = shapeCandidate(raw);
  const label = `${candidate.company || "?"} / ${candidate.solution_name || "?"}`;
  if (isThinListOnly(candidate)) {                            // quality gate: logo-on-a-list-page, not a documented deployment
    run.rejections.push({ candidate: label, reason: "thin: single bare vendor-list-page source" });
    console.log(`  ✗ ${label}: thin vendor-list source`); continue;
  }
  const { ok, errors } = validateEntry(candidate);            // no retrievedUrls: trust researched URLs, still enforce the rule + schema
  if (!ok) { run.rejections.push({ candidate: label, reason: errors[0], all_errors: errors }); console.log(`  ✗ ${label}: ${errors[0]}`); continue; }
  const existing = findExisting(store.entries, candidate);
  if (existing) {
    const { entry, changed, changes } = mergeUpdate(existing, candidate);
    if (changed) { store.entries[store.entries.indexOf(existing)] = entry; run.updated++; console.log(`  ↻ ${label}: ${changes.join("; ")}`); }
    else { dupInBatch++; }
    continue;
  }
  if (seenIds.has(candidate.id)) { dupInBatch++; continue; }   // dup within this batch
  seenIds.add(candidate.id);
  store.entries.push(candidate);
  run.accepted++;
  console.log(`  ✓ ${label}`);
}

store.entries.sort((a, b) => a.id.localeCompare(b.id));
store.updated_at = new Date().toISOString();
rejectionLog.runs.push(run);

console.log(`ingest: ${run.accepted} new, ${run.updated} updated, ${run.rejections.length} rejected, ${dupInBatch} duplicate(s) skipped -> ${store.entries.length} total`);
if (DRY) { console.log("ingest: --dry-run, not writing"); process.exit(0); }
fs.writeFileSync(ENTRIES_PATH, JSON.stringify(store, null, 2) + "\n");
fs.writeFileSync(REJECTIONS_PATH, JSON.stringify(rejectionLog, null, 2) + "\n");
console.log(`ingest: wrote ${path.relative(ROOT, ENTRIES_PATH)} (${store.entries.length} entries)`);
