import Link from "next/link";
import { getEntries, getStats } from "@/lib/data";
import { getSectors } from "@/lib/sectors";
import { formatDate, formatTimestamp } from "@/lib/format";
import Explorer from "@/components/Explorer";
import Marquee from "@/components/Marquee";
import Bi from "@/components/Bi";
import Globe from "@/components/Globe";
import GlobeCountry from "@/components/GlobeCountry";
import { buildMarkers } from "@/lib/geo";
import { ConfidenceBadge } from "@/components/badges";

export default function Home() {
  const entries = getEntries();
  const stats = getStats();
  const sectors = getSectors();
  const companies = [...new Set(entries.map((e) => e.company))].sort((a, b) => a.localeCompare(b));
  const latest = [...entries]
    .sort((a, b) => b.first_seen_date.localeCompare(a.first_seen_date) || a.company.localeCompare(b.company))
    .slice(0, 8);
  const countryCounts: Record<string, number> = {};
  for (const e of entries) {
    if (e.company_country) countryCounts[e.company_country] = (countryCounts[e.company_country] || 0) + 1;
  }
  const markers = buildMarkers(countryCounts);

  return (
    <main>
      {/* ===== Hero · HUBFORUM living gradient ===== */}
      <section className="relative overflow-hidden bg-mauve-night text-white">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="hero-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-20 md:pb-16 md:pt-28">
          <p className="kicker text-mauve-bright">
            <Bi
              en="The AI observatory by HUB Institute · updated autonomously"
              fr="L'observatoire IA du HUB Institute · mis à jour de façon autonome"
            />
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[1.02] tracking-tight md:text-6xl">
            <span className="lang-en">
              The library of
              <br />
              <span className="text-mauve-bright">AI agents</span> inside
              <br />
              the world&apos;s companies
            </span>
            <span className="lang-fr">
              La bibliothèque des
              <br />
              <span className="text-mauve-bright">agents IA</span> déployés
              <br />
              dans les entreprises du monde
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            <Bi
              en="From AI promise to business proof: Agentipedia catalogs the deployments that actually run: real companies, named solutions, shelved by sector for decision-makers. Every entry links the sources that prove it. No source, no entry."
              fr="De la promesse de l'IA à la preuve business : Agentipedia recense les déploiements qui tournent vraiment : entreprises réelles, solutions nommées, classés par secteur pour les décideurs. Chaque fiche cite les sources qui la prouvent. Pas de source, pas de fiche."
            />
          </p>

          <div className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6">
            <div>
              <p className="text-5xl font-black text-mauve-glow md:text-6xl" data-count={stats.entries}>
                {stats.entries}
              </p>
              <p className="kicker mt-1 text-white/60">
                <Bi en="verified deployments" fr="déploiements vérifiés" />
              </p>
            </div>
            <div>
              <p className="text-5xl font-black text-mauve-glow md:text-6xl" data-count={sectors.length}>
                {sectors.length}
              </p>
              <p className="kicker mt-1 text-white/60">
                <Bi en="sectors" fr="secteurs" />
              </p>
            </div>
            <div>
              <p className="text-5xl font-black text-mauve-glow md:text-6xl" data-count={stats.countries}>
                {stats.countries}
              </p>
              <p className="kicker mt-1 text-white/60">
                <Bi en="countries" fr="pays" />
              </p>
            </div>
            <div>
              <p className="text-5xl font-black text-mauve-glow md:text-6xl" data-count={stats.regions}>
                {stats.regions}
              </p>
              <p className="kicker mt-1 text-white/60">
                <Bi en="world regions" fr="régions du monde" />
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
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
        <div className="relative">
          <Marquee items={companies} />
        </div>
      </section>

      {/* ===== The shelves ===== */}
      <section id="sectors" className="mx-auto max-w-6xl scroll-mt-20 px-6 pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3" data-reveal>
          <div>
            <p className="kicker text-mauve">
              <Bi en="The shelves" fr="Les rayons" />
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
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
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s, i) => (
            <li key={s.slug} data-reveal style={{ "--reveal-delay": `${(i % 6) * 60}ms` } as React.CSSProperties}>
              <Link
                href={`/sector/${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-lavender-line bg-lilac-soft p-5 transition-all hover:-translate-y-0.5 hover:border-mauve hover:shadow-[0_10px_30px_-12px_rgb(107_43_217/0.35)]"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[1.05rem] font-extrabold leading-snug">{s.name}</p>
                  <span className="text-2xl font-black text-mauve">{s.entries}</span>
                </div>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">
                  {s.companies.join(" · ")}
                  {s.entries > s.companies.length ? " …" : ""}
                </p>
                <p className="kicker mt-3 text-muted">
                  {s.countries}{" "}
                  {s.countries > 1 ? <Bi en="countries" fr="pays" /> : <Bi en="country" fr="pays" />} ·{" "}
                  {s.production} <Bi en="in production" fr="en production" />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== The world map ===== */}
      <section id="map" className="relative mt-16 scroll-mt-20 overflow-hidden bg-mauve-night text-white">
        <div className="hero-glow absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-[1fr_minmax(0,420px)] md:py-16">
          <div data-reveal>
            <Globe markers={markers} />
            <p className="kicker mt-4 text-center text-white/50">
              <Bi
                en="Drag to spin · click a country to filter the index"
                fr="Faites tourner le globe · cliquez un pays pour filtrer l'index"
              />
            </p>
          </div>
          <div data-reveal>
            <p className="kicker text-mauve-bright">
              <Bi en="The world map" fr="La carte du monde" />
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
              <Bi en="Where the agents run" fr="Où tournent les agents" />
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
              <Bi
                en={`${stats.entries} verified deployments across ${stats.countries} countries. Dot size follows the number of catalogued agents.`}
                fr={`${stats.entries} déploiements vérifiés dans ${stats.countries} pays. La taille des points suit le nombre d'agents catalogués.`}
              />
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
              {markers.slice(0, 10).map((m) => (
                <li key={m.country}>
                  <GlobeCountry country={m.country} count={m.count} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Fresh on the shelves ===== */}
      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3" data-reveal>
          <div>
            <p className="kicker text-mauve">
              <Bi en="Fresh on the shelves" fr="Nouveautés" />
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
              <Bi en="Latest additions" fr="Derniers ajouts" />
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            <Bi
              en="The most recently verified deployments. Scroll sideways."
              fr="Les déploiements vérifiés le plus récemment. Faites défiler horizontalement."
            />
          </p>
        </div>
        <div className="rail -mx-6 mt-8 flex gap-4 overflow-x-auto px-6 pb-3" data-reveal>
          {latest.map((e) => (
            <Link
              key={e.id}
              href={`/entry/${e.id}`}
              className="group w-72 shrink-0 rounded-2xl border border-lavender-line bg-paper p-5 transition-all hover:-translate-y-0.5 hover:border-mauve hover:shadow-[0_10px_30px_-12px_rgb(107_43_217/0.35)]"
            >
              <p className="kicker text-muted">{formatDate(e.first_seen_date)}</p>
              <p className="mt-2 text-base font-extrabold leading-snug">{e.company}</p>
              <p className="mt-0.5 truncate text-sm font-bold text-mauve">{e.solution_name}</p>
              <div className="mt-3">
                <ConfidenceBadge entry={e} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Index ===== */}
      <section id="index" className="mx-auto max-w-6xl scroll-mt-20 px-6 pt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3" data-reveal>
          <div>
            <p className="kicker text-mauve">
              <Bi en="Deployment index" fr="Index des déploiements" />
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
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
    </main>
  );
}
