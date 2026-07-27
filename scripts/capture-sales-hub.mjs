/**
 * Capture real screenshots of the open-source Sales Hub build for the
 * /sales-hub case study.
 *
 * Prereqs (in the Sales-Hub repo, demo mode — no API keys needed):
 *   1. postgres up, `pnpm seed`, then populate the UI:
 *      `pnpm tsx scripts/export-run-trace.ts` (film-day reset + nightly run)
 *   2. `pnpm dev` on http://localhost:3000
 *
 * Then here:  node scripts/capture-sales-hub.mjs
 *
 * Writes 2x dark-mode PNGs into public/sales-hub/. Deterministic by
 * construction: the demo dataset and the nightly run are byte-stable, so
 * re-capturing yields the same screens.
 */
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

const BASE = process.env.SALES_HUB_URL ?? "http://localhost:3000";
const PASSWORD = process.env.SALES_HUB_PASSWORD ?? "clea-demo";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "sales-hub");

// The filmed flow, one screen per architectural claim on the case study.
const SHOTS = [
  ["dashboard", "/dashboard", "Mission-control dashboard: morning brief, KPIs, run activity"],
  ["approvals-inbox", "/approvals", "The approval inbox every agent pipeline terminates in"],
  ["approvals-audit", "/approvals/audit", "Immutable audit trail of resolved approvals"],
  ["po-intake", "/po-intake", "PO intake queue: validated vs escalated extractions"],
  ["email-triage", "/email", "Triage-labeled inbox after the overnight run"],
  ["pipeline", "/crm/pipeline", "CRM pipeline board fed by agent-proposed updates"],
  ["meetings", "/meetings", "Meeting follow-ups with transcript-grounded actions"],
  ["demo-control", "/demo-control", "Demo control: film-day reset + simulated overnight"],
];

async function loadChromium() {
  for (const candidate of ["playwright", "playwright-core", "/opt/node22/lib/node_modules/playwright"]) {
    try {
      return require(candidate).chromium;
    } catch {
      /* next candidate */
    }
  }
  throw new Error("playwright not found — `npm i -D playwright` or install it globally");
}

const chromium = await loadChromium();
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});

// Login: single-password demo gate at /login (field name="password").
await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.fill('input[name="password"]', PASSWORD);
await page.click('button[type="submit"]');
await page.waitForURL("**/dashboard**", { timeout: 30_000 });

for (const [name, route, caption] of SHOTS) {
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600); // let charts/relative-time chips settle
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`captured ${name}.png — ${caption}`);
}

await browser.close();
console.log(`\ndone → ${OUT}`);
