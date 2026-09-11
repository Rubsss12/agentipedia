"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Bi from "@/components/Bi";

// The header's section and page links, with the current one lit.
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

export default function NavLinks({ variant }: { variant: "inline" | "strip" }) {
  const active = useActiveSection();
  const base =
    variant === "inline"
      ? "kicker relative shrink-0 py-1 transition-colors"
      : "kicker relative shrink-0 rounded-full px-3 py-1.5 transition-colors";

  return (
    <>
      {ITEMS.map((it) => {
        const on = active === it.id;
        const cls =
          variant === "inline"
            ? `${base} ${on ? "text-white" : "text-white/70 hover:text-mauve-glow"}`
            : `${base} ${on ? "bg-white/20 text-white" : "text-white/75 hover:text-white"}`;
        return (
          <Link key={it.id} href={it.href} className={cls} aria-current={on ? (it.page ? "page" : "location") : undefined}>
            <Bi en={it.en} fr={it.fr} />
            {variant === "inline" && (
              <span
                aria-hidden
                className={`absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-white transition-opacity ${on ? "opacity-100" : "opacity-0"}`}
              />
            )}
          </Link>
        );
      })}
    </>
  );
}

/** The "Our offers" pill, lit while the offers band is on screen. */
export function OffersPill() {
  const on = useActiveSection() === "offres";
  return (
    <Link
      href="/#offres"
      className={`shrink-0 rounded-full px-3 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.1em] shadow-sm transition-colors sm:px-4 sm:text-[0.7rem] ${
        on ? "bg-[#e11e8c] text-white" : "bg-white text-mauve-ink hover:bg-lilac"
      }`}
    >
      <Bi en="Our offers" fr="Nos offres" />
    </Link>
  );
}
