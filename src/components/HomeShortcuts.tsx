"use client";

// The home page's ways into the index: the search bar in the hero, its
// suggestion chips, and the "start from your role" entries under the sectors.
// None of them filter anything themselves: they hand the index a query or a
// filter through a window event (the index listens, see Explorer) and scroll
// to it, so there is one source of truth for what the index shows.
import { useState } from "react";
import { useLang } from "@/lib/lang";

type Action = { q: string } | { key: string; value: string };

function send(action: Action) {
  if ("q" in action) window.dispatchEvent(new CustomEvent("agentipedia:query", { detail: action.q }));
  else window.dispatchEvent(new CustomEvent("agentipedia:filter", { detail: action }));
  document.getElementById("index")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const SUGGESTIONS: Record<"en" | "fr", { label: string; action: Action }[]> = {
  fr: [
    { label: "L'Oréal", action: { q: "L'Oréal" } },
    { label: "Banque", action: { key: "sector", value: "Financial Services" } },
    { label: "Agentforce", action: { q: "Agentforce" } },
    { label: "Relation client", action: { key: "fn", value: "customer" } },
  ],
  en: [
    { label: "JPMorgan", action: { q: "JPMorgan" } },
    { label: "Banking", action: { key: "sector", value: "Financial Services" } },
    { label: "Agentforce", action: { q: "Agentforce" } },
    { label: "Customer service", action: { key: "fn", value: "customer" } },
  ],
};

export function HeroSearch() {
  const [lang] = useLang();
  const [q, setQ] = useState("");
  const fr = lang === "fr";
  const placeholder = fr ? "Cherchez une entreprise, un secteur, un éditeur…" : "Search a company, a sector, a vendor…";
  return (
    <div className="mt-7 max-w-xl">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          send({ q: q.trim() });
        }}
        className="flex items-center gap-2 rounded-full border border-white/20 bg-white p-1.5 pl-5 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.8)]"
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-mauve" fill="none" aria-hidden>
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
          <path d="M13.5 13.5 17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="min-w-0 flex-1 bg-transparent py-2 text-[0.95rem] text-ink outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-[#e11e8c] px-4 py-2.5 text-sm font-bold sm:px-5 text-white transition-colors hover:bg-[#c4157a]"
        >
          <span className="hidden sm:inline">{fr ? "Rechercher" : "Search"}</span>
          <span className="sm:hidden" aria-label={fr ? "Rechercher" : "Search"}>→</span>
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-white/55">{fr ? "Par exemple :" : "For example:"}</span>
        {SUGGESTIONS[lang].map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => send(s.action)}
            className="rounded-full border border-white/25 px-3 py-1 font-bold text-white/85 transition-colors hover:border-white hover:bg-white/10 hover:text-white"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FunctionEntries({ items }: { items: { key: string; en: string; fr: string; n: number }[] }) {
  const [lang] = useLang();
  const fr = lang === "fr";
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map((it) => (
        <li key={it.key}>
          <button
            type="button"
            onClick={() => send({ key: "fn", value: it.key })}
            className="inline-flex items-center gap-2 rounded-full border border-lavender-line bg-paper px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5 hover:border-mauve hover:text-mauve"
          >
            {fr ? it.fr : it.en}
            <span className="rounded-full bg-mauve/10 px-2 py-0.5 text-xs font-black text-mauve">{it.n}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
