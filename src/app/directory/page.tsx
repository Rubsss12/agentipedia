import Link from "next/link";
import type { Metadata } from "next";
import { getEntries, getStats } from "@/lib/data";
import { sectorFr, countryFr } from "@/lib/labels";
import Bi from "@/components/Bi";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, OG_IMAGE } from "@/lib/site";

/**
 * The plain list of everything in the index, grouped by sector.
 *
 * The Explorer on the home page is the good way to browse, but it is a client
 * component that server-renders six cards: the other 645 fiches existed only
 * once JavaScript had run, so nothing linked to them. A crawler reached 153 of
 * 673 pages, and a reader without JavaScript saw the same six. This page is the
 * boring fix: every fiche, as an ordinary link, rendered on the server.
 *
 * It is deliberately text only. No filters, no cards, no images: it is the
 * table of contents, and it should stay light enough to carry 651 links.
 */
export const metadata: Metadata = (() => {
  const n = getStats().entries;
  const title = "Directory: every deployment in the index";
  const description = `The complete list of the ${n} AI agent deployments catalogued in Agentipedia, grouped by sector, each linking to its fiche and its sources.`;
  return {
    title,
    description,
    alternates: { canonical: "/directory" },
    openGraph: { title: `${title} · Agentipedia`, description, url: "/directory", type: "website", siteName: "Agentipedia by HUB Institute", images: [OG_IMAGE] },
  };
})();

export default function DirectoryPage() {
  const entries = getEntries();
  const stats = getStats();

  const bySector = new Map<string, typeof entries>();
  for (const e of entries) {
    if (!bySector.has(e.sector)) bySector.set(e.sector, []);
    bySector.get(e.sector)!.push(e);
  }
  const sectors = [...bySector.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [, list] of sectors) list.sort((a, b) => a.company.localeCompare(b.company, "en"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Agentipedia directory",
        description: `The complete list of the ${stats.entries} AI agent deployments catalogued in Agentipedia.`,
        url: `${SITE_URL}/directory/`,
        isPartOf: { "@type": "WebSite", name: "Agentipedia", url: `${SITE_URL}/` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Agentipedia", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Directory", item: `${SITE_URL}/directory/` },
        ],
      },
    ],
  };

  return (
    <main>
      <JsonLd data={jsonLd} />

      <section className="relative overflow-hidden bg-mauve-night text-white">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="hero-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <nav className="text-sm">
            <Link href="/" className="font-bold text-mauve-glow transition-colors hover:text-white">
              <Bi en="← Back to the index" fr="← Retour à l'index" />
            </Link>
          </nav>
          <p className="kicker mt-6 text-mauve-bright">
            <Bi en="Directory" fr="Annuaire" />
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            <Bi
              en={`All ${stats.entries} deployments, one list`}
              fr={`Les ${stats.entries} déploiements, en une liste`}
            />
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80">
            <Bi
              en="Every fiche in the index, grouped by sector and sorted by company. To filter by country, vendor, autonomy level or evidence, use the explorer on the home page."
              fr="Toutes les fiches de l'index, groupées par secteur et classées par entreprise. Pour filtrer par pays, éditeur, niveau d'autonomie ou niveau de preuve, utilisez l'explorateur de la page d'accueil."
            />
          </p>
        </div>
      </section>

      <nav aria-label="Sectors" className="border-b border-lavender-line bg-lilac-soft">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-6 py-4">
          {sectors.map(([sector, list]) => (
            <a
              key={sector}
              href={`#${slugOf(sector)}`}
              className="rounded-full border border-lavender-line bg-paper px-3 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:border-mauve hover:text-mauve"
            >
              <Bi en={sector} fr={sectorFr(sector)} /> <span className="text-muted">{list.length}</span>
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {sectors.map(([sector, list]) => (
          <section key={sector} id={slugOf(sector)} className="mb-12 scroll-mt-28">
            <h2 className="text-xl font-extrabold tracking-tight">
              <Bi en={sector} fr={sectorFr(sector)} />{" "}
              <span className="text-base font-bold text-muted">{list.length}</span>
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((e) => (
                <li key={e.id} className="border-b border-lavender-line/60 py-1.5 text-sm leading-snug">
                  <Link href={`/entry/${e.id}/`} className="font-bold hover:text-mauve">
                    {e.company}
                  </Link>{" "}
                  <span className="text-ink-soft">{e.solution_name}</span>
                  <span className="block text-xs text-muted">
                    <Bi en={e.company_country} fr={countryFr(e.company_country)} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

const slugOf = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
