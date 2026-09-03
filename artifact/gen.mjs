// Regenerate the self-contained Agentipedia artifact HTML from the versioned
// template + the live data store. The land dot-cloud is already baked into the
// template, so this only injects the current entries.
//
//   node artifact/gen.mjs   ->   artifact/Agentipedia.html
//
// To publish: republish artifact/Agentipedia.html with the Artifact tool,
// passing url=https://claude.ai/code/artifact/17c55dc4-1bb0-4971-8c00-3f78bd60aaee
// so it updates the existing page instead of minting a new one.
import fs from "node:fs";
import path from "node:path";

const dir = import.meta.dirname;
const root = path.join(dir, "..");
const tpl = fs.readFileSync(path.join(dir, "template.html"), "utf8");
const store = JSON.parse(fs.readFileSync(path.join(root, "data", "entries.json"), "utf8"));

// Cases added by hand live in their own file (see lib/data.ts) — fold them in
// so the artifact shows the same catalog as the site.
const manualPath = path.join(root, "data", "manual-cases.json");
if (fs.existsSync(manualPath)) {
  const manual = JSON.parse(fs.readFileSync(manualPath, "utf8"));
  const seen = new Set(store.entries.map((e) => e.id));
  for (const e of manual) {
    if (!seen.has(e.id)) { seen.add(e.id); store.entries.push({ ...e, provenance: "manual" }); }
  }
  store.entries.sort((a, b) => a.id.localeCompare(b.id));
}

// Neutralize "<" so the JSON can't break out of <script type="application/json">.
const json = JSON.stringify(store).split("<").join("\\u003c");
const out = tpl.replace("__ENTRIES_JSON__", json);

fs.writeFileSync(path.join(dir, "Agentipedia.html"), out);
const left = (out.match(/__ENTRIES_JSON__|__LAND_B64__/g) || []).length;
console.log(`wrote artifact/Agentipedia.html: ${out.length} chars; ${store.entries.length} entries; placeholders left: ${left}`);
if (left) process.exit(1);
