import type { Metadata } from "next";
import Link from "next/link";
import { getAgentWashing, CURRENT_INSIGHT } from "@/lib/insight";
import { LOCKS } from "@/lib/coda";
import { sectorFr } from "@/lib/labels";
import Bi from "@/components/Bi";
import JsonLd from "@/components/JsonLd";
import ShareLinkedIn from "@/components/ShareLinkedIn";
import { SITE_URL, PUBLISHER, OG_IMAGE } from "@/lib/site";

const PATH = `/insights/${CURRENT_INSIGHT.slug}`;

export function generateMetadata(): Metadata {
  const { washed } = getAgentWashing();
  const title = `Agent-washing: ${washed.length} AI agents claim more autonomy than they have`;
  const description = `Of the AI agents catalogued in Agentipedia, ${washed.length} are observed acting above the autonomy their documented governance allows. The CODA™ matrix caps them, and names them.`;
  return {
    title,
    description,
    alternates: { canonical: PATH },
    openGraph: { title, description, url: PATH, type: "article", siteName: "Agentipedia by HUB Institute", images: [OG_IMAGE] },
  };
}

const LOCK_SHORT: Record<string, { en: string; fr: string }> = {
  data: { en: "data", fr: "données" },
  mandate: { en: "mandate", fr: "mandat" },
  supervision: { en: "supervision", fr: "supervision" },
};

