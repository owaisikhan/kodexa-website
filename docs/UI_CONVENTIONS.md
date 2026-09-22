# UI conventions

The site is set as **editorial print**: one paper, one ink, one red, a serif
display face set large, and hairline rules instead of cards. Every rule below
follows from that. If a change needs a shadow, a blur, a gradient, a second
accent colour or a rounded card to work, it's the wrong change.

## Tokens

Defined in `app/_styles/globals.css` under `@theme`, named by role rather than
hue, so a rebrand is a token swap.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#f3f1ec` | the paper |
| `--color-bg-2` | `#ebe8e1` | the alternate band (process, service lists) |
| `--color-surface` | `#faf9f6` | inputs, the form, the chat panel's answers |
| `--color-ink`, `--color-text`, `--color-border` | `#141414` | type, and every rule between blocks |
| `--color-border-soft` | `#d3cfc5` | rules *inside* a block (between list rows) |
| `--color-muted` | `#55524b` | body copy |
| `--color-dim` | `#66625a` | labels and metadata only, never a sentence someone has to read |
| `--color-primary` | `#e4572e` | the red as a **fill**. Ink reads on it |
| `--color-red` | `#b8391a` | the red as **text** on paper. Same hue, darkened to 5.1:1 |
| `--color-on-dark`, `--color-on-dark-muted` | `#f3f1ec`, `#b5b1a8` | type on the ink band |
| `--color-success` / `--warning` / `--danger` / `--neutral` | muted | admin statuses only, always beside a word |

`--color-secondary` is ink, on purpose. There's no second accent: two accents
invite a gradient between them, and one can't produce it.

The red comes in two weights because a fill red is too light to set words in.
Anything that's *text* uses `--color-red`; anything that's a *surface* uses
`--color-primary`. Mixing them up is the commonest way to break contrast here.

## Type

- **Instrument Serif** (`font-display`) for every heading, at weight 400. It
  carries emphasis through size, never through bold.
- **IBM Plex Sans** for body copy.
- **IBM Plex Mono** (`font-mono`) for running heads, index numbers, timelines,
  captions and small print. Always uppercase with `tracking-[0.12em]` or wider.
- Emphasis is **italic and red** (`.em`), the way a magazine sets a pull word.
  One emphasised phrase per heading at most.
- A `<legend>` isn't a heading tag, so it doesn't pick up the serif from the
  base styles. Give it `font-display` explicitly.

## Recurring pieces

- **`RunningHead`** (in `ui/Section.js`) opens every section: a full-width ink
  rule, then a mono line with the section number in red on the left and a
  note on the right. It does the job a coloured card border used to do.
- **`SectionHeader`** is a running head, then the serif title, with an
  optional standfirst beside it on large screens.
- **Numbered lists instead of cards.** Services, outcomes, inclusions, terms
  and related links are all ruled rows with a mono number. A row that links
  somewhere either wipes to ink on hover (the services index) or nudges its
  title right by 4px (the smaller lists).
- **`WorkFeature`** (in `ui/WorkFeature.js`) is one project as a magazine
  spread: a plate on one side, the caption on the other, alternating sides
  down the page, with a "Fig. n" caption under the plate. Home and `/work`
  both use it, so they can't drift apart.
- **`Wordmark`** (exported from `layout/Navbar.js`) is the logo: the name in
  the serif with a red full stop. There's no letter-in-a-square mark.
- **`.panel`** is a 1px ink rule round a surface fill. No shadow, no radius.
  Use it sparingly: the form and the login box, not the content.
- **`.link-draw`** underlines a link from the left on hover.
- **`.kicker`** is the mono label.
- **`.field`** is every input. Focus shows a 2px red rule on its bottom edge.
- **`.glow`, `.block-shape`, `.grid-bg`, `.dot-bg`** are retired effects from
  earlier builds, kept as no-ops so a stray usage renders nothing.

## Buttons

Square rectangles. Ink at rest, red on hover; that's the whole interaction. The
red is the site's one accent, so it's earned by pointing at something rather
than spent on every button at rest.

