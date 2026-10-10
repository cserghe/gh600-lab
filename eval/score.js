#!/usr/bin/env node
// Lab 4: score all attempts and print Markdown (eval.yml appends it to $GITHUB_STEP_SUMMARY).
// Reads results-*.json from the current folder (or the files given as arguments).
// A case passes in an attempt when BOTH severity and component match the expected labels.
// Read the output as "T01 passed 5/5, T03 passed 2/5", not as "suite green".

import { readdirSync, readFileSync } from "node:fs";

const files = process.argv.length > 2
  ? process.argv.slice(2)
  : readdirSync(".").filter((f) => /^results-.*\.json$/.test(f)).sort();

if (files.length === 0) {
  console.log("## Agent eval\n\nNo results-*.json files found. Did the run jobs upload their artefacts?");
  process.exit(1);
}

const norm = (v) => String(v ?? "").trim().toLowerCase();
const passed = (r) =>
  !r.error && r.actual != null &&
  norm(r.actual.severity) === norm(r.expected.severity) &&
  norm(r.actual.component) === norm(r.expected.component);

const byCase = new Map(); // id -> { tag, pass, runs }
const byTag = new Map();  // tag -> { pass, runs }
for (const file of files) {
  for (const r of JSON.parse(readFileSync(file, "utf8"))) {
    const c = byCase.get(r.id) ?? { tag: r.tag, pass: 0, runs: 0 };
    const t = byTag.get(r.tag) ?? { pass: 0, runs: 0 };
    const ok = passed(r) ? 1 : 0;
    c.pass += ok; c.runs += 1; t.pass += ok; t.runs += 1;
    byCase.set(r.id, c); byTag.set(r.tag, t);
  }
}

const pct = (p, n) => (n ? `${Math.round((100 * p) / n)}%` : "n/a");
const out = [];
out.push("## Agent eval", "", `Attempts scored: ${files.length} (${files.join(", ")})`, "");
out.push("### Per case", "", "| Case | Tag | Passed | Pass rate |", "| --- | --- | --- | --- |");
for (const [id, c] of [...byCase].sort()) out.push(`| ${id} | ${c.tag} | ${c.pass}/${c.runs} | ${pct(c.pass, c.runs)} |`);
out.push("", "### Per tag", "", "| Tag | Passed | Pass rate |", "| --- | --- | --- |");
for (const [tag, t] of [...byTag].sort()) out.push(`| ${tag} | ${t.pass}/${t.runs} | ${pct(t.pass, t.runs)} |`);
let all = 0, runs = 0;
for (const t of byTag.values()) { all += t.pass; runs += t.runs; }
out.push("", `**Overall:** ${all}/${runs} (${pct(all, runs)})`);
console.log(out.join("\n"));
