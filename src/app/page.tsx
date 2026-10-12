import type { Metadata } from "next";
import Link from "next/link";
import { getEntries, getStats } from "@/lib/data";
import { getSectors } from "@/lib/sectors";
import { sectorFr } from "@/lib/labels";
import Explorer from "@/components/Explorer";
import Marquee from "@/components/Marquee";
import OffersLead from "@/components/OffersLead";
import HashScroll from "@/components/HashScroll";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PUBLISHER, OG_IMAGE } from "@/lib/site";
import Bi from "@/components/Bi";
import Globe from "@/components/Globe";
import { buildMarkers } from "@/lib/geo";
import CodaMatrix, { type CodaPoint } from "@/components/CodaMatrix";
import { codaDeclared, codaQuadrant, codaScope, type CodaKey } from "@/lib/coda";
import { FUNCTIONS, functionOf } from "@/lib/taxonomy";
import { getAgentWashing, CURRENT_INSIGHT } from "@/lib/insight";
import { HeroSearch, FunctionEntries } from "@/components/HomeShortcuts";
import AlertSignup from "@/components/AlertSignup";
import ShareLinkedIn from "@/components/ShareLinkedIn";
import Momentum from "@/components/Momentum";
import { getMomentum } from "@/lib/momentum";

// Flagship brands for the ticker under the hero, French-led for French
// visitors. Every name must match a company in the index (checked at build).
const BRANDS_FR = [
  "L'Oréal", "Carrefour", "SNCF", "AXA", "TotalEnergies", "Renault", "Orange", "Sanofi", "Decathlon", "ENGIE",
  "Schneider Electric", "Sephora", "Publicis Groupe", "Havas", "Nestlé", "Unilever", "IKEA", "HSBC", "BMW",
  "Mercedes-Benz", "Allianz", "Generali", "Banco Santander", "BBVA", "Deutsche Telekom", "Lufthansa Group",
  "Zalando", "Spotify", "Novo Nordisk", "Maersk",
];
const BRANDS_EN = [
  "JPMorgan Chase", "Walmart", "Amazon", "Netflix", "Mercedes-Benz", "HSBC", "Nestlé", "Pfizer", "Unilever",
  "Toyota", "IKEA", "Bank of America", "Goldman Sachs", "Morgan Stanley", "Wells Fargo", "American Express",
  "Delta Air Lines", "Marriott International", "Hilton", "Home Depot", "Target", "Verizon", "AT&T", "Microsoft",
  "NVIDIA", "Spotify", "Samsung Electronics", "L'Oréal", "Deutsche Telekom", "Singapore Airlines",
];

/** Home numbers shared by the page and its metadata; all move with the index. */
function homeNumbers() {
  const entries = getEntries();
  const stats = getStats();
  const q: Record<CodaKey, number> = { C: 0, O: 0, D: 0, A: 0 };
  let scored = 0;
  for (const e of entries) {
    const k = codaQuadrant(e.coda);
    if (k) {
      q[k]++;
      scored++;
    }
  }
  return {
    total: stats.entries,
    countries: stats.countries,
    copilotedPct: Math.round((100 * q.C) / Math.max(1, scored)),
    agentic: q.A,
  };
}

function agenticLine(n: number): { en: string; fr: string } {
  if (n === 0) return { en: "None is truly agentic.", fr: "Aucun n'est vraiment agentique." };
  if (n === 1) return { en: "Only one is truly agentic.", fr: "Un seul est vraiment agentique." };
  return { en: `Only ${n} are truly agentic.`, fr: `Seuls ${n} sont vraiment agentiques.` };
}

export function generateMetadata(): Metadata {
  const n = homeNumbers();
  const title = "Agentipedia: the proof directory of AI agents actually at work · HUB Institute";
  const description = `${n.total} verified AI agent deployments across ${n.countries} countries: named companies, identified solutions, sources included. See what your peers are running.`;
  const ogTitle = `${n.total} AI agents deployed. ${agenticLine(n.agentic).en}`;
  const ogDescription = "From AI promise to business proof: real companies, named AI agents, verified sources.";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: { title: ogTitle, description: ogDescription, url: "/", type: "website", siteName: "Agentipedia", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: ogTitle, description: ogDescription },
  };
}

