#!/usr/bin/env node
// Extract the final ```json fenced array from each agent transcript (JSONL) and
// write it to <dest>/<basename>.json — WITHOUT dumping the transcript to stdout.
//   node scripts/extract-agent-json.mjs <dest-dir> <file1.output> [file2 ...]
import fs from "node:fs";
import path from "node:path";

const dest = process.argv[2];
const files = process.argv.slice(3);
if (!dest || !files.length) { console.error("usage: extract-agent-json.mjs <dest> <files...>"); process.exit(2); }
fs.mkdirSync(dest, { recursive: true });

function walkStrings(o, out) {
  if (typeof o === "string") out.push(o);
  else if (Array.isArray(o)) o.forEach((x) => walkStrings(x, out));
  else if (o && typeof o === "object") for (const k in o) walkStrings(o[k], out);
}

for (const f of files) {
  const base = path.basename(f).replace(/\.output$/, "");
  let lastJsonText = null;
  const raw = fs.readFileSync(f, "utf8");
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let obj; try { obj = JSON.parse(line); } catch { continue; }
    const strs = []; walkStrings(obj, strs);
    for (const s of strs) if (s.includes("```json")) lastJsonText = s;
  }
  if (!lastJsonText) { console.log(`${base}: no json fence found`); continue; }
  const m = lastJsonText.match(/```json\s*([\s\S]*?)```/g);
  const block = m ? m[m.length - 1].replace(/```json\s*/, "").replace(/```$/, "") : null;
  let arr; try { arr = JSON.parse(block); } catch (e) { console.log(`${base}: json parse failed: ${e.message}`); continue; }
  if (!Array.isArray(arr)) { console.log(`${base}: not an array`); continue; }
  fs.writeFileSync(path.join(dest, base + ".json"), JSON.stringify(arr, null, 1));
  console.log(`${base}: ${arr.length} candidate(s) -> ${base}.json`);
}
