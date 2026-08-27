import Link from "next/link";
import Logo from "@/components/Logo";
import LangToggle from "@/components/LangToggle";
import Bi from "@/components/Bi";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-mauve-night/90 text-white backdrop-blur">
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
            <Link href="/methodology" className="kicker hidden text-white/75 transition-colors hover:text-mauve-glow sm:inline">
              <Bi en="Methodology" fr="Méthodologie" />
            </Link>
          </nav>
          <LangToggle on="dark" />
        </div>
      </div>
    </header>
  );
}
