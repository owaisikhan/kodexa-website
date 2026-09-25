// The Meta Pixel. Meta's real fbevents.js is replaced by a recorder, so this
// proves which events the site sends (and when the script loads) without
// ever contacting Meta.

const RECORDER = `
  window.__px = [];
  var q = (window.fbq && window.fbq.queue) || [];
  window.fbq.callMethod = function () { window.__px.push(Array.from(arguments)); };
  q.forEach(function (a) { window.__px.push(Array.from(a)); });
`;

const events = (page) => page.evaluate(() => (window.__px || []).map((a) => `${a[0]}:${a[1]}`));
const waitForRecorder = (page) => page.waitForFunction(() => Array.isArray(window.__px), null, { timeout: 15000 });

export default async function pixel({ base, browser, ok, allowSubmit }) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  let scriptAt = 0;
  await page.route("https://connect.facebook.net/**", (route) => {
    scriptAt = Date.now();
    route.fulfill({ contentType: "application/javascript", body: RECORDER });
  });
  await page.route("https://wa.me/**", (route) => route.abort());

  const started = Date.now();
  await page.goto(`${base}/`, { waitUntil: "load" });
  const loadedAt = Date.now();
  await waitForRecorder(page);
  ok("Meta's script is fetched only after the page has loaded", scriptAt >= loadedAt, `${scriptAt - started}ms vs load ${loadedAt - started}ms`);
  let seen = await events(page);
  ok("init and PageView on the first page", seen.includes("init:1824366032179710") && seen.includes("track:PageView"), seen.join(", "));

  await page.goto(`${base}/services/online-store`, { waitUntil: "load" });
  await waitForRecorder(page);
  await page.waitForTimeout(500);
  seen = await events(page);
  ok("ViewContent on a service page", seen.includes("track:ViewContent"), seen.join(", "));

  const popup = page.waitForEvent("popup", { timeout: 3000 }).catch(() => null);
  await page.locator('a[href^="https://wa.me/"]').first().click();
  await (await popup)?.close();
  await page.waitForTimeout(300);
  seen = await events(page);
  ok("Contact when a WhatsApp link is tapped", seen.includes("track:Contact"), seen.join(", "));

  // Lead needs a real send, so only with --allow-submit (a build without the
  // database env; see run.mjs).
  if (allowSubmit) {
    await page.goto(`${base}/request?service=website`, { waitUntil: "load" });
    await waitForRecorder(page);
    await page.evaluate(() => localStorage.clear());
    await page.locator("textarea").fill("Pixel check");
    await page.locator('button:has-text("Continue")').click();
    await page.locator('input[autocomplete="name"]').fill("Check Bot");
    await page.locator('input[autocomplete="tel"]').fill("+92 300 0000000");
    await page.locator('button:has-text("Send request")').click();
    await page.waitForTimeout(3000);
    seen = await events(page);
    ok("Lead when a request is sent", seen.includes("track:Lead"), seen.join(", "));
  }

  await page.goto(`${base}/admin/login`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const onAdmin = await page.evaluate(() => typeof window.fbq);
  ok("no Pixel in the admin area", onAdmin === "undefined", `fbq is ${onAdmin}`);

  await page.close();
}
