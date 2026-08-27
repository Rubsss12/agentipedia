// Single source of truth for the canonical site origin, used by metadata,
// sitemap, robots and JSON-LD. Override at build time with NEXT_PUBLIC_SITE_URL.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://agentipedia.hubinstitute.com";

export const PUBLISHER = {
  "@type": "Organization",
  name: "HUB Institute",
  url: "https://www.hubinstitute.com",
} as const;
