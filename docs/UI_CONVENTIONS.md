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
| `--color-secondary` | a cool silver, not a second hue. See below |
| `--color-success` / `--warning` / `--danger` | states, and service accents |

Three text weights, not five. Body copy is `--color-muted`; `--color-dim` is
for labels and metadata only, never a sentence someone has to read.

## Recurring classes

- **`.panel`** is the glass card: border, faint fill, blur. Add `.panel-hover`
  for the lift and glow on hover.
- **`.container-x`** is the page gutter. Sections never set their own.
- **`.grid-bg`** is the engineering grid, masked to fade at the edges. Used
  behind the hero, the CTA bands and the page headers.
- **`.glow`** is a blurred colour blob. Always `pointer-events: none` and
  `aria-hidden`.
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

## Why there is only one accent

The first build was cyan on blue-black with a violet gradient partner. That
combination is the most recognisable tell of a generated interface there is,
and it made a studio that builds software for a living look like it had
ordered its own site from a prompt.

Only the colours changed. The canvas is a true neutral black rather than a
blue-black, the greys are neutral, and one acid lime does every job an accent
does.

`--color-secondary` is a cool silver rather than a second hue. That is
deliberate: the codebase has a dozen `from-primary to-secondary` gradients
(the logo mark, the chat launcher, the process spine, the form's progress
bar), and with one accent against a grey scale each of them reads as a sheen
across the lime instead of a trip across the colour wheel. Two accents invite
the gradient. One cannot produce it.

`.text-gradient` is the exception and is set explicitly to white into grey.
The headline is the largest thing on the page, so it is the one place an
accent-to-accent gradient gives the whole site away.

One thing the hue forced. Lime pushes far more apparent brightness through the
hero's 90px blur than the cool accent it replaced, so at full opacity the orbs
washed the entire first screen olive. They settle at 0.22 now, and every
ambient wash in the site uses `--color-primary-dim` where it used to use
`--color-secondary`, because a blurred silver orb is fog rather than light.

Measured against the canvas: `--color-text` 18.95:1, `--color-primary`
13.80:1, `--color-muted` 7.60:1, and `--color-dim` 5.19:1, up from 3.77:1 on
the old palette. `--color-dim` is still for labels and metadata only, never a
sentence someone has to read.