export default function AgentWashingInsight() {
  const { washed, total, observedN3, noLocks } = getAgentWashing();
  const n = washed.length;
  const pctOfN3 = Math.round((100 * n) / Math.max(1, observedN3));
  const date = new Date(`${CURRENT_INSIGHT.date}T00:00:00Z`);
  const dateFr = date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const dateEn = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Agent-washing: ${n} AI agents claim more autonomy than they have`,
    datePublished: CURRENT_INSIGHT.date,
    url: `${SITE_URL}${PATH}`,
    author: PUBLISHER,
    publisher: PUBLISHER,
    inLanguage: ["en", "fr"],
  };

  return (
    <main className="mx-auto max-w-4xl px-6 pb-16 pt-12">
      <JsonLd data={jsonLd} />
      <p className="kicker text-mauve">
        <Bi en={`This week's insight · ${dateEn}`} fr={`L'insight de la semaine · ${dateFr}`} />
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
        <Bi
          en={`Agent-washing: ${n} agents claim more autonomy than they have`}
          fr={`Agent-washing : ${n} agents se disent plus autonomes qu'ils ne le sont`}
        />
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft">
        <Bi
          en={`Among the ${total} AI deployments scored on the CODA™ matrix, ${observedN3} are observed acting with delegated autonomy (N3): they execute and commit without a person validating each step. Yet ${n} of them, ${pctOfN3} %, document none of the governance that level requires. Their declared level is capped at N2.`}
          fr={`Sur les ${total} déploiements IA scorés sur la matrice CODA™, ${observedN3} sont observés en autonomie déléguée (N3) : ils exécutent et engagent sans qu'un humain valide chaque étape. Or ${n} d'entre eux, soit ${pctOfN3} %, ne documentent pas la gouvernance qu'exige ce niveau. Leur niveau déclaré est plafonné à N2.`}
        />
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { v: n, en: "agents above their governance", fr: "agents au-dessus de leur gouvernance" },
          { v: `${pctOfN3} %`, en: "of the agents observed at N3", fr: "des agents observés à N3" },
          { v: noLocks, en: "document none of the three locks", fr: "ne documentent aucun des trois verrous" },
        ].map((k) => (
          <div key={k.en} className="rounded-2xl border border-lavender-line bg-paper p-5">
            <p className="text-4xl font-black text-mauve">{k.v}</p>
            <p className="mt-1 text-sm font-semibold text-muted">
              <Bi en={k.en} fr={k.fr} />
            </p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">
          <Bi en="What the CODA™ matrix checks" fr="Ce que vérifie la matrice CODA™" />
        </h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          <Bi
            en="Delegating a decision to an agent is only safe when three locks are in place and documented publicly. Without them, the rule is simple: whatever the agent actually does, its declared level stays at N2."
            fr="Déléguer une décision à un agent n'est sûr que si trois verrous sont en place et documentés publiquement. Sans eux, la règle est simple : quoi que fasse réellement l'agent, son niveau déclaré reste à N2."
          />
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {LOCKS.filter((l) => l.forLevel === 3).map((l) => (
            <li key={l.key} className="rounded-xl border border-lavender-line bg-paper p-4">
              <p className="font-extrabold">
                <Bi en={l.en} fr={l.fr} />
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                <Bi en={l.testEn} fr={l.testFr} />
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">
          <Bi en="Why it matters" fr="Pourquoi c'est important" />
        </h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          <Bi
            en="An agent that commits without a written mandate, a named supervisor or reliable data is not more advanced: it is less governed. For a leadership team, the gap between what an agent does and what it is allowed to do is where the incidents, the compliance findings and the loss of trust come from. The competitive edge is not in declaring more autonomy, it is in earning it."
            fr="Un agent qui engage sans mandat écrit, sans superviseur nommé ou sans donnée fiable n'est pas plus avancé : il est moins gouverné. Pour une direction, l'écart entre ce que fait un agent et ce qu'il a le droit de faire, c'est là que naissent les incidents, les constats de non-conformité et la perte de confiance. L'avantage ne se joue pas en déclarant plus d'autonomie, mais en la méritant."
          />
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">
          <Bi en={`The ${n} agents, one by one`} fr={`Les ${n} agents, un par un`} />
        </h2>
        <p className="mt-2 text-sm text-muted">
          <Bi
            en="Observed level, declared level and the locks the public record does not document. Each line opens the full fiche and its sources."
            fr="Niveau observé, niveau déclaré et verrous que les sources publiques ne documentent pas. Chaque ligne ouvre la fiche complète et ses sources."
          />
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-lavender-line bg-paper">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-lavender-line text-left">
                <th className="kicker px-4 py-3 text-muted"><Bi en="Company" fr="Entreprise" /></th>
                <th className="kicker px-4 py-3 text-muted"><Bi en="Agent" fr="Agent" /></th>
                <th className="kicker px-4 py-3 text-muted"><Bi en="Level" fr="Niveau" /></th>
                <th className="kicker px-4 py-3 text-muted"><Bi en="Undocumented locks" fr="Verrous non documentés" /></th>
              </tr>
            </thead>
            <tbody>
              {washed.map((w) => (
                <tr key={w.id} className="border-b border-lavender-line/60 last:border-0">
                  <td className="px-4 py-2.5">
                    <Link href={`/entry/${w.id}`} className="font-bold hover:text-mauve">
                      {w.company}
                    </Link>
                    <span className="block text-xs text-muted">
                      <Bi en={w.sector} fr={sectorFr(w.sector)} />
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-ink-soft">{w.solution}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-bold">
                    N{w.observed} <span className="text-muted">→</span> <span className="text-mauve">N{w.declared}</span>
                  </td>
                  <td className="px-4 py-2.5 text-ink-soft">
                    <span className="lang-en">{w.missing.map((k) => LOCK_SHORT[k].en).join(", ")}</span>
                    <span className="lang-fr">{w.missing.map((k) => LOCK_SHORT[k].fr).join(", ")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-3 rounded-2xl bg-mauve-night p-6 text-white">
        <p className="mr-auto max-w-md text-base font-bold">
          <Bi
            en="Where does your company stand? Place it on the CODA™ matrix."
            fr="Où en est votre entreprise ? Situez-la sur la matrice CODA™."
          />
        </p>
        <Link
          href="/#coda"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-mauve-ink transition-colors hover:bg-lilac"
        >
          <Bi en="Place my company on CODA™" fr="Situer mon entreprise sur CODA™" />
        </Link>
        <ShareLinkedIn path={PATH} />
      </div>
    </main>
  );
}
