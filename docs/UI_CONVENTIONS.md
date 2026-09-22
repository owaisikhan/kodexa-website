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
| `--color-primary` | the one action colour, acid lime |
| `--color-secondary` | the structural colour, cobalt |
| `--color-accent` | the interruption colour, coral. Decoration only |
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
- Pages that start under the fixed navbar need `pt-[136px]`; the navbar is
  72px and the rest is breathing room.

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
- **The glow orbs shrink on phones**, and the hero carries a scrim below `sm`.
  At 390px wide a 420px orb sits directly behind the body copy; measured, the
  paragraph now reads at 6.2:1 against what is actually painted behind it.

The checks that keep this honest are not eyeball work: render every page at
360, 390, 414, 768, 1024, 1280, 1440 and 1920, then assert no horizontal
overflow, nothing past the right edge, no text under 12px, no tap target under
36px, and the hero's call to action above the fold.

## Accessibility

- Decoration is `aria-hidden`. Every glow, grid and mock.
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
- **Three saturated accents that clash slightly on purpose**: acid lime for
  every action, cobalt for structure, coral as an interruption. No gradient
  anywhere between two accents.
- **Type as the layout.** Bricolage Grotesque set solid at 0.95 line-height
  carries the page; DM Sans reads underneath it; JetBrains Mono handles labels,
  stats and timelines so the small print looks like a spec sheet.

Accents are painted as solid blocks now, not a 10% wash, so every accent needs
a stated foreground. That pairing lives in `accentInk` next to `accentVar` in
`_components/ui/ServiceIcon.js`. Lime and amber take ink, cobalt and green take
paper. Measured against their backgrounds, the lowest ratio in the palette is
`--color-dim` on paper at 4.56:1, and `--color-success` was darkened from
`#0f8a4d` to `#0a7340` specifically to clear 4.5:1 for paper-on-green.
