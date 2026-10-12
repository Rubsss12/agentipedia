"use client";

// "Listed on Agentipedia": a badge the company behind a fiche can put on its
// own site, linking back to the fiche. Every badge is a backlink to the index,
// and a public signal that the deployment is sourced.
import { useState } from "react";
import { useLang } from "@/lib/lang";
import { SITE_URL } from "@/lib/site";

export default function BadgeEmbed({ id, company }: { id: string; company: string }) {
  const [lang] = useLang();
  const fr = lang === "fr";
  const [copied, setCopied] = useState(false);
  const alt = fr ? "Référencé sur Agentipedia" : "Listed on Agentipedia";
  const snippet = `<a href="${SITE_URL}/entry/${id}/"><img src="${SITE_URL}/badge/agentipedia-${lang}.svg" alt="${alt}" width="200" height="56"></a>`;
  return (
    <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-lavender-line bg-paper p-5 md:flex-row md:items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/badge/agentipedia-${lang}.svg`} alt={alt} width={200} height={56} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold">
          {fr ? `Vous êtes chez ${company} ? Affichez le badge.` : `Working at ${company}? Show the badge.`}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          {fr
            ? "Collez ce code sur votre site : le badge renvoie vers cette fiche et ses sources."
            : "Paste this code on your site: the badge links back to this fiche and its sources."}
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded-lg bg-lilac-soft px-3 py-2 text-[0.7rem] text-ink-soft">{snippet}</code>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(snippet);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {}
            }}
            className="shrink-0 rounded-full bg-mauve px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-mauve-deep"
          >
            {copied ? (fr ? "Copié" : "Copied") : fr ? "Copier" : "Copy"}
          </button>
        </div>
      </div>
    </section>
  );
}
