// The request form. Guards the bug that shipped once: Continue on step two
// submitted the form, because React reused one <button> and changed its type
// mid-click (see the multi-step rule in CLAUDE.md).
//
// Server actions POST back to the page, so counting POSTs counts sends. Unless
// allowSubmit, every one is aborted before it leaves the browser.

export default async function form({ base, browser, ok, allowSubmit }) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  let posts = 0;
  await page.route("**/*", (route) => {
    if (route.request().method() !== "POST") return route.continue();
    posts++;
    return allowSubmit ? route.continue() : route.abort();
  });

  await page.goto(`${base}/request`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });

  const legend = () => page.locator("legend").first().innerText();
  const continueBtn = page.locator('button:has-text("Continue")');

  await page.locator("button", { hasText: "Website Development" }).click();
  await continueBtn.click();
  await page.waitForTimeout(400);
  ok("step 1 Continue opens step 2", (await legend()).includes("Tell us about it"));

  await page.locator("textarea").fill("A site for my shop");
  await continueBtn.click();
  await page.waitForTimeout(800);
  ok("step 2 Continue opens step 3 and sends nothing", (await legend()).includes("How should we reply") && posts === 0, `posts=${posts}`);

  await page.locator('button:has-text("Back")').click();
  await page.waitForTimeout(400);
  ok("Back keeps what was typed", (await page.locator("textarea").inputValue()) === "A site for my shop");

  const business = page.locator('input[placeholder^="e.g. Saam"]');
  await business.fill("Crumbs");
  await business.press("Enter");
  await page.waitForTimeout(800);
  ok("Enter in a step 2 field moves on and sends nothing", (await legend()).includes("How should we reply") && posts === 0, `posts=${posts}`);

  const name = page.locator('input[autocomplete="name"]');
  ok("placeholders read as examples", ((await name.getAttribute("placeholder")) || "").startsWith("e.g."));

  await name.fill("Check Bot");
  await page.locator('input[autocomplete="tel"]').fill("+92 300 0000000");
  await page.locator('button:has-text("Send request")').click();
  await page.waitForTimeout(allowSubmit ? 3000 : 1200);
  ok("Send request sends exactly once", posts === 1, `posts=${posts}`);

  if (allowSubmit) {
    const headings = (await page.locator("h2").allInnerTexts()).join(" ");
    ok("success screen shown", /Request received|Almost done/.test(headings), headings.slice(0, 60));
  }

  await page.evaluate(() => localStorage.clear());
  await page.close();
}
