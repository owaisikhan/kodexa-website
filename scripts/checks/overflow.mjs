// Nothing sticks out past a phone screen, element by element. A page-level
// "no sideways scroll" check missed the WhatsApp button that ran off the
// request success screen, because its section had overflow:hidden. This looks
// at every leaf element and at clipping parents instead.

const WIDTHS = [320, 360, 390, 414];
const PAGES = ["/", "/services", "/services/online-store", "/services/website-audit", "/work", "/request", "/request?service=online-store", "/about", "/contact", "/faq", "/privacy", "/terms"];

function scan() {
  const W = document.documentElement.clientWidth;
  const leaf = new Set(["A", "BUTTON", "INPUT", "TEXTAREA", "LABEL", "H1", "H2", "H3", "P", "LI", "IMG", "svg"]);
  const bad = [];
  for (const e of document.querySelectorAll("body *")) {
    if (!leaf.has(e.tagName)) continue;
    if (e.closest("[aria-hidden='true'], .sr-only, [class*='marquee']")) continue;
    const s = getComputedStyle(e);
    if (s.display === "none" || s.visibility === "hidden") continue;
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    let why = r.right > W + 1 ? `right edge ${Math.round(r.right)} > ${W}` : r.left < -1 ? `left edge ${Math.round(r.left)}` : "";
    for (let a = e.parentElement; !why && a && a !== document.body; a = a.parentElement) {
      if (/hidden|clip/.test(getComputedStyle(a).overflowX)) {
        const ar = a.getBoundingClientRect();
        if (ar.width > 40 && r.right > ar.right + 1) why = `cut off by a clipping parent by ${Math.round(r.right - ar.right)}px`;
      }
    }
    if (why) bad.push(`${e.tagName.toLowerCase()} "${(e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 40)}": ${why}`);
  }
  return [...new Set(bad)].slice(0, 5);
}

export default async function overflow({ base, browser, ok }) {
  for (const w of WIDTHS) {
    const context = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const problems = [];
    for (const path of PAGES) {
      await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
      // Scroll through so every Reveal has fired before measuring.
      const height = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < height; y += 700) {
        await page.mouse.wheel(0, 700);
        await page.waitForTimeout(40);
      }
      await page.waitForTimeout(400);
      const sideways = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      const found = await page.evaluate(scan);
      if (sideways > 0) found.unshift(`page scrolls sideways by ${sideways}px`);
      for (const f of found) problems.push(`${path}: ${f}`);
    }
    ok(`nothing past the edge at ${w}px (${PAGES.length} pages)`, problems.length === 0, problems.slice(0, 3).join("; "));
    await context.close();
  }
}
