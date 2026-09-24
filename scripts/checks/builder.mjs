// The finder's extras. Guards "I also need: You make the fixes too.": every
// ticked extra must reach the request link, the brief and the WhatsApp message
// as a readable phrase, and a hand-edited ?needs= must not inject text.

export default async function builder({ base, browser, ok }) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const finder = page.locator("#finder");
  await finder.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  await finder.locator("button", { hasText: "Orders come in on WhatsApp" }).click();
  await page.waitForTimeout(500);
  await finder.locator("label", { hasText: "Cash on delivery" }).click();
  await finder.locator("label", { hasText: "Delivery areas" }).click();
  await page.waitForTimeout(300);

  const list = "I would also like:\n- cash on delivery\n- delivery areas and charges";
  const href = await finder.locator('a:has-text("Request this")').getAttribute("href");
  ok("Request this carries the ticked extras", href === "/request?service=online-store&needs=cod,delivery", href);

  const wa = decodeURIComponent(await finder.locator('a:has-text("Or send on WhatsApp")').getAttribute("href"));
  ok("WhatsApp message lists the extras", wa.includes(list) && !wa.includes("What I need: I would"), wa.split("text=")[1]?.slice(0, 80));

  await page.goto(`${base}${href}`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  ok("the brief is prefilled as a list", (await page.locator("textarea").inputValue()) === list);

  await page.goto(`${base}/request?service=website-audit&needs=fixes`, { waitUntil: "networkidle" });
  ok("one extra reads as a sentence", (await page.locator("textarea").inputValue()) === "I would also like the problems fixed for us.");

  await page.goto(`${base}/request?service=online-store&needs=cod,<script>`, { waitUntil: "networkidle" });
  const injected = await page.locator("textarea").inputValue();
  ok("unknown ids are dropped", injected === "I would also like cash on delivery.", JSON.stringify(injected));

  // A saved draft from an earlier visit: the visitor's lines stay, the old
  // extras block (list or old wording) is replaced, not stacked.
  await page.evaluate(() =>
    localStorage.setItem(
      "kodexa:request-draft",
      JSON.stringify({
        service: "online-store",
        values: { business: "", brief: "Bakery orders\nI also need: Delivery areas and charges.", name: "", contact: "" },
        savedAt: Date.now(),
      })
    )
  );
  await page.goto(`${base}/request?service=online-store&needs=payments`, { waitUntil: "networkidle" });
  ok(
    "a restored draft swaps its extras",
    (await page.locator("textarea").inputValue()) === "Bakery orders\nI would also like JazzCash or Easypaisa payments."
  );

  await page.evaluate(() => localStorage.clear());
  await page.close();
}
