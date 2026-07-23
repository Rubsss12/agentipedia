import {
  BANDS,
  CHAINS,
  CODA,
  LEVELS,
  LOCKS,
  TEST_24H,
  codaDeclared,
  codaQuadrant,
  codaScope,
  locksAllow,
  quadrantOf,
  type CodaAssessment,
} from "@/lib/coda";
import Bi from "@/components/Bi";

// The per-entry CODA score card, after the HUB Institute masterclass: the
// scoring map (quadrant tints, N1-N4 rungs, maillons 1-10) on the right, the
// per-maillon scanner on the left, the proof line and the four locks below.
// Solid dot = declared level; amber outline = observed level when the locks
// cap it lower (the anti agent-washing clause made visible).

const W = 460;
const H = 300;
const M = { left: 34, right: 12, top: 14, bottom: 40 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

/** x of the center of maillon column m (1..10). */
function mx(m: number): number {
  return M.left + ((m - 0.5) / 10) * PW;
}
/** y of the center of level rung n (1..4); N1 at the bottom. */
function ny(n: number): number {
  return M.top + PH - ((n - 0.5) / 4) * PH;
}

const AMBER = "#b45309";

function ScoreMap({ a, label }: { a: CodaAssessment; label: string }) {
  const scope = codaScope(a.links);
  const declared = codaDeclared(a);
  const observed = a.observed;
  const capped = observed > declared;
  const dq = CODA[quadrantOf(declared, scope)];
  const midX = M.left + PW / 2;
  const midY = M.top + PH / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
      className="h-auto w-full select-none"
    >
      {/* quadrant tints: top = high autonomy (N3-N4), right = broad (6+) */}
      <rect x={M.left} y={midY} width={PW / 2} height={PH / 2} fill={CODA.C.fill} />
      <rect x={midX} y={midY} width={PW / 2} height={PH / 2} fill={CODA.O.fill} />
      <rect x={M.left} y={M.top} width={PW / 2} height={PH / 2} fill={CODA.D.fill} />
      <rect x={midX} y={M.top} width={PW / 2} height={PH / 2} fill={CODA.A.fill} />

      {/* level rung guides */}
      {[1, 2, 3].map((n) => (
        <line
          key={n}
          x1={M.left}
          x2={M.left + PW}
          y1={M.top + PH - (n / 4) * PH}
          y2={M.top + PH - (n / 4) * PH}
          stroke="#ffffff"
          strokeWidth={n === 2 ? 0 : 1.4}
        />
      ))}
      <line x1={midX} x2={midX} y1={M.top} y2={M.top + PH} stroke="#ffffff" strokeWidth={2} />
      <line x1={M.left} x2={M.left + PW} y1={midY} y2={midY} stroke="#ffffff" strokeWidth={2} />

      {/* quadrant names */}
      {(
        [
          ["D", M.left + 8, M.top + 15],
          ["A", midX + 8, M.top + 15],
          ["C", M.left + 8, midY + 15],
          ["O", midX + 8, midY + 15],
        ] as const
      ).map(([k, x, y]) => (
        <text key={k} x={x} y={y} fontSize="10.5" fontWeight="900" letterSpacing=".08em" fill={CODA[k].color}>
          <tspan className="lang-en">{CODA[k].en.toUpperCase()}</tspan>
          <tspan className="lang-fr">{CODA[k].fr.toUpperCase()}</tspan>
        </text>
      ))}

      {/* Y axis: N1..N4 */}
      {([1, 2, 3, 4] as const).map((n) => (
        <text key={n} x={M.left - 8} y={ny(n) + 3.5} fontSize="10" fontWeight="800" textAnchor="end" fill="#6b6f80">
          N{n}
        </text>
      ))}

      {/* X axis: maillons 1..10 */}
      {Array.from({ length: 10 }, (_, i) => i + 1).map((m) => (
        <text key={m} x={mx(m)} y={M.top + PH + 13} fontSize="9" fontWeight="700" textAnchor="middle" fill="#6b6f80">
          {m}
        </text>
      ))}

      {/* scope bands */}
      {BANDS.map((b) => {
        const x1 = M.left + ((b.from - 1) / 10) * PW + 2;
        const x2 = M.left + (b.to / 10) * PW - 2;
        return (
          <g key={b.from}>
            <rect x={x1} y={M.top + PH + 19} width={x2 - x1} height={13} rx={6.5} fill="#e3e0f0" />
            <text x={(x1 + x2) / 2} y={M.top + PH + 28.5} fontSize="7.6" fontWeight="800" letterSpacing=".05em" textAnchor="middle" fill="#55507a">
              {/* short labels, per the masterclass workshop template */}
              <tspan className="lang-en">{b.en.replace(" scope", "").toUpperCase()}</tspan>
              <tspan className="lang-fr">{b.fr.replace("Périmètre ", "").toUpperCase()}</tspan>
            </text>
          </g>
        );
      })}

      {/* observed marker (amber outline) when the locks cap the level */}
      {capped && (
        <g>
          <line
            x1={mx(scope)}
            y1={ny(observed)}
            x2={mx(scope)}
            y2={ny(declared) - 7}
            stroke={AMBER}
            strokeWidth={1.6}
            strokeDasharray="3 3"
          />
          <circle cx={mx(scope)} cy={ny(observed)} r={6.5} fill="none" stroke={AMBER} strokeWidth={2.4} />
          <text x={mx(scope) + 11} y={ny(observed) + 3.5} fontSize="9" fontWeight="800" fill={AMBER}>
            <tspan className="lang-en">observed N{observed}</tspan>
            <tspan className="lang-fr">observé N{observed}</tspan>
          </text>
        </g>
      )}

      {/* declared marker (solid, quadrant color) */}
      <circle cx={mx(scope)} cy={ny(declared)} r={7.5} fill={dq.color} stroke="#ffffff" strokeWidth={2.4} />
    </svg>
  );
}

