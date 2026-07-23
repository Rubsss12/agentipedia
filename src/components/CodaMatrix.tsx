"use client";

import { useMemo } from "react";
import {
  BANDS,
  CODA,
  CODA_GRID,
  CODA_ORDER,
  LEVELS,
  TEST_24H,
  type CodaKey,
  type CodaLevel,
} from "@/lib/coda";
import { useLang } from "@/lib/lang";

// The collection-level CODA scoring map: every catalogued deployment is a dot
// placed by its two axes (declared autonomy N1-N4, instrumented maillons
// 1-10). Amber-ringed dots are entries whose observed autonomy exceeds what
// their documented locks authorize. Clicking a quadrant filters the index
// (dispatches "agentipedia:coda", which Explorer hears).

export interface CodaPoint {
  q: CodaKey;
  declared: CodaLevel;
  scope: number;
  capped: boolean;
}

const W = 640;
const H = 400;
const M = { left: 40, right: 14, top: 16, bottom: 46 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

function mx(m: number): number {
  return M.left + ((m - 0.5) / 10) * PW;
}
function ny(n: number): number {
  return M.top + PH - ((n - 0.5) / 4) * PH;
}

const AMBER = "#b45309";

export default function CodaMatrix({ points }: { points: CodaPoint[] }) {
  const [lang] = useLang();
  const fr = lang === "fr";

  const counts = useMemo(() => {
    const c = { C: 0, O: 0, D: 0, A: 0 } as Record<CodaKey, number>;
    for (const p of points) c[p.q]++;
    return c;
  }, [points]);

  const levelCounts = useMemo(() => {
    const c: Record<CodaLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const p of points) c[p.declared]++;
    return c;
  }, [points]);

  // Cluster dots sharing (declared, scope) into a deterministic mini-grid.
  const dots = useMemo(() => {
    const groups = new Map<string, CodaPoint[]>();
    for (const p of points) {
      const k = `${p.declared}-${p.scope}`;
      const g = groups.get(k) ?? [];
      g.push(p);
      groups.set(k, g);
    }
    const out: { x: number; y: number; p: CodaPoint }[] = [];
    for (const [, g] of groups) {
      const perRow = Math.min(g.length, 5);
      g.forEach((p, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const rowCount = Math.min(g.length - row * perRow, perRow);
        const dx = (col - (rowCount - 1) / 2) * 10.5;
        const rows = Math.ceil(g.length / perRow);
        const dy = (row - (rows - 1) / 2) * 10.5;
        out.push({ x: mx(p.scope) + dx, y: ny(p.declared) + dy, p });
      });
    }
    return out;
  }, [points]);

  const pick = (key: CodaKey) => {
    window.dispatchEvent(new CustomEvent("agentipedia:coda", { detail: key }));
    document.getElementById("index")?.scrollIntoView({ behavior: "smooth" });
  };

  const midX = M.left + PW / 2;
  const midY = M.top + PH / 2;
  const cappedCount = points.filter((p) => p.capped).length;

  const quadLabel = (key: CodaKey, x: number, y: number, anchor: "start" | "end") => {
    const q = CODA[key];
    return (
      <text x={x} y={y} fontSize="13" fontWeight="900" letterSpacing=".08em" textAnchor={anchor} fill={q.color}>
        {(fr ? q.fr : q.en).toUpperCase()} · {counts[key]}
      </text>
    );
  };

  return (
    <div className="mt-8">
      <div className="overflow-hidden rounded-2xl border border-lavender-line bg-paper">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="CODA scoring map" className="h-auto w-full select-none">
          <rect x={M.left} y={midY} width={PW / 2} height={PH / 2} fill={CODA.C.fill} />
          <rect x={midX} y={midY} width={PW / 2} height={PH / 2} fill={CODA.O.fill} />
          <rect x={M.left} y={M.top} width={PW / 2} height={PH / 2} fill={CODA.D.fill} />
          <rect x={midX} y={M.top} width={PW / 2} height={PH / 2} fill={CODA.A.fill} />
          <line x1={midX} x2={midX} y1={M.top} y2={M.top + PH} stroke="#fff" strokeWidth={2.5} />
          <line x1={M.left} x2={M.left + PW} y1={midY} y2={midY} stroke="#fff" strokeWidth={2.5} />

          {quadLabel("D", M.left + 10, M.top + 20, "start")}
          {quadLabel("A", M.left + PW - 10, M.top + 20, "end")}
          {quadLabel("C", M.left + 10, midY + 20, "start")}
          {quadLabel("O", M.left + PW - 10, midY + 20, "end")}

          {([1, 2, 3, 4] as const).map((n) => (
            <text key={n} x={M.left - 9} y={ny(n) + 4} fontSize="11" fontWeight="800" textAnchor="end" fill="#6b6f80">
              N{n}
            </text>
          ))}
          {Array.from({ length: 10 }, (_, i) => i + 1).map((m) => (
            <text key={m} x={mx(m)} y={M.top + PH + 15} fontSize="10" fontWeight="700" textAnchor="middle" fill="#6b6f80">
              {m}
            </text>
          ))}
          {BANDS.map((b) => {
            const x1 = M.left + ((b.from - 1) / 10) * PW + 2;
            const x2 = M.left + (b.to / 10) * PW - 2;
            return (
              <g key={b.from}>
                <rect x={x1} y={M.top + PH + 22} width={x2 - x1} height={15} rx={7.5} fill="#e3e0f0" />
                <text x={(x1 + x2) / 2} y={M.top + PH + 33} fontSize="8.6" fontWeight="800" letterSpacing=".05em" textAnchor="middle" fill="#55507a">
                  {(fr ? b.fr : b.en).toUpperCase()}
                </text>
              </g>
            );
          })}

          {dots.map(({ x, y, p }, i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={4.4}
              fill={CODA[p.q].color}
              stroke={p.capped ? AMBER : "#ffffff"}
              strokeWidth={p.capped ? 2 : 1.4}
            />
          ))}

          {/* clickable quadrant overlays */}
          {CODA_GRID.map((key) => {
            const q = CODA[key];
            const x = q.scope === "narrow" ? M.left : midX;
            const y = q.autonomy === "high" ? M.top : midY;
            return (
              <rect
                key={key}
                x={x}
                y={y}
                width={PW / 2}
                height={PH / 2}
                fill="transparent"
                className="cursor-pointer"
                onClick={() => pick(key)}
                role="button"
                aria-label={`${fr ? q.fr : q.en}: ${counts[key]}`}
              />
            );
          })}
        </svg>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-lavender-line px-4 py-2.5 text-[0.72rem] font-semibold text-muted">
          <span>{fr ? "Autonomie déclarée (Y) × maillons instrumentés (X)" : "Declared autonomy (Y) × instrumented maillons (X)"}</span>
          {cappedCount > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: AMBER }} />
              <span style={{ color: AMBER }}>
                {cappedCount} {fr ? "observés au-dessus de leurs verrous" : "observed above their locks"}
              </span>
            </span>
          )}
          <span className="ml-auto">{fr ? "Cliquer un quadrant filtre l'index" : "Click a quadrant to filter the index"}</span>
        </div>
      </div>

      {/* the ladder N1 -> N4 (the Y axis), with declared counts */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ul className="space-y-2.5">
          {([1, 2, 3, 4] as const).map((n) => {
            const l = LEVELS[n];
            return (
              <li key={n} className="flex items-start gap-3">
                <span
                  className="mt-0.5 grid h-6 min-w-[2.4rem] shrink-0 place-items-center rounded-md px-1 text-xs font-black tabular-nums text-white"
                  style={{ background: l.color }}
                >
                  {l.n}
                </span>
                <span className="min-w-0">
                  <span className="text-sm font-extrabold">{fr ? l.fr : l.en}</span>
                  <span className="ml-1.5 text-xs font-bold text-muted">· {fr ? l.verbFr : l.verbEn}</span>
                  <span className="ml-2 text-xs text-muted">{levelCounts[n]}</span>
                  <span className="block text-xs leading-snug text-muted">{fr ? l.descFr : l.descEn}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <div>
          <ul className="space-y-2.5">
            {CODA_ORDER.map((key) => {
              const q = CODA[key];
              return (
                <li key={key}>
                  <button onClick={() => pick(key)} className="group flex w-full items-start gap-3 text-left">
                    <span
                      className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-black text-white"
                      style={{ background: q.color }}
                    >
                      {key}
                    </span>
                    <span className="min-w-0">
                      <span className="text-sm font-extrabold group-hover:text-mauve">{fr ? q.fr : q.en}</span>
                      <span className="ml-2 text-xs text-muted">{counts[key]}</span>
                      <span className="block text-xs leading-snug text-muted">{fr ? q.taglineFr : q.taglineEn}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 rounded-lg bg-lilac-soft px-3 py-2 text-xs leading-relaxed text-muted">
            {fr ? TEST_24H.fr : TEST_24H.en}
          </p>
        </div>
      </div>
    </div>
  );
}
