// "Your competitors are moving": the pace at which AI agent deployments become
// public, from each fiche's first public proof (evidence_date). Server-only.
//
// Honest by construction: it counts proofs the index has found, dated by
// their oldest public source. Fiches without a readable source date are left
// out of the series rather than guessed.
import { getEntries } from "./data";
import type { Entry } from "./types";

export interface Quarter {
  key: string; // "2025T1"
  year: number;
  q: number;
  n: number;
  partial: boolean;
}

export interface Proof {
  id: string;
  company: string;
  solution: string;
  sector: string;
  date: string;
}

const quarterOf = (d: string) => Math.floor((Number(d.slice(5, 7)) - 1) / 3) + 1;

export function getMomentum(now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const year = Number(today.slice(0, 4));
  const dated = getEntries().filter((e): e is Entry & { evidence_date: string } => !!e.evidence_date && e.evidence_date <= today);

  // Quarterly series over the last three calendar years, current quarter flagged partial.
  const curQ = quarterOf(today);
  const quarters: Quarter[] = [];
  for (let y = year - 2; y <= year; y++)
    for (let q = 1; q <= 4; q++) {
      if (y === year && q > curQ) break;
      quarters.push({ key: `${y}T${q}`, year: y, q, n: 0, partial: y === year && q === curQ });
    }
  for (const e of dated) {
    const k = `${e.evidence_date.slice(0, 4)}T${quarterOf(e.evidence_date)}`;
    const slot = quarters.find((x) => x.key === k);
    if (slot) slot.n++;
  }

  // Pace: average per complete quarter this year against two years ago.
  const avg = (y: number) => {
    const full = quarters.filter((x) => x.year === y && !x.partial);
    return full.length ? full.reduce((a, x) => a + x.n, 0) / full.length : 0;
  };
  const paceThen = avg(year - 2);
  const paceNow = avg(year);
  const multiplier = paceThen > 0 ? Math.round(paceNow / paceThen) : 0;

  const sinceJanuary = dated.filter((e) => e.evidence_date >= `${year}-01-01`).length;
  const latest: Proof[] = [...dated]
    .sort((a, b) => b.evidence_date.localeCompare(a.evidence_date) || a.company.localeCompare(b.company))
    .slice(0, 6)
    .map((e) => ({ id: e.id, company: e.company, solution: e.solution_name, sector: e.sector, date: e.evidence_date }));

  const bySectorThisYear = new Map<string, number>();
  for (const e of dated) if (e.evidence_date >= `${year}-01-01`) bySectorThisYear.set(e.sector, (bySectorThisYear.get(e.sector) ?? 0) + 1);

  return {
    year,
    quarters,
    paceThen: Math.round(paceThen),
    paceNow: Math.round(paceNow),
    multiplier,
    sinceJanuary,
    latest,
    bySectorThisYear,
    dated: dated.length,
  };
}
