// Run with: npm run smoke
// Renders every node in the tree to catch runtime errors (missing ids, bad markup).
import { build } from "esbuild";
import { pathToFileURL } from "node:url";
import { rmSync } from "node:fs";

const out = new URL("../.smoke-bundle.mjs", import.meta.url).pathname;
await build({
  stdin: {
    contents: `
      import React from "react";
      import { renderToString } from "react-dom/server";
      import tree from "./src/data/decisionTree.json";
      import QuestionStep from "./src/components/QuestionStep.jsx";
      import ResultSummary from "./src/components/ResultSummary.jsx";
      import ScreenerApp from "./src/components/ScreenerApp.jsx";
      export function run() {
        let n = 0;
        for (const [id, node] of Object.entries(tree.nodes)) {
          const el = node.type === "question"
            ? React.createElement(QuestionStep, { node, onAnswer() {} })
            : React.createElement(ResultSummary, { node, data: { has_habitability_claim: true, cure_allowed: true, proper_notice: false }, onReset() {} });
          if (!renderToString(el).length) throw new Error(id + " rendered empty");
          n++;
        }
        if (!renderToString(React.createElement(ScreenerApp)).length) throw new Error("ScreenerApp rendered empty");
        return n;
      }`,
    resolveDir: process.cwd(),
    loader: "jsx",
  },
  bundle: true, format: "esm", platform: "node", packages: "external",
  jsx: "automatic", outfile: out, logLevel: "error",
  define: { "import.meta.env.BASE_URL": '"./"' },
});
try {
  const { run } = await import(pathToFileURL(out));
  console.log(`Smoke test OK: rendered ${run()} nodes without errors.`);
} finally { rmSync(out, { force: true }); }
