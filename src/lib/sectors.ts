// Server-side sector aggregation — the library's shelves, derived from the store.
import { getEntries } from "./data";
import type { Entry } from "./types";

export interface SectorSummary {
  name: string;
  slug: string;
  entries: number;
  countries: number;
  production: number;
  companies: string[]; // sample of company names, alphabetical
}

export function sectorSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSectors(): SectorSummary[] {
  const by = new Map<string, Entry[]>();
  for (const e of getEntries()) {
    if (!by.has(e.sector)) by.set(e.sector, []);
    by.get(e.sector)!.push(e);
  }
  return [...by.entries()]
    .map(([name, list]) => ({
      name,
      slug: sectorSlug(name),
      entries: list.length,
      countries: new Set(list.map((e) => e.company_country).filter(Boolean)).size,
      production: list.filter((e) => e.deployment_stage === "production").length,
      companies: [...new Set(list.map((e) => e.company))].sort((a, b) => a.localeCompare(b)).slice(0, 3),
    }))
    .sort((a, b) => b.entries - a.entries || a.name.localeCompare(b.name));
}

export function getSectorBySlug(slug: string) {
  const summary = getSectors().find((s) => s.slug === slug);
  if (!summary) return undefined;
  return { ...summary, list: getEntries().filter((e) => sectorSlug(e.sector) === slug) };
}
