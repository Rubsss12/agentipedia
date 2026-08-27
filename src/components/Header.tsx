import Link from "next/link";
import Logo from "@/components/Logo";
import LangToggle from "@/components/LangToggle";
import Bi from "@/components/Bi";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 text-white shadow-[0_10px_30px_-18px_rgba(29,17,96,0.9)]"
      style={{ background: "linear-gradient(112deg, #2439e0 0%, #3b2fdd 34%, #6b2bd9 62%, #9a29d5 84%, #c62ecf 100%)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" aria-label="Agentipedia by HUB Institute, home" className="shrink-0">
          <Logo on="dark" />
        </Link>
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-4 overflow-x-auto whitespace-nowrap sm:gap-6">
            <Link href="/#sectors" className="kicker text-white/75 transition-colors hover:text-mauve-glow">
              <Bi en="Sectors" fr="Secteurs" />
            </Link>
            <Link href="/#index" className="kicker text-white/75 transition-colors hover:text-mauve-glow">
              <Bi en="Search" fr="Recherche" />
            </Link>
          </nav>
          <Link
            href="/#offres"
            className="shrink-0 rounded-full bg-white px-4 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-mauve-ink shadow-sm transition-colors hover:bg-lilac"
          >
            <Bi en="Our offers" fr="Nos offres" />
          </Link>
          <Link href="/methodology" className="kicker hidden shrink-0 text-white/75 transition-colors hover:text-mauve-glow sm:inline">
            <Bi en="Methodology" fr="Méthodologie" />
          </Link>
          <LangToggle on="dark" />
        </div>
      </div>
    </header>
  );
}
