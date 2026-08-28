"use client";

// Custom lead form that replicates the HUB Institute "Agentic Business Advisory"
// form ("Être recontacté sous 24h") and posts straight to it via the HubSpot
// Forms Submission API. Targeting the same form means HubSpot records a real
// submission — the lead lands in the CRM and the form's notification emails fire
// like the native embed. Bilingual, in the Agentic palette with the HUB pink CTA.
import { useState } from "react";
import { useLang } from "@/lib/lang";

const PORTAL = "1722292";
const FORM = "a66f349c-b358-43fe-ae5c-a99c14391429"; // "Être recontacté sous 24h"
const ENDPOINT = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL}/${FORM}`;

const T = {
  fr: {
    firstname: "Prénom", lastname: "Nom", email: "Email professionnel", company: "Entreprise",
    jobtitle: "Fonction", context: "Votre contexte en deux lignes",
    emailPh: "prenom.nom@entreprise.com", contextPh: "Secteur, périmètre pressenti, échéance…",
    submit: "Être recontacté sous 24h", sending: "Envoi…",
    success: "Merci pour votre demande ! Elle a bien été partagée à notre équipe. Nous revenons vers vous très rapidement.",
    error: "Une erreur est survenue. Réessayez ou écrivez-nous à contact@hubinstitute.com.",
    consent: "En envoyant ce formulaire, vous acceptez que le HUB Institute traite vos données pour répondre à votre demande.",
  },
  en: {
    firstname: "First name", lastname: "Last name", email: "Work email", company: "Company",
    jobtitle: "Job title", context: "Your context in two lines",
    emailPh: "first.last@company.com", contextPh: "Sector, likely scope, timeline…",
    submit: "Get a call back within 24h", sending: "Sending…",
    success: "Thank you for your request! It has been shared with our team. We'll get back to you very soon.",
    error: "Something went wrong. Please retry or email us at contact@hubinstitute.com.",
    consent: "By submitting this form, you agree that HUB Institute processes your data to answer your request.",
  },
} as const;

type Fields = { firstname: string; lastname: string; email: string; company: string; jobtitle: string; context: string };
const EMPTY: Fields = { firstname: "", lastname: "", email: "", company: "", jobtitle: "", context: "" };

export default function HubspotForm() {
  const [lang] = useLang();
  const t = T[lang];
  const [f, setF] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const set = (k: keyof Fields, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const hutk = (document.cookie.match(/hubspotutk=([^;]+)/) || [])[1];
    const fields: { objectTypeId: string; name: string; value: string }[] = [
      { objectTypeId: "0-1", name: "firstname", value: f.firstname },
      { objectTypeId: "0-1", name: "lastname", value: f.lastname },
      { objectTypeId: "0-1", name: "email", value: f.email },
      { objectTypeId: "0-1", name: "company", value: f.company },
    ];
    if (f.jobtitle.trim()) fields.push({ objectTypeId: "0-1", name: "jobtitle", value: f.jobtitle });
    if (f.context.trim()) fields.push({ objectTypeId: "0-2", name: "description", value: f.context });
    const body = {
      submittedAt: Date.now(),
      fields,
      context: { pageUri: window.location.href, pageName: document.title, ...(hutk ? { hutk } : {}) },
    };
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-xl bg-[#f4f6fa] p-6 text-center text-sm font-semibold text-[#1a2340]">
        {t.success}
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-[#e2e8f0] bg-[#f4f6fa] px-4 py-3 text-sm text-[#1a2340] outline-none transition-colors placeholder:text-[#9aa4bd] focus:border-[#e11e8c] focus:bg-white";
  const labelCls = "mb-1.5 block text-sm font-bold text-[#1a2340]";
  const req = <span className="text-[#e11e8c]">*</span>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className={labelCls}>{t.firstname}{req}</span>
          <input className={inputCls} required value={f.firstname} onChange={(e) => set("firstname", e.target.value)} />
        </label>
        <label>
          <span className={labelCls}>{t.lastname}{req}</span>
          <input className={inputCls} required value={f.lastname} onChange={(e) => set("lastname", e.target.value)} />
        </label>
        <label>
          <span className={labelCls}>{t.email}{req}</span>
          <input type="email" placeholder={t.emailPh} className={inputCls} required value={f.email} onChange={(e) => set("email", e.target.value)} />
        </label>
        <label>
          <span className={labelCls}>{t.company}{req}</span>
          <input className={inputCls} required value={f.company} onChange={(e) => set("company", e.target.value)} />
        </label>
      </div>
      <label className="block">
        <span className={labelCls}>{t.jobtitle}</span>
        <input className={inputCls} value={f.jobtitle} onChange={(e) => set("jobtitle", e.target.value)} />
      </label>
      <label className="block">
        <span className={labelCls}>{t.context}</span>
        <textarea placeholder={t.contextPh} className={`${inputCls} min-h-[96px] resize-y`} value={f.context} onChange={(e) => set("context", e.target.value)} />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-[#e11e8c] px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#c4157a] disabled:opacity-60"
      >
        {status === "sending" ? t.sending : t.submit}
      </button>
      {status === "error" && <p className="text-xs font-semibold text-[#c4157a]">{t.error}</p>}
      <p className="text-[0.68rem] leading-relaxed text-[#9aa4bd]">{t.consent}</p>
    </form>
  );
}
