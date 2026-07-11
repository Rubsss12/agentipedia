// HUB-family lockup, rebuilt in code from the HUBFORUM mark's construction:
// rounded "HUB" badge + bold wordmark + a small strip tagline underneath.
// on="light" renders for white surfaces (header), on="dark" for the violet
// footer/hero surfaces.
export default function Logo({ on = "light" }: { on?: "light" | "dark" }) {
  const wordmark = on === "light" ? "text-ink" : "text-white";
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-[0.72rem] font-black tracking-tight text-white"
        style={{ background: "linear-gradient(135deg, #2439e0 0%, #6b2bd9 55%, #c62ecf 100%)" }}
      >
        HUB
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-[1.02rem] font-extrabold uppercase tracking-[0.08em] ${wordmark}`}>
          Agentipedia
        </span>
        <span className="mt-1 self-start rounded-sm bg-signal px-1.5 py-0.5 text-[0.5rem] font-extrabold uppercase tracking-[0.18em] text-white">
          by HUB Institute
        </span>
      </span>
    </span>
  );
}
