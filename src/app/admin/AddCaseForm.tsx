"use client";

// Formulaire d'ajout manuel d'un cas. Poste vers /api/add-case (worker
// Cloudflare), qui valide à nouveau côté serveur puis commite la fiche dans
// data/manual-cases.json — le site se reconstruit et se redéploie tout seul.
import { useState } from "react";

const SECTORS = ["Financial Services","Insurance","Healthcare & Life Sciences","Retail & E-commerce","Consumer Goods & Manufacturing","Automotive & Mobility","Technology & Software","Telecommunications","Media & Entertainment","Travel & Transportation","Hospitality & Food","Energy & Utilities","Public Sector & Education","Professional & Business Services"];
const REGIONS = ["North America","Latin America","Europe","Middle East","Africa","South Asia","East Asia","Southeast Asia","Oceania","Antarctica"];
const STAGES: [string, string][] = [["production","En production"],["pilot","Pilote"],["announced","Annoncé"],["unknown","Inconnu"]];
const STYPES: [string, string][] = [["company_official","Source officielle de l'entreprise"],["news_media","Presse"],["earnings_call","Résultats financiers"],["conference_talk","Conférence"],["vendor_case_study","Étude de cas éditeur"],["press_release","Communiqué"],["other","Autre"]];
const CHAINS: [string, string][] = [["","— sans score CODA™ —"],["care","Parcours service client"],["commerce","Parcours d'achat"],["achats","Processus achats"],["fonctions","Fonctions de l'entreprise"],["pilotage","Chaîne de pilotage"],["ops","Opérations industrielles"],["fraude","Risque & fraude"],["revenue","Pricing & revenue"],["claims","Chaîne sinistres"],["soin","Parcours de soin"],["delivery","Chaîne delivery"],["science","Chaîne scientifique"],["public","Parcours usager"],["supply","Supply chain"],["vente","Cycle de vente B2B"]];
const LOCKS: [string, string][] = [["data","donnée fiable"],["mandate","mandat écrit"],["supervision","supervision outillée"],["compliance","conformité auditée"]];

const input = "w-full rounded-lg border border-lavender-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-mauve";
const label = "mb-1.5 block text-[0.7rem] font-bold uppercase tracking-wider text-muted";

