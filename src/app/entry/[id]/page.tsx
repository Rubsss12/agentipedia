import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntries, getEntry, isVendorSourced } from "@/lib/data";
import { SOURCE_TYPE_LABELS, SOURCE_TYPE_LABELS_FR } from "@/lib/types";
import { ConfidenceBadge, StageBadge, SourceTypeChip } from "@/components/badges";
import { sectorSlug } from "@/lib/sectors";
import { confidencePercent, formatDate, hostOf } from "@/lib/format";
import Bi from "@/components/Bi";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getEntries().map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const e = getEntry(id);
  if (!e) return {};
  return {
    title: `${e.company} × ${e.solution_name}`,
    description: e.use_case,
  };
}

function Fact({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="rounded-xl border border-lavender-line bg-lilac-soft px-4 py-3">
      <p className="kicker text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold">{value || "—"}</p>
    </div>
  );
}

export default async function EntryPage({ params }: Props) {
  const { id } = await params;
  const entry = getEntry(id);
  if (!entry) notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 pb-8 pt-10">
      <nav className="text-sm text-muted">
        <Link href="/" className="font-bold text-mauve transition-colors hover:text-mauve-deep">
          <Bi en="← Back to the index" fr="← Retour à l'index" />
        </Link>
      </nav>

      <header className="mt-6">
        <p className="kicker text-mauve">
          <Link href={`/sector/${sectorSlug(entry.sector)}`} className="hover:underline">
            {entry.sector}
          </Link>{" "}
          · {entry.region} · {entry.company_country}
        </p>
        <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-tight md:text-4xl">
          {entry.company}
        </h1>
        <p className="mt-2 text-xl font-bold text-mauve-deep">
          {entry.solution_name}
          {entry.vendor && entry.vendor !== entry.solution_name && (
            <span className="text-muted">
              {" "}
              · <Bi en="vendor:" fr="éditeur :" /> {entry.vendor}
            </span>
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <StageBadge stage={entry.deployment_stage} />
          <ConfidenceBadge entry={entry} />
        </div>
      </header>

      <section className="mt-8">
        <p className="kicker text-muted">
          <Bi en="What the agent does" fr="Ce que fait l'agent" />
        </p>
        <p className="mt-2 text-lg leading-relaxed text-ink-soft">{entry.use_case}</p>
        <p className="lang-fr mt-1 text-xs text-muted">Fiche rédigée en anglais, au plus près des sources.</p>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <Fact label={<Bi en="Sector" fr="Secteur" />} value={entry.sector} />
        <Fact label={<Bi en="Industry" fr="Industrie" />} value={entry.industry} />
        <Fact label={<Bi en="Department" fr="Département" />} value={entry.department} />
        <Fact label={<Bi en="Vendor" fr="Éditeur" />} value={entry.vendor} />
        <Fact label={<Bi en="Country" fr="Pays" />} value={entry.company_country} />
        <Fact label={<Bi en="Region" fr="Région" />} value={entry.region} />
        <Fact label={<Bi en="First catalogued" fr="Ajouté le" />} value={formatDate(entry.first_seen_date)} />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight">
          <Bi en="Reported outcomes" fr="Résultats rapportés" />
        </h2>
        {entry.reported_outcomes.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            <Bi
              en="No measurable outcomes were reported in the sources. Fields stay empty rather than guessed."
              fr="Aucun résultat mesurable n'est rapporté dans les sources. Les champs restent vides plutôt que devinés."
            />
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {entry.reported_outcomes.map((o, i) => (
              <li
                key={i}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-lavender-line px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold">{o.metric}</p>
                  <p className="text-lg font-black text-mauve">{o.value}</p>
                </div>
                <div className="text-right">
                  <SourceTypeChip type={o.source_type} />
                  <p className="mt-1 text-[0.7rem] text-muted">
                    {o.source_type === "vendor_case_study" || o.source_type === "press_release" ? (
                      <Bi en="claimed, not independently confirmed" fr="déclaré, non confirmé indépendamment" />
                    ) : (
                      <Bi en="as reported by this source type" fr="tel que rapporté par ce type de source" />
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 rounded-2xl border border-lavender-line bg-lilac-soft p-5">
        <h2 className="text-xl font-black uppercase tracking-tight">
          <Bi en="Confidence:" fr="Confiance :" /> {confidencePercent(entry.confidence)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{entry.confidence_reason}</p>
        {isVendorSourced(entry) && (
          <p className="mt-3 rounded-lg bg-warn-bg px-3 py-2 text-sm font-semibold text-warn">
            <Bi
              en="All evidence for this entry comes from vendor marketing (case studies or press releases). Confidence is capped at 50% until an independent source confirms it."
              fr="Toutes les preuves de cette fiche viennent du marketing de l'éditeur (cas clients ou communiqués). La confiance est plafonnée à 50 % tant qu'une source indépendante ne la confirme pas."
            />
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight">Sources</h2>
        <ul className="mt-4 space-y-3">
          {entry.sources.map((s, i) => (
            <li key={i} className="rounded-xl border border-lavender-line px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <SourceTypeChip type={s.source_type} />
                <span className="text-xs font-bold text-muted">{s.publisher}</span>
                <span className="ml-auto text-xs text-muted">
                  <Bi en="retrieved" fr="consulté le" /> {formatDate(s.retrieved_date)}
                </span>
              </div>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 block font-bold text-mauve-deep underline-offset-4 transition-colors hover:text-mauve hover:underline"
              >
                {s.title}
              </a>
              <p className="text-xs text-muted">{hostOf(s.url)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          <span className="lang-en">
            Source types explained on the{" "}
            <Link href="/methodology" className="font-bold text-mauve hover:underline">
              methodology page
            </Link>
            . Types: {Object.values(SOURCE_TYPE_LABELS).join(", ").toLowerCase()}.
          </span>
          <span className="lang-fr">
            Les types de sources sont expliqués sur la{" "}
            <Link href="/methodology" className="font-bold text-mauve hover:underline">
              page méthodologie
            </Link>
            . Types : {Object.values(SOURCE_TYPE_LABELS_FR).join(", ").toLowerCase()}.
          </span>
        </p>
      </section>
    </main>
  );
}
