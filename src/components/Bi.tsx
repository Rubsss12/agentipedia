// Renders a string in both languages; CSS (data-lang on <html>) shows one.
export default function Bi({ en, fr }: { en: React.ReactNode; fr: React.ReactNode }) {
  return (
    <>
      <span className="lang-en">{en}</span>
      <span className="lang-fr">{fr}</span>
    </>
  );
}
