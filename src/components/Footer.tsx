import Link from "next/link";
import { getStats } from "@/lib/data";
import { formatTimestamp } from "@/lib/format";
import Logo from "@/components/Logo";
import Bi from "@/components/Bi";

export default function Footer() {
  const stats = getStats();
  return (
    <footer className="mt-20 bg-mauve-night text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* brand row: Agentipedia lockup left, think-tank link right */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-8">
          <Logo on="dark" />
          <a
            href="https://www.hubinstitute.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white/70 transition-colors hover:text-mauve-glow"
          >
            <Bi en="A HUB Institute think tank ↗" fr="Un think tank du HUB Institute ↗" />
          </a>
        </div>

        {/* three columns, tops aligned on the same line */}
        <div className="grid gap-10 pt-8 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="kicker text-mauve-bright">
              <Bi en="About" fr="À propos" />
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              <Bi
                en="The AI & Agentic observatory by HUB Institute: from AI promise to business proof. Real companies, named solutions, verified sources, worldwide."
                fr="L'observatoire IA et Agentique du HUB Institute : de la promesse de l'IA à la preuve business. Entreprises réelles, solutions nommées, sources vérifiées, dans le monde entier."
              />
            </p>
          </div>
          <div>
            <p className="kicker text-mauve-bright">
              <Bi en="Explore" fr="Explorer" />
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>
                <Link href="/#sectors" className="transition-colors hover:text-mauve-glow">
                  <Bi en="Sectors" fr="Secteurs" />
                </Link>
              </li>
              <li>
                <Link href="/#index" className="transition-colors hover:text-mauve-glow">
                  <Bi en="Deployment index" fr="Index des déploiements" />
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="transition-colors hover:text-mauve-glow">
                  <Bi en="Methodology & sourcing standard" fr="Méthodologie & standard de sourcing" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="kicker text-mauve-bright">
              <Bi en="Status" fr="État" />
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>
                {stats.entries} <Bi en="verified deployments" fr="déploiements vérifiés" />
              </li>
              <li>
                {stats.countries} <Bi en="countries" fr="pays" /> · {stats.regions}{" "}
                <Bi en="regions" fr="régions" />
              </li>
              <li>
                <Bi en="Last updated:" fr="Dernière mise à jour :" />{" "}
                {stats.updatedAt ? (
                  formatTimestamp(stats.updatedAt)
                ) : (
                  <Bi en="awaiting first curation run" fr="en attente de la première curation" />
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-5">
          <p className="text-xs leading-relaxed text-white/50">
            <Bi
              en="Agentipedia · Insights & Experiences · by HUB Institute, Paris. Updated autonomously by the curation engine. Entries that cannot name both the company and the exact solution are rejected, and every rejection is logged."
              fr="Agentipedia · Insights & Experiences · par HUB Institute, Paris. Mis à jour de façon autonome par le moteur de curation. Toute fiche qui ne nomme pas à la fois l'entreprise et la solution exacte est rejetée, et chaque rejet est journalisé."
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