function LinkGlyph({ s }: { s: 0 | 1 | 2 }) {
  const style =
    s === 2
      ? { bg: "#e7f2e4", fg: "#3d7a33", t: "✓" }
      : s === 1
        ? { bg: "#fbeed3", fg: "#9a6b13", t: "~" }
        : { bg: "#efeff3", fg: "#9a9aa8", t: "✗" };
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded text-[0.65rem] font-black"
      style={{ background: style.bg, color: style.fg, width: "1.15rem", height: "1.15rem" }}
    >
      {style.t}
    </span>
  );
}

export default function CodaCard({ a, name }: { a: CodaAssessment; name: string }) {
  const chain = CHAINS[a.chain];
  const scope = codaScope(a.links);
  const declared = codaDeclared(a);
  const observed = a.observed;
  const capped = observed > declared;
  const q = CODA[codaQuadrant(a)!];
  const lvl = LEVELS[declared];
  const full = a.links.filter((s) => s === 2).length;
  const partial = a.links.filter((s) => s === 1).length;
  const allowed = locksAllow(a.locks);

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-lavender-line">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-lavender-line bg-lilac-soft px-4 py-3">
        <p className="kicker text-mauve-deep">
          <Bi en="CODA Score Card · HUB Institute" fr="CODA Score Card · HUB Institute" />
        </p>
        <p className="text-xs font-bold text-muted">
          <Bi en="Scored from public evidence" fr="Scorée au constat des sources publiques" />
        </p>
      </header>

      <div className="grid gap-5 p-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-start">
        {/* ===== the scanner: one status per maillon ===== */}
        <div>
          <p className="kicker text-muted">
            <Bi en="Frieze · " fr="Frise · " />
            <Bi en={chain.en} fr={chain.fr} />
          </p>
          <ol className="mt-2 space-y-1">
            {chain.links.map((l, i) => (
              <li key={i} className="flex items-center gap-2 text-[0.78rem] leading-tight">
                <LinkGlyph s={a.links[i] as 0 | 1 | 2} />
                <span className={a.links[i] ? "font-bold text-ink" : "text-muted"}>
                  <span className="tabular-nums">{i + 1}.</span> <Bi en={l.en} fr={l.fr} />
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-2.5 rounded-lg bg-lilac-soft px-3 py-2 text-xs font-bold text-mauve-deep">
            <Bi
              en={`Instrumented maillons: ${full} full + ${partial} partial ≈ ${scope}/10`}
              fr={`Maillons instrumentés : ${full} pleins + ${partial} partiels ≈ ${scope}/10`}
            />
          </p>
        </div>

        {/* ===== the scoring map ===== */}
        <div>
          <ScoreMap a={a} label={`CODA score card: ${name}`} />
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.7rem] font-semibold text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: q.color }} />
              <Bi en="declared" fr="déclaré" />
            </span>
            {capped && (
              <span className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="inline-block h-2.5 w-2.5 rounded-full border-2"
                  style={{ borderColor: AMBER }}
                />
                <span style={{ color: AMBER }}>
                  <Bi en="observed (amber), capped by the locks" fr="observé (ambre), plafonné par les verrous" />
                </span>
              </span>
            )}
            <span className="ml-auto">
              <Bi en="Autonomy (Y) × instrumented maillons (X)" fr="Autonomie (Y) × maillons instrumentés (X)" />
            </span>
          </div>
        </div>
      </div>

      {/* ===== verdict ===== */}
      <div className="border-t border-lavender-line px-4 py-3">
        <p className="text-sm font-black" style={{ color: q.color }}>
          <Bi en={q.en} fr={q.fr} /> · N{declared} <Bi en={lvl.en} fr={lvl.fr} />
          <span className="font-bold text-muted">
            {" "}
            · <Bi en={`scope ${scope}/10`} fr={`portée ${scope}/10`} />
          </span>
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          <Bi en={a.basis_en} fr={a.basis_fr} />
        </p>

        {/* the four locks */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {LOCKS.map((l) => {
            const ok = a.locks.includes(l.key);
            return (
              <span
                key={l.key}
                title={l.testFr}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                  ok ? "bg-ok-bg text-ok" : "bg-ink/5 text-muted"
                }`}
              >
                <span aria-hidden>{ok ? "✓" : "○"}</span>
                <Bi en={l.en} fr={l.fr} />
              </span>
            );
          })}
          <span className="inline-flex items-center rounded-full bg-lilac px-2 py-0.5 text-[0.65rem] font-bold text-mauve-deep">
            <Bi en={`locks authorize N${allowed}`} fr={`verrous : N${allowed} autorisé`} />
          </span>
        </div>

        <p className="mt-2.5 text-xs leading-relaxed text-muted">
          <span className="font-bold">
            <Bi en="declared = min(observed, authorized by the locks)." fr="déclaré = min(observé, autorisé par les verrous)." />
          </span>{" "}
          <Bi
            en="A lock without public evidence counts as closed - the anti agent-washing clause. "
            fr="Un verrou sans preuve publique est réputé fermé - la clause anti agent-washing. "
          />
          <Bi en={TEST_24H.en} fr={TEST_24H.fr} />{" "}
          <Bi
            en="Analytical placement on the HUB Institute CODA matrix, from public sources; never a claim made by the company."
            fr="Placement analytique sur la matrice CODA du HUB Institute, au constat des sources publiques ; jamais une affirmation de l'entreprise."
          />
        </p>
      </div>
    </section>
  );
}
