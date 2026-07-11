import Link from "next/link";
import { getEntries, getStats } from "@/lib/data";
import { getSectors } from "@/lib/sectors";
import { formatTimestamp } from "@/lib/format";
import Explorer from "@/components/Explorer";

export default function Home() {
  const entries = getEntries();
  const stats = getStats();
  const sectors = getSectors();

  return (
    <main>
      {/* ===== Hero — HUBFORUM-style violet night ===== */}
      <section className="relative overflow-hidden bg-mauve-night text-white">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="hero-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 md:pb-24 md:pt-28">
          <p className="kicker text-mauve-bright">The living library · updated autonomously</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[1.02] tracking-tight md:text-6xl">
            The library of
            <br />
            <span className="text-mauve-bright">AI agents</span> inside
            <br />
            the world&apos;s companies
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Agentipedia catalogs real, verified deployments of AI agents inside
            named companies — shelved by sector, searchable by anything. Every
            entry names both the company and the exact solution, and links the
            sources that prove it. No source, no entry.
          </p>

          <div className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6">
            <div>
              <p className="text-5xl font-black text-mauve-glow md:text-6xl">{stats.entries}</p>
              <p className="kicker mt-1 text-white/60">verified deployments</p>
            </div>
            <div>
              <p className="text-5xl font-black text-mauve-glow md:text-6xl">{sectors.length}</p>
              <p className="kicker mt-1 text-white/60">sectors</p>
            </div>
            <div>
              <p className="text-5xl font-black text-mauve-glow md:text-6xl">{stats.countries}</p>
              <p className="kicker mt-1 text-white/60">countries</p>
            </div>
            <div>
              <p className="text-5xl font-black text-mauve-glow md:text-6xl">{stats.regions}</p>
              <p className="kicker mt-1 text-white/60">world regions</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#sectors"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-mauve-ink transition-colors hover:bg-lilac"
            >
              Browse by sector
            </a>
            <a
              href="#index"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white/90 transition-colors hover:border-mauve-bright hover:text-mauve-glow"
            >
              Search everything
            </a>
            <p className="text-xs text-white/50">
              Last updated:{" "}
              {stats.updatedAt ? formatTimestamp(stats.updatedAt) : "awaiting first curation run"}
            </p>
          </div>
        </div>
      </section>

      {/* ===== The shelves ===== */}
      <section id="sectors" className="mx-auto max-w-6xl scroll-mt-20 px-6 pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="kicker text-mauve">The shelves</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">Browse by sector</h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            Every deployment is filed on exactly one shelf. Open a sector to see
            who runs what inside it.
          </p>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s) => (
            <li key={s.slug}>
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
                  {s.countries} {s.countries > 1 ? "countries" : "country"} · {s.production} in production
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== Index ===== */}
      <section id="index" className="mx-auto max-w-6xl scroll-mt-20 px-6 pt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="kicker text-mauve">Deployment index</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
              Who runs what, where
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            Search companies, solutions and vendors, or narrow by sector,
            geography, industry, department, stage and confidence.
          </p>
        </div>
        <Explorer entries={entries} />
      </section>
    </main>
  );
}
