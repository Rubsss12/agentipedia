import type { Metadata } from "next";
import Link from "next/link";
import { getStats } from "@/lib/data";
import { getSectors } from "@/lib/sectors";
import { faq } from "@/lib/faq";
import Bi from "@/components/Bi";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PUBLISHER, OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "What Agentipedia is, how a deployment earns its place, and what the CODA™ autonomy levels and scope actually measure.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ · Agentipedia",
    description:
      "What Agentipedia is, how a deployment earns its place, and what the CODA™ autonomy levels and scope actually measure.",
    url: "/faq",
    type: "website",
    siteName: "Agentipedia by HUB Institute",
    images: [OG_IMAGE],
  },
};

export default function FaqPage() {
  const stats = getStats();
  const sectors = getSectors().length;
  const items = faq(stats.entries, sectors, stats.countries);

  // One FAQPage per language: a single object cannot hold two languages without
  // making both answers unquotable, and the point of this markup is to be quoted.
  const page = (lang: "en" | "fr") => ({
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq/#${lang}`,
    inLanguage: lang,
    url: `${SITE_URL}/faq/`,
    publisher: PUBLISHER,
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: lang === "en" ? q.qEn : q.qFr,
      acceptedAnswer: { "@type": "Answer", text: lang === "en" ? q.aEn : q.aFr },
    })),
  });

  return (
    <main className="mx-auto max-w-3xl px-6 pb-12 pt-12">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [page("en"), page("fr")] }} />

      <p className="kicker text-mauve">
        <Bi en="Frequently asked questions" fr="Questions fréquentes" />
      </p>
      <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">
        <Bi en="Agentipedia, answered" fr="Agentipedia, en clair" />
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        <Bi
          en="The questions we are asked most about the index and the CODA™ scoring behind it. Each answer stands on its own."
          fr="Les questions qu'on nous pose le plus sur l'index et sur le scoring CODA™ qui le sous-tend. Chaque réponse se suffit à elle-même."
        />
      </p>

      <div className="mt-10 grid gap-4">
        {items.map((q, i) => (
          <section key={i} className="rounded-2xl border border-lavender-line bg-paper p-5">
            <h2 className="text-lg font-extrabold leading-snug tracking-tight text-mauve-deep">
              <Bi en={q.qEn} fr={q.qFr} />
            </h2>
            <p className="mt-2.5 leading-relaxed text-ink-soft">
              <Bi en={q.aEn} fr={q.aFr} />
            </p>
          </section>
        ))}
      </div>

      <section className="mt-12 rounded-2xl border-2 border-mauve bg-lilac-soft p-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-mauve-deep">
          <Bi en="Go deeper" fr="Aller plus loin" />
        </h2>
        <ul className="mt-3 grid gap-2 text-sm font-bold">
          <li>
            <Link href="/methodology/" className="text-mauve hover:underline">
              <Bi en="The full methodology →" fr="La méthodologie complète →" />
            </Link>
          </li>
          <li>
            <Link href="/figures/" className="text-mauve hover:underline">
              <Bi en="Agentipedia in figures →" fr="L'Agentipedia en chiffres →" />
            </Link>
          </li>
          <li>
            <Link href="/#index" className="text-mauve hover:underline">
              <Bi en="Browse the deployments →" fr="Parcourir les déploiements →" />
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
