import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSectors, getSectorBySlug } from "@/lib/sectors";
import Explorer from "@/components/Explorer";
import Bi from "@/components/Bi";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getSectors().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) return {};
  return {
    title: `${sector.name}: AI agent deployments`,
    description: `${sector.entries} verified AI agent deployments inside named ${sector.name.toLowerCase()} companies, with sources.`,
  };
}

export default async function SectorPage({ params }: Props) {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) notFound();

  const vendors = [...new Set(sector.list.map((e) => e.vendor).filter(Boolean))];
  const vendorHead = vendors.slice(0, 4).join(", ");
  const vendorMore = vendors.length - 4;

  return (
    <main>
      <section className="relative overflow-hidden bg-mauve-night text-white">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="hero-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <nav className="text-sm">
            <Link href="/#sectors" className="font-bold text-mauve-glow transition-colors hover:text-white">
              <Bi en="← All sectors" fr="← Tous les secteurs" />
            </Link>
          </nav>
          <p className="kicker mt-6 text-mauve-bright">
            <Bi en="Sector shelf" fr="Rayon sectoriel" />
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            {sector.name}
          </h1>
          <div className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-4">
            <div>
              <p className="text-4xl font-black text-mauve-glow" data-count={sector.entries}>{sector.entries}</p>
              <p className="kicker mt-1 text-white/60">
                <Bi en="deployments" fr="déploiements" />
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-mauve-glow" data-count={sector.countries}>{sector.countries}</p>
              <p className="kicker mt-1 text-white/60">
                {sector.countries > 1 ? <Bi en="countries" fr="pays" /> : <Bi en="country" fr="pays" />}
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-mauve-glow" data-count={sector.production}>{sector.production}</p>
              <p className="kicker mt-1 text-white/60">
                <Bi en="in production" fr="en production" />
              </p>
            </div>
            {vendors.length > 0 && (
              <p className="max-w-md text-xs leading-relaxed text-white/60">
                <span className="lang-en">
                  Solutions on this shelf come from {vendorHead}
                  {vendorMore > 0 ? ` and ${vendorMore} more` : ""}.
                </span>
                <span className="lang-fr">
                  Les solutions de ce rayon viennent de {vendorHead}
                  {vendorMore > 0 ? ` et ${vendorMore} autres` : ""}.
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-4">
        <Explorer entries={sector.list} />
      </section>
    </main>
  );
}
