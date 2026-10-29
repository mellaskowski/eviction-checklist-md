// Run with: npm run links
// Visits every resource URL and reports the result. Some sites block automated
// requests (403/429) even though the page works in a browser, so check those by hand.
import { readFileSync } from "node:fs";

const resources = JSON.parse(readFileSync(new URL("../src/data/resources.json", import.meta.url)));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function check(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const res = await fetch(url, { redirect: "follow", signal: ctl.signal, headers: { "User-Agent": UA } });
    res.body?.cancel();
    return { status: res.status };
  } catch (e) {
    return { status: "ERROR", note: e.cause?.code || e.name };
  } finally {
    clearTimeout(timer);
  }
}

const entries = Object.entries(resources).filter(([, r]) => r.url);
const results = [];
let next = 0;
async function worker() {
  while (next < entries.length) {
    const [id, r] = entries[next++];
    results.push({ id, name: r.name, url: r.url, ...(await check(r.url)) });
  }
}
await Promise.all(Array.from({ length: 5 }, worker));

let ok = 0;
for (const r of results.sort((a, b) => a.id.localeCompare(b.id))) {
  const good = typeof r.status === "number" && r.status < 400;
  const soft = r.status === 403 || r.status === 429;
  if (good) { ok++; continue; }
  console.log(`${soft ? "CHECK BY HAND" : "BROKEN?"}  [${r.status}${r.note ? " " + r.note : ""}]  ${r.name}\n    ${r.url}`);
}
console.log(`\n${ok} of ${results.length} links responded OK.`);
