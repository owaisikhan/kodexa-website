// In-page links. Guards the "Process sometimes does nothing" bug: a repeat
// click, or a click while Lenis was still gliding, left the page wherever the
// glide was heading. Fixed by Lenis `anchors` and `stopInertiaOnNavigate` in
// SmoothScroll.js; the section should land just under the 88px navbar.

const landed = (page, id) =>
  page.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), id);
const near = (top) => Math.abs(top) < 200;

export default async function links({ base, browser, ok }) {
  const desk = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const clickProcess = () => desk.locator('nav[aria-label="Main"] a', { hasText: "Process" }).first().click();

  await desk.goto(`${base}/`, { waitUntil: "networkidle" });
  await clickProcess();
  await desk.waitForTimeout(1800);
  let top = await landed(desk, "process");
  ok("Process from the top of the home page", near(top), `top=${top}`);

  await desk.mouse.wheel(0, -3000);
  await desk.waitForTimeout(1500);
  await clickProcess();
  await desk.waitForTimeout(1800);
  top = await landed(desk, "process");
  ok("Process clicked a second time", near(top), `top=${top}`);

  await desk.goto(`${base}/`, { waitUntil: "networkidle" });
  await desk.mouse.wheel(0, 1200);
  await desk.waitForTimeout(150);
  await clickProcess();
  await desk.waitForTimeout(1800);
  top = await landed(desk, "process");
  ok("Process clicked while still scrolling", near(top), `top=${top}`);

  await desk.goto(`${base}/services/website`, { waitUntil: "networkidle" });
  await desk.mouse.wheel(0, 800);
  await desk.waitForTimeout(500);
  await clickProcess();
  await desk.waitForTimeout(2500);
  top = await landed(desk, "process");
  ok("Process from a service page mid-scroll", near(top), `top=${top}`);

  await desk.goto(`${base}/services`, { waitUntil: "networkidle" });
  await desk.locator('main a[href="#compare"]').first().click();
  await desk.waitForTimeout(1800);
  top = await landed(desk, "compare");
  ok("Compare side by side on /services", near(top), `top=${top}`);
  await desk.close();

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await phone.goto(`${base}/work`, { waitUntil: "networkidle" });
  await phone.locator('button[aria-label="Open menu"]').tap();
  await phone.waitForTimeout(500);
  await phone.locator('#mobile-menu a[href="/#process"]').tap();
  await phone.waitForTimeout(2500);
  top = await landed(phone, "process");
  const overflow = await phone.evaluate(() => document.body.style.overflow);
  ok("Process from the phone menu, another page", near(top) && !overflow, `top=${top}`);

  // The phone menu's first screen must hold the call to action on a small phone.
  const small = await browser.newPage({ viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true });
  await small.goto(`${base}/`, { waitUntil: "networkidle" });
  await small.locator('button[aria-label="Open menu"]').tap();
  await small.waitForTimeout(500);
  const ctaBottom = await small.evaluate(() =>
    Math.round(document.querySelector('#mobile-menu a[href="/request"]').getBoundingClientRect().bottom)
  );
  ok("Start a project visible in the phone menu at 360x640", ctaBottom <= 640, `bottom=${ctaBottom}`);

  await phone.close();
  await small.close();
}
