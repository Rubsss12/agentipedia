// Client-safe types and pure helpers; no Node imports here.
import type { CodaAssessment } from "./coda";

export type SourceType =
  | "company_official"
  | "earnings_call"
  | "news_media"
  | "conference_talk"
  | "vendor_case_study"
  | "press_release"
  | "other";

export type DeploymentStage = "pilot" | "production" | "announced" | "unknown";

export interface Outcome {
  metric: string;
  value: string;
  source_type: SourceType;
}

export interface Source {
  url: string;
  title: string;
  publisher: string;
  source_type: SourceType;
  retrieved_date: string;
}

export interface Entry {
  id: string;
  company: string;
  company_country: string;
  region: string;
  sector: string;
  solution_name: string;
  /** false = confirmed deployment whose agent has no public name (the "unnamed" collection). Absent means named. */
  solution_named?: boolean;
  vendor: string;
  use_case: string;
  department: string;
  industry: string;
  deployment_stage: DeploymentStage;
  /**
   * CODA score (HUB Institute matrix): observed autonomy N1-N4, documented
   * locks, and the instrumented maillons of the entry's value-chain frieze.
   * Declared level, scope and quadrant are derived (see lib/coda.ts).
   */
  coda?: CodaAssessment;
  reported_outcomes: Outcome[];
  first_seen_date: string;
  sources: Source[];
  confidence: number;
  confidence_reason: string;
  /**
   * How the entry entered the index. Absent (or "engine") means the curation
   * engine found it on the live web; "manual" means the HUB Institute team
   * added it by hand via `npm run add-case` — shown with a badge on the fiche.
   */
  provenance?: "engine" | "manual";
}

export interface Store {
  updated_at: string | null;
  entries: Entry[];
}

const MARKETING_TYPES: SourceType[] = ["vendor_case_study", "press_release"];

export function isVendorSourced(entry: Entry): boolean {
  return entry.sources.length > 0 && entry.sources.every((s) => MARKETING_TYPES.includes(s.source_type));
}

export function isMarketingType(t: SourceType): boolean {
  return MARKETING_TYPES.includes(t);
}

export function isUnnamed(entry: Entry): boolean {
  return entry.solution_named === false;
}

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  company_official: "Company official",
  earnings_call: "Earnings call",
  news_media: "News media",
  conference_talk: "Conference talk",
  vendor_case_study: "Vendor case study",
  press_release: "Press release",
  other: "Other",
};

export const STAGE_LABELS: Record<DeploymentStage, string> = {
  production: "In production",
  pilot: "Pilot",
  announced: "Announced",
  unknown: "Stage unknown",
};

// French labels for the bilingual chrome (data stays in English).
export const SOURCE_TYPE_LABELS_FR: Record<SourceType, string> = {
  company_official: "Officiel entreprise",
  earnings_call: "Résultats financiers",
  news_media: "Presse",
  conference_talk: "Conférence",
  vendor_case_study: "Cas client éditeur",
  press_release: "Communiqué de presse",
  other: "Autre",
};

export const STAGE_LABELS_FR: Record<DeploymentStage, string> = {
  production: "En production",
  pilot: "Pilote",
  announced: "Annoncé",
  unknown: "Statut inconnu",
};
