import type { Metadata } from "next";
import { getStats } from "@/lib/data";
import { formatTimestamp } from "@/lib/format";
import Bi from "@/components/Bi";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "The two-field rule, the sourcing standard and the confidence policy behind every Agentipedia entry.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: "Methodology · Agentipedia",
    description:
      "The two-field rule, the sourcing standard and the confidence policy behind every Agentipedia entry.",
    url: "/methodology",
    type: "website",
    siteName: "Agentipedia by HUB Institute",
  },
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
            en={
              <>
                If either field is missing, generic or unverifiable against a source the engine
                actually retrieved, the candidate is rejected. Rejections are recorded with a
                one-line reason in a public log (
                <code className="rounded bg-lilac px-1 py-0.5 text-xs">data/rejections.json</code>
                ). Accepted entries are filed on exactly one of 14 canonical sector shelves, so the
                Index Live can be browsed the way analysts actually look for precedents: by industry.
              </>
            }
            fr={
              <>
                Si l&apos;un des deux champs manque, reste générique ou ne peut pas être vérifié
                dans une source réellement consultée, le candidat est rejeté. Chaque rejet est
                consigné avec sa raison dans un journal public (
                <code className="rounded bg-lilac px-1 py-0.5 text-xs">data/rejections.json</code>
                ). Les fiches acceptées sont rangées sur un seul des 14 rayons sectoriels, pour
                parcourir l&apos;Index Live comme les analystes cherchent leurs précédents : par
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
          <Bi en="The CODA score card (HUB Institute)" fr="La CODA Score Card (HUB Institute)" />
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          <Bi
            en="Every entry carries a CODA score card: its position on the HUB Institute matrix, built from two measured axes. The vertical axis is the autonomy ladder N1-N4; the horizontal axis counts the maillons of the entry's value-chain frieze that the agent measurably instruments. The quadrant - Copiloted, Orchestrated, Delegated, Agentic - follows from the two axes (high autonomy = N3+, broad scope = 6+ maillons); it is never assigned directly."
            fr="Chaque fiche porte une CODA Score Card : sa position sur la matrice du HUB Institute, construite à partir de deux axes mesurés. L'axe vertical est l'escalier d'autonomie N1-N4 ; l'axe horizontal compte les maillons de la frise de la chaîne de valeur que l'agent instrumente de façon mesurable. Le quadrant - Copiloté, Orchestré, Délégué, Agentique - découle des deux axes (autonomie forte = N3+, portée large = 6 maillons et plus) ; il n'est jamais attribué directement."
          />
        </p>
        <ol className="mt-4 space-y-2 text-sm leading-relaxed">
          <li className="rounded-xl bg-lilac-soft p-3">
            <Bi
              en={<><strong className="text-ink">N1 · Assistance.</strong>{" "}The agent proposes, the human does. Every output is reworked: writing, analysis and code copilots.</>}
              fr={<><strong className="text-ink">N1 · Assistance.</strong>{" "}L&apos;agent propose, l&apos;humain fait. Chaque sortie est reprise : copilotes de rédaction, d&apos;analyse, de code.</>}
            />
          </li>
          <li className="rounded-xl bg-lilac-soft p-3">
            <Bi
              en={<><strong className="text-ink">N2 · Validated execution.</strong>{" "}The agent does, the human validates before impact. Answering is not executing: a purely informational agent stays at N2 even when no one reviews each reply.</>}
              fr={<><strong className="text-ink">N2 · Exécution validée.</strong>{" "}L&apos;agent fait, l&apos;humain valide avant impact. Répondre n&apos;est pas exécuter : un agent purement informationnel reste en N2 même quand personne ne relit chaque réponse.</>}
            />
          </li>
          <li className="rounded-xl bg-lilac-soft p-3">
            <Bi
              en={<><strong className="text-ink">N3 · Delegation under mandate.</strong>{" "}The agent does and commits (refunds, blocks, publishes prices); the human handles exceptions within written bounds.</>}
              fr={<><strong className="text-ink">N3 · Délégation sous mandat.</strong>{" "}L&apos;agent fait et engage (rembourse, bloque, publie des prix) ; l&apos;humain traite les exceptions dans des bornes écrites.</>}
            />
          </li>
          <li className="rounded-xl bg-lilac-soft p-3">
            <Bi
              en={<><strong className="text-ink">N4 · Audited autonomy.</strong>{" "}The agent chains decisions end to end; the human governs through reviews, journals and veto rights.</>}
              fr={<><strong className="text-ink">N4 · Autonomie auditée.</strong>{" "}L&apos;agent enchaîne les décisions de bout en bout ; l&apos;humain gouverne par les revues, les journaux et le droit de veto.</>}
            />
          </li>
        </ol>
        <p className="mt-4 rounded-xl bg-lilac-soft p-3 text-sm leading-relaxed text-ink-soft">
          <Bi
            en={<><strong className="text-ink">The 24-hour test.</strong>{" "}&ldquo;If the human does nothing for 24 hours, does the decision still get made?&rdquo; No: N1-N2. Yes, within written bounds: N3. Yes, re-arbitrations included, under reviews: N4. One proof criterion: what the journals attest, not what the agent&apos;s manager declares - so a vendor-only sourced entry can never be observed beyond N2.</>}
            fr={<><strong className="text-ink">Le test des 24 heures.</strong>{" "}« Si l&apos;humain ne fait rien pendant 24 heures, la décision se prend-elle ? » Non : N1-N2. Oui, dans des bornes écrites : N3. Oui, ré-arbitrages compris, sous revues : N4. Un seul critère de preuve : ce que les journaux constatent, pas ce que le gestionnaire d&apos;agent déclare - une fiche sourcée uniquement éditeur ne peut donc jamais être observée au-delà de N2.</>}
          />
        </p>
        <p className="mt-3 rounded-xl bg-lilac-soft p-3 text-sm leading-relaxed text-ink-soft">
          <Bi
            en={<><strong className="text-ink">The counting rule (X axis).</strong>{" "}Each entry is read against a 10-maillon frieze of its own process (customer-care journey, purchase journey, procurement, claims, fraud, pricing, and so on). A maillon counts when the agent does measurable work there - reading, analysis, action; a maillon merely fed by its results does not. Scope = full maillons + half the partial ones: restricted 1-2, intermediate 3-6, extended 7-10.</>}
            fr={<><strong className="text-ink">La règle de comptage (axe X).</strong>{" "}Chaque fiche est lue contre une frise de 10 maillons propre à son processus (parcours service client, parcours d&apos;achat, achats, sinistres, fraude, pricing, etc.). Un maillon compte si l&apos;agent y accomplit un travail mesurable - lecture, analyse, action ; un maillon simplement alimenté par ses résultats ne compte pas. Portée = maillons pleins + moitié des partiels : restreint 1-2, intermédiaire 3-6, étendu 7-10.</>}
          />
        </p>
        <p className="mt-3 rounded-xl bg-lilac-soft p-3 text-sm leading-relaxed text-ink-soft">
          <Bi
            en={<><strong className="text-ink">The four locks and the anti agent-washing clause.</strong>{" "}Reliable data, a written mandate and tooled supervision open level N3; audited compliance opens N4. Declared level = min(observed level, level authorized by the locks) - and a lock without public evidence counts as closed. When an agent&apos;s observed autonomy exceeds what its documented locks authorize, the card shows both: the solid dot is the declared level, the amber outline the observed one.</>}
            fr={<><strong className="text-ink">Les quatre verrous et la clause anti agent-washing.</strong>{" "}La donnée fiable, le mandat écrit et la supervision outillée ouvrent le niveau N3 ; la conformité auditée ouvre le N4. Niveau déclaré = min(niveau observé, niveau autorisé par les verrous) - et un verrou sans preuve publique est réputé fermé. Quand l&apos;autonomie observée d&apos;un agent dépasse ce que ses verrous documentés autorisent, la carte montre les deux : le point plein est le niveau déclaré, le contour ambre le niveau observé.</>}
          />
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          <Bi
            en="The same grid reads agentic commerce: there the mandate is the purchase itself - an agent that discovers, compares and prepares while the customer confirms and pays holds no mandate (N2 on the purchase journey); the level rises only when the agent transacts within bounds the customer wrote. Placement is our analytical judgment from public sources, never a label the company or vendor applied; when the sources are too thin to place a deployment, the card stays unset."
            fr="La même grille lit le commerce agentique : le mandat y est l'achat lui-même - un agent qui découvre, compare et prépare pendant que le client confirme et paie n'a pas de mandat (N2 sur le parcours d'achat) ; le niveau ne monte que quand l'agent transige dans des bornes écrites par le client. Le placement relève de notre jugement analytique sur sources publiques, jamais d'une étiquette posée par l'entreprise ou l'éditeur ; quand les sources sont trop minces, la carte reste vide."
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
                team behind HUBFORUM and the HUB Institute communities. The Index Live exists to give
                those decision-makers hard precedents: who deployed what, where, with which
                results, and on whose word.
              </>
            }
            fr={
              <>
                Agentipedia est l&apos;observatoire IA du <strong>HUB Institute</strong>, le think
                tank parisien qui aide les décideurs à passer de la promesse à la preuve business, l&apos;équipe derrière HUBFORUM et les communautés HUB Institute. L&apos;Index Live
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
