// Server-only store access (reads data/entries.json from disk at build time).
import fs from "node:fs";
import path from "node:path";
import type { Entry, Store } from "./types";

export type * from "./types";
export { isVendorSourced, isMarketingType, SOURCE_TYPE_LABELS, STAGE_LABELS } from "./types";

let cache: Store | null = null;

export function getStore(): Store {
  if (cache) return cache;
  const dir = path.join(process.cwd(), "data");
  const store = JSON.parse(fs.readFileSync(path.join(dir, "entries.json"), "utf8")) as Store;

  // Cases added by hand (admin form on the site, or `npm run add-case`) live in
  // their own small file: entries.json is over GitHub's 1MB Contents API limit,
  // so the form could never rewrite it. They are merged in at build time and
  // carry provenance:"manual", which shows a badge on the fiche.
  const manualPath = path.join(dir, "manual-cases.json");
  if (fs.existsSync(manualPath)) {
    const manual = JSON.parse(fs.readFileSync(manualPath, "utf8")) as Entry[];
    const seen = new Set(store.entries.map((e) => e.id));
    for (const e of manual) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      store.entries.push({ ...e, provenance: "manual" });
    }
    store.entries.sort((a, b) => a.id.localeCompare(b.id));
  }

  const evidencePath = path.join(dir, "evidence-dates.json");
  if (fs.existsSync(evidencePath)) {
    const dates = (JSON.parse(fs.readFileSync(evidencePath, "utf8")) as { entries: Record<string, string> }).entries;
    for (const e of store.entries) if (dates[e.id]) e.evidence_date = dates[e.id];
  }

  cache = store;
  return cache;
}

export function getEntries(): Entry[] {
  return getStore().entries;
}

export function getEntry(id: string): Entry | undefined {
  return getEntries().find((e) => e.id === id);
}

export function getStats() {
  const entries = getEntries();
  return {
    entries: entries.length,
    countries: new Set(entries.map((e) => e.company_country).filter(Boolean)).size,
    regions: new Set(entries.map((e) => e.region)).size,
    vendors: new Set(entries.map((e) => e.vendor).filter(Boolean)).size,
    // The store stamp only moves on a curation run; hand-added fiches do not
    // touch it, so the freshness shown is whichever is later.
    updatedAt: latestOf(getStore().updated_at, entries.map((e) => e.first_seen_date).sort().at(-1)),
  };
}

function latestOf(stamp: string | null | undefined, latestEntry: string | undefined): string {
  if (!latestEntry) return stamp ?? "";
  if (!stamp || latestEntry > stamp.slice(0, 10)) return latestEntry;
  return stamp;
}
