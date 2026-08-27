// Agentipedia lockup: the official HUB Institute mark + the Agentipedia
// wordmark (the mark already reads "HUB Institute", so no tagline strip).
// on="light" (header, white surface) shows the navy mark as delivered.
// on="dark" (footer, violet surface) shows the white knockout version directly.
export default function Logo({ on = "light" }: { on?: "light" | "dark" }) {
  const wordmark = on === "light" ? "text-ink" : "text-white";
  const src = on === "dark" ? "/hub-institute-logo-white.svg" : "/hub-institute-logo.svg";
  return (
    <span className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="HUB Institute" className="h-9 w-auto shrink-0" />
      <span className={`text-[1.02rem] font-extrabold uppercase tracking-[0.08em] ${wordmark}`}>
        Agentipedia
      </span>
    </span>
  );
}
