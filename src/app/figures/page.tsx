import type { Metadata } from "next";
import Link from "next/link";
import { getFigures } from "@/lib/figures";
import { getStore } from "@/lib/data";
import { sectorSlug } from "@/lib/sectors";
import { sectorFr, regionFr, countryFr } from "@/lib/labels";
import { formatTimestamp } from "@/lib/format";
import Bi from "@/components/Bi";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PUBLISHER, OG_IMAGE } from "@/lib/site";
import type { Row } from "@/lib/figures";

export const metadata: Metadata = {
  title: "Agentipedia in figures",
  description:
    "How AI agents actually break down across autonomy levels, scope, sectors and countries, measured on the deployments catalogued in Agentipedia rather than forecast.",
  alternates: { canonical: "/figures" },
  openGraph: {
    title: "Agentipedia in figures",
    description:
      "How AI agents actually break down across autonomy levels, scope, sectors and countries, measured rather than forecast.",
    url: "/figures",
    type: "website",
    siteName: "Agentipedia by HUB Institute",
    images: [OG_IMAGE],
  },
};

function Table({
  captionEn,
  captionFr,
  rows,
  total,
  href,
  labelFr,
}: {
  captionEn: string;
  captionFr: string;
  rows: Row[];
  total: number;
  href?: (r: Row) => string;
  labelFr?: (s: string) => string;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-black uppercase tracking-tight">
        <Bi en={captionEn} fr={captionFr} />
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-lavender-line text-left">
              <th className="kicker py-2 font-bold text-muted">
                <Bi en={captionEn} fr={captionFr} />
              </th>
              <th className="kicker py-2 text-right font-bold text-muted">
                <Bi en="Deployments" fr="Déploiements" />
              </th>
              <th className="kicker py-2 text-right font-bold text-muted">
                <Bi en="Share" fr="Part" />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const label = (
                <Bi en={r.labelEn} fr={labelFr ? labelFr(r.labelFr) : r.labelFr} />
              );
              return (
                <tr key={r.key} className="border-b border-lavender-line/60">
                  <td className="py-2 pr-3 font-semibold">
                    {href ? (
                      <Link href={href(r)} className="text-mauve hover:underline">
                        {label}
                      </Link>
                    ) : (
                      label
                    )}
                  </td>
                  <td className="py-2 text-right font-black tabular-nums">{r.n}</td>
                  <td className="py-2 text-right tabular-nums text-muted">
                    {total ? `${Math.round((r.n / total) * 100)}%` : "n/a"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Stat({ n, en, fr }: { n: string; en: string; fr: string }) {
  return (
    <div className="rounded-2xl border border-lavender-line bg-paper px-4 py-4">
      <p className="text-3xl font-black tabular-nums text-mauve-deep">{n}</p>
      <p className="kicker mt-1 text-muted">
        <Bi en={en} fr={fr} />
      </p>
    </div>
  );
}

export default function FiguresPage() {
  const f = getFigures();
  const updated = getStore().updated_at;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        name: "Agentipedia: AI agent deployments in figures",
        description: `Distribution of ${f.total} documented AI-agent deployments by CODA™ autonomy level, value-chain scope, deployment stage, sector, region and country.`,
        url: `${SITE_URL}/figures/`,
        license: "https://agentipedia.hubinstitute.com/methodology/",
        isAccessibleForFree: true,
        creator: PUBLISHER,
        publisher: PUBLISHER,
        ...(updated ? { dateModified: updated } : {}),
        variableMeasured: [
          { "@type": "PropertyValue", name: "Deployments catalogued", value: f.total },
          { "@type": "PropertyValue", name: "Sectors", value: f.sectors },
          { "@type": "PropertyValue", name: "Countries", value: f.countries },
          { "@type": "PropertyValue", name: "Public sources cited", value: f.sourceCount },
          ...f.byLevel.map((r) => ({
            "@type": "PropertyValue" as const,
            name: `Deployments declared ${r.key}`,
            value: r.n,
          })),
          ...f.byQuadrant.map((r) => ({
            "@type": "PropertyValue" as const,
            name: `Deployments in the ${r.labelEn} quadrant`,
            value: r.n,
          })),
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Agentipedia", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Agentipedia in figures", item: `${SITE_URL}/figures/` },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pb-12 pt-12">
      <JsonLd data={jsonLd} />

      <p className="kicker text-mauve">
        <Bi en="Agentipedia in figures" fr="L'Agentipedia en chiffres" />
      </p>
      <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">
        <Bi en="What the deployments actually say" fr="Ce que disent vraiment les déploiements" />
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        <Bi
          en={`Every number below is counted from the ${f.total} deployments catalogued in Agentipedia.`}
          fr={`Chaque chiffre ci-dessous est compté sur les ${f.total} déploiements catalogués dans Agentipedia.`}
        />
      </p>
      {updated && (
        <p className="mt-2 text-xs text-muted">
          <Bi en="Last updated" fr="Dernière mise à jour" /> : {formatTimestamp(updated)}
        </p>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <Stat n={String(f.total)} en="deployments catalogued" fr="déploiements catalogués" />
        <Stat n={String(f.sourceCount)} en="public sources cited" fr="sources publiques citées" />
        <Stat n={String(f.countries)} en="countries" fr="pays" />
        <Stat n={String(f.sectors)} en="sectors" fr="secteurs" />
      </div>

      <section className="mt-10 rounded-2xl border-2 border-mauve bg-lilac-soft p-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-mauve-deep">
          <Bi en="What to remember" fr="Ce qu'il faut retenir" />
        </h2>
        <ul className="mt-3 grid gap-2.5 text-sm leading-relaxed">
          <li>
            <Bi
              en={`Autonomy is rare: ${f.byLevel[2].n + f.byLevel[3].n} of ${f.scored} scored deployments (${Math.round(((f.byLevel[2].n + f.byLevel[3].n) / Math.max(1, f.scored)) * 100)}%) are declared at N3 or above. The overwhelming majority still validate every action with a human.`}
              fr={`L'autonomie reste rare : ${f.byLevel[2].n + f.byLevel[3].n} des ${f.scored} déploiements scorés (${Math.round(((f.byLevel[2].n + f.byLevel[3].n) / Math.max(1, f.scored)) * 100)}%) sont déclarés à N3 ou au-delà. L'immense majorité fait encore valider chaque action par un humain.`}
            />
          </li>
          <li>
            <Bi
              en={`Scope is narrow: ${f.byScope[0].n + f.byScope[1].n} deployments instrument 6 or fewer of the 10 links of their value chain. Agents are being deployed on segments of a process, not on whole processes.`}
              fr={`La portée est étroite : ${f.byScope[0].n + f.byScope[1].n} déploiements instrumentent 6 Maillons ou moins sur les 10 de leur chaîne de valeur. Les agents sont déployés sur des segments de processus, pas sur des processus entiers.`}
            />
          </li>
          <li>
            <Bi
              en={`${f.cappedByLocks} deployments are observed acting above the level their documented governance authorises, which is exactly the gap the CODA™ locks are there to catch.`}
              fr={`${f.cappedByLocks} déploiements sont observés au-dessus du niveau qu'autorise leur gouvernance documentée, précisément l'écart que les verrous CODA™ servent à repérer.`}
            />
          </li>
          <li>
            <Bi
              en={`Evidence is thin where it matters most: only ${f.withOutcomes} of ${f.total} deployments disclose a measurable outcome, and ${f.vendorOnly} rest on vendor marketing alone.`}
              fr={`La preuve manque là où elle compte le plus : ${f.withOutcomes} déploiements sur ${f.total} publient un résultat mesurable, et ${f.vendorOnly} ne reposent que sur du marketing éditeur.`}
            />
          </li>
        </ul>
      </section>

      <Table
        captionEn="Declared autonomy level"
        captionFr="Niveau d'autonomie déclaré"
        rows={f.byLevel}
        total={f.scored}
      />
      <Table
        captionEn="CODA™ quadrant"
        captionFr="Quadrant CODA™"
        rows={f.byQuadrant}
        total={f.scored}
      />
      <Table
        captionEn="Value-chain scope"
        captionFr="Portée sur la chaîne de valeur"
        rows={f.byScope}
        total={f.scored}
      />
      <Table
        captionEn="Deployment stage"
        captionFr="Statut de déploiement"
        rows={f.byStage}
        total={f.total}
      />
      <Table
        captionEn="Sector"
        captionFr="Secteur"
        rows={f.bySector}
        total={f.total}
        href={(r) => `/sector/${sectorSlug(r.key)}/`}
        labelFr={sectorFr}
      />
      <Table
        captionEn="World region"
        captionFr="Région du monde"
        rows={f.byRegion}
        total={f.total}
        labelFr={regionFr}
      />
      <Table
        captionEn="Country (top 15)"
        captionFr="Pays (top 15)"
        rows={f.byCountry}
        total={f.total}
        labelFr={countryFr}
      />
      <Table
        captionEn="Declared vendor or platform (top 15)"
        captionFr="Éditeur ou plateforme déclarée (top 15)"
        rows={f.byVendor}
        total={f.total}
      />

      <section className="mt-12 rounded-2xl border border-lavender-line bg-lilac-soft p-6">
        <h2 className="text-lg font-black uppercase tracking-tight text-mauve-deep">
          <Bi en="Citing these figures" fr="Citer ces chiffres" />
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          <Bi
            en="Free to reuse with attribution: “Agentipedia, HUB Institute” and a link to this page."
            fr="Réutilisation libre avec attribution : « Agentipedia, HUB Institute » et un lien vers cette page."
          />
        </p>
        <p className="mt-3 text-sm font-bold">
          <Link href="/methodology/" className="text-mauve hover:underline">
            <Bi en="How the numbers are built →" fr="Comment les chiffres sont construits →" />
          </Link>
        </p>
      </section>
    </main>
  );
}
