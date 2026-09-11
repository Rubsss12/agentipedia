// Agentipedia lockup: the official HUB Institute mark + the Agentipedia
// wordmark (the mark already reads "HUB Institute", so no tagline strip).
// on="light" (header, white surface) shows the navy mark as delivered.
// on="dark" (footer, violet surface) shows the white knockout version directly.
export default function Logo({ on = "light" }: { on?: "light" | "dark" }) {
  const wordmark = on === "light" ? "text-ink" : "text-white";
  const src = on === "dark" ? "/hub-institute-logo-white.svg" : "/hub-institute-logo.svg";
  return (
    <span className="flex min-w-0 items-center gap-2 sm:gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="HUB Institute" className="h-8 w-auto shrink-0 sm:h-9" />
      <span className={`truncate text-[0.85rem] font-extrabold uppercase tracking-[0.06em] sm:text-[1.02rem] sm:tracking-[0.08em] ${wordmark}`}>
        Agentipedia
      </span>
    </span>
  );
}
