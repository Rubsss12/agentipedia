import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntries, getEntry, isVendorSourced } from "@/lib/data";
import { SOURCE_TYPE_LABELS, SOURCE_TYPE_LABELS_FR } from "@/lib/types";
import { ConfidenceBadge, StageBadge, SourceTypeChip, UnnamedBadge, ManualBadge } from "@/components/badges";
import { sectorSlug } from "@/lib/sectors";
import { confidencePercent, formatDate, hostOf } from "@/lib/format";
import { regimeOf } from "@/lib/regulation";
import { CodaBadge } from "@/components/badges";
import CodaCard from "@/components/CodaCard";
import Bi from "@/components/Bi";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PUBLISHER } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getEntries().map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const e = getEntry(id);
  if (!e) return {};
  const title = `${e.company} × ${e.solution_name}`;
  const path = `/entry/${e.id}`;
  return {
    title,
    description: e.use_case,
    keywords: [e.company, e.solution_name, e.vendor, e.sector, e.industry, "AI agent", "agentic AI"].filter(Boolean) as string[],
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · Agentipedia`,
      description: e.use_case,
      url: path,
      type: "article",
      siteName: "Agentipedia by HUB Institute",
    },
  };
}

function Fact({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="rounded-xl border border-lavender-line bg-lilac-soft px-4 py-3">
      <p className="kicker text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold">{value || "-"}</p>
    </div>
  );
}

export default async function EntryPage({ params }: Props) {
  const { id } = await params;
  const entry = getEntry(id);
  if (!entry) notFound();
  const regime = regimeOf(entry);
  const url = `${SITE_URL}/entry/${entry.id}`;
  const title = `${entry.company} × ${entry.solution_name}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description: entry.use_case,
        url,
        datePublished: entry.first_seen_date,
        inLanguage: "en",
        isAccessibleForFree: true,
        about: {
          "@type": "Organization",
          name: entry.company,
          ...(entry.company_country
            ? { address: { "@type": "PostalAddress", addressCountry: entry.company_country } }
            : {}),
        },
        mentions: {
          "@type": "SoftwareApplication",
          name: entry.solution_name,
          applicationCategory: "AI agent",
          ...(entry.vendor ? { author: { "@type": "Organization", name: entry.vendor } } : {}),
        },
        keywords: [entry.sector, entry.industry, entry.vendor, "AI agent", "agentic AI"].filter(Boolean).join(", "),
        isPartOf: { "@type": "WebSite", name: "Agentipedia", url: SITE_URL },
        publisher: PUBLISHER,
        ...(entry.sources?.length ? { citation: entry.sources.map((s) => s.url) } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Agentipedia", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: entry.sector, item: `${SITE_URL}/sector/${sectorSlug(entry.sector)}` },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-4xl px-6 pb-8 pt-10">
      <JsonLd data={jsonLd} />
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
              · <Bi en="Vendor:" fr="Éditeur :" /> {entry.vendor}
            </span>
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.coda && <CodaBadge coda={entry.coda} />}
          {entry.solution_named === false && <UnnamedBadge />}
          {entry.provenance === "manual" && entry.sources.length > 0 && <ManualBadge />}
          <StageBadge stage={entry.deployment_stage} />
          <ConfidenceBadge entry={entry} />
        </div>
        {entry.solution_named === false && (
          <p className="mt-3 max-w-2xl rounded-lg bg-coral-bg px-3 py-2 text-sm font-semibold text-coral-deep">
            <Bi
              en="The deployment is verified by non-marketing sources, but the agent has no public product name. The descriptor above is ours; nothing is guessed."
              fr="Le déploiement est vérifié par des sources non marketing, mais l'agent n'a pas de nom public. Le descriptif ci-dessus est le nôtre ; rien n'est deviné."
            />
          </p>
        )}
      </header>

      <section className="mt-8">
        <p className="kicker text-muted">
          <Bi en="What the agent does" fr="Ce que fait l'agent" />
        </p>
        <p className="mt-2 text-lg leading-relaxed text-ink-soft">{entry.use_case}</p>
        <p className="lang-fr mt-1 text-xs text-muted">Fiche rédigée en anglais.</p>
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

      {entry.coda && <CodaCard a={entry.coda} name={`${entry.company} × ${entry.solution_name}`} />}

      {regime && (
        <section className="mt-4 rounded-xl border border-lavender-line bg-lilac-soft px-4 py-3">
          <p className="kicker text-muted">
            <Bi en="AI regulation context" fr="Cadre réglementaire IA" />
          </p>
          <p className="mt-1 text-sm font-bold">
            <Bi en={regime.en} fr={regime.fr} />
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            <Bi en={regime.noteEn} fr={regime.noteFr} />{" "}
            <Bi
              en="Derived from the deploying organization's home country; this is jurisdictional context, not a compliance assessment."
              fr="Déduit du pays de l'organisation ; c'est un contexte juridictionnel, pas une évaluation de conformité."
            />
          </p>
        </section>
      )}

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
        {entry.sources.length === 0 && (
          <p className="mt-4 rounded-xl border border-lavender-line bg-lilac-soft px-4 py-3 text-sm text-ink-soft">
            <Bi
              en="Client-sourced: shared with HUB Institute by the company itself, with no public source to date."
              fr="Source client : cas transmis au HUB Institute par l'entreprise elle-même, sans source publique à ce jour."
            />
          </p>
        )}
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

      {/* Dig deeper into this use case — lead CTA */}
      <section className="mt-12 rounded-2xl bg-mauve-night p-6 text-white md:p-8">
        <p className="kicker text-mauve-bright">
          <Bi en="Dig deeper into this use case" fr="Creuser ce cas d'usage" />
        </p>
        <h2 className="mt-2 text-xl font-extrabold tracking-tight md:text-2xl">
          <Bi en="Want to run an agent like this?" fr="Envie de déployer un agent comme celui-ci ?" />
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
          <Bi
            en={`Understand in detail how ${entry.company} runs ${entry.solution_name}, or launch a similar project in your company. HUB Institute's experts support you, from audit to execution.`}
            fr={`Comprendre en détail comment ${entry.company} déploie ${entry.solution_name}, ou lancer un projet similaire dans votre entreprise : les experts du HUB Institute vous accompagnent, de l'audit à l'exécution.`}
          />
        </p>
        <Link
          href="/#offres"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e11e8c] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#c4157a]"
        >
          <Bi en="Talk to an expert" fr="Parler à un expert" /> →
        </Link>
      </section>
    </main>
  );
}
