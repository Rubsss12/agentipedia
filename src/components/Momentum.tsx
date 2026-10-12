import Link from "next/link";
import Bi from "@/components/Bi";
import { getMomentum } from "@/lib/momentum";
import { sectorFr } from "@/lib/labels";

// "Your competitors are moving": the quarterly pace of AI agent deployments
// made public, and the latest proofs. Sits right under the hero, so the page
// opens on movement rather than on a database.

/** Month and year only: a source often dates to the month, never invent a day. */
export function proofMonth(iso: string, locale: "fr-FR" | "en-GB") {
  return new Date(`${iso.slice(0, 7)}-01T00:00:00Z`).toLocaleDateString(locale, { month: "long", year: "numeric", timeZone: "UTC" });
}

export default function Momentum() {
  const m = getMomentum();
  const W = 560, H = 210, L = 8, R = 8, T = 26, B = 46;
  const n = m.quarters.length;
  const gw = (W - L - R) / n;
  const bw = gw * 0.58;
  const max = Math.max(1, ...m.quarters.map((q) => q.n));
  const years = [...new Set(m.quarters.map((q) => q.year))];

  return (
    <section id="mouvement" className="mx-auto max-w-6xl scroll-mt-28 px-6 pt-14 lg:scroll-mt-20">
      <div data-reveal>
        <p className="kicker text-mauve">
          <Bi en="Your competitors are moving" fr="Vos concurrents se bougent" />
        </p>
        <h2 className="mt-2 max-w-3xl text-2xl font-extrabold tracking-tight md:text-3xl">
          <Bi
            en={`${m.sinceJanuary} AI agent deployments made public since 1 January ${m.year}.`}
            fr={`${m.sinceJanuary} déploiements d'agents IA rendus publics depuis le 1er janvier ${m.year}.`}
          />
        </h2>
        {m.multiplier > 1 && (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft md:text-base">
            <Bi
              en={`The pace has grown ${m.multiplier}-fold in two years: ${m.paceThen} deployments made public per quarter in ${m.year - 2}, ${m.paceNow} in ${m.year}. Here are the latest proofs.`}
              fr={`Le rythme a été multiplié par ${m.multiplier} en deux ans : ${m.paceThen} déploiements rendus publics par trimestre en ${m.year - 2}, ${m.paceNow} en ${m.year}. Voici les dernières preuves.`}
            />
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <figure className="flex flex-col justify-between rounded-2xl border border-lavender-line bg-paper p-4 md:p-5" data-reveal>
          <svg viewBox={`0 0 ${W} ${H}`} className="my-auto w-full" role="img" aria-label="Déploiements rendus publics par trimestre">
            {m.quarters.map((q, i) => {
              const h = ((H - T - B) * q.n) / max;
              const x = L + gw * i + (gw - bw) / 2;
              const y = H - B - h;
              const hot = q.year === m.year;
              return (
                <g key={q.key}>
                  <rect
                    x={x}
                    y={y}
                    width={bw}
                    height={Math.max(1, h)}
                    rx={3}
                    fill={q.partial ? "#efe9fe" : hot ? "#6d28d9" : "#1d1160"}
                    stroke={q.partial ? "#6d28d9" : "none"}
                    strokeDasharray={q.partial ? "4 3" : undefined}
                  />
                  <text x={x + bw / 2} y={y - 6} fontSize="12" fontWeight="800" textAnchor="middle" fill="#1d1160">
                    {q.n}
                  </text>
                  <text x={x + bw / 2} y={H - B + 16} fontSize="10" textAnchor="middle" fill="#7a7599">
                    T{q.q}
                  </text>
                </g>
              );
            })}
            <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="#e3e0f0" />
            {years.map((y) => {
              const idx = m.quarters.map((q, i) => (q.year === y ? i : -1)).filter((i) => i >= 0);
              const cx = L + gw * ((idx[0] + idx[idx.length - 1]) / 2 + 0.5);
              return (
                <text key={y} x={cx} y={H - 8} fontSize="13" fontWeight="900" textAnchor="middle" fill={y === m.year ? "#6d28d9" : "#1d1160"}>
                  {y}
                </text>
              );
            })}
          </svg>
          <figcaption className="mt-2 text-xs leading-relaxed text-muted">
            <Bi
              en="Deployments in the directory made public per quarter, dated by their first public proof. The current quarter is still open."
              fr="Déploiements de l'annuaire rendus publics par trimestre, datés par leur première preuve publique. Le trimestre en cours n'est pas terminé."
            />
          </figcaption>
        </figure>

        <div className="rounded-2xl border border-lavender-line bg-paper p-4 md:p-5" data-reveal>
          <p className="kicker text-mauve">
            <Bi en="Latest proofs" fr="Dernières preuves" />
          </p>
          <ul className="mt-2 divide-y divide-lavender-line">
            {m.latest.map((p) => (
              <li key={p.id}>
                <Link href={`/entry/${p.id}`} className="group flex items-baseline gap-3 py-2.5">
                  <span className="w-24 shrink-0 text-xs font-bold text-muted">
                    <Bi en={proofMonth(p.date, "en-GB")} fr={proofMonth(p.date, "fr-FR")} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-extrabold group-hover:text-mauve">{p.company}</span>
                    <span className="block truncate text-xs text-muted">
                      <span className="font-bold text-mauve">{p.solution}</span> · <Bi en={p.sector} fr={sectorFr(p.sector)} />
                    </span>
                  </span>
                  <span className="text-mauve transition-transform group-hover:translate-x-0.5" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <a href="#index" className="mt-2 inline-block text-sm font-bold text-mauve hover:underline">
            <Bi en="See every recent proof →" fr="Voir toutes les preuves récentes →" />
          </a>
        </div>
      </div>
    </section>
  );
}
