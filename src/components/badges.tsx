import type { DeploymentStage, Entry, SourceType } from "@/lib/types";
import {
  isVendorSourced,
  isMarketingType,
  SOURCE_TYPE_LABELS,
  SOURCE_TYPE_LABELS_FR,
  STAGE_LABELS,
  STAGE_LABELS_FR,
} from "@/lib/types";
import { confidencePercent } from "@/lib/format";
import Bi from "@/components/Bi";

// Confidence semantics: >= 0.7 solid evidence, 0.5-0.7 reported but thinner,
// <= 0.5 usually vendor-marketing-capped. Vendor-only entries always show the
// caution treatment no matter the number.
export function ConfidenceBadge({ entry }: { entry: Entry }) {
  const vendor = isVendorSourced(entry);
  const c = entry.confidence;
  const tone = vendor
    ? "bg-warn-bg text-warn"
    : c >= 0.7
      ? "bg-ok-bg text-ok"
      : "bg-lilac text-mauve-deep";
  const label = vendor ? (
    <Bi en="Vendor-sourced" fr="Source éditeur" />
  ) : c >= 0.7 ? (
    <Bi en="Confirmed" fr="Confirmé" />
  ) : (
    <Bi en="Reported" fr="Rapporté" />
  );
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${tone}`}
      title={entry.confidence_reason}
    >
      {label}
      <span>· {confidencePercent(c)}</span>
    </span>
  );
}

const STAGE_TONES: Record<DeploymentStage, string> = {
  production: "bg-mauve text-white",
  pilot: "bg-mauve-ink/10 text-mauve-ink",
  announced: "bg-lilac text-mauve-deep",
  unknown: "bg-ink/5 text-muted",
};

export function StageBadge({ stage }: { stage: DeploymentStage }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${STAGE_TONES[stage]}`}>
      <Bi en={STAGE_LABELS[stage]} fr={STAGE_LABELS_FR[stage]} />
    </span>
  );
}

// The unnamed collection: deployment confirmed, agent has no public name.
export function UnnamedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-coral-bg px-2.5 py-1 text-[0.7rem] font-bold text-coral-deep">
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: "#f2764f" }}
      />
      <Bi en="Unnamed agent" fr="Agent sans nom" />
    </span>
  );
}

import { CODA, codaDeclared, codaQuadrant, codaScope, type CodaAssessment } from "@/lib/coda";

// Quadrant pill computed from the two axes; the amber ring flags an entry
// whose observed autonomy exceeds what its documented locks authorize.
export function CodaBadge({ coda }: { coda: CodaAssessment }) {
  const key = codaQuadrant(coda);
  if (!key) return null;
  const q = CODA[key];
  const declared = codaDeclared(coda);
  const capped = coda.observed > declared;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold text-white"
      style={{ background: q.color }}
      title={`${q.taglineEn} / ${q.taglineFr} · ${codaScope(coda.links)}/10`}
    >
      <span className="font-black tabular-nums">N{declared}</span>
      <span className="lang-en">{q.en}</span>
      <span className="lang-fr">{q.fr}</span>
      {capped && (
        <span
          aria-hidden
          title="observed > declared"
          className="inline-block h-2 w-2 rounded-full border-2 border-[#ffd9a8] bg-transparent"
        />
      )}
    </span>
  );
}

export function SourceTypeChip({ type }: { type: SourceType }) {
  const marketing = isMarketingType(type);
  return (
    <span
      className={`inline-flex rounded px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${
        marketing ? "bg-warn-bg text-warn" : "bg-lilac text-mauve-deep"
      }`}
    >
      <Bi en={SOURCE_TYPE_LABELS[type]} fr={SOURCE_TYPE_LABELS_FR[type]} />
    </span>
  );
}
