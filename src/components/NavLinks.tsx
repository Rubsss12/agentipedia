"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Bi from "@/components/Bi";

// The header's section and page links, with the current one lit.
//
// Every link is a pill, like "Our offers": the current one fills in white, the
// others stay outlined by their hover state. "Our offers" is always fuchsia,
// because it is the call to action, and gains a white ring when the offers band
// is on screen. Before, it was the only item that changed colour, and only on
// arrival, which read as a glitch.
//
// On the home page the active link follows the scroll (the section whose top
// has passed under the sticky header); elsewhere it follows the route. One
// component renders both the inline desktop row and the compact mobile strip,
// so the two can never disagree.

type Item = { id: string; href: string; en: string; fr: string; page?: boolean };

const ITEMS: Item[] = [
  { id: "sectors", href: "/#sectors", en: "Sectors", fr: "Secteurs" },
  { id: "coda", href: "/#coda", en: "CODA™", fr: "CODA™" },
  { id: "index", href: "/#index", en: "Search", fr: "Recherche" },
  { id: "methodology", href: "/methodology/", en: "Methodology", fr: "Méthodologie", page: true },
  { id: "figures", href: "/figures/", en: "Figures", fr: "Chiffres", page: true },
];

// Sections the scroll-spy watches, in page order. "offres" lights the pill.
const SECTIONS = ["sectors", "coda", "index", "offres"];

export function useActiveSection(): string | null {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      // A section counts as current once its top is within 40% of the viewport
      // from the header; the last one to qualify wins.
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  if (pathname === "/") return active;
  if (pathname.startsWith("/methodology")) return "methodology";
  if (pathname.startsWith("/figures")) return "figures";
  return null;
}

const PILL = "kicker shrink-0 rounded-full px-3 py-1.5 transition-colors";

export default function NavLinks({ variant }: { variant: "inline" | "strip" }) {
  const active = useActiveSection();
  return (
    <>
      {ITEMS.map((it) => {
        const on = active === it.id;
        return (
          <Link
            key={it.id}
            href={it.href}
            data-variant={variant}
            aria-current={on ? (it.page ? "page" : "location") : undefined}
            className={`${PILL} ${on ? "border border-white bg-white text-mauve-ink" : "border border-white/35 text-white/85 hover:bg-white/15 hover:text-white"}`}
          >
            <Bi en={it.en} fr={it.fr} />
          </Link>
        );
      })}
    </>
  );
}

/** The "Our offers" pill: always fuchsia, ringed while the offers band is on screen. */
export function OffersPill() {
  const on = useActiveSection() === "offres";
  return (
    <Link
      href="/#offres"
      aria-current={on ? "location" : undefined}
      className={`shrink-0 rounded-full bg-[#e11e8c] px-3 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-white shadow-sm transition-all hover:bg-[#c4157a] sm:px-4 sm:text-[0.7rem] ${
        on ? "ring-2 ring-white" : ""
      }`}
    >
      <Bi en="Our offers" fr="Nos offres" />
    </Link>
  );
}
