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
        Entreprise et solution doivent être nommées. La source est recommandée mais
        facultative : sans elle, la fiche est publiée comme cas transmis par l&apos;équipe.
      </p>
      <AddCaseForm />
    </main>
  );
}
