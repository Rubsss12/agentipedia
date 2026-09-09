// Single source of truth for the canonical site origin, used by metadata,
// sitemap, robots and JSON-LD. Override at build time with NEXT_PUBLIC_SITE_URL.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://agentipedia.hubinstitute.com";

// Defining `openGraph` on a page REPLACES the root layout's object rather than
// merging into it, so every page that sets its own has to restate the image or
// it ships an imageless card. One constant, spread everywhere.
export const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Agentipedia by HUB Institute — the AI & Agentic index",
} as const;

export const PUBLISHER = {
  "@type": "Organization",
  name: "HUB Institute",
  url: "https://www.hubinstitute.com",
} as const;
