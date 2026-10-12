import Bi from "@/components/Bi";
import { SITE_URL } from "@/lib/site";

/** LinkedIn's share dialog for a page of this site; no script, no tracking. */
export default function ShareLinkedIn({ path, tone = "dark" }: { path: string; tone?: "dark" | "light" }) {
  const href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE_URL}${path}`)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${
        tone === "dark"
          ? "border-white/30 text-white hover:border-white hover:bg-white/10"
          : "border-lavender-line bg-paper text-ink hover:border-mauve hover:text-mauve"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
      <Bi en="Share on LinkedIn" fr="Partager sur LinkedIn" />
    </a>
  );
}