export default function Home() {
  const entries = getEntries();
  const stats = getStats();
  const sectors = getSectors();
  const n = homeNumbers();
  const line = agenticLine(n.agentic);
  const known = new Set(entries.map((e) => e.company.replace(/ \(.*\)$/, "").replace(/ Motor Corporation$/, "")));
  const missingBrands = [...BRANDS_FR, ...BRANDS_EN].filter((b) => !known.has(b));
  if (missingBrands.length) throw new Error(`Ticker brands not in the index: ${missingBrands.join(", ")}`);
  const latest = entries.map((e) => e.first_seen_date).sort().at(-1) ?? "";
  const latestDate = latest ? new Date(`${latest}T00:00:00Z`) : null;
  const fmtDay = (loc: string) =>
    latestDate?.toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) ?? "";
  const fnCounts = FUNCTIONS.filter((g) => g.key !== "other").map((g) => ({
    ...g,
    n: entries.filter((e) => functionOf(e) === g.key).length,
  }));
  const insight = getAgentWashing();
  const momentum = getMomentum();
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
      {/* ===== Hero: the thesis figure, then the search ===== */}
      <section className="relative overflow-hidden bg-mauve-night text-white">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="hero-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-14 md:pb-14 md:pt-20">
          <div className="grid items-center gap-10 md:grid-cols-[1.05fr_minmax(0,440px)]">
            <div>
              <a
                href="https://agenticbusinessforum.hubinstitute.com/?utm_source=agentipedia&utm_medium=referral&utm_campaign=home-hero"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1 pl-1 pr-3 text-xs font-bold text-white transition-colors hover:border-white hover:bg-white/15"
              >
                <span className="shrink-0 rounded-full bg-[#e11e8c] px-2.5 py-1 text-[0.65rem] uppercase tracking-wider">
                  <Bi en="Event" fr="Événement" />
                </span>
                <span className="truncate">
                  <Bi
                    en="Agentic Business Forum · 31 March 2027, Paris"
                    fr="Agentic Business Forum · 31 mars 2027, Paris"
                  />
                </span>
                <span aria-hidden>→</span>
              </a>
              <p className="kicker text-mauve-bright">
                <Bi en="The AI & agentic proof directory by HUB Institute" fr="L'annuaire des preuves IA & agentiques du HUB Institute" />
              </p>
              <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
                <span className="lang-en">
                  {n.total} AI agents deployed. <span style={{ color: "#c25ef5" }}>{line.en}</span>
                </span>
                <span className="lang-fr">
                  {n.total} agents IA déployés. <span style={{ color: "#c25ef5" }}>{line.fr}</span>
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                <Bi
                  en="Named companies, identified solutions, verifiable sources: see what your peers are really running, and the gap still to close. No source, no entry."
                  fr="Entreprises nommées, solutions identifiées, sources vérifiables : voyez ce que font réellement vos pairs, et l'écart qu'il reste à combler. Pas de source, pas de fiche."
                />
              </p>

              <HeroSearch />

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#sectors"
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-mauve-ink transition-colors hover:bg-lilac"
                >
                  <Bi en="Explore my sector" fr="Explorer mon secteur" />
                </a>
                <a
                  href="#coda"
                  className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white/90 transition-colors hover:border-mauve-bright hover:text-mauve-glow"
                >
                  <Bi en="Place my company on CODA™" fr="Situer mon entreprise sur CODA™" />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-5">
                <div>
                  <p className="text-4xl font-black text-mauve-glow md:text-5xl">
                    <span data-count={n.total}>{n.total}</span>
                  </p>
                  <p className="kicker mt-1 text-white/60">
                    <Bi en="proven deployments" fr="déploiements prouvés" />
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-mauve-glow md:text-5xl">
                    <span data-count={n.copilotedPct}>{n.copilotedPct}</span>
                    <span className="text-3xl md:text-4xl"> %</span>
                  </p>
                  <p className="kicker mt-1 text-white/60">
                    <Bi en="still copiloted" fr="encore copilotés" />
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-mauve-glow md:text-5xl">
                    <span data-count={n.countries}>{n.countries}</span>
                  </p>
                  <p className="kicker mt-1 text-white/60">
                    <Bi en="countries" fr="pays" />
                  </p>
                </div>
              </div>
              {latestDate && (
                <p className="mt-5 text-xs text-white/50">
                  <Bi
                    en={`Continuously updated · latest entry added ${fmtDay("en-GB")}`}
                    fr={`Index mis à jour en continu · dernière fiche ajoutée le ${fmtDay("fr-FR")}`}
                  />
                </p>
              )}
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
          <Marquee fr={BRANDS_FR} en={BRANDS_EN} />
        </div>
      </section>

      {/* ===== Your competitors are moving: pace and latest proofs ===== */}
      <Momentum />

      {/* ===== This week's insight: one shareable finding ===== */}
      <section className="mx-auto max-w-6xl px-6 pt-10" data-reveal>
        <div className="flex flex-col gap-4 rounded-2xl border border-lavender-line bg-paper p-5 md:flex-row md:items-center md:p-6">
          <div className="min-w-0 flex-1">
            <p className="kicker text-mauve">
              <Bi en="This week's insight" fr="L'insight de la semaine" />
            </p>
            <p className="mt-1.5 text-lg font-extrabold leading-snug md:text-xl">
              <Bi
                en={`Agent-washing: ${insight.washed.length} agents claim more autonomy than they have`}
                fr={`Agent-washing : ${insight.washed.length} agents se disent plus autonomes qu'ils ne le sont`}
              />
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href={`/insights/${CURRENT_INSIGHT.slug}/`}
              className="rounded-full bg-mauve px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-mauve-deep"
            >
              <Bi en="Read the analysis" fr="Lire l'analyse" />
            </Link>
            <ShareLinkedIn path={`/insights/${CURRENT_INSIGHT.slug}/`} tone="light" />
          </div>
        </div>
      </section>

      {/* ===== Sectors, then functions: what your peers run ===== */}
      <section id="sectors" className="mx-auto max-w-6xl scroll-mt-28 px-6 pt-14 lg:scroll-mt-20">
        <div data-reveal>
          <p className="kicker text-mauve">
            <Bi en="Sectors" fr="Secteurs" />
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
            <Bi en="What are your peers running?" fr="Que font vos pairs ?" />
          </h2>
          <p className="mt-2 text-sm text-muted md:text-base">
            <Bi
              en={`${sectors.length} sectors under scrutiny. Start with yours.`}
              fr={`${sectors.length} secteurs passés au crible. Commencez par le vôtre.`}
            />
          </p>
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
                  {(momentum.bySectorThisYear.get(s.name) ?? 0) > 0 && (
                    <span className="mt-0.5 block text-[0.7rem] font-bold text-mauve">
                      +{momentum.bySectorThisYear.get(s.name)}{" "}
                      <Bi en={`made public in ${momentum.year}`} fr={`rendus publics en ${momentum.year}`} />
                    </span>
                  )}
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
        <div className="mt-7" data-reveal>
          <p className="text-sm font-extrabold">
            <Bi en="Or start from your role" fr="Ou entrez par votre fonction" />
          </p>
          <FunctionEntries items={fnCounts} />
        </div>
      </section>

      {/* ===== CODA scoring map, on a tinted band so it reads as its own section ===== */}
      <div className="mt-16 border-y border-lavender-line bg-lilac-soft/60">
        <section id="coda" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-14 lg:scroll-mt-20">
          <div data-reveal>
            <p className="kicker text-mauve">
              <Bi en="The CODA™ Matrix" fr="La matrice CODA™" />
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
              <Bi
                en={`${n.copilotedPct}% of agents are still copiloted. The advantage lies elsewhere.`}
                fr={`${n.copilotedPct} % des agents restent copilotés. L'avantage se joue ailleurs.`}
              />
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft md:text-base">
              <Bi
                en={`Every deployment is placed by its real autonomy and the span of value chain it covers. Verdict: ${insight.washed.length} agents claim more autonomy than they have. Click a quadrant to see who does what.`}
                fr={`Chaque déploiement est placé selon son autonomie réelle et l'étendue de la chaîne de valeur qu'il couvre. Verdict : ${insight.washed.length} agents se disent plus autonomes qu'ils ne le sont. Cliquez sur un quadrant pour voir qui fait quoi.`}
              />
            </p>
          </div>
          <CodaMatrix points={codaPoints} />
        </section>
      </div>

      {/* ===== Index (filters + everything) ===== */}
      <section id="index" className="mx-auto max-w-6xl scroll-mt-28 px-6 pt-16 lg:scroll-mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3" data-reveal>
          <div>
            <p className="kicker text-mauve">
              <Bi en="The proof directory" fr="L'annuaire des preuves" />
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
              <Bi en="Who runs what, where, and to what result" fr="Qui déploie quoi, où, et pour quel résultat" />
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            <Bi
              en="Every fiche is a proof: a named company, an identified agent, dated public sources. Search, then narrow by sector, function or confidence."
              fr="Chaque fiche est une preuve : une entreprise nommée, un agent identifié, des sources publiques datées. Cherchez, puis affinez par secteur, fonction ou niveau de confiance."
            />
          </p>
        </div>
        <Explorer entries={entries} />
      </section>

      {/* ===== Sector alert and contribution: the reason to come back ===== */}
      <section className="mx-auto max-w-6xl px-6 pt-16" data-reveal>
        <AlertSignup sectors={sectors.map((s) => ({ en: s.name, fr: sectorFr(s.name) }))} />
        <p className="mt-4 text-center text-sm text-muted">
          <Bi en="Spotted a deployment we don't list yet?" fr="Vous avez repéré un déploiement absent de l'index ?" />{" "}
          <a
            href={`mailto:contact@hubinstitute.com?subject=${encodeURIComponent("Agentipedia : soumettre un déploiement")}`}
            className="font-bold text-mauve hover:underline"
          >
            <Bi en="Submit a deployment" fr="Soumettre un déploiement" />
          </a>
        </p>
      </section>

      {/* ===== Lead-gen band: HUB Institute offers + contact form ===== */}
      <OffersLead total={n.total} />
    </main>
  );
}
