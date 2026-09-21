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
| `--color-primary` | the one action colour, cyan |
| `--color-secondary` | the gradient partner, violet |
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

## Accessibility

- Decoration is `aria-hidden`. Every glow, grid and mock.
- Focus rings are visible for keyboard users, suppressed for mouse users.
- Colour is never the only signal: the selected service card gets a tick as
  well as a border, and buttons carry words rather than icons alone.
- Reduced motion is honoured globally and re-checked in each GSAP effect.