export default function AddCaseForm() {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    password: "", company: "", solution_name: "", company_country: "",
    region: "Europe", sector: SECTORS[0], industry: "", department: "", vendor: "",
    use_case: "", deployment_stage: "production",
    src_url: "", src_title: "", src_publisher: "", src_type: "company_official", src_date: today,
    out_metric: "", out_value: "",
    chain: "", links: "", observed: "2", basis: "",
  });
  const [locks, setLocks] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [added, setAdded] = useState<{ company: string; solution: string } | null>(null);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]); setState("sending");
    const body: Record<string, unknown> = {
      password: f.password,
      company: f.company, solution_name: f.solution_name, company_country: f.company_country,
      region: f.region, sector: f.sector, industry: f.industry, department: f.department,
      vendor: f.vendor, use_case: f.use_case, deployment_stage: f.deployment_stage,
      sources: f.src_url.trim()
        ? [{ url: f.src_url, title: f.src_title, publisher: f.src_publisher, source_type: f.src_type, retrieved_date: f.src_date }]
        : [],
      reported_outcomes: f.out_metric && f.out_value ? [{ metric: f.out_metric, value: f.out_value, source_type: f.src_type }] : [],
    };
    if (f.chain) {
      body.coda = {
        chain: f.chain,
        links: f.links.replace(/\D/g, "").split("").map(Number),
        observed: Number(f.observed), locks, basis_fr: f.basis, basis_en: f.basis,
      };
    }
    // Posted to the pages.dev origin on purpose: on the custom domain the
    // hubinstitute.com bot challenge answers /api/ with an HTML interstitial
    // before the request ever reaches the worker.
    const endpoint = "https://agentipedia.pages.dev/api/add-case";
    try {
      const res = await fetch(endpoint, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
      });
      const raw = await res.text();
      let data: { ok?: boolean; errors?: string[]; company?: string; solution?: string };
      try {
        data = JSON.parse(raw);
      } catch {
        setErrors([`Réponse inattendue du serveur (code ${res.status}). Réessayez, et si cela persiste prévenez Rubens.`]);
        setState("idle");
        return;
      }
      if (!res.ok || !data.ok) { setErrors(data.errors || [`Erreur ${res.status}.`]); setState("idle"); return; }
      setAdded({ company: data.company!, solution: data.solution! });
      setState("done");
    } catch (err) {
      setErrors([`Connexion au serveur impossible (${err instanceof Error ? err.message : "réseau"}). Vérifiez votre connexion et réessayez.`]);
      setState("idle");
    }
  }

  if (state === "done" && added) {
    return (
      <div className="rounded-2xl border border-lavender-line bg-lilac-soft p-8 text-center">
        <p className="text-lg font-extrabold">Fiche ajoutée ✓</p>
        <p className="mt-2 text-sm text-ink-soft">
          <strong>{added.company} × {added.solution}</strong> a été enregistrée.
          Le site se reconstruit automatiquement : la fiche sera en ligne dans une à deux minutes.
        </p>
        <button
          onClick={() => { setAdded(null); setState("idle"); setF((p) => ({ ...p, company: "", solution_name: "", use_case: "", src_url: "", src_title: "", src_publisher: "", out_metric: "", out_value: "", links: "", basis: "" })); setLocks([]); }}
          className="mt-5 rounded-full bg-mauve px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-mauve-deep"
        >
          Ajouter un autre cas
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8">
      <div className="rounded-2xl border border-lavender-line bg-lilac-soft p-5">
        <label className={label}>Mot de passe de l&apos;équipe</label>
        <input type="password" className={input} value={f.password} required autoComplete="current-password"
          onChange={(e) => set("password", e.target.value)} placeholder="••••••••" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Entreprise *</label><input className={input} required value={f.company} onChange={(e) => set("company", e.target.value)} placeholder="Nom exact, jamais générique" /></div>
        <div><label className={label}>Agent / solution *</label><input className={input} required value={f.solution_name} onChange={(e) => set("solution_name", e.target.value)} placeholder="Nom public de l'agent" /></div>
        <div><label className={label}>Pays *</label><input className={input} required value={f.company_country} onChange={(e) => set("company_country", e.target.value)} placeholder="France, United States…" /></div>
        <div><label className={label}>Région *</label><select className={input} value={f.region} onChange={(e) => set("region", e.target.value)}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></div>
        <div><label className={label}>Secteur *</label><select className={input} value={f.sector} onChange={(e) => set("sector", e.target.value)}>{SECTORS.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className={label}>Industrie</label><input className={input} value={f.industry} onChange={(e) => set("industry", e.target.value)} placeholder="Sous-secteur" /></div>
        <div><label className={label}>Département</label><input className={input} value={f.department} onChange={(e) => set("department", e.target.value)} placeholder="Service client, Sinistres…" /></div>
        <div><label className={label}>Éditeur</label><input className={input} value={f.vendor} onChange={(e) => set("vendor", e.target.value)} placeholder="Éditeur, In-house, ou vide" /></div>
        <div><label className={label}>Stade</label><select className={input} value={f.deployment_stage} onChange={(e) => set("deployment_stage", e.target.value)}>{STAGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        <div className="sm:col-span-2"><label className={label}>Ce que fait l&apos;agent *</label><textarea className={`${input} min-h-24`} required value={f.use_case} onChange={(e) => set("use_case", e.target.value)} placeholder="Le périmètre fonctionnel, tel que la source le décrit." /></div>
      </div>

      <div className="mt-8 border-t border-lavender-line pt-6">
        <p className="kicker text-mauve">La source <span className="normal-case tracking-normal text-muted">(facultative)</span></p>
        <p className="mt-1 text-sm text-muted">Avec une source, la fiche est marquée « Confirmé ». Sans source, elle est publiée comme cas transmis par l&apos;équipe.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className={label}>URL</label><input className={input} type="url" value={f.src_url} onChange={(e) => set("src_url", e.target.value)} placeholder="https://…" /></div>
          <div><label className={label}>Titre de la page</label><input className={input} value={f.src_title} onChange={(e) => set("src_title", e.target.value)} /></div>
          <div><label className={label}>Éditeur de la page</label><input className={input} value={f.src_publisher} onChange={(e) => set("src_publisher", e.target.value)} /></div>
          <div><label className={label}>Type</label><select className={input} value={f.src_type} onChange={(e) => set("src_type", e.target.value)}>{STYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
          <div><label className={label}>Date de consultation</label><input className={input} value={f.src_date} onChange={(e) => set("src_date", e.target.value)} placeholder="AAAA-MM-JJ" /></div>
        </div>
      </div>

      <div className="mt-8 border-t border-lavender-line pt-6">
        <p className="kicker text-mauve">Résultat rapporté <span className="normal-case tracking-normal text-muted">(optionnel)</span></p>
        <p className="mt-1 text-sm text-muted">Un chiffre absent des sources n&apos;existe pas sur la fiche : laissez vide si rien n&apos;est publié.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className={label}>Ce qui est mesuré</label><input className={input} value={f.out_metric} onChange={(e) => set("out_metric", e.target.value)} placeholder="Demandes traitées par mois" /></div>
          <div><label className={label}>Valeur publiée</label><input className={input} value={f.out_value} onChange={(e) => set("out_value", e.target.value)} placeholder="120 000" /></div>
        </div>
      </div>

      <div className="mt-8 border-t border-lavender-line pt-6">
        <p className="kicker text-mauve">Score CODA™ <span className="normal-case tracking-normal text-muted">(optionnel)</span></p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className={label}>Chaîne de valeur</label><select className={input} value={f.chain} onChange={(e) => set("chain", e.target.value)}>{CHAINS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
          <div><label className={label}>Autonomie observée</label><select className={input} value={f.observed} onChange={(e) => set("observed", e.target.value)}><option value="1">N1 · propose</option><option value="2">N2 · prépare</option><option value="3">N3 · exécute</option><option value="4">N4 · transige</option></select></div>
          <div className="sm:col-span-2"><label className={label}>Les 10 maillons — 0 rien · 1 partiel · 2 plein</label><input className={input} value={f.links} onChange={(e) => set("links", e.target.value)} placeholder="2120000000" maxLength={14} /></div>
          <div className="sm:col-span-2">
            <label className={label}>Verrous avec preuve publique</label>
            <div className="flex flex-wrap gap-4 text-sm">
              {LOCKS.map(([v, l]) => (
                <label key={v} className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={locks.includes(v)}
                    onChange={(e) => setLocks((p) => e.target.checked ? [...p, v] : p.filter((x) => x !== v))} />
                  {l}
                </label>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2"><label className={label}>Ligne de preuve</label><textarea className={`${input} min-h-20`} value={f.basis} onChange={(e) => set("basis", e.target.value)} placeholder="Ce qui atteste le niveau : volumes, taux, ce que l'agent exécute." /></div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mt-6 rounded-xl bg-warn-bg px-4 py-3 text-sm text-warn">
          <strong>Fiche refusée — {errors.length} point{errors.length > 1 ? "s" : ""} à corriger :</strong>
          <ul className="mt-2 list-disc pl-5">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "sending"}
          className="rounded-full bg-[#e11e8c] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#c4157a] disabled:opacity-60">
          {state === "sending" ? "Envoi…" : "Ajouter la fiche au site"}
        </button>
        <span className="text-xs text-muted">La fiche est en ligne une à deux minutes après l&apos;envoi.</span>
      </div>
    </form>
  );
}
