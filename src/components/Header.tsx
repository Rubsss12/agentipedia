import Link from "next/link";
import Logo from "@/components/Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-lavender-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" aria-label="Agentipedia by HUB Institute — home">
          <Logo on="light" />
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/#sectors" className="kicker text-ink-soft transition-colors hover:text-mauve">
            Sectors
          </Link>
          <Link href="/#index" className="kicker text-ink-soft transition-colors hover:text-mauve">
            Search
          </Link>
          <Link href="/methodology" className="kicker text-ink-soft transition-colors hover:text-mauve">
            Methodology
          </Link>
        </nav>
      </div>
    </header>
  );
}
