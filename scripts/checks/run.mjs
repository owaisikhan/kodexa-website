// Regression checks for the bugs that looked fine by eye and passed the build.
// Run against a production build:
//
//   npm run build && npm start          (in one terminal)
//   npm run check                        (in another)
//   npm run check -- --base http://localhost:3123 --only form,links
//
// The form check never lets a request reach the server unless you pass
// --allow-submit, and only do that against a build made WITHOUT .env.local:
// with Supabase configured, a submitted test lands in the live leads table.
//
// Exit code 1 when anything fails. See "Verifying a change" in CLAUDE.md.

import { chromium } from "playwright";

import form from "./form.mjs";
import builder from "./builder.mjs";
import links from "./links.mjs";
import overflow from "./overflow.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]);
    return acc;
  }, [])
);

const BASE = args.base || "http://localhost:3000";
const ALL = { form, builder, links, overflow };
const only = typeof args.only === "string" ? args.only.split(",") : Object.keys(ALL);

// In Claude Code on the web, Chromium is preinstalled at /opt/pw-browsers and
// must not be downloaded. Elsewhere, run `npx playwright install chromium` once.
const launch = { headless: true };
if (process.env.PLAYWRIGHT_BROWSERS_PATH === "/opt/pw-browsers") launch.executablePath = "/opt/pw-browsers/chromium";

try {
  await fetch(BASE);
} catch {
  console.error(`Nothing is answering at ${BASE}. Start the site first (npm run build && npm start).`);
  process.exit(1);
}

const browser = await chromium.launch(launch);
let failures = 0;

// Each check gets these and reports with ok(label, passed, detail).
const ctx = {
  base: BASE,
  browser,
  allowSubmit: Boolean(args["allow-submit"]),
  ok(label, passed, detail = "") {
    if (!passed) failures++;
    console.log(`  ${passed ? "ok  " : "FAIL"} ${label}${detail ? `  (${detail})` : ""}`);
  },
};

for (const name of only) {
  if (!ALL[name]) {
    console.error(`Unknown check "${name}". Choose from: ${Object.keys(ALL).join(", ")}`);
    process.exit(1);
  }
  console.log(`\n${name}`);
  try {
    await ALL[name](ctx);
  } catch (e) {
    failures++;
    console.log(`  FAIL ${name} stopped: ${e.message.split("\n")[0]}`);
  }
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
