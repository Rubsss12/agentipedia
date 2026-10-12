"use client";

// The weekly sector alert, placed after the index. It needs its own HubSpot
// form (an alert sign-up must not land in the "call me back" sales form):
// set ALERT_FORM to that form's GUID and the block posts to it, with the
// sector in the "message" field. Until then it falls back to a pre-filled
// email to the team, so no sign-up is ever silently dropped.
import { useState } from "react";
import { useLang } from "@/lib/lang";

const PORTAL = "1722292";
const ALERT_FORM = "";

export default function AlertSignup({ sectors }: { sectors: { en: string; fr: string }[] }) {
  const [lang] = useLang();
  const fr = lang === "fr";
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const label = sectors.find((s) => s.en === sector);
    const sectorName = label ? (fr ? label.fr : label.en) : "";
    if (!ALERT_FORM) {
      const subject = fr ? `Alerte Agentipedia : ${sectorName}` : `Agentipedia alert: ${sectorName}`;
      const body = fr
        ? `Bonjour,\n\nJe souhaite recevoir chaque semaine les nouveaux déploiements vérifiés du secteur « ${sectorName} ».\n\nEmail : ${email}`
        : `Hello,\n\nI would like to receive the newly verified deployments in the "${sectorName}" sector every week.\n\nEmail: ${email}`;
      window.location.href = `mailto:contact@hubinstitute.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("done");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL}/${ALERT_FORM}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submittedAt: Date.now(),
          fields: [
            { objectTypeId: "0-1", name: "email", value: email },
            { objectTypeId: "0-1", name: "message", value: `Alerte Agentipedia : ${sector}` },
          ],
          context: { pageUri: window.location.href, pageName: document.title },
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const input =
    "w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-[#e11e8c]";

  return (
    <div className="grid gap-6 rounded-3xl bg-mauve-night p-6 text-white md:grid-cols-[1fr_1.1fr] md:items-center md:p-9">
      <div>
        <p className="kicker text-mauve-bright">{fr ? "Alerte sectorielle" : "Sector alert"}</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
          {fr ? "Ne manquez aucun déploiement dans votre secteur" : "Never miss a deployment in your sector"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {fr
            ? "Chaque semaine, les nouvelles fiches vérifiées de votre secteur et la lecture qu'en font nos analystes."
            : "Every week, the newly verified entries in your sector and our analysts' take on them."}
        </p>
      </div>
      {status === "done" ? (
        <p className="rounded-2xl bg-white/10 p-5 text-sm font-semibold">
          {ALERT_FORM
            ? fr
              ? "C'est noté : vous recevrez la prochaine alerte de votre secteur."
              : "Done: you will receive the next alert for your sector."
            : fr
              ? "Votre messagerie s'est ouverte avec la demande pré-remplie : il ne reste qu'à l'envoyer."
              : "Your email app opened with the request pre-filled: just send it."}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="sr-only" htmlFor="alert-email">{fr ? "Email professionnel" : "Work email"}</label>
          <input
            id="alert-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={fr ? "Email professionnel" : "Work email"}
            className={input}
          />
          <label className="sr-only" htmlFor="alert-sector">{fr ? "Votre secteur" : "Your sector"}</label>
          <select id="alert-sector" required value={sector} onChange={(e) => setSector(e.target.value)} className={input}>
            <option value="">{fr ? "Votre secteur" : "Your sector"}</option>
            {sectors.map((s) => (
              <option key={s.en} value={s.en}>
                {fr ? s.fr : s.en}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-[#e11e8c] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#c4157a] disabled:opacity-60"
          >
            {fr ? "Recevoir l'alerte" : "Get the alert"}
          </button>
          {status === "error" && (
            <p className="text-xs font-semibold text-[#ff9fd0] sm:col-span-3">
              {fr ? "Une erreur est survenue, réessayez." : "Something went wrong, please retry."}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
