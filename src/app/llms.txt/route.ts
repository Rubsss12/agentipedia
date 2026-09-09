import { getFigures } from "@/lib/figures";
import { getSectors, sectorSlug } from "@/lib/sectors";
import { getStore } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

// /llms.txt is the emerging convention for telling a language model what a site
// contains and where the authoritative pages are, in one plain-text file it can
// read in a single fetch instead of crawling 480 pages to find out.
//
// Generated from the store rather than hand-maintained, so the counts here can
// never contradict the site.
export const dynamic = "force-static";

export function GET() {
  const f = getFigures();
  const updated = getStore().updated_at;
  const sectors = getSectors();

  const body = `# Agentipedia

> A public catalog of real AI-agent deployments inside named companies, published by HUB Institute. ${f.total} deployments across ${f.sectors} sectors and ${f.countries} countries, each naming the company and the exact solution, each linked to the public sources that prove it, each scored on the CODA(TM) matrix.

Publisher: HUB Institute (https://www.hubinstitute.com)
Canonical site: ${SITE_URL}/
${updated ? `Last updated: ${updated}\n` : ""}
## What makes this index unusual

- No source, no entry. An entry exists only when a retrieved public source names both a real company and a named solution. Never "a large retailer", never "a chatbot".
- Every entry is scored on two independent measured axes: autonomy N1-N4, and the number of value-chain links (1-10) the agent measurably instruments.
- Declared level = min(observed level, level the documented locks authorise). Vendor-marketing-only evidence caps the observed level at N2. ${f.cappedByLocks} entries are observed acting above what their governance authorises.
- Cases shared directly by a company with no public source are published and labelled "client-sourced" rather than dressed up as verified.

## Key figures (counted, not forecast)

- Deployments catalogued: ${f.total}
- Public sources cited: ${f.sourceCount}
- Declared at N3 or above: ${f.byLevel[2].n + f.byLevel[3].n} of ${f.scored} scored
${f.byLevel.map((r) => `- ${r.labelEn}: ${r.n}`).join("\n")}
${f.byQuadrant.map((r) => `- Quadrant ${r.labelEn}: ${r.n}`).join("\n")}
- Instrumenting 6 or fewer of 10 value-chain links: ${f.byScope[0].n + f.byScope[1].n}
- Disclosing a measurable outcome: ${f.withOutcomes}
- Resting on vendor marketing alone: ${f.vendorOnly}

## Primary pages

- [The index](${SITE_URL}/): searchable catalog of all ${f.total} deployments, filterable by CODA(TM) quadrant, level, sector, country, stage and confidence.
- [The index in figures](${SITE_URL}/figures/): the distributions above, with sources and licence to cite.
- [Methodology](${SITE_URL}/methodology/): the two-field rule, the sourcing standard, the confidence policy.
- [FAQ](${SITE_URL}/faq/): what CODA(TM) measures, what N1-N4 mean, what scope x/10 means.

## Sectors

${sectors.map((s) => `- [${s.name}](${SITE_URL}/sector/${sectorSlug(s.name)}/): ${s.entries} deployments`).join("\n")}

## Entries

Every deployment has its own page at ${SITE_URL}/entry/{id}/ carrying a "Key facts" block in English and French, a CODA(TM) score card, the reported outcomes and the full source list. The complete list of URLs is in ${SITE_URL}/sitemap.xml.

## Citation

Free to reuse with attribution: "Agentipedia, HUB Institute", with a link to the page cited.
Contact: contact@hubinstitute.com
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
