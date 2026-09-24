# UI conventions

## Tokens

Defined in `app/_styles/globals.css` under `@theme`, named by role rather than
hue, so a rebrand is a token swap rather than a search for `cyan`.

| Token | Use |
|---|---|
| `--color-bg`, `--color-bg-2` | page background, alternating bands |
| `--color-surface`, `--color-surface-2` | inputs and inner panels |
| `--color-border`, `--color-border-soft` | panel edges, hairlines |
| `--color-text`, `--color-muted`, `--color-dim` | the three text weights |
| `--color-primary` | the one action colour, ochre |
| `--color-secondary` | the structural colour, slate |
| `--color-accent` | the interruption colour, terracotta. Decoration only |
| `--color-neutral` | the inert chip, stone. Used for a status with no state |
| `--color-ink` | the colour of every rule, shadow and border |
| `--color-on-dark` | text that sits on cobalt or green |
| `--color-success` / `--warning` / `--danger` | states, and service accents |

Three text weights, not five. Body copy is `--color-muted`; `--color-dim` is
for labels and metadata only, never a sentence someone has to read.

## Recurring classes

- **`.panel`** is the card: a solid fill, a 2px ink rule and square-ish
  corners. Add `.panel-raised` for a static offset shadow, or `.panel-hover`
  to make it press into that shadow when the cursor is on it.
- **`.container-x`** is the page gutter. Sections never set their own.
- **`.grid-bg`** is diagonal ink hatching, and `.dot-bg` is a dot screen. Both
  are background texture behind the hero, the CTA band and page headers.
- **`.block-shape`** is a flat rectangle of accent colour with an ink outline,
  used as hero decoration. Always `pointer-events: none` and `aria-hidden`.
- **`.glow`** is retired and renders nothing. It is kept as a no-op so an old
  usage degrades to invisible rather than to a hard rectangle across a page.
- **`.text-mark`** is the marker stroke behind a phrase. It paints the
  highlight with a box-shadow so the text keeps its own colour, which is what
  keeps its contrast ratio measurable.
- **`.field`** is every input, select and textarea.
- **`.kicker`** is the small uppercase label above a heading.

## Layout

- `Section` owns vertical rhythm: `py-24 md:py-32`, or `tight` for `py-16
  md:py-20`. Do not set section padding by hand.
- `SectionHeader` owns the kicker + title + body block.
- The navbar is 88px. Full-height sections start with `pt-[88px]`; inner
  pages use `ui/PageHero.js` (breadcrumbs, one h1, one line, `pt-[152px]`).
  See "Load-bearing things" in CLAUDE.md before changing the header.
- Legal pages share `legal/LegalPage.js`: a contents list (sticky on
  desktop), numbered sections with ids, a "Last updated" date from the data.

## Motion rules

- Entrances: `Reveal`, 0.7s, `[0.16, 1, 0.3, 1]`, staggered by 0.06 to 0.1.
- Scroll-linked: GSAP ScrollTrigger, `scrub` only for things that should track
  the scroll exactly (the process rail). Everything else fires once.
- Hover: 0.3 to 0.35s. Anything slower feels broken on a trackpad.
- Nothing animates on a value a user needs to read before it settles.

## Work cards

Every card leads with a 16:10 image area, whether that is a real screenshot or
a drawn mock, so the grid keeps one rhythm no matter which it is.

- Screenshots are `object-cover object-top`: the **top** of a screenshot is the
  part that explains the product, so a tall image loses its bottom, not its
  header.
- A screenshot gets a short fade at its bottom edge, only so a bright screen
  does not fight the dark panel border.
- Mocks are drawn in `_components/ui/WorkMock.js`: `store`, `dashboard` and
  `phone`. Add a kind there rather than reaching for an image.
- Hover scales a screenshot by 1.03 over 700ms. Mocks do not scale; their
  contents animate in on scroll instead.

## Responsive rules

- **Hero type is sized by whichever dimension is tighter**, not by width alone:
  `clamp(2.5rem, min(7vw, 8.5vh), 5.4rem)`. Width alone hands a 1366x768 laptop
  the same 90px headline as a 27-inch monitor, and the hero's button falls off
  the bottom of the screen on the commonest laptop resolution there is.
- **Hero spacing is viewport-relative** (`hero-pad`, `hero-gap-sm`,
  `hero-gap-lg`), so a short screen closes the gaps instead of holding a
  desktop rhythm open.
- **`.tap` on any inline link.** Under `pointer: coarse` it grows the hit area
  to 44x44 without changing anything on a mouse-driven screen. A 17px-tall
  footer link is a miserable thing to hit with a thumb.
- **Buttons wrap below `sm`** (`max-w-full text-balance`, `sm:whitespace-nowrap`
  in `ui/Button.js`). A nowrap label inside a section with `overflow-hidden`
  runs off a phone and the page-level overflow check never sees it, so check
  elements, not just the page. A full-width action on a phone gets
  `w-full sm:w-auto`.
