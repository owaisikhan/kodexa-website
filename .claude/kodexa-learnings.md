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
| L-001 | 2026-09-23 | rule | WhatsApp always shows the real WhatsApp logo; the floating button is the logo alone | all | ready |
| L-002 | 2026-09-23 | gotcha | Icon-and-text links are flex rows at every pointer; only the 44px growth is touch-only | all | ready |
| L-003 | 2026-09-23 | rule | Interactive demos must announce themselves: pointer cursor on every button, plus an animated tapping hand until first use | all | ready |
| L-004 | 2026-09-23 | correction | A pair of important actions is two real buttons, never two underlined links stacked together; and every menu action exists on phone too | all | ready |

## Entries

### L-001 · 2026-09-23 · strong · rule
- **Said / saw:** "only write WhatsApp with a whatsapp real icon, and near the chatbot only the whatapp real logo should appear"
- **Context:** kodexa-website, feature/easy-navigation. Every WhatsApp button used lucide's generic `MessageCircle`, and the floating button carried a "Chat on WhatsApp" label beside the chatbot's own bubble.
- **Lesson:** Anywhere the word WhatsApp appears (buttons, footer contact, admin reply, request hand-off), use the real WhatsApp glyph from one `ui/WhatsAppIcon.js` (lucide has no brand icons), in brand green `#25D366` on light surfaces and white or ink on the green button. The floating WhatsApp button is the logo alone at the same size as the chat launcher, and the chat launcher uses a bot icon, so the two never look like the same app.
- **Scope:** all (every Kodexa site hands leads to WhatsApp)
- **Target in skill:** references/types/marketing-site.md section 6 (Lead capture); SKILL.md section 3 Leads row
- **Status:** ready

### L-002 · 2026-09-23 · medium · gotcha
- **Said / saw:** user screenshots of the footer (GitHub icon, word and arrow stacked in a column) and "Compare them side by side" with its arrow on the next line
- **Context:** `.tap` in globals.css set `display: inline-flex` only inside `@media (pointer: coarse)`, so on a mouse-driven screen the svg (block after the reset) took its own line. Shipped on main.
- **Lesson:** A touch-target helper may grow the hit area only under `pointer: coarse`, but the layout (inline-flex, align-items: center) belongs outside the media query. Every desktop check must include a link that holds an icon, because DOM checks and phone screenshots both miss this.
- **Scope:** all
- **Target in skill:** references/types/marketing-site.md section 4 (Layout and type); SKILL.md section 5 (How done is proven)
- **Status:** ready

### L-003 · 2026-09-23 · strong · rule
- **Said / saw:** "change the shape of the cursor when hovered over the mockups so that a new user can surely know that he can tap to see the changes", then "when hovered over a mockup, the cursor pointer should animate to show that user can tap"
- **Context:** kodexa-website, the "Try it" work drawings. Tailwind v4 resets buttons to `cursor: default`, so the controls looked inert under a mouse.
- **Lesson:** Every project carries one global rule, `button:not(:disabled), [role="button"] { cursor: pointer }`, because Tailwind v4 no longer does. Anything interactive that does not look interactive (a drawing, a demo, a mock) also gets an animated tapping hand over the one control to try first: shown on mouse hover, or on touch screens when it scrolls into view, gone for good after the first press, and still (not animated) under reduced motion. The system cursor cannot be animated in a browser, so the hint is drawn on the page.
- **Scope:** all
- **Target in skill:** SKILL.md section 3 (house defaults, a Cursor row); references/types/marketing-site.md section 5 (Motion)
- **Status:** ready

### L-004 · 2026-09-23 · medium · correction
- **Said / saw:** "find your in two taps button is not visible on mobile view and find yours in two taps and compare all 9 are stacked together, which effects visibility"
- **Context:** the Services menu and /services header offered "Find yours in two taps" and "Compare all nine" as two small underlined links, one above the other; the phone menu had only the second.
- **Lesson:** When two actions matter, make them real buttons (primary and ghost), with a gap between them, not a stack of underlined links that reads as fine print. And every action in the desktop menu must exist in the phone menu, visible without expanding anything if it is the one an undecided visitor needs.
- **Scope:** all
- **Target in skill:** references/types/marketing-site.md section 4 (Layout and type)
- **Status:** ready
