#!/usr/bin/env node
// Génère un magic link Supabase SANS envoyer d'email — pour connecter
// manuellement quelques VIP (Vincent & co) tant que le domaine d'envoi Resend
// n'est pas vérifié. Tu envoies le lien obtenu à la personne par ton canal
// habituel (mail perso, Slack). Elle clique → connectée sur Agentipedia.
//
// Usage:
//   node scripts/invite.mjs vincent@hubinstitute.com [autre@hubinstitute.com ...]
//
// Pré-requis dans .env.local (gitignoré) :
//   SUPABASE_SERVICE_ROLE_KEY=...   (Supabase → Settings → API → service_role, SECRET)

import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Charge .env.local à la main (le projet ne le fait pas tout seul).
try {
  const env = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch { /* pas de .env.local, on lira l'environnement */ }

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exdpayjilefpzhujusoo.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REDIRECT_TO = process.env.INVITE_REDIRECT_TO || "https://agentipedia-one.vercel.app/";
const ALLOWED_DOMAIN = "hubinstitute.com";

if (!SERVICE_KEY) {
  console.error(
    "invite: SUPABASE_SERVICE_ROLE_KEY manquante.\n" +
    "→ Supabase → Settings → API → 'service_role' (clé SECRÈTE), copie-la dans .env.local :\n" +
    "   SUPABASE_SERVICE_ROLE_KEY=eyJ...\n",
  );
  process.exit(2);
}

const emails = process.argv.slice(2);
if (!emails.length) {
  console.error("invite: donne au moins un email.\n  node scripts/invite.mjs vincent@hubinstitute.com");
  process.exit(2);
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function linkFor(email) {
  // S'assure que l'utilisateur existe (sinon 'magiclink' échoue sur un inconnu).
  const { error: createErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (createErr && !/already|registered|exists/i.test(createErr.message)) {
    throw createErr;
  }
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: REDIRECT_TO },
  });
  if (error) throw error;
  return data?.properties?.action_link;
}

console.log(`invite: redirection après login → ${REDIRECT_TO}\n`);
for (const email of emails) {
  if (!email.toLowerCase().endsWith("@" + ALLOWED_DOMAIN)) {
    console.log(`⚠️  ${email} — hors @${ALLOWED_DOMAIN}, ignoré (règle Agentipedia).`);
    continue;
  }
  try {
    const link = await linkFor(email);
    console.log(`✅ ${email}`);
    console.log(`   ${link}\n`);
  } catch (e) {
    console.log(`❌ ${email} — ${e.message}\n`);
  }
}
console.log("Envoie chaque lien à la personne concernée. Valable ~1 h ; regénère au besoin.");
