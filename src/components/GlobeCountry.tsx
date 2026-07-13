"use client";

// One clickable place row next to the globe: filters the index and jumps to it.
export default function GlobeCountry({
  place,
  count,
  filterKey,
}: {
  place: string;
  count: number;
  filterKey: "country" | "region";
}) {
  return (
    <button
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("agentipedia:country", { detail: { key: filterKey, value: place } }),
        );
        document.getElementById("index")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="group flex w-full items-baseline justify-between gap-3 border-b border-white/10 py-1.5 text-left"
    >
      <span className="text-sm font-semibold text-white/85 transition-colors group-hover:text-mauve-glow">
        {place}
      </span>
      <span className="text-sm font-black text-mauve-bright">{count}</span>
    </button>
  );
}
