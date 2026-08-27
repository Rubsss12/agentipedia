import Bi from "@/components/Bi";

// HUBFORUM-style participants strip: an endless ticker of the companies in
// the library, straight from the store. Duplicated once so the CSS loop is
// seamless; hover pauses it.
export default function Marquee({ items }: { items: string[] }) {
  const row = items.join("  ·  ");
  const prefix = <Bi en="In the Index Live" fr="Dans l'Index Live" />;
  // Duration scales with the number of companies so the pixel speed stays a
  // slow, constant crawl no matter how long the list grows (~4s per company).
  const durationSeconds = Math.max(240, items.length * 4);
  return (
    <div className="marquee overflow-hidden border-t border-white/15 py-3" aria-hidden>
      <div
        className="marquee-track kicker gap-0 text-white/70"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        <span className="pr-8">{prefix}&nbsp;:&nbsp; {row}  ·  </span>
        <span className="pr-8">{prefix}&nbsp;:&nbsp; {row}  ·  </span>
      </div>
    </div>
  );
}
