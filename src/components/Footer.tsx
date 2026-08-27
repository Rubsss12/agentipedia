import Link from "next/link";
import { getStats } from "@/lib/data";
import { formatTimestamp } from "@/lib/format";
import Bi from "@/components/Bi";

// Footer modelled on the hubinstitute.com footer: deep navy ground, the white
// HUB mark, the same link columns (Insights / Communities / Our expertise /
// Contact) plus social links. HUB links carry UTM tags so HubSpot can attribute
// footer traffic and leads to Agentipedia.
const HUB = "https://www.hubinstitute.com";
const UTM = "utm_source=agentipedia&utm_medium=referral&utm_campaign=footer";
const hub = (path: string) => `${HUB}${path}${path.includes("?") ? "&" : "?"}${UTM}`;

type L = { en: string; fr: string; href: string };

const INSIGHTS: L[] = [
  { en: "Latest articles", fr: "Les derniers articles", href: hub("/tous-les-articles") },
  { en: "Reports", fr: "Rapports", href: hub("/tous-les-rapports") },
  { en: "White papers", fr: "Livres blancs", href: hub("/livres-blancs") },
  { en: "Books", fr: "Ouvrages", href: hub("/ouvrages") },
  { en: "Newsletters", fr: "Newsletters", href: hub("/newsletters") },
];
const COMMUNITIES: L[] = [
  { en: "Access the platform", fr: "Accéder au site", href: "https://communities.hubinstitute.com" },
];
const EXPERTISE: L[] = [
  { en: "Membership", fr: "Membership", href: hub("/membership") },
  { en: "Agentic Business Advisory", fr: "Agentic Business Advisory", href: hub("/conseil/agentic-business-advisory") },
  { en: "Generative AI consulting", fr: "Conseil en IA générative", href: hub("/ai-consulting") },
  { en: "Digital transformation consulting", fr: "Conseil en transformation digitale", href: hub("/regie-expert") },
  { en: "Training", fr: "Formations", href: hub("/formations") },
  { en: "Keynotes", fr: "Keynotes", href: hub("/toutes-nos-keynotes") },
  { en: "Learning expeditions", fr: "Learning expeditions", href: hub("/learning-expeditions") },
  { en: "Events", fr: "Événements", href: hub("/tous-les-events") },
  { en: "Become a partner", fr: "Devenir partenaire", href: hub("/devenir-partenaire") },
];
const CONTACT: L[] = [
  { en: "contact@hubinstitute.com", fr: "contact@hubinstitute.com", href: "mailto:contact@hubinstitute.com" },
  { en: "Media kit", fr: "Media kit", href: hub("/a-propos/media-kit") },
  { en: "About", fr: "À propos", href: hub("/a-propos") },
  { en: "Brochure (PDF)", fr: "Brochure (PDF)", href: "https://insights.hubinstitute.com/hubfs/Brochure_VVT_Produits%20HUB.pdf" },
  { en: "Our team", fr: "Notre équipe", href: `${HUB}/a-propos?${UTM}#equipe` },
  { en: "Join us", fr: "Nous rejoindre", href: "https://www.welcometothejungle.com/fr/companies/hub-institute/jobs" },
  { en: "Cookies", fr: "Cookies", href: hub("/politique-confidentialite") },
];

const SOCIALS: { name: string; href: string; path: string }[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/hub-institute/", path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" },
  { name: "X", href: "https://twitter.com/HUBInstitute", path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25H8.1l4.71 6.23 5.43-6.23zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64z" },
  { name: "Facebook", href: "https://www.facebook.com/HUBInstitute", path: "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" },
  { name: "Instagram", href: "https://www.instagram.com/hubinstitute/", path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" },
  { name: "YouTube", href: "https://www.youtube.com/@Hubinstitute", path: "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" },
];

const linkCls = "text-[0.82rem] font-semibold uppercase tracking-wide text-white/75 transition-colors hover:text-white";

function Heading({ en, fr }: { en: string; fr: string }) {
  return (
    <p className="mb-5 text-[0.95rem] font-extrabold uppercase tracking-wide text-white">
      <Bi en={en} fr={fr} />
    </p>
  );
}

function Col({ items }: { items: L[] }) {
  return (
    <ul className="space-y-3">
      {items.map((l) => {
        const external = !l.href.startsWith("/");
        return (
          <li key={l.href}>
            {external ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                <Bi en={l.en} fr={l.fr} />
              </a>
            ) : (
              <Link href={l.href} className={linkCls}>
                <Bi en={l.en} fr={l.fr} />
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Footer() {
  const stats = getStats();
  return (
    <footer className="mt-20 text-white" style={{ backgroundColor: "#010130" }}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[auto_1fr_1.4fr_1fr]">
          {/* logo + identity */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hub-institute-logo-white.svg" alt="HUB Institute" className="h-16 w-auto" />
            <p className="mt-5 max-w-[13rem] text-xs leading-relaxed text-white/55">
              <Bi
                en="Agentipedia — the AI & Agentic observatory by HUB Institute."
                fr="Agentipedia — l'observatoire IA et Agentique du HUB Institute."
              />
            </p>
          </div>

          {/* Insights + Communities */}
          <div>
            <Heading en="Insights" fr="Insights" />
            <Col items={INSIGHTS} />
            <div className="mt-10">
              <Heading en="Communities" fr="Communities" />
              <Col items={COMMUNITIES} />
            </div>
          </div>

          {/* Our expertise */}
          <div>
            <Heading en="Our expertise" fr="Nos expertises" />
            <Col items={EXPERTISE} />
          </div>

          {/* Contact + Follow */}
          <div>
            <Heading en="Contact" fr="Contact" />
            <Col items={CONTACT} />
            <div className="mt-10">
              <Heading en="Follow us" fr="Nous suivre" />
              <div className="flex flex-wrap gap-2.5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#010130] transition-transform hover:-translate-y-0.5"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
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
            />{" "}
            · {stats.entries} <Bi en="deployments" fr="déploiements" /> ·{" "}
            <Bi en="updated" fr="màj" /> {stats.updatedAt ? formatTimestamp(stats.updatedAt) : "—"}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-white/45">
            <a href={`${HUB}/mentions-legales`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              <Bi en="Legal notice" fr="Mentions légales" />
            </a>
            <a href={`${HUB}/politique-confidentialite`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              <Bi en="Privacy" fr="Confidentialité" />
            </a>
            <a href={`${HUB}/conditions-generales`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              <Bi en="Terms" fr="CGV" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
