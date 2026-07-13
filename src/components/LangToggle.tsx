"use client";

import { useEffect } from "react";
import { initLang, useLang } from "@/lib/lang";

// hubforum-style FR | EN switch. Initializes the page language on mount
// (stored preference, else browser language).
export default function LangToggle({ on = "light" }: { on?: "light" | "dark" }) {
  const [lang, setLang] = useLang();
  useEffect(() => {
    initLang();
  }, []);

  const base = "px-2 py-1 text-[0.68rem] font-extrabold tracking-[0.14em] rounded-md transition-colors";
  const active = "bg-mauve text-white";
  const idle =
    on === "light" ? "text-muted hover:text-mauve" : "text-white/60 hover:text-white";

  return (
    <div
      className={`flex items-center gap-0.5 rounded-lg border p-0.5 ${
        on === "light" ? "border-lavender-line" : "border-white/25"
      }`}
      role="group"
      aria-label="Language / Langue"
    >
      <button aria-pressed={lang === "fr"} className={`${base} ${lang === "fr" ? active : idle}`} onClick={() => setLang("fr")}>
        FR
      </button>
      <button aria-pressed={lang === "en"} className={`${base} ${lang === "en" ? active : idle}`} onClick={() => setLang("en")}>
        EN
      </button>
    </div>
  );
}
