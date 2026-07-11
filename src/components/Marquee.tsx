// HUBFORUM-style participants strip: an endless ticker of the companies in
// the library, straight from the store. Duplicated once so the CSS loop is
// seamless; hover pauses it.
export default function Marquee({ items }: { items: string[] }) {
  const row = items.join("  ·  ");
  return (
    <div className="marquee overflow-hidden border-t border-white/15 py-3" aria-hidden>
      <div className="marquee-track kicker gap-0 text-white/70">
        <span className="pr-8">In the library&nbsp;:&nbsp; {row}  ·  </span>
        <span className="pr-8">In the library&nbsp;:&nbsp; {row}  ·  </span>
      </div>
    </div>
  );
}
