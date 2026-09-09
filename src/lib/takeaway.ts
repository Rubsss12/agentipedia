import type { Entry } from "./types";
import { STAGE_LABELS, STAGE_LABELS_FR, isVendorSourced } from "./types";
import { CODA, LEVELS, codaDeclared, codaQuadrant, codaScope } from "./coda";
import { sectorFr, countryFr } from "./labels";

/**
 * The "key facts" a machine should be able to lift off a fiche without parsing
 * an SVG.
 *
 * Every line is ASSEMBLED FROM FIELDS, never translated prose, which is what
 * makes a French version possible at all across the whole index. The long
 * `use_case` paragraph stays in the language of its sources (English); this
 * block is the part that answers "who runs what, how autonomously, on what
 * evidence", and it answers it in the reader's language.
 *
 * Nothing here is new information: it is the fiche's own data, said plainly.
 * If a field is missing the line is dropped rather than padded.
 */
export interface Takeaway {
  en: string;
  fr: string;
}

const pct = (c: number) => `${Math.round(c * 100)}%`;

function sourceKinds(e: Entry): { en: string; fr: string } {
  const publishers = [...new Set(e.sources.map((s) => s.publisher).filter(Boolean))];
  const shown = publishers.slice(0, 3).join(", ");
  const rest = publishers.length - 3;
  const list = rest > 0 ? `${shown} +${rest}` : shown;
  return { en: list, fr: list };
}

export function takeaways(e: Entry): Takeaway[] {
  const out: Takeaway[] = [];
  const country = e.company_country;
  // "éditée/édité par" would need a gender the data does not carry, so the
  // vendor is stated as a label rather than agreed with the solution name.
  const vendorEn = e.vendor && e.vendor !== e.solution_name ? ` (vendor: ${e.vendor})` : "";
  const vendorFr = e.vendor && e.vendor !== e.solution_name ? ` (éditeur : ${e.vendor})` : "";
  const named = e.solution_named === false;

  // 1. Who runs what, where, at what stage.
  out.push({
    en:
      `${e.company}${country ? ` (${country})` : ""} runs ${named ? "an unnamed agent" : e.solution_name}` +
      `${vendorEn} in ${e.department || e.industry || e.sector}. ` +
      `Stage: ${STAGE_LABELS[e.deployment_stage].toLowerCase()}.`,
    fr:
      `${e.company}${country ? ` (${countryFr(country)})` : ""} exploite ${named ? "un agent sans nom public" : e.solution_name}` +
      `${vendorFr} sur le périmètre ${e.department || e.industry || sectorFr(e.sector)}. ` +
      `Stade : ${STAGE_LABELS_FR[e.deployment_stage].toLowerCase()}.`,
  });

  // 2. The CODA reading, which is the whole point of the index.
  if (e.coda) {
    const declared = codaDeclared(e.coda);
    const scope = codaScope(e.coda.links);
    const key = codaQuadrant(e.coda);
    const q = key ? CODA[key] : undefined;
    const lvl = LEVELS[declared];
    const capped = e.coda.observed > declared;
    out.push({
      en:
        `Scored N${declared}, ${lvl.en.toLowerCase()}: the agent ${lvl.verbEn.toLowerCase()}. Quadrant ${q?.en ?? "n/a"}, ` +
        `${scope}/10 value-chain links instrumented on the HUB Institute CODA™ matrix.` +
        (capped ? ` Observed at N${e.coda.observed} but capped at N${declared}: the locks documented publicly do not authorise more.` : ""),
      fr:
        `Scoré N${declared}, ${lvl.fr.toLowerCase()} : l'agent ${lvl.verbFr.toLowerCase()}. Quadrant ${q?.fr ?? "n/d"}, ` +
        `${scope}/10 maillons de la chaîne de valeur instrumentés sur la matrice CODA™ du HUB Institute.` +
        (capped ? ` Observé à N${e.coda.observed} mais plafonné à N${declared} : les verrous documentés publiquement n'autorisent pas davantage.` : ""),
    });
  }

  // 3. The strongest reported number, when there is one.
  const o = e.reported_outcomes[0];
  if (o) {
    out.push({
      en: `Reported outcome: ${o.value} (${o.metric}).`,
      fr: `Résultat rapporté : ${o.value} (${o.metric}).`,
    });
  }

  // 4. The evidence behind the fiche, stated for what it is.
  if (e.sources.length === 0) {
    out.push({
      en: "Client-sourced: shared with HUB Institute by the company itself, with no public source to date.",
      fr: "Source client : cas transmis au HUB Institute par l'entreprise elle-même, sans source publique à ce jour.",
    });
  } else {
    const k = sourceKinds(e);
    const vendor = isVendorSourced(e);
    out.push({
      en:
        `Evidence: ${e.sources.length} public source${e.sources.length > 1 ? "s" : ""} (${k.en}), confidence ${pct(e.confidence)}.` +
        (vendor ? " Vendor-marketing only, which caps the observed level at N2." : ""),
      fr:
        `Preuves : ${e.sources.length} source${e.sources.length > 1 ? "s" : ""} publique${e.sources.length > 1 ? "s" : ""} (${k.fr}), confiance ${pct(e.confidence)}.` +
        (vendor ? " Sources uniquement éditeur, ce qui plafonne l'observé à N2." : ""),
    });
  }

  return out;
}

/** One-sentence summary, for meta descriptions and machine-readable summaries. */
export function takeawaySentence(e: Entry, lang: "en" | "fr" = "en"): string {
  return takeaways(e)
    .slice(0, 2)
    .map((t) => t[lang])
    .join(" ");
}
