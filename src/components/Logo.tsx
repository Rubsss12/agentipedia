// Agentipedia lockup: the official HUB Institute mark + the Agentipedia
// wordmark (the mark already reads "HUB Institute", so no tagline strip).
// on="light" renders for white surfaces (header): the navy logo as delivered.
// on="dark" renders for the violet footer/hero surfaces: the two-tone mark keeps
// its "HUB" knockout letters only in two colours, so on dark it sits on a small
// white plate rather than being flattened to a white silhouette.
export default function Logo({ on = "light" }: { on?: "light" | "dark" }) {
  const wordmark = on === "light" ? "text-ink" : "text-white";
  const mark = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src="/hub-institute-logo.svg" alt="HUB Institute" className="h-9 w-auto shrink-0" />
  );
  return (
    <span className="flex items-center gap-2.5">
      {on === "dark" ? (
        <span className="inline-flex shrink-0 rounded-lg bg-white p-1.5">{mark}</span>
      ) : (
        mark
      )}
      <span className={`text-[1.02rem] font-extrabold uppercase tracking-[0.08em] ${wordmark}`}>
        Agentipedia
      </span>
    </span>
  );
}
