// Aggregations for the public figures page. Everything is derived from the
// store at build time. There is no second source of truth to keep in sync, so
// the page cannot quote a number the index does not actually contain.
import { getEntries } from "./data";
import { codaDeclared, codaQuadrant, codaScope, CODA, LEVELS, type CodaKey, type CodaLevel } from "./coda";
import { isVendorSourced } from "./types";
import type { DeploymentStage } from "./types";

export interface Row {
  key: string;
  labelEn: string;
  labelFr: string;
  n: number;
}

const sortRows = (rows: Row[]) => rows.sort((a, b) => b.n - a.n || a.labelEn.localeCompare(b.labelEn));

function count<T extends string | number>(values: T[]): Map<T, number> {
  const m = new Map<T, number>();
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  return m;
}

export function getFigures() {
  const entries = getEntries();
  const scored = entries.filter((e) => e.coda);

  // Autonomy ladder, declared level (the one the locks authorise).
  const levels = count(scored.map((e) => codaDeclared(e.coda!)));
  const byLevel: Row[] = ([1, 2, 3, 4] as CodaLevel[]).map((n) => ({
    key: `N${n}`,
    labelEn: `N${n} · ${LEVELS[n].en}`,
    labelFr: `N${n} · ${LEVELS[n].fr}`,
    n: levels.get(n) ?? 0,
  }));

  const quads = count(scored.map((e) => codaQuadrant(e.coda!)).filter(Boolean) as CodaKey[]);
  const byQuadrant: Row[] = (["C", "O", "D", "A"] as CodaKey[]).map((k) => ({
    key: k,
    labelEn: CODA[k].en,
    labelFr: CODA[k].fr,
    n: quads.get(k) ?? 0,
  }));

  // Scope bands, on the 1-10 value-chain axis.
  const scopes = scored.map((e) => codaScope(e.coda!.links));
  const band = (lo: number, hi: number) => scopes.filter((s) => s >= lo && s <= hi).length;
  const byScope: Row[] = [
    { key: "1-2", labelEn: "Restricted · 1 to 2 links", labelFr: "Restreinte · 1 à 2 maillons", n: band(1, 2) },
    { key: "3-6", labelEn: "Intermediate · 3 to 6 links", labelFr: "Intermédiaire · 3 à 6 maillons", n: band(3, 6) },
    { key: "7-10", labelEn: "Extended · 7 to 10 links", labelFr: "Étendue · 7 à 10 maillons", n: band(7, 10) },
  ];

  const stages = count(entries.map((e) => e.deployment_stage));
  const STAGE: Record<DeploymentStage, [string, string]> = {
    production: ["In production", "En production"],
    pilot: ["Pilot", "Pilote"],
    announced: ["Announced", "Annoncé"],
    unknown: ["Stage unknown", "Statut inconnu"],
  };
  const byStage: Row[] = sortRows(
    (Object.keys(STAGE) as DeploymentStage[]).map((s) => ({
      key: s,
      labelEn: STAGE[s][0],
      labelFr: STAGE[s][1],
      n: stages.get(s) ?? 0,
    })),
  );

  const bySector = sortRows(
    [...count(entries.map((e) => e.sector))].map(([k, n]) => ({ key: k, labelEn: k, labelFr: k, n })),
  );
  const byRegion = sortRows(
    [...count(entries.map((e) => e.region))].map(([k, n]) => ({ key: k, labelEn: k, labelFr: k, n })),
  );
  const byCountry = sortRows(
    [...count(entries.map((e) => e.company_country).filter(Boolean))].map(([k, n]) => ({
      key: k,
      labelEn: k,
      labelFr: k,
      n,
    })),
  ).slice(0, 15);
  const byVendor = sortRows(
    [...count(entries.map((e) => e.vendor).filter(Boolean))].map(([k, n]) => ({
      key: k,
      labelEn: k,
      labelFr: k,
      n,
    })),
  ).slice(0, 15);

  const withOutcomes = entries.filter((e) => e.reported_outcomes.length > 0).length;
  const vendorOnly = entries.filter((e) => e.sources.length > 0 && isVendorSourced(e)).length;
  const unnamed = entries.filter((e) => e.solution_named === false).length;
  const cappedByLocks = scored.filter((e) => e.coda!.observed > codaDeclared(e.coda!)).length;
  const sourceCount = entries.reduce((n, e) => n + e.sources.length, 0);

  return {
    total: entries.length,
    scored: scored.length,
    sectors: new Set(entries.map((e) => e.sector)).size,
    countries: new Set(entries.map((e) => e.company_country).filter(Boolean)).size,
    regions: new Set(entries.map((e) => e.region)).size,
    vendors: new Set(entries.map((e) => e.vendor).filter(Boolean)).size,
    sourceCount,
    sourcesPerEntry: entries.length ? sourceCount / entries.length : 0,
    withOutcomes,
    vendorOnly,
    unnamed,
    cappedByLocks,
    byLevel,
    byQuadrant,
    byScope,
    byStage,
    bySector,
    byRegion,
    byCountry,
    byVendor,
  };
}
