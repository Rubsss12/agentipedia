#!/usr/bin/env node
// Le kit de promotion d'Agentipedia : les visuels réseaux sociaux, rendus aux
// chiffres du jour.
//
//   npm run promo-kit            → version française dans promo-kit/
//   npm run promo-kit -- --en    → version anglaise
//
// Les chiffres ne sont jamais écrits à la main : ils sont recalculés depuis
// l'index à chaque rendu, avec la même règle CODA que le site (engine/coda.mjs).
// Un visuel qui annonce 487 agents copilotés doit pouvoir être refait le mois
// suivant sans que personne n'ait à se souvenir d'où venait le chiffre.
//
// Le gabarit des visuels est design/promo/kit.html : pour changer un texte ou
// une couleur, c'est là, puis on relance. Les textes de publication sont le
// gabarit design/promo/textes.md, dont les chiffres sont des champs : le script
// écrit la version remplie dans promo-kit/textes.md. On publie depuis cette
// sortie, jamais depuis le gabarit, pour qu'aucun chiffre périmé ne parte.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { codaQuadrant, isCapped } from "../engine/coda.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const SRC = path.join(ROOT, "design", "promo");
const EN = process.argv.includes("--en");
const OUT = path.join(ROOT, "promo-kit", EN ? "en" : "fr");

const readJson = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback);
const entries = [
  ...readJson(path.join(ROOT, "data", "entries.json"), { entries: [] }).entries,
  ...readJson(path.join(ROOT, "data", "manual-cases.json"), []),
];

const quad = { C: 0, O: 0, D: 0, A: 0 };
let capped = 0;
for (const e of entries) {
  if (!e.coda) continue;
  quad[codaQuadrant(e.coda)]++;
  if (isCapped(e.coda)) capped++;
}
const data = {
  total: entries.length,
  countries: new Set(entries.map((e) => e.company_country).filter(Boolean)).size,
  sectors: new Set(entries.map((e) => e.sector)).size,
  capped,
  ...quad,
};

const SLIDES = ["annonce", "carre", "carrousel-1", "carrousel-2", "carrousel-3", "carrousel-4", "carrousel-5"];

fs.mkdirSync(OUT, { recursive: true });
const tmp = path.join(OUT, ".kit.html");
fs.writeFileSync(tmp, fs.readFileSync(path.join(SRC, "kit.html"), "utf8").replace("__DATA__", JSON.stringify(data)));
fs.copyFileSync(path.join(ROOT, "public", "hub-institute-logo-white.svg"), path.join(OUT, "hub-institute-logo-white.svg"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 1 });
await page.goto(`file://${tmp}?lang=${EN ? "en" : "fr"}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
for (const id of SLIDES) {
  const file = path.join(OUT, `${id}.png`);
  await page.locator(`#${id}`).screenshot({ path: file });
  const { size } = fs.statSync(file);
  console.log(`${path.relative(ROOT, file)}  ${Math.round(size / 1024)} Ko`);
}
await browser.close();
fs.unlinkSync(tmp);

// Les mêmes chiffres dans les textes de publication, pour qu'un visuel à jour
// ne parte jamais avec une légende d'il y a deux curations.
const copy = fs.readFileSync(path.join(SRC, "textes.md"), "utf8").replace(/\{(\w+)\}/g, (m, k) => (k in data ? data[k] : m));
fs.writeFileSync(path.join(ROOT, "promo-kit", "textes.md"), copy);
console.log("promo-kit/textes.md");
fs.unlinkSync(path.join(OUT, "hub-institute-logo-white.svg"));
console.log(`\nchiffres du jour : ${JSON.stringify(data)}`);