- **Inputs are at least 16px** on phones (the chat input included), or iOS
  zooms the page when one is focused.

The checks that keep this honest are not eyeball work: render every page at
360, 390, 414, 768, 1024, 1280, 1440 and 1920, then assert no horizontal
overflow, nothing past the right edge, no text under 12px, no tap target under
44px, and the hero's call to action above the fold. Inline links in running
text get `.tap` too; the audit counts them.

## Navigation

- **Where you are is always marked.** Routes use `aria-current="page"`; on
  the home page the marker follows the scroll through `#services`,
  `#finder` and `#process` (an IntersectionObserver in `Navbar.js`, `SPY_SECTIONS`) with
  `aria-current="location"`.
- **Services is a menu, not an anchor.** Desktop opens on click or hover;
  phones get a collapsible list in the drawer that starts closed. Both close
  on Escape (focus returns to the button), an outside click and any link. The
  drawer traps Tab while open.
- **Every inner page has a breadcrumb** (`ui/Breadcrumbs.js`, which also
  writes BreadcrumbList data). Service pages end with prev and next links that
  wrap around.
- **Two actions that matter are two buttons**, primary and ghost, never two
  stacked underlined links (the finder's "Find yours in two taps" and
  "Compare all nine" were missed that way).
- **Nothing that explains a card is hover-only**: `[@media(hover:none)]:opacity-100`.
- **WhatsApp always shows the real WhatsApp logo** (`ui/WhatsAppIcon.js`);
  the chatbot launcher is a bot icon so the two floating buttons never look
  alike. The WhatsApp button hides on `/request`, which is the WhatsApp
  handoff already.
- `.tap` is a flex row everywhere; only its 44px growth is touch-only.
- The header sits at `z-[60]`, above the chat and WhatsApp buttons.

## Forms

- `--color-placeholder` is clearly lighter than typed text, typed values are
  weight 500 and placeholders 400, and every example placeholder starts with
  "e.g.". A placeholder as dark as an answer makes an empty form look filled.
- Multi-step forms: distinct `key` on each step's button, Enter in a one-line
  field advances, and nothing is sent before the last step.
- Success copy is honest: "Request received" only when a row was stored,
  otherwise "Almost done" and the WhatsApp step.

## Accessibility

- Decoration is `aria-hidden`. Every grid, block shape and mock.
- Questions and answers use native `<details>` (`company/FaqList.js`): they
  work without JavaScript and announce as expandable.
- Focus rings are visible for keyboard users, suppressed for mouse users.
- Colour is never the only signal: the selected service card gets a tick as
  well as a border, and buttons carry words rather than icons alone.
- Reduced motion is honoured globally and re-checked in each GSAP effect.

## Why the palette looks like this

The first build was dark by default, with a cyan-to-violet gradient, frosted
glass panels, blurred accent orbs and Inter. Every one of those is a
documented tell of a generated interface, and together they made a studio that
builds software for a living look like it had ordered its own site from a
prompt.

What replaced it:

- **Paper, not a dark canvas.** A warm bone sheet reads as printed matter and
  is what a small-business owner is used to reading a quote on.
- **Ink rules and hard offset shadows instead of blur.** A card sits on the
  page rather than floating over it. Hover presses it into its own shadow;
  nothing lifts and nothing glows.
- **Three muted pigments**: ochre for every action, slate for structure,
  terracotta as an interruption. No gradient anywhere between two accents.
  Hard 2px rules and offset shadows are already loud, and three screen-bright
  accents on top of them made the page shout at somebody who is only trying to
  price a website. These hold the same structure at a readable volume.
- **Type as the layout.** Bricolage Grotesque set solid at 0.95 line-height
  carries the page; DM Sans reads underneath it; JetBrains Mono handles labels,
  stats and timelines so the small print looks like a spec sheet.

Accents are painted as solid blocks, not a 10% wash, so every accent needs a
stated foreground. That pairing lives in `accentInk` next to `accentVar` in
`_components/ui/ServiceIcon.js`, and in the `ink` field on each entry of
`STATUS_STYLE` in `_lib/requests-data.js`. Ochre and terracotta take ink,
slate and forest take paper.

The status chip in the admin list used to print its colour as text over a 14%
wash of itself. That reads for a bright screen colour and fails completely for
a pigment: ochre text on near-white paper is not readable. The chip is a solid
fill with an ink rule now, which is what every other coloured thing on the
site already is.

Measured: ink on paper 15.35:1, muted 6.84:1, dim 5.32:1, ink on ochre 8.98:1,
paper on slate 10.62:1, paper on forest 6.20:1, ink on terracotta 5.01:1.
