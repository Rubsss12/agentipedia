import type { MetadataRoute } from "next";
import { getEntries, getStats } from "@/lib/data";
import { getSectors } from "@/lib/sectors";
import { SITE_URL as BASE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // lastModified is honest: the pages built from the index move whenever the
  // index does, and a fiche's own page dates from the day it entered the index.
  const indexed = getStats().updatedAt;
  return [
    { url: `${BASE}/`, lastModified: indexed, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/methodology/`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/figures/`, lastModified: indexed, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/faq/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/insights/agent-washing/`, lastModified: indexed, changeFrequency: "weekly", priority: 0.7 },
    ...getSectors().map((s) => ({
      url: `${BASE}/sector/${s.slug}/`,
      lastModified: indexed,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...getEntries().map((e) => ({
      url: `${BASE}/entry/${e.id}/`,
      lastModified: e.first_seen_date,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
