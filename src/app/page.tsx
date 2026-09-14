import type { Metadata } from "next";
import Link from "next/link";
import { getEntries, getStats } from "@/lib/data";

export const metadata: Metadata = { alternates: { canonical: "/" } };
import { getSectors } from "@/lib/sectors";
import { sectorFr } from "@/lib/labels";
import { formatTimestamp } from "@/lib/format";
import Explorer from "@/components/Explorer";
import Marquee from "@/components/Marquee";
import OffersLead from "@/components/OffersLead";
import HashScroll from "@/components/HashScroll";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PUBLISHER } from "@/lib/site";
import Bi from "@/components/Bi";
import Globe from "@/components/Globe";
import { buildMarkers } from "@/lib/geo";
import CodaMatrix, { type CodaPoint } from "@/components/CodaMatrix";
import { codaDeclared, codaQuadrant, codaScope } from "@/lib/coda";

export default function Home() {
  const entries = getEntries();
  const stats = getStats();
  const sectors = getSectors();
  const companies = [...new Set(entries.map((e) => e.company))].sort((a, b) => a.localeCompare(b));
  const markers = buildMarkers(entries);
  const unnamedCount = entries.filter((e) => e.solution_named === false).length;
  const codaPoints: CodaPoint[] = entries
    .filter((e) => e.coda)
    .map((e) => {
      const a = e.coda!;
      const declared = codaDeclared(a);
      return { q: codaQuadrant(a)!, declared, scope: codaScope(a.links), capped: a.observed > declared };
    });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Agentipedia",
        alternateName: "Agentipedia by HUB Institute",
        url: SITE_URL,
        inLanguage: ["en", "fr"],
        publisher: PUBLISHER,
      },
      {
        "@type": "Dataset",
        name: "Agentipedia: AI agent deployments at work",
        description:
          "A curated, source-verified catalog of real AI-agent deployments inside named companies worldwide, each scored on the CODA™ maturity matrix. From AI promise to business proof.",
        url: SITE_URL,
        creator: PUBLISHER,
        publisher: PUBLISHER,
        isAccessibleForFree: true,
        keywords: ["AI agents", "agentic AI", "enterprise AI", "AI deployments", "case studies", "CODA™ maturity"],
        variableMeasured: `${stats.entries} verified deployments across ${stats.countries} countries and ${sectors.length} sectors`,
        ...(stats.updatedAt ? { dateModified: stats.updatedAt } : {}),
      },
      {
        "@type": "Organization",
        name: "HUB Institute",
        url: "https://www.hubinstitute.com",
        sameAs: [
          "https://www.linkedin.com/company/hub-institute/",
          "https://twitter.com/HUBInstitute",
          "https://www.instagram.com/hubinstitute/",
          "https://www.youtube.com/@Hubinstitute",
        ],
      },
    ],
  };

  return (
    <main>
      <JsonLd data={jsonLd} />
      <HashScroll />
      {/* ===== Hero: copy on the left, interactive globe card top-right ===== */}
      <section className="relative overflow-hidden bg-mauve-night text-white">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="hero-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-14 md:pb-14 md:pt-20">
          <div className="grid items-center gap-10 md:grid-cols-[1.05fr_minmax(0,440px)]">
            {/* left: copy */}
            <div>
              <p className="kicker text-mauve-bright">
                <Bi
                  en="The AI & Agentic observatory by HUB Institute"
                  fr="L'observatoire IA et Agentique du HUB Institute"
                />
              </p>
              <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
                <span className="lang-en">
                  The AI &amp; <span style={{ color: "#c25ef5" }}>Agentic</span> index
                </span>
                <span className="lang-fr">
                  L&apos;index de l&apos;IA et de <span style={{ color: "#c25ef5" }}>l&apos;agentique</span>
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                <Bi
                  en="From AI promise to business proof: the deployments that actually run, real companies and identified solutions, with the sources that prove it. No source, no entry."
                  fr="De la promesse de l'IA à la preuve business : les déploiements qui tournent vraiment, entreprises réelles et solutions identifiées, avec les sources qui le prouvent. Pas de source, pas de fiche."
                />
              </p>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-5">
                <div>
                  <p className="text-4xl font-black text-mauve-glow md:text-5xl" data-count={stats.entries}>
                    {stats.entries}
                  </p>
                  <p className="kicker mt-1 text-white/60">
                    <Bi en="verified deployments" fr="déploiements vérifiés" />
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-mauve-glow md:text-5xl" data-count={sectors.length}>
                    {sectors.length}
                  </p>
                  <p className="kicker mt-1 text-white/60">
                    <Bi en="sectors" fr="secteurs" />
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-mauve-glow md:text-5xl" data-count={stats.countries}>
                    {stats.countries}
                  </p>
                  <p className="kicker mt-1 text-white/60">
                    <Bi en="countries" fr="pays" />
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#sectors"
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-mauve-ink transition-colors hover:bg-lilac"
                >
                  <Bi en="Browse by sector" fr="Parcourir par secteur" />
                </a>
                <a
                  href="#index"
                  className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white/90 transition-colors hover:border-mauve-bright hover:text-mauve-glow"
                >
                  <Bi en="Search everything" fr="Tout rechercher" />
                </a>
                <p className="text-xs text-white/50">
                  <Bi en="Last updated:" fr="Dernière mise à jour :" />{" "}
                  {stats.updatedAt ? (
                    formatTimestamp(stats.updatedAt)
                  ) : (
                    <Bi en="awaiting first curation run" fr="en attente de la première curation" />
                  )}
                </p>
              </div>
            </div>

            {/* right: the globe, in its own interactive card */}
            <div className="rounded-3xl border border-white/15 bg-white/[0.05] p-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm md:p-5">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <p className="kicker text-mauve-bright">
                  <Bi en="Top AI use cases" fr="Les meilleurs cas d'usage IA" />
                </p>
                <p className="text-xs text-white/55">
                  {stats.countries} <Bi en="countries" fr="pays" />
                </p>
              </div>
              <Globe markers={markers} />
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.68rem] font-bold text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: "#e62ec8" }} aria-hidden />
                  <Bi en="Named AI agents" fr="Agents IA nommés" />
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: "#f2764f" }} aria-hidden />
                  <Bi en={`Unnamed AI agents (${unnamedCount})`} fr={`Agents IA sans nom (${unnamedCount})`} />
                </span>
              </div>
              <p className="kicker mt-2 text-center text-white/50">
                <Bi
                  en="Drag to spin · click a dot to filter"
                  fr="Faites tourner · cliquez un point pour filtrer"
                />
              </p>
            </div>
          </div>
        </div>
        <div className="relative">
          <Marquee items={companies} />
        </div>
      </section>

      {/* ===== The shelves (compact) ===== */}
      <section id="sectors" className="mx-auto max-w-6xl scroll-mt-28 px-6 pt-14 lg:scroll-mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3" data-reveal>
          <div>
            <p className="kicker text-mauve">
              <Bi en="Sectors" fr="Secteurs" />
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
              <Bi en="Browse by sector" fr="Parcourir par secteur" />
            </h2>
          </div>
        </div>
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((s, i) => (
            <li key={s.slug} data-reveal style={{ "--reveal-delay": `${(i % 8) * 40}ms` } as React.CSSProperties}>
              <Link
                href={`/sector/${s.slug}`}
                className="group flex h-full items-center gap-3 rounded-xl border border-lavender-line bg-paper px-3.5 py-2.5 transition-all hover:-translate-y-0.5 hover:border-mauve hover:shadow-[0_10px_30px_-14px_rgb(107_43_217/0.4)]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mauve/10 text-sm font-black text-mauve">
                  {s.entries}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.82rem] font-extrabold leading-tight">
                    <Bi en={s.name} fr={sectorFr(s.name)} />
                  </span>
                  <span className="mt-0.5 block truncate text-[0.7rem] text-muted">
                    {s.countries}{" "}
                    {s.countries > 1 ? <Bi en="countries" fr="pays" /> : <Bi en="country" fr="pays" />} ·{" "}
                    {s.production} <Bi en="in production" fr="en production" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== CODA scoring map, on a tinted band so it reads as its own section ===== */}
      <div className="mt-16 border-y border-lavender-line bg-lilac-soft/60">
        <section id="coda" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-14 lg:scroll-mt-20">
          <div data-reveal>
            <p className="kicker text-mauve">
              <Bi en="Scoring map, CODA™ method" fr="Carte de scoring selon la méthode CODA™" />
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
              <Bi
                en="Every agent placed by autonomy level and value chain"
                fr="Chaque agent placé par niveau d'autonomie et chaîne de valeur"
              />
            </h2>
          </div>
          <CodaMatrix points={codaPoints} />
        </section>
      </div>

      {/* ===== Index (filters + everything), right after the shelves ===== */}
      <section id="index" className="mx-auto max-w-6xl scroll-mt-28 px-6 pt-16 lg:scroll-mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3" data-reveal>
          <div>
            <p className="kicker text-mauve">
              <Bi en="AI & agentic deployment index" fr="Index des déploiements IA et agentiques" />
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
              <Bi en="Who runs what, where" fr="Qui déploie quoi, où" />
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            <Bi
              en="Search companies, solutions and vendors, or narrow by sector, geography, industry, department, status and confidence."
              fr="Cherchez entreprises, solutions et éditeurs, ou filtrez par secteur, géographie, industrie, département, statut et confiance."
            />
          </p>
        </div>
        <Explorer entries={entries} />
      </section>

      {/* ===== Lead-gen band: HUB Institute offers + contact form ===== */}
      <OffersLead />
    </main>
  );
}
