"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Entry } from "@/lib/types";
import { ConfidenceBadge, StageBadge } from "@/components/badges";
import { hostOf } from "@/lib/format";
import { useLang, type Lang } from "@/lib/lang";
import Bi from "@/components/Bi";

type ConfidenceFilter = "any" | "high" | "medium" | "independent";
type SortKey = "az" | "newest" | "confidence";

interface Filters {
  q: string;
  sector: string;
  region: string;
  country: string;
  industry: string;
  department: string;
  vendor: string;
  stage: string;
  confidence: ConfidenceFilter;
}

const EMPTY: Filters = {
  q: "",
  sector: "",
  region: "",
  country: "",
  industry: "",
  department: "",
  vendor: "",
  stage: "",
  confidence: "any",
};

const MARKETING = new Set(["vendor_case_study", "press_release"]);

const STR = {
  en: {
    placeholder: "Search company, solution, vendor or use case…  (press / to focus)",
    sector: "Sector", region: "Region", country: "Country", industry: "Industry",
    department: "Department", vendor: "Vendor", stage: "Stage", confidence: "Confidence",
    sort: "Sort", allSectors: "All sectors", allRegions: "All regions", allCountries: "All countries",
    allIndustries: "All industries", allDepartments: "All departments", allVendors: "All vendors",
    allStages: "All stages", anyConfidence: "Any confidence",
    prod: "In production", pilot: "Pilot", announced: "Announced", unknown: "Unknown",
    high: "High (≥ 70%)", medium: "Medium+ (≥ 50%)", independent: "Independently sourced",
    az: "Company A–Z", newest: "Newest first", conf: "Confidence first",
    of: "of", deployments: "deployments", reset: "Reset all filters",
    dataNote: "Entry records are written in English.",
  },
  fr: {
    placeholder: "Rechercher une entreprise, une solution, un éditeur…  (touche / pour cibler)",
    sector: "Secteur", region: "Région", country: "Pays", industry: "Industrie",
    department: "Département", vendor: "Éditeur", stage: "Statut", confidence: "Confiance",
    sort: "Tri", allSectors: "Tous les secteurs", allRegions: "Toutes les régions", allCountries: "Tous les pays",
    allIndustries: "Toutes les industries", allDepartments: "Tous les départements", allVendors: "Tous les éditeurs",
    allStages: "Tous les statuts", anyConfidence: "Toute confiance",
    prod: "En production", pilot: "Pilote", announced: "Annoncé", unknown: "Inconnu",
    high: "Élevée (≥ 70 %)", medium: "Moyenne+ (≥ 50 %)", independent: "Sources indépendantes",
    az: "Entreprise A–Z", newest: "Plus récents", conf: "Confiance d'abord",
    of: "sur", deployments: "déploiements", reset: "Réinitialiser les filtres",
    dataNote: "Les fiches sont rédigées en anglais.",
  },
} satisfies Record<Lang, Record<string, string>>;

