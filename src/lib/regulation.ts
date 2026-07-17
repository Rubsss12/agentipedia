// AI-regulation regimes, derived deterministically from the deploying
// company's home country (the applicable jurisdiction). This is a
// jurisdictional CONTEXT for decision-makers, never a compliance assessment
// of the deployment itself.
import type { Entry } from "@/lib/types";

export type RegimeKey =
  | "eu_ai_act"
  | "europe_non_eu"
  | "north_america"
  | "china"
  | "apac"
  | "mea"
  | "latam";

export interface Regime {
  key: RegimeKey;
  en: string;
  fr: string;
  /** One-line honest description of the regime. */
  noteEn: string;
  noteFr: string;
  countries: string[];
}

export const REGIMES: Regime[] = [
  {
    key: "eu_ai_act",
    en: "EU AI Act",
    fr: "AI Act européen",
    noteEn: "Binding risk-based regulation, in force since August 2024 with phased obligations.",
    noteFr: "Règlement contraignant par niveaux de risque, en vigueur depuis août 2024 avec obligations progressives.",
    countries: ["France", "Germany", "Spain", "Italy", "Sweden", "Netherlands", "Estonia"],
  },
  {
    key: "europe_non_eu",
    en: "Europe non-EU (UK, Switzerland)",
    fr: "Europe hors UE (R-U, Suisse)",
    noteEn: "National, principles-based approaches outside the EU AI Act.",
    noteFr: "Approches nationales fondées sur des principes, hors AI Act.",
    countries: ["United Kingdom", "Switzerland"],
  },
  {
    key: "north_america",
    en: "North America (sectoral & state laws)",
    fr: "Amérique du Nord (lois sectorielles)",
    noteEn: "No federal AI act in the US; sectoral rules, executive orders and state laws. Canada's framework is in progress.",
    noteFr: "Pas de loi IA fédérale aux États-Unis ; règles sectorielles, décrets et lois d'États. Cadre canadien en cours.",
    countries: ["United States", "Canada"],
  },
  {
    key: "china",
    en: "China (binding AI measures)",
    fr: "Chine (règles contraignantes)",
    noteEn: "Binding generative AI measures and algorithm regulations administered by the CAC.",
    noteFr: "Mesures contraignantes sur l'IA générative et les algorithmes, administrées par la CAC.",
    countries: ["China"],
  },
  {
    key: "apac",
    en: "Asia-Pacific (AI acts & frameworks)",
    fr: "Asie-Pacifique (lois et cadres IA)",
    noteEn: "Mixed landscape: South Korea's AI Basic Act, Japan's AI law, Singapore's model framework, voluntary standards elsewhere.",
    noteFr: "Paysage mixte : AI Basic Act coréen, loi IA japonaise, cadre modèle singapourien, standards volontaires ailleurs.",
    countries: ["Japan", "South Korea", "Singapore", "India", "Indonesia", "Malaysia", "Taiwan", "Australia", "New Zealand"],
  },
  {
    key: "mea",
    en: "Middle East & Africa (strategies)",
    fr: "Moyen-Orient & Afrique (stratégies)",
    noteEn: "National AI strategies and guidelines; binding horizontal AI laws are still rare.",
    noteFr: "Stratégies et lignes directrices nationales ; les lois IA horizontales contraignantes restent rares.",
    countries: ["United Arab Emirates", "Saudi Arabia", "Qatar", "Kenya", "Nigeria", "South Africa", "Ethiopia"],
  },
  {
    key: "latam",
    en: "Latin America (draft bills)",
    fr: "Amérique latine (projets de loi)",
    noteEn: "AI bills advancing (e.g. Brazil's PL 2338); no binding horizontal act in force yet.",
    noteFr: "Projets de loi IA en cours (ex. PL 2338 au Brésil) ; pas encore de loi horizontale en vigueur.",
    countries: ["Brazil", "Argentina", "Chile", "Mexico"],
  },
];

const BY_COUNTRY = new Map<string, Regime>();
for (const r of REGIMES) for (const c of r.countries) BY_COUNTRY.set(c, r);

/** Regime for an entry, from the deploying organization's home country. */
export function regimeOf(entry: Pick<Entry, "company_country">): Regime | null {
  return BY_COUNTRY.get(entry.company_country) ?? null;
}
