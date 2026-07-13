"use client";

// One clickable country row next to the globe: filters the index and jumps to it.
export default function GlobeCountry({ country, count }: { country: string; count: number }) {
  return (
    <button
      onClick={() => {
        window.dispatchEvent(new CustomEvent("agentipedia:country", { detail: country }));
        document.getElementById("index")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="group flex w-full items-baseline justify-between gap-3 border-b border-white/10 py-1.5 text-left"
    >
      <span className="text-sm font-semibold text-white/85 transition-colors group-hover:text-mauve-glow">
        {country}
      </span>
      <span className="text-sm font-black text-mauve-bright">{count}</span>
    </button>
  );
}
