"use client";

import { useMemo } from "react";
import { BANDS, CODA, CODA_GRID, CODA_ORDER, type CodaKey, type CodaLevel } from "@/lib/coda";
import { useLang } from "@/lib/lang";

// The collection-level CODA scoring map: every catalogued deployment is a dot
// placed by its two axes (declared autonomy N1 to N4, instrumented Maillons 1
// to 10). Amber-ringed dots are entries whose observed autonomy exceeds what
// their documented locks authorize. Clicking a quadrant or a dot filters the
// index (dispatches "agentipedia:coda", which Explorer hears).

export interface CodaPoint {
  q: CodaKey;
  declared: CodaLevel;
  scope: number;
  capped: boolean;
}

const W = 640;
const H = 600;
// Left margin carries the rotated Y title and the N labels; the bottom one the
// Maillon numbers, the scope bands and the X title.
const M = { left: 50, right: 8, top: 14, bottom: 88 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;
const COL = PW / 10;

// Four equal rows, so the four quadrants stay the same size as on the CODA
// slide. Fractions of the plot height, N1 at the bottom.
const FRAC: Record<CodaLevel, number> = { 1: 0.25, 2: 0.25, 3: 0.25, 4: 0.25 };
const LEVELS_UP: CodaLevel[] = [1, 2, 3, 4];
const rowH = (n: CodaLevel) => PH * FRAC[n];
const rowBottom = (n: CodaLevel) => M.top + PH - LEVELS_UP.filter((k) => k < n).reduce((sum, k) => sum + rowH(k), 0);

function mx(m: number): number {
  return M.left + ((m - 0.5) / 10) * PW;
}
function ny(n: CodaLevel): number {
  return rowBottom(n) - rowH(n) / 2;
}

const AMBER = "#b45309";
const INK = "#1b1333";

// Quadrant labels sit at the top of the N4 row (Délégué, Agentique) and at the
// bottom of the N1 row (Copiloté, Orchestré), away from the N2 row. Clusters in
// those two rows keep clear of the label plates.
const LABEL = 26;
// dot radius as a share of the spacing between dot centres (0.5 = touching)
const DOT = 0.52;
const reserveFor = (level: CodaLevel) => (level === 4 || level === 1 ? LABEL : 0);
const shiftFor = (level: CodaLevel) => (level === 4 ? LABEL / 2 : level === 1 ? -LABEL / 2 : 0);

export default function CodaMatrix({ points }: { points: CodaPoint[] }) {
  const [lang] = useLang();
  const fr = lang === "fr";

  const counts = useMemo(() => {
    const c = { C: 0, O: 0, D: 0, A: 0 } as Record<CodaKey, number>;
    for (const p of points) c[p.q]++;
    return c;
  }, [points]);

  // Dots sharing a cell (declared level x scope) sit on a small staggered grid
  // inside that cell. Every dot on the map has the SAME size: the spacing is set
  // once, by the most crowded cell, so no cluster ever leaves its cell. Dots just
  // touch, each keeping its white rim; amber-ringed dots are drawn last so their
  // ring is never covered by a neighbour.
  const { dots, r } = useMemo(() => {
    const groups = new Map<string, CodaPoint[]>();
    for (const p of points) {
      const k = `${p.declared}-${p.scope}`;
      const g = groups.get(k) ?? [];
      g.push(p);
      groups.set(k, g);
    }
    const V = Math.sqrt(3) / 2; // row pitch of a hexagonal packing
    const width = COL - 4;
    const shape = (n: number, sp: number) => {
      const even = Math.max(1, Math.floor(width / sp));
      const odd = even * sp + sp / 2 <= width ? even : Math.max(1, even - 1);
      let rows = 0;
      let cap = 0;
      while (cap < n) {
        cap += rows % 2 ? odd : even;
        rows++;
      }
      return { even, odd, rows };
    };
    const fits = (sp: number) =>
      [...groups.values()].every((g) => {
        const { rows } = shape(g.length, sp);
        return (rows - 1) * sp * V + 2 * DOT * sp <= rowH(g[0].declared) - 6 - reserveFor(g[0].declared);
      });
    let s = 14;
    while (s > 3 && !fits(s)) s -= 0.1;
    const radius = s * DOT;

    const out: { x: number; y: number; p: CodaPoint }[] = [];
    for (const [, g] of groups) {
      const { even, odd, rows } = shape(g.length, s);
      const cx = mx(g[0].scope);
      const cy = ny(g[0].declared) + shiftFor(g[0].declared);
      // rows of equal length get a quarter-step nudge each way to stay staggered
      const stagger = odd === even ? s / 4 : 0;
      let i = 0;
      for (let row = 0; row < rows; row++) {
        const cap = row % 2 ? odd : even;
        const inRow = Math.min(cap, g.length - i);
        const start = Math.floor((cap - inRow) / 2);
        for (let j = 0; j < inRow; j++) {
          out.push({
            x: cx + (start + j - (cap - 1) / 2) * s + (row % 2 ? stagger : -stagger),
            y: cy + (row - (rows - 1) / 2) * s * V,
            p: g[i++],
          });
        }
      }
    }
    out.sort((a, b) => Number(a.p.capped) - Number(b.p.capped));
    return { dots: out, r: radius };
  }, [points]);

  const pick = (key: CodaKey) => {
    window.dispatchEvent(new CustomEvent("agentipedia:coda", { detail: key }));
    document.getElementById("index")?.scrollIntoView({ behavior: "smooth" });
  };

  const midX = M.left + PW / 2;
  const midY = M.top + PH * (FRAC[4] + FRAC[3]);
  const cappedCount = points.filter((p) => p.capped).length;

  // Quadrant names sit on a light plate drawn above the dots.
  const quadLabel = (key: CodaKey, x: number, y: number, anchor: "start" | "end") => {
    const q = CODA[key];
    const text = `${(fr ? q.fr : q.en).toUpperCase()} · ${counts[key]}`;
    const w = text.length * 8.4 + 14;
    const rx = anchor === "start" ? x - 7 : x - w + 7;
    return (
      <g pointerEvents="none">
        <rect x={rx} y={y - 14} width={w} height={20} rx={10} fill="#ffffff" fillOpacity={0.92} />
        <text x={x} y={y} fontSize="12.5" fontWeight="900" letterSpacing=".06em" textAnchor={anchor} fill={q.deep}>
          {text}
        </text>
      </g>
    );
  };

  const bandShort = (b: (typeof BANDS)[number]) =>
    (fr ? b.fr.replace("Périmètre ", "") : b.en.replace(" scope", "")).toUpperCase();

  return (
    <div className="mt-8">
      <div className="overflow-hidden rounded-2xl border border-lavender-line bg-paper">
        {/* On a phone the map keeps a readable size and scrolls sideways inside
            its card rather than shrinking the dots to specks. */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={fr ? "Carte de scoring CODA" : "CODA scoring map"}
            className="h-auto w-full min-w-[34rem] select-none"
          >
            <rect x={M.left} y={midY} width={PW / 2} height={M.top + PH - midY} fill={CODA.C.fill} />
            <rect x={midX} y={midY} width={PW / 2} height={M.top + PH - midY} fill={CODA.O.fill} />
            <rect x={M.left} y={M.top} width={PW / 2} height={midY - M.top} fill={CODA.D.fill} />
            <rect x={midX} y={M.top} width={PW / 2} height={midY - M.top} fill={CODA.A.fill} />
            <line x1={midX} x2={midX} y1={M.top} y2={M.top + PH} stroke="#fff" strokeWidth={2.5} />
            <line x1={M.left} x2={M.left + PW} y1={midY} y2={midY} stroke="#fff" strokeWidth={2.5} />

            {/* Y axis: levels, then its title, rotated */}
            {([1, 2, 3, 4] as const).map((n) => (
              <text key={n} x={M.left - 9} y={ny(n) + 4} fontSize="11.5" fontWeight="800" textAnchor="end" fill="#6b6f80">
                N{n}
              </text>
            ))}
            <text
              x={13}
              y={M.top + PH / 2}
              transform={`rotate(-90 13 ${M.top + PH / 2})`}
              fontSize="13"
              fontWeight="900"
              textAnchor="middle"
              fill={INK}
            >
              {fr ? "Autonomie déclarée de l'agent" : "Agent's declared autonomy"}
            </text>

            {/* X axis: Maillon numbers, scope bands, then its title */}
            {Array.from({ length: 10 }, (_, i) => i + 1).map((m) => (
              <text key={m} x={mx(m)} y={M.top + PH + 16} fontSize="10.5" fontWeight="700" textAnchor="middle" fill="#6b6f80">
                {m}
              </text>
            ))}
            {BANDS.map((b) => {
              const x1 = M.left + ((b.from - 1) / 10) * PW + 2;
              const x2 = M.left + (b.to / 10) * PW - 2;
              return (
                <g key={b.from}>
                  <rect x={x1} y={M.top + PH + 24} width={x2 - x1} height={17} rx={8.5} fill="#e3e0f0" />
                  <text
                    x={(x1 + x2) / 2}
                    y={M.top + PH + 36}
                    fontSize="9"
                    fontWeight="800"
                    letterSpacing=".06em"
                    textAnchor="middle"
                    fill="#55507a"
                  >
                    {bandShort(b)}
                  </text>
                </g>
              );
            })}
            <text x={M.left + PW / 2} y={H - 14} fontSize="13" fontWeight="900" textAnchor="middle" fill={INK}>
              {fr ? "Maillons de la chaîne de valeur instrumentés" : "Instrumented value-chain Maillons"}
            </text>

            {dots.map(({ x, y, p }, i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={r}
                fill={CODA[p.q].color}
                stroke={p.capped ? AMBER : "#ffffff"}
                strokeWidth={p.capped ? Math.max(1, r * 0.5) : Math.max(0.5, r * 0.28)}
              />
            ))}

            {/* clickable quadrant overlays: a click on a dot lands here too */}
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
                  height={q.autonomy === "high" ? midY - M.top : M.top + PH - midY}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => pick(key)}
                  role="button"
                  aria-label={`${fr ? q.fr : q.en}: ${counts[key]}`}
                />
              );
            })}

            {quadLabel("D", M.left + 12, M.top + 22, "start")}
            {quadLabel("A", M.left + PW - 12, M.top + 22, "end")}
            {quadLabel("C", M.left + 12, M.top + PH - 12, "start")}
            {quadLabel("O", M.left + PW - 12, M.top + PH - 12, "end")}
          </svg>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-lavender-line px-4 py-2.5 text-[0.74rem] font-semibold text-muted">
          {cappedCount > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: AMBER }} />
              <span style={{ color: AMBER }}>
                {fr
                  ? `${cappedCount} agents IA observés au-dessus de leur véritable niveau d'autonomie`
                  : `${cappedCount} AI agents observed above their true autonomy level`}
              </span>
            </span>
          )}
          <span className="sm:ml-auto">
            {fr ? "Cliquer sur un quadrant ou un point filtre l'index" : "Click a quadrant or a dot to filter the index"}
          </span>
        </div>
      </div>

      {/* Under the map: the four quadrants as a 2 x 2 of shortcuts, and in the
          freed corner the CODA matrix itself, as the HUB Institute slide draws it. */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-stretch">
        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
          {CODA_ORDER.map((key) => {
            const q = CODA[key];
            return (
              <li key={key}>
                <button
                  onClick={() => pick(key)}
                  className="group flex h-full w-full items-start gap-2.5 rounded-xl border border-lavender-line bg-paper px-3 py-2.5 text-left transition-colors hover:border-mauve"
                >
                  <span
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md text-[0.7rem] font-black text-white"
                    style={{ background: q.color }}
                  >
                    {key}
                  </span>
                  <span className="min-w-0">
                    <span className="text-sm font-extrabold group-hover:text-mauve">{fr ? q.fr : q.en}</span>
                    <span className="ml-2 text-xs font-bold text-muted">{counts[key]}</span>
                    <span className="block text-xs font-semibold leading-snug text-muted">{fr ? q.taglineFr : q.taglineEn}</span>
                    <span className="mt-1 block text-[0.72rem] leading-snug text-ink-soft">{fr ? q.descFr : q.descEn}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <figure className="flex w-full flex-col rounded-2xl border border-lavender-line bg-paper p-4 md:p-5">
          <figcaption className="kicker text-mauve">{fr ? "La Matrice CODA™" : "The CODA™ Matrix"}</figcaption>
          <div className="mt-3 flex flex-1 gap-2.5">
            <p className="kicker shrink-0 rotate-180 text-center text-[0.62rem] leading-tight text-muted [writing-mode:vertical-rl]">
              {fr ? "Autonomie des agents →" : "Agent autonomy →"}
            </p>
            <div className="grid flex-1 grid-cols-2 gap-1.5">
              {CODA_GRID.map((key) => {
                const q = CODA[key];
                return (
                  <button
                    key={key}
                    onClick={() => pick(key)}
                    aria-label={`${fr ? q.fr : q.en}: ${counts[key]}`}
                    className="grid min-h-[7.5rem] place-items-center rounded-lg text-white transition-transform hover:scale-[1.02] sm:aspect-[16/10] sm:min-h-0"
                    style={{ background: q.color }}
                  >
                    <span className="text-center">
                      <span className="block text-4xl font-black leading-none md:text-5xl">{key}</span>
                      <span className="mt-2 block text-xs font-extrabold uppercase tracking-wider md:text-sm">
                        {fr ? q.fr : q.en}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="kicker mt-2.5 pl-6 text-center text-[0.62rem] leading-tight text-muted">
            {fr ? "Portée business, Maillons de la chaîne de valeur →" : "Business scope, value-chain Maillons →"}
          </p>
        </figure>
      </div>
    </div>
  );
}
