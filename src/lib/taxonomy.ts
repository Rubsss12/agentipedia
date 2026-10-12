// Normalised taxonomies for the index filters and the home page entry points.
//
// The curation engine writes department, industry and vendor as free text:
// 291 departments, 243 industries and 267 vendor strings for 473 fiches, which
// made the filters unusable. Each is folded here into a short, stable list
// (8 functions, about 20 industries, about 20 vendors). First matching rule
// wins, so the order of the rules matters. Client-safe: no Node imports.
import type { Entry } from "./types";

export interface Group {
  key: string;
  en: string;
  fr: string;
}

type Rule = [RegExp, string];

function classify(value: string, rules: Rule[], fallback: string): string {
  for (const [re, key] of rules) if (re.test(value)) return key;
  return fallback;
}

// ---------- Functions (from the department field)

export const FUNCTIONS: Group[] = [
  { key: "exec", en: "General management", fr: "Direction générale" },
  { key: "marketing", en: "Marketing & sales", fr: "Marketing & ventes" },
  { key: "customer", en: "Customer service", fr: "Relation client" },
  { key: "finance", en: "Finance", fr: "Finance" },
  { key: "hr", en: "HR", fr: "RH" },
  { key: "ops", en: "Operations", fr: "Opérations" },
  { key: "it", en: "IT & data", fr: "IT & data" },
  { key: "other", en: "Other functions", fr: "Autres fonctions" },
];

const FUNCTION_RULES: Rule[] = [
  [/human resources|\bhr\b|talent|recruit|workforce/i, "hr"],
  [/\bfinance\b|accounting|\btax\b|billing|revenue cycle|treasury|audit|fraud|financial crime|collections|investor relations|payments? operations/i, "finance"],
  [/company-wide|firmwide|groupwide|enterprise-wide|cross-functional|employee productivity|employee enablement|whole-of-government|cabinet|strategy|enterprise \/|multiple business lines|corporate functions|ai office|ai practice|center of excellence/i, "exec"],
  [/clinical|oncology|decision support|research|r&d|drug/i, "ops"],
  [/customer|client service|\bcare\b|support|contact cent|call cent|switchboard|member|guest|passenger|patient (access|engagement|scheduling)|post-discharge|front desk|roadside|citizen|public services|government (digital )?services|digital government|e-government|advice|adviser|fare payment|help/i, "customer"],
  [/marketing|sales|commerce|merchandis|advertising|\bfan\b|fan |loyalty|personali[sz]ation|distribution|relationship|consultant enablement|fundraising|tourism|digital banking|digital channels|retail bank|super app|consumer|personal finance|wealth|small-business|sme banking/i, "marketing"],
  [/production|manufactur|plant|powertrain|maintenance|quality|industrial/i, "ops"],
  [/\bit\b|\bict\b|engineering|software|technology|\bdata\b|analytics|information|service desk|platform|\bai\b|digital|search|product|knowledge|gaming|game/i, "it"],
  [/operation|supply|logistic|warehouse|store|restaurant|procurement|claims|underwriting|clinical|nursing|oncology|drug|research|r&d|science|facilit|property|leasing|legal|judiciary|customs|newsroom|news|broadcast|content|network|mortgage|lending|transaction|revenue management|capacity|catering|cabin|agronomy|education|teaching|student|school|emergency|outpatient|nutrition|contract|broking|agency|innovation|programs|delivery|mine|rail|exploration|upstream/i, "ops"],
];

export function functionOf(e: Entry): string {
  return classify(e.department || "", FUNCTION_RULES, "other");
}

// ---------- Industries (from the industry field, finer than the sector)

export const INDUSTRIES: Group[] = [
  { key: "banking", en: "Banking", fr: "Banque" },
  { key: "fintech", en: "Fintech & payments", fr: "Fintech & paiements" },
  { key: "insurance", en: "Insurance", fr: "Assurance" },
  { key: "telecom", en: "Telecommunications", fr: "Télécoms" },
  { key: "air", en: "Airlines & aviation", fr: "Aérien" },
  { key: "transport", en: "Transport & logistics", fr: "Transport & logistique" },
  { key: "retail", en: "Retail & e-commerce", fr: "Distribution & e-commerce" },
  { key: "food", en: "Restaurants & food", fr: "Restauration & alimentaire" },
  { key: "hospitality", en: "Hotels & travel", fr: "Hôtellerie & voyage" },
  { key: "public", en: "Government", fr: "Administration" },
  { key: "education", en: "Education", fr: "Éducation" },
  { key: "health", en: "Healthcare", fr: "Santé" },
  { key: "pharma", en: "Pharma & life sciences", fr: "Pharma & sciences du vivant" },
  { key: "energy", en: "Energy & utilities", fr: "Énergie & services publics" },
  { key: "auto", en: "Automotive", fr: "Automobile" },
  { key: "industry", en: "Industry & manufacturing", fr: "Industrie" },
  { key: "media", en: "Media, sports & entertainment", fr: "Médias, sport & divertissement" },
  { key: "services", en: "Consulting & professional services", fr: "Conseil & services professionnels" },
  { key: "tech", en: "Technology & software", fr: "Technologie & logiciel" },
  { key: "other", en: "Other industries", fr: "Autres industries" },
];

