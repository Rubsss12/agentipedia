// HUBFORUM-style participants strip: an endless ticker of about thirty
// flagship brands from the index, a French-led list for French visitors and
// an international one otherwise. Duplicated once so the CSS loop is
// seamless; hover pauses it. The full list stays one search away.
function Track({ label, items }: { label: string; items: string[] }) {
  const row = items.join("  ·  ");
  // ~4s per brand keeps the crawl slow and constant whatever the list length.
  const durationSeconds = Math.max(90, items.length * 4);
  return (
    <div className="marquee-track kicker gap-0 text-white/70" style={{ animationDuration: `${durationSeconds}s` }}>
      <span className="pr-8">
        {label}&nbsp; {row}  ·
      </span>
      <span className="pr-8">
        {label}&nbsp; {row}  ·
      </span>
    </div>
  );
}

export default function Marquee({ fr, en }: { fr: string[]; en: string[] }) {
  return (
    <div className="marquee overflow-hidden border-t border-white/15 py-3" aria-hidden>
      <div className="lang-fr">
        <Track label="Ils ont déployé. Nous avons vérifié :" items={fr} />
      </div>
      <div className="lang-en">
        <Track label="They deployed. We verified:" items={en} />
      </div>
    </div>
  );
}
