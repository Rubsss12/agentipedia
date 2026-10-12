// "This week's insight": one shareable finding, shown under the home hero and
// developed on its own page. The finding is computed from the store, so its
// numbers move with the index; only the angle (and the date it was published)
// is editorial. To publish next week's insight, add a page under
// /insights/<slug> and point CURRENT_INSIGHT at it.
import { getEntries } from "./data";
import { LOCKS, codaDeclared, type LockKey } from "./coda";

export const CURRENT_INSIGHT = {
  slug: "agent-washing",
  date: "2026-09-18",
};

export interface WashedAgent {
  id: string;
  company: string;
  solution: string;
  sector: string;
  observed: number;
  declared: number;
  missing: LockKey[];
}

/** Agents observed above the level their documented locks allow. */
export function getAgentWashing() {
  const entries = getEntries().filter((e) => e.coda);
  const washed: WashedAgent[] = entries
    .filter((e) => e.coda!.observed > codaDeclared(e.coda!))
    .map((e) => ({
      id: e.id,
      company: e.company,
      solution: e.solution_name,
      sector: e.sector,
      observed: e.coda!.observed,
      declared: codaDeclared(e.coda!),
      missing: LOCKS.filter((l) => l.forLevel === 3 && !e.coda!.locks.includes(l.key)).map((l) => l.key),
    }))
    .sort((a, b) => a.company.localeCompare(b.company));
  const observedN3 = entries.filter((e) => e.coda!.observed >= 3).length;
  const noLocks = washed.filter((w) => w.missing.length === 3).length;
  return { washed, total: entries.length, observedN3, noLocks };
}
