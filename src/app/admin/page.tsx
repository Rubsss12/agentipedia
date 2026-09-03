import type { Metadata } from "next";
import AddCaseForm from "./AddCaseForm";

export const metadata: Metadata = {
  title: "Ajouter un cas",
  description: "Ajout manuel d'un déploiement à l'index Agentipedia.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-16 pt-12">
      <p className="kicker text-mauve">Réservé à l&apos;équipe HUB Institute</p>
      <h1 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-4xl">
        Ajouter un cas d&apos;usage
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
        Pour les cas clients et les déploiements repérés hors du moteur de curation.
        La fiche passe <strong>la même règle</strong> que le reste de l&apos;index : entreprise
        nommée, solution nommée, et au moins une source publique vérifiable.
      </p>
      <p className="mt-3 max-w-2xl rounded-lg bg-warn-bg px-4 py-3 text-sm text-warn">
        Un cas client sans trace publique ne peut pas entrer dans l&apos;index : c&apos;est la promesse
        du site, et une question de confidentialité. Demandez au client de publier
        (post LinkedIn, communiqué, page site) — cette trace devient la source.
      </p>
      <AddCaseForm />
    </main>
  );
}
