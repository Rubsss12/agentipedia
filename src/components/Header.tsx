import Link from "next/link";
import Logo from "@/components/Logo";
import LangToggle from "@/components/LangToggle";
import NavLinks, { OffersPill } from "@/components/NavLinks";

// Two rows below lg: the brand, the offers pill and the language switch on the
// first, the section links in a scrollable strip on the second. Squeezing all of
// it onto one line pushed the page 51px wider than an iPhone screen, so the
// whole site scrolled sideways.
export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 text-white shadow-[0_10px_30px_-18px_rgba(29,17,96,0.9)]"
      style={{ background: "linear-gradient(112deg, #2439e0 0%, #3b2fdd 34%, #6b2bd9 62%, #9a29d5 84%, #c62ecf 100%)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <Link href="/" aria-label="Agentipedia by HUB Institute, home" className="min-w-0 shrink">
          <Logo on="dark" />
        </Link>
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-5">
          <nav aria-label="Sections" className="hidden items-center gap-6 lg:flex">
            <NavLinks variant="inline" />
          </nav>
          <OffersPill />
          <LangToggle on="dark" />
        </div>
      </div>
      <nav
        aria-label="Sections"
        className="flex gap-1 overflow-x-auto border-t border-white/10 px-3 py-1.5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        <NavLinks variant="strip" />
      </nav>
    </header>
  );
}
