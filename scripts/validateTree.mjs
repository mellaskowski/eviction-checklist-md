// Run with: npm run validate
// Catches dead ends, broken links, orphan nodes, and undefined glossary/checklist/resource ids.
import { readFileSync } from "node:fs";
import { validateTree } from "../src/engine/screenerEngine.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../src/data/${f}`, import.meta.url)));
const errors = validateTree(load("decisionTree.json"), {
  glossary: load("glossary.json"),
  checklist: load("checklist.json"),
  resources: load("resources.json"),
});

if (errors.length) {
  console.error(`\n${errors.length} problem(s) found:\n`);
  errors.forEach((e) => console.error(" - " + e));
  process.exit(1);
}
console.log("Decision tree OK: no dead ends, broken links, or orphans.");
