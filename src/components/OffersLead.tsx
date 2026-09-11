import Bi from "@/components/Bi";
import HubspotForm from "@/components/HubspotForm";

// Lead-generation band at the foot of the home page: promotes the HUB Institute
// offers that turn the proof on this observatory into action, and embeds the
// live HUB Institute contact form. Offer links carry UTM tags so leads sourced
// from Agentipedia are attributable in HubSpot.
const UTM = "utm_source=agentipedia&utm_medium=referral&utm_campaign=home-offres";
const base = "https://www.hubinstitute.com";

type Offer = {
  eyebrowEn: string;
  eyebrowFr: string;
  titleEn: string;
  titleFr: string;
  descEn: string;
  descFr: string;
  href: string;
  tone?: "navy" | "mauve";
};

const OFFERS: Offer[] = [
  {
    eyebrowEn: "Advisory",
    eyebrowFr: "Conseil",
    titleEn: "Agentic Business Advisory",
    titleFr: "Agentic Business Advisory",
    descEn: "Design, prioritise and test your AI agents, from strategy to POC, with the team behind this observatory.",
    descFr: "Concevez, priorisez et testez vos agents IA, de la stratégie au POC, avec l'équipe derrière cet observatoire.",
    href: `${base}/conseil/agentic-business-advisory?${UTM}`,
    tone: "navy",
  },
  {
    eyebrowEn: "Consulting",
    eyebrowFr: "Conseil",
    titleEn: "AI consulting",
    titleFr: "Conseil en IA",
    descEn: "Audit, roadmap, steering and operational activation on your strategic priorities.",
    descFr: "Audit, feuille de route, pilotage et activation opérationnelle sur vos priorités stratégiques.",
    href: `https://agenticbusinessforum.hubinstitute.com/?${UTM}`,
  },
  {
    eyebrowEn: "Training",
    eyebrowFr: "Formation",
    titleEn: "AI training",
    titleFr: "Formations IA",
    descEn: "Upskill your teams on generative AI and rethink how work gets done, at scale.",
    descFr: "Montez vos équipes en compétence sur l'IA générative et repensez le travail, à grande échelle.",
    href: `${base}/formations?${UTM}`,
  },
  {
    eyebrowEn: "Membership",
    eyebrowFr: "Membership",
    titleEn: "HUB Institute membership",
    titleFr: "Membership HUB Institute",
    descEn: "Join 120 member companies and 2,000 decision-makers: intelligence, foresight and direct access to our analysts.",
    descFr: "Rejoignez 120 entreprises adhérentes et 2 000 décideurs : veille, prospective et accès direct à nos analystes.",
    href: `${base}/membership?${UTM}`,
    tone: "mauve",
  },
];

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OffersLead() {
  return (
    <section id="offres" className="scroll-mt-28 pt-20 lg:scroll-mt-20">
      <div className="border-t border-lavender-line bg-lilac-soft">
        <div className="mx-auto max-w-6xl px-6 py-16">
          {/* heading: tie the proof on the site to HUB Institute action */}
          <div className="max-w-2xl">
            <p className="kicker text-mauve">
              <Bi en="Go further with HUB Institute" fr="Aller plus loin avec le HUB Institute" />
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
              <Bi
                en="You've seen the proof in action. Put it to work in your company, starting now."
                fr="Vous avez vu les preuves en action. Mettez-les en application dans votre entreprise dès maintenant."
              />
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-base">
              <Bi
                en="Agentipedia is the observatory of the HUB Institute think tank. The same experts turn these deployments into your roadmap: advisory, training and a decision-makers' network."
                fr="Agentipedia est l'observatoire du think tank HUB Institute. Les mêmes experts transforment ces déploiements en votre feuille de route : conseil, formation et réseau de décideurs."
              />
            </p>
          </div>

          {/* offer cards */}
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OFFERS.map((o) => {
              const dark = !!o.tone;
              const bg = o.tone === "mauve" ? "bg-mauve" : "bg-mauve-night";
              return (
              <a
                key={o.href}
                href={o.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex h-full flex-col rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-18px_rgb(107_43_217/0.45)] ${
                  dark
                    ? `border-transparent ${bg} text-white`
                    : "border-lavender-line bg-paper hover:border-mauve"
                }`}
              >
                <p className={`kicker ${dark ? "text-mauve-bright" : "text-mauve"}`}>
                  <Bi en={o.eyebrowEn} fr={o.eyebrowFr} />
                </p>
                <p className="mt-2 text-lg font-extrabold leading-tight">
                  <Bi en={o.titleEn} fr={o.titleFr} />
                </p>
                <p className={`mt-2 flex-1 text-sm leading-relaxed ${dark ? "text-white/75" : "text-muted"}`}>
                  <Bi en={o.descEn} fr={o.descFr} />
                </p>
                <span
                  className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold ${
                    dark ? "text-mauve-bright" : "text-mauve"
                  }`}
                >
                  <Bi en="Discover" fr="Découvrir" />
                  <span className="transition-transform group-hover:translate-x-0.5">
                    <Arrow />
                  </span>
                </span>
              </a>
              );
            })}
          </div>

          {/* contact: pitch + embedded HUB Institute form */}
          <div className="relative mt-14 grid gap-8 rounded-3xl border border-white/10 bg-mauve-night p-6 text-white shadow-[0_30px_80px_-40px_rgba(29,17,96,0.9)] md:grid-cols-[1fr_1.1fr] md:p-10">
            <div className="flex flex-col justify-center">
              {/* The HUB mark signs the lead block: the form goes to HUB Institute,
                  not to Agentipedia, so the brand belongs here rather than the site logo.
                  It is pinned to the card's top-left corner from md up, where the copy is
                  vertically centred against the taller form; below md the card is a single
                  column and the mark simply leads the stack. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hub-institute-logo-white.svg"
                alt="HUB Institute"
                className="mb-7 h-16 w-auto self-start md:absolute md:top-10 md:left-10 md:mb-0 md:h-[5.5rem]"
              />
              <p className="kicker text-mauve-bright">
                <Bi en="Let's talk about your projects" fr="Parlons de vos projets" />
              </p>
              <h3 className="mt-2 text-xl font-extrabold tracking-tight md:text-2xl">
                <Bi
                  en="Let's build your agentic roadmap together"
                  fr="Construisons ensemble votre roadmap agentique"
                />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                <Bi
                  en="Send us a line and our team gets back to you to scope your priorities: audit, use cases, roadmap or training."
                  fr="Écrivez-nous et notre équipe revient vers vous pour cadrer vos priorités : audit, cas d'usage, feuille de route ou formation."
                />
              </p>
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <dt className="text-2xl font-black text-mauve-bright">45 000</dt>
                  <dd className="kicker mt-0.5 text-white/50">
                    <Bi en="executives trained" fr="cadres accompagnés" />
                  </dd>
                </div>
                <div>
                  <dt className="text-2xl font-black text-mauve-bright">120</dt>
                  <dd className="kicker mt-0.5 text-white/50">
                    <Bi en="member companies" fr="entreprises adhérentes" />
                  </dd>
                </div>
                <div>
                  <dt className="text-2xl font-black text-mauve-bright">2 000</dt>
                  <dd className="kicker mt-0.5 text-white/50">
                    <Bi en="decision-makers" fr="décideurs membres" />
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-xs text-white/60">
                <Bi en="Prefer email?" fr="Vous préférez l'email ?" />{" "}
                <a href="mailto:contact@hubinstitute.com" className="font-semibold text-mauve-bright hover:underline">
                  contact@hubinstitute.com
                </a>
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">
              <HubspotForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