const INDUSTRY_RULES: Rule[] = [
  [/insur/i, "insurance"],
  [/fintech|payment|wallet|lending|mortgage|credit card|consumer finance/i, "fintech"],
  [/bank|financial|wealth|asset management|investment|capital markets|brokerage|stock exchange|securities/i, "banking"],
  [/telecom|mobile network|operator/i, "telecom"],
  [/airline|aviation|airport/i, "air"],
  [/rail|transit|transport|logistic|shipping|freight|delivery|postal|mobility services|ride/i, "transport"],
  [/restaurant|food|beverage|dairy|grocery|agri|coffee/i, "food"],
  [/retail|e-commerce|ecommerce|marketplace|apparel|fashion|beauty|cosmetic|luxury|home improvement|department store|furniture/i, "retail"],
  [/hotel|hospitality|travel|tourism|booking/i, "hospitality"],
  [/pharma|biotech|life science|drug/i, "pharma"],
  [/health|hospital|medical|clinic|care provider|payer/i, "health"],
  [/education|university|school|academic|college/i, "education"],
  [/government|public|ministry|municipal|federal|state|city|judiciary|defen[cs]e|civil|tax authority|customs|statistic|nonprofit|non-profit|charity/i, "public"],
  [/oil|gas|energy|utilit|power|electric|mining|metals|steel/i, "energy"],
  [/automotive|vehicle|car /i, "auto"],
  [/manufactur|industrial|semiconductor|electronics|construction|engineering|chemical|appliance|consumer goods|cpg|packaged/i, "industry"],
  [/media|news|publishing|broadcast|entertainment|music|streaming|gaming|game|sport|league|football|basketball|advertising|marketing/i, "media"],
  [/consult|legal|law|accounting|audit|professional services|it services|outsourcing|staffing|real estate|property/i, "services"],
  [/software|saas|technology|tech|internet|platform|ai |cloud|cyber/i, "tech"],
];

export function industryOf(e: Entry): string {
  return classify(e.industry || "", INDUSTRY_RULES, "other");
}

// ---------- Vendors (the platform the fiche declares)

const VENDOR_RULES: Rule[] = [
  [/salesforce|agentforce/i, "Salesforce"],
  [/microsoft|azure|github|copilot/i, "Microsoft"],
  [/google|gemini|vertex|deepmind/i, "Google"],
  [/\baws\b|amazon web services|bedrock|amazon/i, "AWS"],
  [/anthropic|claude/i, "Anthropic"],
  [/openai|chatgpt/i, "OpenAI"],
  [/sierra/i, "Sierra"],
  [/decagon/i, "Decagon"],
  [/servicenow/i, "ServiceNow"],
  [/glean/i, "Glean"],
  [/abridge/i, "Abridge"],
  [/harvey/i, "Harvey"],
  [/cognition|windsurf|devin/i, "Cognition"],
  [/siemens/i, "Siemens"],
  [/nvidia/i, "NVIDIA"],
  [/deepseek/i, "DeepSeek"],
  [/\bmeta\b|llama/i, "Meta"],
];

export const VENDOR_NONE = "none";
export const VENDOR_OTHER = "other";

export function vendorOf(e: Entry): string {
  const v = (e.vendor || "").trim();
  if (!v || /in-house|internal|proprietary/i.test(v) && !VENDOR_RULES.some(([re]) => re.test(v))) return VENDOR_NONE;
  return classify(v, VENDOR_RULES, VENDOR_OTHER);
}

export function vendorLabel(key: string, fr: boolean): string {
  if (key === VENDOR_NONE) return fr ? "Interne ou non déclaré" : "In-house or undeclared";
  if (key === VENDOR_OTHER) return fr ? "Autres éditeurs" : "Other vendors";
  return key;
}

/** Vendor groups present in the data, most used first, with the catch-alls last. */
export function vendorGroups(entries: Entry[]): string[] {
  const n = new Map<string, number>();
  for (const e of entries) n.set(vendorOf(e), (n.get(vendorOf(e)) ?? 0) + 1);
  return [...n.keys()]
    .filter((k) => k !== VENDOR_NONE && k !== VENDOR_OTHER)
    .sort((a, b) => (n.get(b) ?? 0) - (n.get(a) ?? 0) || a.localeCompare(b))
    .concat([VENDOR_OTHER, VENDOR_NONE].filter((k) => n.has(k)));
}

export const groupLabel = (list: Group[], key: string, fr: boolean) => {
  const g = list.find((x) => x.key === key);
  return g ? (fr ? g.fr : g.en) : key;
};

/** A fiche has a quantified result when one of its outcomes carries a number. */
export const hasQuantifiedResult = (e: Entry) => e.reported_outcomes.some((o) => /\d/.test(o.value));