function uniqueValues(entries: Entry[], key: keyof Entry): string[] {
  return [...new Set(entries.map((e) => String(e[key])).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function matches(e: Entry, f: Filters): boolean {
  if (f.sector && e.sector !== f.sector) return false;
  if (f.region && e.region !== f.region) return false;
  if (f.country && e.company_country !== f.country) return false;
  if (f.industry && e.industry !== f.industry) return false;
  if (f.department && e.department !== f.department) return false;
  if (f.vendor && e.vendor !== f.vendor) return false;
  if (f.stage && e.deployment_stage !== f.stage) return false;
  if (f.confidence === "high" && e.confidence < 0.7) return false;
  if (f.confidence === "medium" && e.confidence < 0.5) return false;
  if (f.confidence === "independent" && e.sources.every((s) => MARKETING.has(s.source_type)))
    return false;
  if (f.q) {
    const hay = [e.company, e.solution_name, e.vendor, e.use_case, e.company_country, e.industry, e.sector]
      .join(" ")
      .toLowerCase();
    if (!hay.includes(f.q.toLowerCase())) return false;
  }
  return true;
}

function Select({
  label,
  value,
  onChange,
  options,
  anyLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  anyLabel: string;
}) {
  return (
    <label className="flex min-w-36 flex-1 flex-col gap-1 sm:flex-none">
      <span className="kicker text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-lavender-line bg-paper px-2.5 py-2 text-sm text-ink outline-none transition-colors focus:border-mauve"
      >
        <option value="">{anyLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Explorer({ entries }: { entries: Entry[] }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState<SortKey>("az");
  const [lang] = useLang();
  const t = STR[lang];
  const searchRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<Filters>) => setF((prev) => ({ ...prev, ...patch }));

  // "/" focuses the search from anywhere on the page.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.scrollIntoView({ block: "center" });
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  const results = useMemo(() => {
    const list = entries.filter((e) => matches(e, f));
    if (sort === "newest")
      list.sort((a, b) => b.first_seen_date.localeCompare(a.first_seen_date) || a.company.localeCompare(b.company));
    else if (sort === "confidence")
      list.sort((a, b) => b.confidence - a.confidence || a.company.localeCompare(b.company));
    else list.sort((a, b) => a.company.localeCompare(b.company));
    return list;
  }, [entries, f, sort]);

  const active = JSON.stringify(f) !== JSON.stringify(EMPTY);
  const opt = (vals: string[]) => vals.map((v) => ({ value: v, label: v }));

  // Active-filter chips (label shown, one-click removal).
  const chips: { key: keyof Filters; label: string }[] = [];
  if (f.q) chips.push({ key: "q", label: `“${f.q}”` });
  (["sector", "region", "country", "industry", "department", "vendor"] as const).forEach((k) => {
    if (f[k]) chips.push({ key: k, label: f[k] });
  });
  if (f.stage) chips.push({ key: "stage", label: { production: t.prod, pilot: t.pilot, announced: t.announced, unknown: t.unknown }[f.stage] ?? f.stage });
  if (f.confidence !== "any")
    chips.push({ key: "confidence", label: { high: t.high, medium: t.medium, independent: t.independent, any: "" }[f.confidence] });

  return (
    <div className="mt-8">
      {/* ===== Toolbar ===== */}
      <div className="rounded-2xl border border-lavender-line bg-lilac-soft p-4 md:p-5">
        <input
          ref={searchRef}
          type="search"
          value={f.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          className="w-full rounded-xl border border-lavender-line bg-paper px-4 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-muted focus:border-mauve"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          {uniqueValues(entries, "sector").length > 1 && (
            <Select label={t.sector} value={f.sector} onChange={(v) => set({ sector: v })} options={opt(uniqueValues(entries, "sector"))} anyLabel={t.allSectors} />
          )}
          <Select label={t.region} value={f.region} onChange={(v) => set({ region: v })} options={opt(uniqueValues(entries, "region"))} anyLabel={t.allRegions} />
          <Select label={t.country} value={f.country} onChange={(v) => set({ country: v })} options={opt(uniqueValues(entries, "company_country"))} anyLabel={t.allCountries} />
          <Select label={t.industry} value={f.industry} onChange={(v) => set({ industry: v })} options={opt(uniqueValues(entries, "industry"))} anyLabel={t.allIndustries} />
          <Select label={t.department} value={f.department} onChange={(v) => set({ department: v })} options={opt(uniqueValues(entries, "department"))} anyLabel={t.allDepartments} />
          <Select label={t.vendor} value={f.vendor} onChange={(v) => set({ vendor: v })} options={opt(uniqueValues(entries, "vendor"))} anyLabel={t.allVendors} />
          <Select
            label={t.stage}
            value={f.stage}
            onChange={(v) => set({ stage: v })}
            options={[
              { value: "production", label: t.prod },
              { value: "pilot", label: t.pilot },
              { value: "announced", label: t.announced },
              { value: "unknown", label: t.unknown },
            ]}
            anyLabel={t.allStages}
          />
          <Select
            label={t.confidence}
            value={f.confidence}
            onChange={(v) => set({ confidence: v as ConfidenceFilter })}
            options={[
              { value: "high", label: t.high },
              { value: "medium", label: t.medium },
              { value: "independent", label: t.independent },
            ]}
            anyLabel={t.anyConfidence}
          />
          <Select
            label={t.sort}
            value={sort}
            onChange={(v) => setSort(v as SortKey)}
            options={[
              { value: "newest", label: t.newest },
              { value: "confidence", label: t.conf },
            ]}
            anyLabel={t.az}
          />
        </div>

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <button
                key={c.key}
                onClick={() => set({ [c.key]: c.key === "confidence" ? "any" : "" } as Partial<Filters>)}
                className="inline-flex items-center gap-1.5 rounded-full bg-mauve px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-mauve-deep"
              >
                {c.label}
                <span aria-hidden>✕</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            <span className="font-bold text-ink">{results.length}</span> {t.of} {entries.length}{" "}
            {t.deployments}
            <span className="lang-fr"> · {STR.fr.dataNote}</span>
          </p>
          {active && (
            <button
              onClick={() => setF(EMPTY)}
              className="text-sm font-bold text-mauve transition-colors hover:text-mauve-deep"
            >
              {t.reset}
            </button>
          )}
        </div>
      </div>

      {/* ===== Results ===== */}
      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-lavender-line p-12 text-center">
          {entries.length === 0 ? (
            <>
              <p className="text-lg font-bold">
                <Bi en="The catalog is empty right now." fr="Le catalogue est vide pour le moment." />
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                <Bi
                  en="The curation engine has not completed its first discovery run yet. Entries appear here automatically once verified deployments are found."
                  fr="Le moteur de curation n'a pas encore terminé sa première collecte. Les fiches apparaîtront ici dès que des déploiements vérifiés seront trouvés."
                />
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold">
                <Bi en="No deployment matches these filters." fr="Aucun déploiement ne correspond à ces filtres." />
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                <Bi
                  en="Your search and filters excluded every entry. Loosen a filter or clear everything to start over."
                  fr="Votre recherche et vos filtres excluent toutes les fiches. Élargissez un filtre ou réinitialisez tout pour repartir de zéro."
                />
              </p>
              <button
                onClick={() => setF(EMPTY)}
                className="mt-5 rounded-full bg-mauve px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-mauve-deep"
              >
                {t.reset}
              </button>
            </>
          )}
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 pb-4 md:grid-cols-2">
          {results.map((e, i) => (
            <li key={e.id} className="card-in" style={{ "--i": Math.min(i, 12) } as React.CSSProperties}>
              <Link
                href={`/entry/${e.id}`}
                className="group flex h-full flex-col rounded-2xl border border-lavender-line bg-paper p-5 transition-all hover:-translate-y-0.5 hover:border-mauve hover:shadow-[0_10px_30px_-12px_rgb(107_43_217/0.35)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-extrabold leading-snug">{e.company}</p>
                    <p className="mt-0.5 text-sm font-bold text-mauve">
                      {e.solution_name}
                      {e.vendor && e.vendor !== e.solution_name && (
                        <span className="font-semibold text-muted"> · {e.vendor}</span>
                      )}
                    </p>
                  </div>
                  <span className="kicker shrink-0 rounded bg-lilac px-2 py-1 text-mauve-deep">
                    {e.region}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
                  {e.use_case}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <StageBadge stage={e.deployment_stage} />
                  <ConfidenceBadge entry={e} />
                  <span className="ml-auto text-xs text-muted">
                    {e.sources.length} source{e.sources.length > 1 ? "s" : ""}
                    {e.sources[0] ? ` · ${hostOf(e.sources[0].url)}` : ""}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
