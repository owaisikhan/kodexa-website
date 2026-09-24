# kodexa-builder learnings

This file is how this repo teaches the kodexa-builder skill. Every session
that loads the skill reads it first and appends to it as the user corrects,
reverses or chooses things. Entries promoted into the skill are marked with
the version they landed in. See the skill's `references/self-improvement.md`
for the rules.

- **Project:** kodexa-website (Kodexa's own studio site)
- **Type:** marketing-site (with the site-scoped ai-chatbot)
- **Who reads it daily:** strangers on phones from a Facebook post or ad, deciding whether to send a request
- **Palette exceptions:** none
- **Skill version when started:** 1.0.0

## Summary

| ID | Date | Kind | Lesson (short) | Scope | Status |
|---|---|---|---|---|---|
| L-001 | 2026-09-23 | rule | WhatsApp always shows the real WhatsApp logo; the floating button is the logo alone | all | promoted v1.1.0 |
| L-002 | 2026-09-23 | gotcha | Icon-and-text links are flex rows at every pointer; only the 44px growth is touch-only | all | promoted v1.1.0 |
| L-003 | 2026-09-23 | rule | Interactive demos must announce themselves: pointer cursor on every button, plus an animated tapping hand until first use | all | promoted v1.1.0 |
| L-004 | 2026-09-23 | correction | A pair of important actions is two real buttons, never two underlined links stacked together; and every menu action exists on phone too | all | promoted v1.1.0 |
| L-005 | 2026-09-23 | gotcha | Multi-step forms: Continue and Submit need different keys, and the form must refuse to submit before the last step | all | promoted v1.1.0 |
| L-006 | 2026-09-23 | correction | Placeholders must never look like typed answers: lighter token, lighter weight, and an e.g. prefix | all | promoted v1.1.0 |
| L-007 | 2026-09-23 | stale | slop_scan must skip the block next dev writes into AGENTS.md (its dashes are Next's text, and the block is meant to be committed) | all | promoted v1.1.0 |
| L-008 | 2026-09-24 | gap | Every public site ships About, Contact, FAQ, privacy, terms, sitemap, robots and an OG image | all | promoted v1.2.0 |
| L-009 | 2026-09-24 | gotcha | Lenis needs anchors and stopInertiaOnNavigate, or in-page links land wrong on a repeat or mid-scroll click | all | promoted v1.2.0 |
| L-010 | 2026-09-24 | correction | Add-on pickers carry a label and a separate message phrase, and never offer what the service already includes | all | promoted v1.2.0 |
| L-011 | 2026-09-24 | rule | Hamid Javed is the only person named on Kodexa's public site, ads and client material | all | promoted v1.2.0 |
| L-012 | 2026-09-24 | choice | Top-menu labels never share a word; legal, About and Contact stay in the footer | all | promoted v1.2.0 |
| L-013 | 2026-09-24 | gotcha | Every repo ships npm run check; form checks abort POSTs unless --allow-submit on a build without the database env | all | promoted v1.2.0 |

## Entries

### L-001 · 2026-09-23 · strong · rule
- **Said / saw:** "only write WhatsApp with a whatsapp real icon, and near the chatbot only the whatapp real logo should appear"
- **Context:** kodexa-website, feature/easy-navigation. Every WhatsApp button used lucide's generic `MessageCircle`, and the floating button carried a "Chat on WhatsApp" label beside the chatbot's own bubble.
- **Lesson:** Anywhere the word WhatsApp appears (buttons, footer contact, admin reply, request hand-off), use the real WhatsApp glyph from one `ui/WhatsAppIcon.js` (lucide has no brand icons), in brand green `#25D366` on light surfaces and white or ink on the green button. The floating WhatsApp button is the logo alone at the same size as the chat launcher, and the chat launcher uses a bot icon, so the two never look like the same app.
- **Scope:** all (every Kodexa site hands leads to WhatsApp)
- **Target in skill:** references/types/marketing-site.md section 6 (Lead capture); SKILL.md section 3 Leads row
- **Status:** promoted v1.1.0

### L-002 · 2026-09-23 · medium · gotcha
- **Said / saw:** user screenshots of the footer (GitHub icon, word and arrow stacked in a column) and "Compare them side by side" with its arrow on the next line
- **Context:** `.tap` in globals.css set `display: inline-flex` only inside `@media (pointer: coarse)`, so on a mouse-driven screen the svg (block after the reset) took its own line. Shipped on main.
- **Lesson:** A touch-target helper may grow the hit area only under `pointer: coarse`, but the layout (inline-flex, align-items: center) belongs outside the media query. Every desktop check must include a link that holds an icon, because DOM checks and phone screenshots both miss this.
- **Scope:** all
- **Target in skill:** references/types/marketing-site.md section 4 (Layout and type); SKILL.md section 5 (How done is proven)
- **Status:** promoted v1.1.0

### L-003 · 2026-09-23 · strong · rule
- **Said / saw:** "change the shape of the cursor when hovered over the mockups so that a new user can surely know that he can tap to see the changes", then "when hovered over a mockup, the cursor pointer should animate to show that user can tap"
- **Context:** kodexa-website, the "Try it" work drawings. Tailwind v4 resets buttons to `cursor: default`, so the controls looked inert under a mouse.
- **Lesson:** Every project carries one global rule, `button:not(:disabled), [role="button"] { cursor: pointer }`, because Tailwind v4 no longer does. Anything interactive that does not look interactive (a drawing, a demo, a mock) also gets an animated tapping hand over the one control to try first: shown on mouse hover, or on touch screens when it scrolls into view, gone for good after the first press, and still (not animated) under reduced motion. The system cursor cannot be animated in a browser, so the hint is drawn on the page.
- **Scope:** all
- **Target in skill:** SKILL.md section 3 (house defaults, a Cursor row); references/types/marketing-site.md section 5 (Motion)
- **Status:** promoted v1.1.0

### L-004 · 2026-09-23 · medium · correction
- **Said / saw:** "find your in two taps button is not visible on mobile view and find yours in two taps and compare all 9 are stacked together, which effects visibility"
- **Context:** the Services menu and /services header offered "Find yours in two taps" and "Compare all nine" as two small underlined links, one above the other; the phone menu had only the second.
- **Lesson:** When two actions matter, make them real buttons (primary and ghost), with a gap between them, not a stack of underlined links that reads as fine print. And every action in the desktop menu must exist in the phone menu, visible without expanding anything if it is the one an undecided visitor needs.
- **Scope:** all
- **Target in skill:** references/types/marketing-site.md section 4 (Layout and type)
- **Status:** promoted v1.1.0

### L-005 · 2026-09-23 · medium · gotcha
- **Said / saw:** "when first part of the form gets filled and the second form appears, this warning comes, even thought i did not yet press the send request button" (the toast "Please tell us your name." on reaching step three)
- **Context:** kodexa-website request form. Continue (type="button") and Send request (type="submit") rendered in the same spot, so React reused one <button> and changed its type during the click; the browser then submitted the form. Shipped on main.
- **Lesson:** In any multi-step form, give the step buttons distinct keys (key="continue" / key="send") so React never mutates one into the other, add an onSubmit guard that moves to the next step instead of sending before the last step, and make Enter in a one-line field advance. Test by clicking Continue on the second-to-last step and asserting no POST was sent.
- **Scope:** all
- **Target in skill:** references/types/marketing-site.md section 6 (Lead capture); SKILL.md section 5 (How done is proven)
- **Status:** promoted v1.1.0

### L-006 · 2026-09-23 · medium · correction
- **Said / saw:** "the placeholder and other text weight almost look identical" (request form, step three)
- **Context:** `.field::placeholder` used `--color-dim` (5.9:1), close to the typed text, at the same weight, so "Hamid" and "+92 300 1234567" read as answers already filled in.
- **Lesson:** Every project gets a `--color-placeholder` token clearly lighter than body text (about 3.5 to 4:1 on the field; the label carries the instruction), typed values one weight heavier (500) than placeholders (400), `opacity: 1` on `::placeholder` for Firefox, and example placeholders start with "e.g.".
- **Scope:** all
- **Target in skill:** SKILL.md section 3 (house defaults) or references/types/marketing-site.md section 6 (Lead capture)
- **Status:** promoted v1.1.0

### L-007 · 2026-09-23 · strong · stale
- **Said / saw:** `slop_scan.py` failed on AGENTS.md:29 and :31 after `next dev` ran; the lines are inside `<!-- BEGIN:nextjs-agent-rules -->`, which Next 16 writes and re-adds on every dev run, and whose own text says to commit it.
- **Context:** kodexa-website, feature/easy-navigation (committed in ecdd00e with the missing-key notice).
- **Lesson:** The anti-slop scan checks our words, not generated ones: `slop_scan.py` should skip everything between `BEGIN:nextjs-agent-rules` and `END:nextjs-agent-rules`. SKILL.md's "leave the AGENTS.md block alone" should also say to commit it, so `next dev` stops dirtying the tree.
- **Scope:** all
- **Target in skill:** scripts/slop_scan.py; SKILL.md section 3 (Next 16 specifics)
- **Status:** promoted v1.1.0

### L-008 · 2026-09-24 · medium · gap
- **Said / saw:** "check if kodexa site is missing some important pages that should be there, like a terms and condition, policies page a about us and contact page"
- **Context:** kodexa-website shipped and was about to run Meta ads with no About, Contact, FAQ, privacy policy, terms, sitemap, robots or link preview image.
- **Lesson:** Every public site ships with About, Contact, FAQ, Privacy and Terms (content as data, the privacy policy true of what the code stores), plus `app/sitemap.js`, `app/robots.js` (disallow /admin and /api) and `app/opengraph-image.js` using bundled font files. Meta lead ads require a privacy policy URL. Footer carries the legal links; the lead form links to the privacy policy next to the phone field.
- **Scope:** all
- **Target in skill:** references/types/marketing-site.md (new "Pages every site needs" section)
- **Status:** promoted v1.2.0

### L-009 · 2026-09-24 · medium · gotcha
- **Said / saw:** "check that pressing how it works does not work sometimes"
- **Context:** Lenis smooth scroll plus Next `<Link href="/#process">`: repeat clicks, clicks during a glide, and clicks from a page still gliding all landed in the wrong place (reproduced 5 of 7 cases).
- **Lesson:** Whenever Lenis is used, construct it with `anchors: true` and `stopInertiaOnNavigate: true`; it honours `scroll-padding-top`, so set that on `html` to the header height plus air. Test a repeat click and a mid-scroll click.
- **Scope:** all
- **Target in skill:** references/types/marketing-site.md motion section; references/types/3d-website.md where Lenis is set up
- **Status:** promoted v1.2.0

### L-010 · 2026-09-24 · medium · correction
- **Said / saw:** "the builder prefills the message correctly, and these extras text is correct and relevant" (screenshot: "I also need: You make the fixes too.")
- **Context:** Finder extras had one label used both as a checkbox and inside a sentence, and 9 of 26 extras repeated what the service already includes.
- **Lesson:** Optional add-ons need a checkbox `label` and a separate `phrase` for the generated message; one item reads as a sentence, several as a "- item" list. Every add-on must be something the service does not already include; check against its `includes` list.
- **Scope:** all
- **Target in skill:** references/types/marketing-site.md section 6 (Lead capture)
- **Status:** promoted v1.2.0

### L-011 · 2026-09-24 · strong · explicit rule
- **Said / saw:** "Dont mention Ammar and Owais name anywhere, where required use Hamid Javed, as Hamid should be the front of all this work"
- **Context:** About page first named both developers with their GitHub links; the footer linked github.com/owaisikhan.
- **Lesson:** On Kodexa's public sites, ads and client-facing material, the only person named is Hamid Javed (GitHub EmeDev27). Never name Ammar or Owais or link their GitHub accounts. The skill's own description of the studio may stay internal.
- **Scope:** all (Kodexa-branded work)
- **Target in skill:** SKILL.md intro and section 2 (placeholders: public-facing name)
- **Status:** promoted v1.2.0

### L-012 · 2026-09-24 · strong · choice
- **Said / saw:** "suggest better names, as they both seem to look alike" (nav: "Work" and "How it works"); picked Option B: "Our work" and "Process"
- **Context:** kodexa-website top menu. Offered three options; the user chose "Our work" / "Process" over "Projects" / "How to order".
- **Lesson:** Top-menu labels must not share a word ("Work" / "How it works" read as one link). Default labels for a studio site: Services, Our work, Process, plus the CTA button. Legal, About and Contact stay in the footer; FAQ may join the phone menu, and every added phone-menu row means re-checking that the CTA is visible on a 360x640 screen.
- **Scope:** all
- **Target in skill:** references/types/marketing-site.md section 3 (Navigation)
- **Status:** promoted v1.2.0

### L-013 · 2026-09-24 · medium · gotcha
- **Said / saw:** "would it be helpful?" then "yes add" (committing the regression checks); earlier, form tests run against a build with Supabase env stored fake leads ("Hamid", "+92 300 1234567") in the live `service_requests` table.
- **Context:** kodexa-website. Checks lived in a session scratchpad and were lost with it; the only committed audit was the skill's generic `site_audit.mjs`.
- **Lesson:** Every site ships `scripts/checks/` with `npm run check` (plain Playwright, a dev dependency, `/opt/pw-browsers/chromium` when present): one check per bug that shipped or nearly did. Form checks abort every POST in the browser by default and need an explicit `--allow-submit`, used only against a build without the database env. Prove each new check by reintroducing its bug once.
- **Scope:** all
- **Target in skill:** SKILL.md section 5 (How done is proven); references/folder-structure.md (scripts/checks)
- **Status:** promoted v1.2.0

