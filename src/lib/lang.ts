"use client";

import { useSyncExternalStore } from "react";

// Tiny client-side language store. The chrome is rendered in both languages;
// this only flips the data-lang attribute (CSS does the rest) and lets client
// components re-render their own strings.
export type Lang = "en" | "fr";
const KEY = "agentipedia-lang";
const EVENT = "agentipedia:lang";

export function currentLang(): Lang {
  if (typeof document === "undefined") return "en";
  return document.documentElement.dataset.lang === "fr" ? "fr" : "en";
}

export function applyLang(lang: Lang) {
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT, { detail: lang }));
}

export function initLang() {
  let lang: Lang | null = null;
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "fr" || stored === "en") lang = stored;
  } catch {}
  if (!lang) lang = navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: lang }));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

export function useLang(): [Lang, (l: Lang) => void] {
  // Server snapshot is "en"; after hydration React re-reads the real value
  // (set pre-paint by the boot script) and re-renders if it differs.
  const lang = useSyncExternalStore(subscribe, currentLang, () => "en" as Lang);
  return [lang, applyLang];
}
