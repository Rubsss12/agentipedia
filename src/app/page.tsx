import Link from "next/link";
import { getEntries, getStats } from "@/lib/data";
import { getSectors } from "@/lib/sectors";
import { formatTimestamp } from "@/lib/format";
import Explorer from "@/components/Explorer";
import Marquee from "@/components/Marquee";
import OffersLead from "@/components/OffersLead";
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

  return (
    <main>
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
                  The Index Live of <span className="text-mauve-bright">AI agents</span>{" "}
                  inside the world&apos;s companies
                </span>
                <span className="lang-fr">
                  L&apos;Index Live des <span className="text-mauve-bright">agents IA</span>{" "}
                  déployés dans les entreprises du monde
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                <Bi
                  en="From AI promise to business proof: the deployments that actually run, real companies and named solutions, with the sources that prove it. No source, no entry."
                  fr="De la promesse de l'IA à la preuve business : les déploiements qui tournent vraiment, entreprises réelles et solutions nommées, avec les sources qui le prouvent. Pas de source, pas de fiche."
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
                <div>
                  <p className="text-4xl font-black text-mauve-glow md:text-5xl" data-count={stats.regions}>
                    {stats.regions}
                  </p>
                  <p className="kicker mt-1 text-white/60">
                    <Bi en="world regions" fr="régions du monde" />
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
                  <Bi en="Where the agents run" fr="Où tournent les agents" />
                </p>
                <p className="text-xs text-white/55">
                  {stats.countries} <Bi en="countries" fr="pays" />
                </p>
              </div>
              <Globe markers={markers} />
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.68rem] font-bold text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: "#e62ec8" }} aria-hidden />
                  <Bi en="Named agents" fr="Agents nommés" />
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: "#f2764f" }} aria-hidden />
                  <Bi en={`Unnamed (${unnamedCount})`} fr={`Sans nom (${unnamedCount})`} />
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
      <section id="sectors" className="mx-auto max-w-6xl scroll-mt-20 px-6 pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3" data-reveal>
          <div>
            <p className="kicker text-mauve">
              <Bi en="The shelves" fr="Les rayons" />
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
              <Bi en="Browse by sector" fr="Parcourir par secteur" />
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            <Bi
              en="Every deployment is filed on exactly one shelf. Open a sector to see who runs what inside it."
              fr="Chaque déploiement est rangé sur un seul rayon. Ouvrez un secteur pour voir qui y déploie quoi."
            />
          </p>
        </div>
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((s, i) => (
            <li key={s.slug} data-reveal style={{ "--reveal-delay": `${(i % 8) * 40}ms` } as React.CSSProperties}>
              <Link
                href={`/sector/${s.slug}`}
                className="group flex h-full items-center gap-3 rounded-xl border border-lavender-line bg-lilac-soft px-3.5 py-2.5 transition-all hover:-translate-y-0.5 hover:border-mauve hover:shadow-[0_10px_30px_-14px_rgb(107_43_217/0.4)]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mauve/10 text-sm font-black text-mauve">
                  {s.entries}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.82rem] font-extrabold leading-tight">{s.name}</span>
                  <span className="mt-0.5 block truncate text-[0.7rem] text-muted">
                    {s.countries}{" "}
                    {s.countries > 1 ? <Bi en="countries" fr="pays" /> : <Bi en="country" fr="pays" />} ·{" "}
                    {s.production} <Bi en="in prod." fr="en prod." />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== CODA lens: four postures of adoption, click to filter the index ===== */}
      <section id="coda" className="mx-auto max-w-6xl scroll-mt-20 px-6 pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3" data-reveal>
          <div>
            <p className="kicker text-mauve">
              <Bi en="The CODA scoring map · HUB Institute" fr="La carte du scoring CODA · HUB Institute" />
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
              <Bi en="Every agent, placed on two axes" fr="Chaque agent, placé sur deux axes" />
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            <Bi
              en="Autonomy N1-N4 as the journals attest it (the 24-hour test), instrumented value-chain maillons 1-10 as the scope. The quadrant follows from the two axes; each entry carries its own score card."
              fr="L'autonomie N1-N4 telle que les journaux l'attestent (le test des 24 heures), les maillons instrumentés 1-10 comme portée. Le quadrant découle des deux axes ; chaque fiche porte sa propre score card."
            />
          </p>
        </div>
        <CodaMatrix points={codaPoints} />
        <p className="mt-5 text-xs text-muted" data-reveal>
          <Bi
            en="Declared = min(observed, authorized by the documented locks) - the anti agent-washing clause. Placement is our analytical reading of each deployment, never a claim made by the source."
            fr="Déclaré = min(observé, autorisé par les verrous documentés) - la clause anti agent-washing. Le placement est notre lecture analytique de chaque déploiement, jamais une affirmation de la source."
          />
        </p>
      </section>

      {/* ===== Index (filters + everything), right after the shelves ===== */}
      <section id="index" className="mx-auto max-w-6xl scroll-mt-20 px-6 pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3" data-reveal>
          <div>
            <p className="kicker text-mauve">
              <Bi en="Deployment index" fr="Index des déploiements" />
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
              <Bi en="Who runs what, where" fr="Qui déploie quoi, où" />
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            <Bi
              en="Search companies, solutions and vendors, or narrow by sector, geography, industry, department, stage and confidence."
              fr="Cherchez entreprises, solutions et éditeurs, ou filtrez par secteur, géographie, industrie, département, stade et confiance."
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
