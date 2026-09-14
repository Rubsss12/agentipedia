import type { Metadata } from "next";
import Link from "next/link";
import Bi from "@/components/Bi";
import { OG_IMAGE } from "@/lib/site";
import { CODA, CODA_ORDER, LEVELS, type CodaLevel } from "@/lib/coda";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "The two-field rule, the CODA™ score card, the sourcing thesis and the confidence score behind every Agentipedia entry.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: "Methodology · Agentipedia",
    description:
      "The two-field rule, the CODA™ score card, the sourcing thesis and the confidence score behind every Agentipedia entry.",
    url: "/methodology",
    type: "website",
    siteName: "Agentipedia by HUB Institute",
    images: [OG_IMAGE],
  },
};

// The ladder as the methodology explains it: richer than the one-line
// descriptions in lib/coda, but coloured with the same level colours so the
// page reads in the CODA palette used by the map and the score cards.
const RUNGS: { n: CodaLevel; en: React.ReactNode; fr: React.ReactNode }[] = [
  {
    n: 1,
    en: "The agent proposes, the human does. Every output is reworked: writing, analysis and code copilots.",
    fr: "L'agent propose, l'humain fait. Chaque sortie est reprise : copilotes de rédaction, d'analyse, de code.",
  },
  {
    n: 2,
    en: "The agent does, the human validates before impact. Answering is not executing: a purely informational agent stays at N2 even when no one reviews each reply.",
    fr: "L'agent fait, l'humain valide avant impact. Répondre n'est pas exécuter : un agent purement informationnel reste en N2 même quand personne ne relit chaque réponse.",
  },
  {
    n: 3,
    en: "The agent does and commits (refunds, blocks, publishes prices); the human handles exceptions within written bounds.",
    fr: "L'agent fait et engage (rembourse, bloque, publie des prix) ; l'humain traite les exceptions dans des bornes écrites.",
  },
  {
    n: 4,
    en: "The agent chains decisions end to end; the human governs through reviews, journals and veto rights.",
    fr: "L'agent enchaîne les décisions de bout en bout ; l'humain gouverne par les revues, les journaux et le droit de veto.",
  },
];

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-8 pt-12">
      <p className="kicker text-mauve">
        <Bi en="Methodology" fr="Méthodologie" />
      </p>
      <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">
        <Bi en="How a use-case entry gets in" fr="Comment une fiche de cas d'usage s'intègre" />
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        <Bi
          en="Agentipedia is fed by an engine that searches the live web, extracts candidate deployments and applies one strict rule. A smaller accurate encyclopedia beats a larger fabricated one, so the engine rejects anything it cannot verify."
          fr="Agentipedia est alimenté par un moteur qui interroge le web en direct, extrait des déploiements candidats et applique une règle stricte. Une encyclopédie plus petite mais exacte vaut mieux qu'une grande inventée : le moteur rejette tout ce qu'il ne peut pas vérifier."
        />
      </p>

      <section className="mt-10 rounded-2xl border-2 border-mauve bg-lilac-soft p-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-mauve-deep">
          <Bi en="The two-field rule" fr="La règle des deux champs" />
        </h2>
        <p className="mt-3 leading-relaxed">
          <Bi
            en={
              <>
                An entry exists only when a retrieved source names <strong>both</strong>:
              </>
            }
            fr={
              <>
                Une fiche n&apos;existe que si une source réellement consultée nomme{" "}
                <strong>les deux</strong>{" "}:
              </>
            }
          />
        </p>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed">
          <li className="rounded-xl bg-paper p-4">
            <Bi
              en={
                <>
                  <strong className="text-mauve-deep">1 · The company.</strong>{" "}A real,
                  identifiable organization by its actual name: Klarna, JPMorgan, Rakuten, Air
                  India. Never &ldquo;a large retailer&rdquo; or &ldquo;a European bank&rdquo;.
                </>
              }
              fr={
                <>
                  <strong className="text-mauve-deep">1 · L&apos;entreprise.</strong>{" "}Une
                  organisation réelle, identifiable par son vrai nom : Klarna, JPMorgan, Rakuten,
                  Air India. Jamais « un grand distributeur » ou « une banque européenne ».
                </>
              }
            />
          </li>
          <li className="rounded-xl bg-paper p-4">
            <Bi
              en={
                <>
                  <strong className="text-mauve-deep">2 · The identified solution.</strong>{" "}An
                  identified product, platform or internally branded agent: Salesforce Agentforce, Sierra,
                  Bank of America Erica, Mercado Libre Verdi on Gemini. Never &ldquo;a
                  chatbot&rdquo; or &ldquo;an LLM&rdquo;.
                </>
              }
              fr={
                <>
                  <strong className="text-mauve-deep">2 · La solution identifiée.</strong>{" "}Un produit,
                  une plateforme ou un agent interne avec un nom : Salesforce Agentforce, Sierra,
                  Bank of America Erica, Mercado Libre Verdi sur Gemini. Jamais « un chatbot » ou
                  « un LLM ».
                </>
              }
            />
          </li>
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          <Bi
            en="If either field is missing, generic or unverifiable against a source the engine actually retrieved, the candidate is rejected. Accepted entries are filed in exactly one of 14 sectors, so the index can be browsed the way analysts actually look for precedents: by industry."
            fr="Si l'un des deux champs manque, reste générique ou ne peut pas être vérifié dans une source réellement consultée, le candidat est rejeté. Les fiches acceptées sont rangées dans un seul des 14 secteurs, pour parcourir l'index comme les analystes cherchent leurs précédents : par industrie."
          />
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-lavender-line bg-coral-bg/40 p-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-coral-deep">
          <Bi en="Unnamed agents" fr="Les agents sans nom" />
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          <Bi
            en={
              <>
                Some deployments are certain, but the agent has no public name. We keep them,
                marked <strong className="text-coral-deep">Unnamed agent</strong>, with our own
                descriptor instead of a guessed brand, and a stricter bar: at least one
                non-marketing source.
              </>
            }
            fr={
              <>
                Certains déploiements sont avérés, mais l&apos;agent n&apos;a pas de nom public. Nous
                les gardons, marqués <strong className="text-coral-deep">Agent sans nom</strong>, avec
                notre propre descriptif plutôt qu&apos;une marque devinée, et une exigence plus
                stricte : au moins une source non marketing.
              </>
            }
          />
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-lavender-line p-6">
        <h2 className="text-xl font-black uppercase tracking-tight">
          <Bi en="The regulation axis" fr="L'axe réglementaire" />
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          <Bi
            en="Every entry can be filtered by AI-regulation regime (EU AI Act, North America, China, Asia-Pacific and so on). The regime is derived deterministically from the deploying organization's home country, the applicable jurisdiction. It describes the regulatory context a decision-maker operates in; it is never a claim that the deployment itself is compliant or certified."
            fr="Chaque fiche peut être filtrée par cadre de régulation IA (AI Act européen, Amérique du Nord, Chine, Asie-Pacifique, etc.). Le cadre est déduit de façon déterministe du pays de l'organisation, la juridiction applicable. Il décrit le contexte réglementaire dans lequel évolue un décideur ; ce n'est jamais une affirmation que le déploiement lui-même est conforme ou certifié."
          />
        </p>
      </section>

      {/* The CODA score card, in the CODA palette: quadrant tints and level colours
          match the scoring map on the home page and the card on every fiche. */}
      <section className="mt-10 overflow-hidden rounded-2xl border border-lavender-line">
        <div className="bg-mauve-night px-6 py-4 text-white">
          <h2 className="text-xl font-black uppercase tracking-tight">
            <Bi en="The CODA™ score card" fr="La CODA™ Score Card" />
          </h2>
        </div>
        {/* the four quadrant colours as a band under the title */}
        <div className="flex h-1.5" aria-hidden>
          {CODA_ORDER.map((k) => (
            <span key={k} className="flex-1" style={{ background: CODA[k].color }} />
          ))}
        </div>
        <div className="p-6">
          <p className="text-sm leading-relaxed text-ink-soft">
            <Bi
              en="Every entry carries a CODA™ score card: its position on the matrix, built from two measured axes. The vertical axis is the autonomy ladder, N1 to N4; the horizontal axis counts the Maillons of the entry's value-chain frieze that the agent measurably instruments. The quadrant follows from the two axes (high autonomy means N3 or above, broad scope means 6 Maillons or more); it is never assigned directly."
              fr="Chaque fiche porte une CODA™ Score Card : sa position sur la matrice, construite à partir de deux axes mesurés. L'axe vertical est l'escalier d'autonomie, de N1 à N4 ; l'axe horizontal compte les Maillons de la frise de la chaîne de valeur que l'agent instrumente de façon mesurable. Le quadrant découle des deux axes (autonomie forte à partir de N3, portée large à partir de 6 Maillons) ; il n'est jamais attribué directement."
            />
          </p>

          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {CODA_ORDER.map((k) => {
              const q = CODA[k];
              return (
                <li key={k} className="rounded-xl border-l-4 p-3" style={{ borderColor: q.color, background: q.fill }}>
                  <p className="text-sm font-black" style={{ color: q.deep }}>
                    {k} · <Bi en={q.en} fr={q.fr} />
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-ink-soft">
                    <Bi en={q.taglineEn} fr={q.taglineFr} />
                  </p>
                </li>
              );
            })}
          </ul>

          <ol className="mt-5 space-y-2 text-sm leading-relaxed">
            {RUNGS.map((r) => {
              const l = LEVELS[r.n];
              return (
                <li key={r.n} className="flex items-start gap-3 rounded-xl border border-lavender-line bg-paper p-3">
                  <span
                    className="mt-0.5 grid h-6 min-w-[2.4rem] shrink-0 place-items-center rounded-md px-1 text-xs font-black text-white"
                    style={{ background: l.color }}
                  >
                    N{r.n}
                  </span>
                  <span className="text-ink-soft">
                    <strong className="text-ink">
                      <Bi en={l.en} fr={l.fr} />.
                    </strong>{" "}
                    <Bi en={r.en} fr={r.fr} />
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="mt-4 rounded-xl bg-lilac-soft p-3 text-sm leading-relaxed text-ink-soft">
            <Bi
              en={<><strong className="text-ink">The counting rule (X axis).</strong>{" "}Each entry is read against a frieze of 10 Maillons of its own process (customer-care journey, purchase journey, procurement, claims, fraud, pricing, and so on). A Maillon counts when the agent does measurable work there (reading, analysis, action); a Maillon merely fed by its results does not. Scope = full Maillons + half the partial ones: restricted from 1 to 2, intermediate from 3 to 6, extended from 7 to 10.</>}
              fr={<><strong className="text-ink">La règle de comptage (axe X).</strong>{" "}Chaque fiche est lue contre une frise de 10 Maillons propre à son processus (parcours service client, parcours d&apos;achat, achats, sinistres, fraude, pricing, etc.). Un Maillon compte si l&apos;agent y accomplit un travail mesurable (lecture, analyse, action) ; un Maillon simplement alimenté par ses résultats ne compte pas. Portée = Maillons pleins + moitié des partiels : restreinte de 1 à 2, intermédiaire de 3 à 6, étendue de 7 à 10.</>}
            />
          </p>
          <p className="mt-3 rounded-xl bg-lilac-soft p-3 text-sm leading-relaxed text-ink-soft">
            <Bi
              en={<><strong className="text-ink">The four locks.</strong>{" "}Reliable data, a written mandate and tooled supervision open level N3; audited compliance opens N4. The declared level is the lower of the observed level and the level the locks authorize, and a lock without public evidence counts as closed. When an agent&apos;s observed autonomy exceeds what its documented locks authorize, the card shows both: the solid dot is the declared level, the amber outline the observed one.</>}
              fr={<><strong className="text-ink">Les quatre verrous.</strong>{" "}La donnée fiable, le mandat écrit et la supervision outillée ouvrent le niveau N3 ; la conformité auditée ouvre le N4. Le niveau déclaré est le plus bas entre le niveau observé et celui qu&apos;autorisent les verrous, et un verrou sans preuve publique est réputé fermé. Quand l&apos;autonomie observée d&apos;un agent dépasse ce que ses verrous documentés autorisent, la carte montre les deux : le point plein est le niveau déclaré, le contour ambre le niveau observé.</>}
            />
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            <Bi
              en="The same grid reads agentic commerce: there the mandate is the purchase itself. An agent that discovers, compares and prepares while the customer confirms and pays holds no mandate (N2 on the purchase journey); the level rises only when the agent transacts within bounds the customer wrote. Placement is our analytical judgment from public sources, never a label the company or vendor applied; when the sources are too thin to place a deployment, the card stays unset."
              fr="La même grille lit le commerce agentique : le mandat y est l'achat lui-même. Un agent qui découvre, compare et prépare pendant que le client confirme et paie n'a pas de mandat (N2 sur le parcours d'achat) ; le niveau ne monte que quand l'agent transige dans des bornes écrites par le client. Le placement relève de notre jugement analytique sur sources publiques, jamais d'une étiquette posée par l'entreprise ou l'éditeur ; quand les sources sont trop minces, la carte reste vide."
            />
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight">
          <Bi en="The sourcing thesis" fr="La thèse du sourcing" />
        </h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
          <li className="rounded-xl border border-lavender-line p-4">
            <Bi
              en={
                <>
                  <strong className="text-ink">No source, no entry.</strong>{" "}Every entry traces to
                  at least one source retrieved through live web search during a curation run.
                  Cited URLs must have appeared in that run&apos;s search results. A URL the run
                  never saw is treated as fabricated and the candidate is rejected.
                </>
              }
              fr={
                <>
                  <strong className="text-ink">Pas de source, pas de fiche.</strong>{" "}Chaque fiche
                  remonte à au moins une source récupérée par recherche web en direct pendant une
                  curation. Les URL citées doivent être apparues dans les résultats de cette session. Une URL jamais vue est traitée comme fabriquée et le candidat est
                  rejeté.
                </>
              }
            />
          </li>
          <li className="rounded-xl border border-lavender-line p-4">
            <Bi
              en={
                <>
                  <strong className="text-ink">Empty beats invented.</strong>{" "}If a detail (vendor,
                  department, metric, date) is not in a source, the field stays empty. Gaps are
                  never filled with plausible guesses.
                </>
              }
              fr={
                <>
                  <strong className="text-ink">Vide plutôt qu&apos;inventé.</strong>{" "}Si un détail (éditeur, département, métrique, date) n&apos;est pas dans une source, le champ
                  reste vide. Les trous ne sont jamais comblés par des suppositions plausibles.
                </>
              }
            />
          </li>
          <li className="rounded-xl border border-lavender-line p-4">
            <Bi
              en={
                <>
                  <strong className="text-ink">Claimed is not confirmed.</strong>{" "}Every source is
                  typed: company official, earnings call, news media, conference talk, vendor case
                  study, press release, or other. Vendor case studies and press releases are
                  marketing: usable, but always labeled, and their metrics are shown as claims.
                </>
              }
              fr={
                <>
                  <strong className="text-ink">Déclaré n&apos;est pas confirmé.</strong>{" "}Chaque
                  source est typée : officiel entreprise, résultats financiers, presse, conférence,
                  cas client éditeur, communiqué, ou autre. Les cas clients et communiqués sont du
                  marketing : utilisables, mais toujours étiquetés, et leurs métriques affichées
                  comme des déclarations.
                </>
              }
            />
          </li>
          <li className="rounded-xl border border-lavender-line p-4">
            <Bi
              en={
                <>
                  <strong className="text-ink">Conflicts stay visible.</strong>{" "}When sources
                  disagree, both are kept and the confidence drops, with the conflict noted in the
                  confidence reason.
                </>
              }
              fr={
                <>
                  <strong className="text-ink">Les conflits restent visibles.</strong>{" "}Quand les
                  sources divergent, les deux sont conservées et la confiance baisse, le conflit
                  étant noté dans la justification.
                </>
              }
            />
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight">
          <Bi en="The confidence score" fr="Le score de confiance" />
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          <Bi
            en="Each entry carries a confidence between 0 and 1 with a written reason. Two hard policies apply:"
            fr="Chaque fiche porte une confiance entre 0 et 1, avec une justification écrite. Deux règles dures s'appliquent :"
          />
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-soft">
          <li className="rounded-xl bg-warn-bg p-4 font-semibold text-warn">
            <Bi
              en="Entries whose only evidence is vendor marketing are capped at 50%, whatever the marketing says."
              fr="Les fiches dont la seule preuve est le marketing d'un éditeur sont plafonnées à 50 %, quoi qu'en dise le marketing."
            />
          </li>
          <li className="rounded-xl bg-ok-bg p-4 font-semibold text-ok">
            <Bi
              en="“Confirmed” (≥ 70%) requires at least one independent source: news media, an earnings call, a conference talk or an official company channel."
              fr="« Confirmé » (≥ 70 %) exige au moins une source indépendante : presse, résultats financiers, conférence ou canal officiel de l'entreprise."
            />
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight">
          <Bi en="How the site stays current" fr="Comment le site reste à jour" />
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          <Bi
            en="A scheduled curation run generates fresh discovery queries across sectors, industries, regions and languages (the matrix rotates so non-English press is searched, not just US and EU coverage), searches the live web, applies the rule in deterministic code, deduplicates against the existing catalog (the same company plus the same solution is an update, never a second entry) and rebuilds this site."
            fr="Une curation planifiée génère de nouvelles requêtes de découverte par secteur, industrie, région et langue (la matrice tourne pour couvrir la presse non anglophone, pas seulement les États-Unis et l'Europe), interroge le web en direct, applique la règle dans du code déterministe, déduplique contre le catalogue (même entreprise plus même solution égale mise à jour, jamais un doublon) et reconstruit ce site."
          />
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-lavender-line bg-lilac-soft p-6">
        <h2 className="text-xl font-black uppercase tracking-tight">
          <Bi en="Who leads the initiative" fr="Qui porte l'initiative" />
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          <Bi
            en={
              <>
                Agentipedia is the AI observatory of <strong>HUB Institute</strong>, the consulting
                firm and think tank that helps decision-makers move from promise to business proof,
                the team behind HUBFORUM and the HUB Institute communities. The index exists to give
                those decision-makers hard precedents: who deployed what, where, with which results,
                and on whose word.
              </>
            }
            fr={
              <>
                Agentipedia est l&apos;observatoire IA du <strong>HUB Institute</strong>, le cabinet de
                conseil et think tank qui aide les décideurs à passer de la promesse à la preuve
                business, l&apos;équipe derrière HUBFORUM et les communautés HUB Institute. L&apos;index
                existe pour donner à ces décideurs des précédents solides : qui a déployé quoi, où,
                avec quels résultats, et sur la parole de qui.
              </>
            }
          />
        </p>
        <Link
          href="/#offres"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e11e8c] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#c4157a]"
        >
          <Bi en="Discover our offers" fr="Découvrir nos offres" /> →
        </Link>
      </section>
    </main>
  );
}
