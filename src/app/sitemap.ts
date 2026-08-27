import type { MetadataRoute } from "next";
import { getEntries } from "@/lib/data";
import { getSectors } from "@/lib/sectors";
import { SITE_URL as BASE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/methodology/`, changeFrequency: "monthly", priority: 0.6 },
    ...getSectors().map((s) => ({
      url: `${BASE}/sector/${s.slug}/`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...getEntries().map((e) => ({
      url: `${BASE}/entry/${e.id}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