| Variant | Rest | Hover |
|---|---|---|
| `primary` | ink fill, paper text | red fill, ink text |
| `ghost` | ink outline | ink fill, paper text |
| `paper` | paper fill (for the ink band) | red fill |
| `whatsapp` | WhatsApp green, ink text | slightly darker |

## Layout

- `Section` owns vertical rhythm: `py-20 md:py-28`, or `tight` for
  `py-14 md:py-20`. Don't set section padding by hand.
- The grid is 12 columns at `lg`. Headlines take 8, the index or the facts
  box takes 4.
- The navbar is 72px. Inner pages start at `pt-[104px] md:pt-[120px]`.
- **One inverted block per page**: the `CtaBand`, ink ground and paper type,
  directly above the footer. A second one would stop it reading as the end.
- The footer signs off with the name set as large as the measure allows
  (`clamp(5rem, 24.5vw, 22rem)`), `aria-hidden` because it's already in the
  header.

## Motion rules

- **The type is the picture, so the type is what moves.** The hero headline
  rises word by word out of its own line box (`overflow-hidden` on each line
  is the mask), after the masthead rules draw in from the left.
- Entrances: `Reveal`, 0.7s, `[0.16, 1, 0.3, 1]`, staggered 0.05 to 0.1.
- Scroll-linked: the process rule draws across with ScrollTrigger `scrub`.
  Everything else fires once.
- The stack ticker is a 60-second loop of italic serif. Slow on purpose.
- Hover: 0.2 to 0.5s. The services row wipe is the longest at 0.5s because
  it's the one strong movement in the list.
- Nothing animates on a value someone needs to read before it settles.

## Work plates

Every plate is 16:10, whether it's a real screenshot or a drawing, so the
spreads keep one rhythm.

- Screenshots are `object-cover object-top`: the top of a screenshot is the
  part that explains the product.
- Drawings live in `_components/ui/WorkMock.js` (`store`, `dashboard`,
  `phone`) and are line art: ink hairlines on paper, with exactly one element
  in red to show where the eye should go. A product image is a box with a
  cross through it, the draughtsman's convention for "image goes here".
- The caption says "Screenshot" or "Drawn from the build", so a drawing never
  pretends to be a photo.

## Responsive rules

- **Hero type is sized by whichever dimension is tighter**:
  `clamp(3.3rem, min(8.6vw, 11.5vh), 8.25rem)`. Width alone hands a 1366x768
  laptop a 27-inch monitor's headline and pushes the button below the fold.
- **The services index collapses** from six columns to number, title and
  arrow, with the description and timeline beneath. The hero's side index is
  hidden below `lg` because the services section follows immediately.
- **`.tap` on every inline link.** Under `pointer: coarse` it grows the hit
  area to 44x44 without changing anything on a mouse-driven screen.
- **The chat panel sits above the WhatsApp button**, not over it
  (`bottom-36`), and its height is capped by `100svh - 15rem` so it never runs
  under the navbar on a short screen.

The checks that keep this honest: the hero call to action is above the fold
at 1366x768, 1280x720, 1440x900, 1920x1080, 768x1024, 390x844 and 360x740; no
page scrolls sideways at 320, 390, 768, 1024 or 1366; and no link or button on
a touch phone is under 44px.

## Accessibility

- Every colour pairing in use passes WCAG AA. Measured: ink on paper 16.3:1,
  muted 6.9:1, dim 5.4:1, red text on paper 5.1:1, paper on ink 16.3:1, ink on
  the red fill 5.0:1, and every admin status chip 5.4:1 or better.
- Colour is never the only signal: statuses carry a word, the selected
  service in the form carries a tick, and buttons carry words, not just icons.
- Decoration is `aria-hidden`: the ticker's duplicate, the footer wordmark,
  the row-wipe fill, the drawn plates (which carry an `sr-only` label).
- The hero `h1` has an `aria-label` with the whole sentence, because its words
  are split into spans for the animation.
- Reduced motion is honoured globally and re-checked in each GSAP effect.
