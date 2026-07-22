import type { Metadata } from "next";
import { getStats } from "@/lib/data";
import { formatTimestamp } from "@/lib/format";
import Bi from "@/components/Bi";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "The two-field rule, the sourcing standard and the confidence policy behind every Agentipedia entry.",
};

export default function MethodologyPage() {
  const stats = getStats();
  return (
    <main className="mx-auto max-w-3xl px-6 pb-8 pt-12">
      <p className="kicker text-mauve">
        <Bi en="Methodology" fr="Méthodologie" />
      </p>
      <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">
        <Bi en="How an entry earns its place" fr="Comment une fiche gagne sa place" />
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        <Bi
          en="Agentipedia is curated by an autonomous engine that searches the live web, extracts candidate deployments and applies one strict rule. A smaller accurate encyclopedia beats a larger fabricated one, so the engine rejects anything it cannot verify, and logs every rejection."
          fr="Agentipedia est alimenté par un moteur autonome qui interroge le web en direct, extrait des déploiements candidats et applique une règle stricte. Une encyclopédie plus petite mais exacte vaut mieux qu'une grande inventée : le moteur rejette tout ce qu'il ne peut pas vérifier, et journalise chaque rejet."
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
                  <strong className="text-mauve-deep">2 · The named solution.</strong>{" "}A named
                  product, platform or internally branded agent: Salesforce Agentforce, Sierra,
                  Bank of America Erica, Mercado Libre Verdi on Gemini. Never &ldquo;a
                  chatbot&rdquo; or &ldquo;an LLM&rdquo;.
                </>
              }
              fr={
                <>
                  <strong className="text-mauve-deep">2 · La solution nommée.</strong>{" "}Un produit,
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
            en={
              <>
                If either field is missing, generic or unverifiable against a source the engine
                actually retrieved, the candidate is rejected. Rejections are recorded with a
                one-line reason in a public log (
                <code className="rounded bg-lilac px-1 py-0.5 text-xs">data/rejections.json</code>
                ). Accepted entries are filed on exactly one of 14 canonical sector shelves, so the
                library can be browsed the way analysts actually look for precedents: by industry.
              </>
            }
            fr={
              <>
                Si l&apos;un des deux champs manque, reste générique ou ne peut pas être vérifié
                dans une source réellement consultée, le candidat est rejeté. Chaque rejet est
                consigné avec sa raison dans un journal public (
                <code className="rounded bg-lilac px-1 py-0.5 text-xs">data/rejections.json</code>
                ). Les fiches acceptées sont rangées sur un seul des 14 rayons sectoriels, pour
                parcourir la bibliothèque comme les analystes cherchent leurs précédents : par
                industrie.
              </>
            }
          />
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-lavender-line bg-coral-bg/40 p-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-coral-deep">
          <Bi en="The unnamed collection" fr="La collection sans nom" />
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          <Bi
            en={
              <>
                Some deployments are certain, yet the agent has no public product name: a CEO
                quantifies its impact on an earnings call, official pages describe it, the press
                covers it. Refusing them would hide real adoption; inventing a name would break the
                rule. So they live in a second, clearly separated collection: the entry is marked{" "}
                <strong className="text-coral-deep">Unnamed agent</strong>, the solution field
                carries our descriptor (never a guessed brand), and the evidence bar is stricter:
                at least one non-marketing source (company official, earnings call, news media or
                conference talk) is required. On the globe they appear as coral dots.
              </>
            }
            fr={
              <>
                Certains déploiements sont certains, mais l&apos;agent n&apos;a pas de nom public :
                un PDG chiffre son impact en résultats, les pages officielles le décrivent, la
                presse le couvre. Les refuser cacherait une adoption réelle ; inventer un nom
                briserait la règle. Ils vivent donc dans une seconde collection clairement
                séparée : la fiche porte le badge{" "}
                <strong className="text-coral-deep">Agent sans nom</strong>, le champ solution
                contient notre descriptif (jamais une marque devinée), et la barre de preuve est
                plus stricte : au moins une source non marketing (officiel entreprise, résultats
                financiers, presse ou conférence) est exigée. Sur le globe, ils apparaissent en
                points corail.
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

      <section className="mt-10 rounded-2xl border border-lavender-line p-6">
        <h2 className="text-xl font-black uppercase tracking-tight">
          <Bi en="The CODA levels (N1 to N4)" fr="Les niveaux CODA (N1 à N4)" />
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          <Bi
            en="CODA is the HUB Institute strategic framework for reading agent maturity. It places every deployment on two axes, the autonomy the agent holds and the business scope it covers, then numbers the four resulting levels in the order of the acronym C-O-D-A. The level is our priority lens: it reads how far a deployment goes, and where the human still stands."
            fr="CODA est la grille stratégique du HUB Institute pour lire la maturité des agents. Elle place chaque déploiement sur deux axes, l'autonomie de l'agent et sa portée business, puis numérote les quatre niveaux obtenus dans l'ordre de l'acronyme C-O-D-A. Le niveau est notre lecture prioritaire : il dit jusqu'où va un déploiement, et où se tient encore l'humain."
          />
        </p>
        <ol className="mt-4 space-y-2 text-sm leading-relaxed">
          <li className="rounded-xl bg-lilac-soft p-3">
            <Bi
              en={<><strong className="text-ink">N1 · Copilot.</strong>{" "}Punctual assistant; a person validates each output. The starting point for most companies.</>}
              fr={<><strong className="text-ink">N1 · Copilote.</strong>{" "}Assistant ponctuel ; un humain valide chaque sortie. Le point de départ de la plupart.</>}
            />
          </li>
          <li className="rounded-xl bg-lilac-soft p-3">
            <Bi
              en={<><strong className="text-ink">N2 · Orchestrated.</strong>{" "}AI coordinates a whole process, but the human stays in the loop at every critical step.</>}
              fr={<><strong className="text-ink">N2 · Orchestrée.</strong>{" "}L&apos;IA coordonne un processus entier, mais l&apos;humain reste dans la boucle à chaque étape critique.</>}
            />
          </li>
          <li className="rounded-xl bg-lilac-soft p-3">
            <Bi
              en={<><strong className="text-ink">N3 · Delegated.</strong>{" "}The agent runs targeted tasks on its own; the human steps in only by exception.</>}
              fr={<><strong className="text-ink">N3 · Déléguée.</strong>{" "}L&apos;agent exécute des tâches ciblées en autonomie ; l&apos;humain n&apos;intervient qu&apos;en exception.</>}
            />
          </li>
          <li className="rounded-xl bg-lilac-soft p-3">
            <Bi
              en={<><strong className="text-ink">N4 · Agentic.</strong>{" "}Multi-agent systems run processes end to end; the human designs, supervises and arbitrates.</>}
              fr={<><strong className="text-ink">N4 · Agentique.</strong>{" "}Des systèmes multi-agents pilotent des processus de bout en bout ; l&apos;humain conçoit, supervise et arbitre.</>}
            />
          </li>
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          <Bi
            en="Placement is our analytical judgment from what the sources describe, never a label the company or vendor applied. When the sources are too thin to place a deployment with confidence, the level is left unset."
            fr="Le placement relève de notre jugement analytique à partir de ce que décrivent les sources, jamais d'une étiquette posée par l'entreprise ou l'éditeur. Quand les sources sont trop minces pour trancher, le niveau reste vide."
          />
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight">
          <Bi en="The sourcing standard" fr="Le standard de sourcing" />
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
            en={
              <>
                A scheduled curation run executes daily without human input: it generates fresh
                discovery queries across sectors, industries, regions and languages (the matrix
                rotates so non-English press is searched, not just US and EU coverage), searches
                the live web, applies the rule in deterministic code, deduplicates against the
                existing catalog (the same company plus the same solution is an update, never a second entry) and rebuilds this site. The data store (
                <code className="rounded bg-lilac px-1 py-0.5 text-xs">data/entries.json</code>) is
                the single source of truth, so any entry can be audited or corrected by hand.
              </>
            }
            fr={
              <>
                Une curation planifiée s&apos;exécute chaque jour sans intervention humaine : elle
                génère de nouvelles requêtes de découverte par secteur, industrie, région et langue
                (la matrice tourne pour couvrir la presse non anglophone, pas seulement les États-Unis
                et l&apos;Europe), interroge le web en direct, applique la règle dans du code
                déterministe, déduplique contre le catalogue (même entreprise plus même solution
                égale mise à jour, jamais un doublon) et reconstruit ce site. Le magasin de données
                (<code className="rounded bg-lilac px-1 py-0.5 text-xs">data/entries.json</code>)
                est l&apos;unique source de vérité : toute fiche peut être auditée ou corrigée à la
                main.
              </>
            }
          />
        </p>
        <p className="mt-4 text-sm text-muted">
          <Bi en="Catalog now:" fr="Catalogue actuel :" /> {stats.entries}{" "}
          <Bi en="entries" fr="fiches" /> · {stats.countries} <Bi en="countries" fr="pays" /> ·{" "}
          <Bi en="last updated" fr="dernière mise à jour" />{" "}
          {stats.updatedAt ? (
            formatTimestamp(stats.updatedAt)
          ) : (
            <Bi en="(awaiting first run)" fr="(en attente de la première curation)" />
          )}
          .
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-lavender-line bg-lilac-soft p-6">
        <h2 className="text-xl font-black uppercase tracking-tight">
          <Bi en="Who's behind this" fr="Qui est derrière" />
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          <Bi
            en={
              <>
                Agentipedia is the AI observatory of <strong>HUB Institute</strong>, the Paris-based
                think tank that helps decision-makers move from promise to business proof, the
                team behind HUBFORUM and the HUB Institute communities. The library exists to give
                those decision-makers hard precedents: who deployed what, where, with which
                results, and on whose word.
              </>
            }
            fr={
              <>
                Agentipedia est l&apos;observatoire IA du <strong>HUB Institute</strong>, le think
                tank parisien qui aide les décideurs à passer de la promesse à la preuve business, l&apos;équipe derrière HUBFORUM et les communautés HUB Institute. La bibliothèque
                existe pour donner à ces décideurs des précédents solides : qui a déployé quoi, où,
                avec quels résultats, et sur la parole de qui.
              </>
            }
          />
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-lavender-line p-6">
        <h2 className="text-xl font-black uppercase tracking-tight">
          <Bi en="Spotted an error?" fr="Une erreur ?" />
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          <Bi
            en={
              <>
                Every entry links its sources, so you can check any claim in one click. If a
                deployment was discontinued or a detail is wrong, correct the entry in{" "}
                <code className="rounded bg-lilac px-1 py-0.5 text-xs">data/entries.json</code> via a pull request. The store is designed to be audited by humans.
              </>
            }
            fr={
              <>
                Chaque fiche cite ses sources : toute affirmation se vérifie en un clic. Si un
                déploiement a été arrêté ou qu&apos;un détail est faux, corrigez la fiche dans{" "}
                <code className="rounded bg-lilac px-1 py-0.5 text-xs">data/entries.json</code> via une pull request. Le magasin est conçu pour être audité par des humains.
              </>
            }
          />
        </p>
      </section>
    </main>
  );
}
