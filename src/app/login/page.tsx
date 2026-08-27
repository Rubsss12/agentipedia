"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase, ALLOWED_DOMAIN } from "@/lib/supabase";
import { useLang } from "@/lib/lang";
import Bi from "@/components/Bi";
import s from "./login.module.css";

// The Agentipedia front door. Passwordless magic link, restricted to
// @hubinstitute.com for now. Lives at "/", full-screen (no app chrome); the
// catalog lives behind it at /explorer. Because Supabase's default Site URL is
// the app root, the magic link returns here and the session is captured.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function LoginPage() {
  const [lang, setLang] = useLang();
  const fr = lang === "fr";
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [who, setWho] = useState<string | null>(null);
  const redirectTo = useRef<string>("");

  useEffect(() => {
    redirectTo.current = window.location.origin + window.location.pathname;
    supabase.auth.getSession().then(({ data }) => setWho(data.session?.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setWho(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = email.trim();
    if (!EMAIL_RE.test(v)) {
      setErr(fr ? "Entrez une adresse email valide." : "Enter a valid email address.");
      return;
    }
    if (ALLOWED_DOMAIN && v.toLowerCase().slice(-(ALLOWED_DOMAIN.length + 1)) !== "@" + ALLOWED_DOMAIN) {
      setErr(
        fr
          ? `Accès réservé aux adresses @${ALLOWED_DOMAIN} pour le moment.`
          : `Access reserved for @${ALLOWED_DOMAIN} addresses for now.`,
      );
      return;
    }
    setErr(null);
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: v,
      options: { emailRedirectTo: redirectTo.current, shouldCreateUser: true },
    });
    setSending(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
  }

  async function logout() {
    await supabase.auth.signOut();
    setWho(null);
    setSent(false);
  }

  return (
    <main className={s.page}>
      <div className={s.shell}>
        {/* ===== brand panel ===== */}
        <section className={s.brand}>
          <div className={s.gridLines} aria-hidden />
          <div className={s.hubmark}>
            <span className={s.sq}>
              HUB<small>INSTITUTE</small>
            </span>
            <span className={s.wm}>
              <Bi en="the observatory of the agentic enterprise" fr="l'observatoire de l'entreprise agentique" />
            </span>
          </div>

          <div className={s.lead}>
            <p className={s.eyebrow}>Agentipedia</p>
            <h1>
              <Bi
                en={<>AI agents,<br /><em>as attested.</em></>}
                fr={<>Les agents IA<br /><em>au constat.</em></>}
              />
            </h1>
            <p className={s.sub}>
              <Bi
                en="The catalog of verified deployments, each scored on the HUB Institute CODA™ matrix. Sign in to reach the diagnostic."
                fr="Le catalogue des déploiements vérifiés, chacun scoré sur la matrice CODA™ du HUB Institute. Connectez-vous pour accéder au diagnostic."
              />
            </p>
          </div>

          <div className={s.motif}>
            <p className={s.cap}>
              <Bi en="The CODA™ scoring map" fr="La carte du scoring CODA™" />
            </p>
            <svg viewBox="0 0 360 150" role="img" aria-label="CODA scoring map">
              <rect x="30" y="8" width="150" height="61" fill="#e0a43b" opacity=".16" />
              <rect x="180" y="8" width="150" height="61" fill="#8f7bff" opacity=".18" />
              <rect x="30" y="69" width="150" height="61" fill="#9aa6b8" opacity=".12" />
              <rect x="180" y="69" width="150" height="61" fill="#4e77b0" opacity=".16" />
              <line x1="180" y1="8" x2="180" y2="130" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
              <line x1="30" y1="69" x2="330" y2="69" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
              <text x="20" y="24" fill="#fff" fillOpacity=".55" fontSize="8" fontWeight="700" textAnchor="end">N4</text>
              <text x="20" y="55" fill="#fff" fillOpacity=".55" fontSize="8" fontWeight="700" textAnchor="end">N3</text>
              <text x="20" y="86" fill="#fff" fillOpacity=".55" fontSize="8" fontWeight="700" textAnchor="end">N2</text>
              <text x="20" y="117" fill="#fff" fillOpacity=".55" fontSize="8" fontWeight="700" textAnchor="end">N1</text>
              <g>
                <circle cx="66" cy="112" r="3.2" fill="#9aa6b8" /><circle cx="86" cy="104" r="3.2" fill="#9aa6b8" />
                <circle cx="104" cy="112" r="3.2" fill="#9aa6b8" /><circle cx="120" cy="96" r="3.2" fill="#9aa6b8" />
                <circle cx="138" cy="104" r="3.2" fill="#9aa6b8" /><circle cx="96" cy="88" r="3.2" fill="#9aa6b8" />
                <circle cx="212" cy="96" r="3.2" fill="#4e77b0" /><circle cx="236" cy="104" r="3.2" fill="#4e77b0" />
                <circle cx="120" cy="50" r="3.4" fill="#e0a43b" /><circle cx="140" cy="42" r="3.4" fill="#e0a43b" />
                <circle cx="158" cy="50" r="3.4" fill="#e0a43b" /><circle cx="132" cy="58" r="3.4" fill="#e0a43b" />
                <circle cx="210" cy="46" r="3.6" fill="#c9b6ff" />
                <circle cx="150" cy="50" r="6.4" fill="none" stroke="#f2b25a" strokeWidth="1.6" />
              </g>
            </svg>
          </div>

          <div className={s.stats}>
            <div><div className={s.n}>90</div><div className={s.l}><Bi en="verified deployments" fr="déploiements vérifiés" /></div></div>
            <div><div className={s.n}>N1–N4</div><div className={s.l}><Bi en="autonomy, as attested" fr="autonomie au constat" /></div></div>
            <div><div className={s.n}>7</div><div className={s.l}><Bi en="continents" fr="continents" /></div></div>
          </div>
        </section>

        {/* ===== auth card ===== */}
        <section className={s.auth}>
          <div className={s.topbar}>
            <button type="button" className={fr ? s.on : ""} onClick={() => setLang("fr")}>FR</button>
            <button type="button" className={!fr ? s.on : ""} onClick={() => setLang("en")}>EN</button>
          </div>

          {who ? (
            <div className={s.session}>
              <div className={s.sentIc}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <div>
                <b><Bi en="Welcome" fr="Bienvenue" /></b>
                <p className={s.hintText} style={{ marginTop: 6 }}>
                  <Bi en="Signed in as" fr="Connecté en tant que" /> <strong>{who}</strong>.
                </p>
              </div>
              <Link className={`${s.btn} ${s.primary}`} href="/">
                <Bi en="Enter Agentipedia →" fr="Entrer dans Agentipedia →" />
              </Link>
              <button type="button" className={s.linkbtn} onClick={logout}>
                <Bi en="Sign out" fr="Se déconnecter" />
              </button>
            </div>
          ) : sent ? (
            <div className={s.sent}>
              <div className={s.sentIc}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 6 12 13 2 6" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
              </div>
              <div>
                <b><Bi en="Check your inbox" fr="Vérifiez votre boîte mail" /></b>
                <p className={s.hintText} style={{ marginTop: 8 }}>
                  <Bi en="We sent a sign-in link to" fr="Nous avons envoyé un lien de connexion à" />{" "}
                  <strong>{email.trim()}</strong>.{" "}
                  <Bi en="Click it to enter Agentipedia." fr="Cliquez dessus pour entrer dans Agentipedia." />
                </p>
              </div>
              <p className={s.foot}>
                <Bi en="Nothing yet?" fr="Rien reçu ?" />{" "}
                <button type="button" className={s.linkbtn} onClick={() => submit(new Event("submit") as unknown as React.FormEvent)}>
                  <Bi en="Resend" fr="Renvoyer" />
                </button>{" "}·{" "}
                <button type="button" className={s.linkbtn} onClick={() => setSent(false)}>
                  <Bi en="Change address" fr="Changer d'adresse" />
                </button>
              </p>
            </div>
          ) : (
            <>
              <h2><Bi en="Sign in" fr="Connexion" /></h2>
              <p className={s.hintText}>
                <Bi
                  en="Enter your work email: we send you a secure sign-in link. No password."
                  fr="Entrez votre email professionnel : nous vous envoyons un lien de connexion sécurisé. Aucun mot de passe."
                />
              </p>

              <form className={s.form} onSubmit={submit} noValidate>
                <div>
                  <label className={s.label} htmlFor="email"><Bi en="Work email" fr="Email professionnel" /></label>
                  <div className={s.field}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg>
                    <input
                      id="email"
                      className={`${s.input} ${err ? s.bad : ""}`}
                      type="email"
                      autoComplete="email"
                      placeholder="vous@hubinstitute.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (err) setErr(null); }}
                    />
                  </div>
                  {err && <p className={s.err}>{err}</p>}
                </div>
                <button className={`${s.btn} ${s.primary}`} type="submit" disabled={sending}>
                  {sending
                    ? <Bi en="Sending…" fr="Envoi…" />
                    : <Bi en="Email me a sign-in link" fr="Recevoir mon lien de connexion" />}
                </button>
              </form>

              <div className={s.reassure}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span>
                  <Bi
                    en={`One-time link, valid 15 minutes. Access reserved for @${ALLOWED_DOMAIN} addresses.`}
                    fr={`Lien à usage unique, valable 15 minutes. Accès réservé aux adresses @${ALLOWED_DOMAIN}.`}
                  />
                </span>
              </div>

              <p className={s.foot}>
                <Bi
                  en={<>By continuing you accept the HUB Institute <a href="https://www.hubinstitute.com">terms</a> and privacy policy.</>}
                  fr={<>En continuant, vous acceptez les <a href="https://www.hubinstitute.com">conditions</a> et la politique de confidentialité du HUB Institute.</>}
                />
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
