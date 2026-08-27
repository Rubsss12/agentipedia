import Link from "next/link";
import { getStats } from "@/lib/data";
import { formatTimestamp } from "@/lib/format";
import Logo from "@/components/Logo";
import Bi from "@/components/Bi";

// Footer styled after hubinstitute.com: deep navy ground, the white HUB mark,
// several columns of links (including the HUB offers, for lead capture), and a
// legal bar. UTM tags let HubSpot attribute footer clicks to Agentipedia.
const UTM = "utm_source=agentipedia&utm_medium=referral&utm_campaign=footer";
const HUB = "https://www.hubinstitute.com";

function ColHeading({ en, fr }: { en: string; fr: string }) {
  return (
    <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/45">
      <Bi en={en} fr={fr} />
    </p>
  );
}

const linkCls = "text-sm text-white/75 transition-colors hover:text-white";

export default function Footer() {
  const stats = getStats();
  return (
    <footer className="mt-20 text-white" style={{ backgroundColor: "#010130" }}>
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* brand row */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-10">
          <Logo on="dark" />
          <a
            href={HUB}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white/70 transition-colors hover:text-white"
          >
            <Bi en="A HUB Institute think tank ↗" fr="Un think tank du HUB Institute ↗" />
          </a>
        </div>

        {/* columns */}
        <div className="grid gap-10 pt-10 md:grid-cols-4">
          {/* Explore Agentipedia */}
          <div>
            <ColHeading en="Explore" fr="Explorer" />
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/#sectors" className={linkCls}>
                  <Bi en="Sectors" fr="Secteurs" />
                </Link>
              </li>
              <li>
                <Link href="/#index" className={linkCls}>
                  <Bi en="Deployment index" fr="Index des déploiements" />
                </Link>
              </li>
              <li>
                <Link href="/methodology" className={linkCls}>
                  <Bi en="Methodology" fr="Méthodologie" />
                </Link>
              </li>
            </ul>
          </div>

          {/* HUB Institute offers (lead-gen) */}
          <div>
            <ColHeading en="Our offers" fr="Nos offres" />
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={`${HUB}/conseil/agentic-business-advisory?${UTM}`} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  Agentic Business Advisory
                </a>
              </li>
              <li>
                <a href={`${HUB}/ai-consulting?${UTM}`} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <Bi en="Generative AI consulting" fr="Conseil en IA générative" />
                </a>
              </li>
              <li>
                <a href={`${HUB}/formations?${UTM}`} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <Bi en="AI training" fr="Formations IA" />
                </a>
              </li>
              <li>
                <a href={`${HUB}/membership?${UTM}`} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <Bi en="Membership" fr="Adhésion" />
                </a>
              </li>
            </ul>
          </div>

          {/* HUB Institute */}
          <div>
            <ColHeading en="HUB Institute" fr="HUB Institute" />
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={`${HUB}/a-propos?${UTM}`} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <Bi en="About" fr="À propos" />
                </a>
              </li>
              <li>
                <a href={`${HUB}/a-propos#equipe`} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <Bi en="Our team" fr="Notre équipe" />
                </a>
              </li>
              <li>
                <a href="mailto:contact@hubinstitute.com" className={linkCls}>
                  <Bi en="Contact us" fr="Nous contacter" />
                </a>
              </li>
              <li>
                <a href={`${HUB}/#offres`} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <Bi en="Become a member" fr="Devenir membre" />
                </a>
              </li>
            </ul>
          </div>

          {/* About + status */}
          <div>
            <ColHeading en="The observatory" fr="L'observatoire" />
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              <Bi
                en="The AI & Agentic observatory by HUB Institute: from AI promise to business proof. Real companies, identified solutions, verified sources, worldwide."
                fr="L'observatoire IA et Agentique du HUB Institute : de la promesse de l'IA à la preuve business. Entreprises réelles, solutions identifiées, sources vérifiées, dans le monde entier."
              />
            </p>
            <p className="mt-4 text-xs text-white/50">
              {stats.entries} <Bi en="deployments" fr="déploiements" /> · {stats.countries}{" "}
              <Bi en="countries" fr="pays" />
              <br />
              <Bi en="Updated:" fr="Mis à jour :" />{" "}
              {stats.updatedAt ? (
                formatTimestamp(stats.updatedAt)
              ) : (
                <Bi en="pending first run" fr="première curation à venir" />
              )}
            </p>
          </div>
        </div>
      </div>

      {/* legal bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
          <p className="text-xs text-white/45">
            <Bi
              en="© Agentipedia · Insights & Experiences · by HUB Institute, Paris."
              fr="© Agentipedia · Insights & Experiences · par HUB Institute, Paris."
            />
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-white/45">
            <a href={`${HUB}/mentions-legales`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              <Bi en="Legal notice" fr="Mentions légales" />
            </a>
            <a href={`${HUB}/politique-confidentialite`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              <Bi en="Privacy" fr="Confidentialité" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
