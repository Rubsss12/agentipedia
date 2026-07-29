import Link from "next/link";
import Logo from "@/components/Logo";
import LangToggle from "@/components/LangToggle";
import Bi from "@/components/Bi";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-lavender-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" aria-label="Agentipedia by HUB Institute, home" className="shrink-0">
          <Logo on="light" />
        </Link>
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-4 overflow-x-auto whitespace-nowrap sm:gap-6">
            <Link href="/#sectors" className="kicker text-ink-soft transition-colors hover:text-mauve">
              <Bi en="Sectors" fr="Secteurs" />
            </Link>
            <Link href="/#index" className="kicker text-ink-soft transition-colors hover:text-mauve">
              <Bi en="Search" fr="Recherche" />
            </Link>
            <Link href="/methodology" className="kicker hidden text-ink-soft transition-colors hover:text-mauve sm:inline">
              <Bi en="Methodology" fr="Méthodologie" />
            </Link>
          </nav>
          <LangToggle on="light" />
        </div>
      </div>
    </header>
  );
}
