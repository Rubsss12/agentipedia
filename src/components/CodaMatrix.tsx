"use client";

import { CODA, CODA_GRID, CODA_ORDER, type CodaKey } from "@/lib/coda";
import { useLang } from "@/lib/lang";

// The HUB Institute CODA matrix as a clickable 2x2. The cells keep the
// autonomy x scope layout; every cell and the legend lead with its maturity
// level N1..N4. Clicking a quadrant filters the index (dispatches
// "agentipedia:coda", which Explorer hears).
export default function CodaMatrix({ counts }: { counts: Record<CodaKey, number> }) {
  const [lang] = useLang();
  const fr = lang === "fr";

  const pick = (key: CodaKey) => {
    window.dispatchEvent(new CustomEvent("agentipedia:coda", { detail: key }));
    document.getElementById("index")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mt-8">
      <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
        {/* the matrix */}
        <div className="flex gap-2">
          {/* vertical axis label */}
          <div className="flex items-center">
            <span
              className="kicker whitespace-nowrap text-muted"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {fr ? "Autonomie de l'agent →" : "Agent autonomy →"}
            </span>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-2" style={{ width: "min(78vw, 360px)" }}>
              {CODA_GRID.map((key) => {
                const q = CODA[key];
                return (
                  <button
                    key={key}
                    onClick={() => pick(key)}
                    className="group flex aspect-[4/3] flex-col justify-between rounded-xl p-3 text-left text-white transition-transform hover:-translate-y-0.5"
                    style={{ background: q.color }}
                    aria-label={`${q.n} ${fr ? q.fr : q.en}`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black leading-none tabular-nums">{q.n}</span>
                      <span className="text-lg font-black tabular-nums opacity-90">{counts[key] ?? 0}</span>
                    </div>
                    <div>
                      <p className="text-[0.8rem] font-extrabold uppercase leading-tight tracking-wide">
                        {fr ? q.fr : q.en}
                        <span className="font-semibold opacity-70"> · {q.letter}</span>
                      </p>
                      <p className="mt-0.5 text-[0.62rem] font-semibold leading-tight text-white/80">
                        {fr ? q.taglineFr : q.taglineEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="kicker mt-2 text-center text-muted">
              {fr ? "Portée business →" : "Business scope →"}
            </p>
          </div>
        </div>

        {/* legend / ladder N1 -> N4 */}
        <div>
          <p className="kicker text-muted">
            {fr ? "Maturité N1 → N4" : "Maturity N1 → N4"}
          </p>
          <ul className="mt-2.5 space-y-2.5">
            {CODA_ORDER.map((key) => {
              const q = CODA[key];
              return (
                <li key={key}>
                  <button onClick={() => pick(key)} className="group flex w-full items-start gap-3 text-left">
                    <span
                      className="mt-0.5 grid h-6 min-w-[2rem] shrink-0 place-items-center rounded-md px-1 text-xs font-black tabular-nums text-white"
                      style={{ background: q.color }}
                    >
                      {q.n}
                    </span>
                    <span className="min-w-0">
                      <span className="text-sm font-extrabold group-hover:text-mauve">
                        {fr ? q.fr : q.en}
                      </span>
                      <span className="ml-1.5 text-xs font-semibold text-muted">· {q.letter}</span>
                      <span className="ml-2 text-xs text-muted">{counts[key] ?? 0}</span>
                      <span className="block text-xs leading-snug text-muted">{fr ? q.descFr : q.descEn}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
