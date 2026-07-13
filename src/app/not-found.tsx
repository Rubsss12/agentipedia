import Link from "next/link";
import Bi from "@/components/Bi";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center">
      <p className="kicker text-mauve">404</p>
      <h1 className="mt-3 text-3xl font-black uppercase tracking-tight">
        <Bi en="This page is not in the catalog" fr="Cette page n'est pas au catalogue" />
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        <Bi
          en="The address may be wrong, or the entry was removed after a correction. Everything that is verified lives in the index."
          fr="L'adresse est peut-être erronée, ou la fiche a été retirée après correction. Tout ce qui est vérifié vit dans l'index."
        />
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-mauve px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-mauve-deep"
      >
        <Bi en="Back to the index" fr="Retour à l'index" />
      </Link>
    </main>
  );
}
