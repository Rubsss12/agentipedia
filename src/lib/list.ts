// The shape the Explorer needs, and nothing else.
//
// The Explorer is a client component: whatever it receives is serialised into
// the page for every visitor, on top of the HTML they can already read. It
// renders twenty cards and keeps the rest in memory to filter, sort and
// search, so it does need all 651 fiches. It does not need all of each fiche.
//
// Passing the store straight through shipped the two CODA basis paragraphs
// (310 KB), the full source objects with titles, publishers and retrieval
// dates (271 KB) and every outcome label (73 KB) into a page that displays
// none of them. The projection below keeps the fields the component actually
// reads, in the shape it reads them, so no call site has to change:
//
//   sources   kept as an array, because the cards count them and the filter
//             tests their types; only the first keeps its url, which is the
//             only one shown (as a host name).
//   outcomes  kept as an array of values, because the "with a figure" filter
//             looks for a digit in the value.
//
// Everything a reader clicks through to (the basis lines, the source list,
// the full outcomes) lives on the fiche page, which serves it on demand.
import type { Entry, SourceType } from "./types";
import type { CodaScore } from "./coda";

export interface ListEntry {
  id: string;
  company: string;
  company_country: string;
  region: string;
  sector: string;
  solution_name: string;
  solution_named?: boolean;
  vendor: string;
  use_case: string;
  department: string;
  industry: string;
  deployment_stage: Entry["deployment_stage"];
  coda?: CodaScore;
  reported_outcomes: { value: string }[];
  evidence_date?: string;
  sources: { source_type: SourceType; url?: string }[];
  confidence: number;
  confidence_reason: string;
}

export function toListEntry(e: Entry): ListEntry {
  return {
    id: e.id,
    company: e.company,
    company_country: e.company_country,
    region: e.region,
    sector: e.sector,
    solution_name: e.solution_name,
    ...(e.solution_named === false ? { solution_named: false as const } : {}),
    vendor: e.vendor,
    use_case: e.use_case,
    department: e.department,
    industry: e.industry,
    deployment_stage: e.deployment_stage,
    ...(e.coda ? { coda: { chain: e.coda.chain, links: e.coda.links, observed: e.coda.observed, locks: e.coda.locks } } : {}),
    reported_outcomes: e.reported_outcomes.map((o) => ({ value: o.value })),
    ...(e.evidence_date ? { evidence_date: e.evidence_date } : {}),
    sources: e.sources.map((s, i) =>
      i === 0 ? { source_type: s.source_type, url: s.url } : { source_type: s.source_type },
    ),
    confidence: e.confidence,
    confidence_reason: e.confidence_reason,
  };
}

export const toListEntries = (entries: Entry[]): ListEntry[] => entries.map(toListEntry);
