import Link from "next/link";
import { getStats } from "@/lib/data";
import { formatTimestamp } from "@/lib/format";
import Logo from "@/components/Logo";

export default function Footer() {
  const stats = getStats();
  return (
    <footer className="mt-20 bg-mauve-night text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <Logo on="dark" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            The AI observatory of the HUB Institute think tank: from AI promise
            to business proof. Real companies, named solutions, verified
            sources — worldwide.
          </p>
        </div>
        <div>
          <p className="kicker text-mauve-bright">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/#sectors" className="transition-colors hover:text-mauve-glow">Sector shelves</Link>
            </li>
            <li>
              <Link href="/#index" className="transition-colors hover:text-mauve-glow">Deployment index</Link>
            </li>
            <li>
              <Link href="/methodology" className="transition-colors hover:text-mauve-glow">
                Methodology &amp; sourcing standard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker text-mauve-bright">Status</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>{stats.entries} verified deployments</li>
            <li>{stats.countries} countries · {stats.regions} regions</li>
            <li>
              Last updated:{" "}
              {stats.updatedAt ? formatTimestamp(stats.updatedAt) : "awaiting first curation run"}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-white/50">
          Agentipedia · Insights &amp; Experiences · by HUB Institute, Paris.
          Updated autonomously by the curation engine — entries that cannot name
          both the company and the exact solution are rejected, and every
          rejection is logged.
        </p>
      </div>
    </footer>
  );
}
