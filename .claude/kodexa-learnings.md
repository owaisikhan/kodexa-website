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
