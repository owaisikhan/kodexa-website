# Changelog

## Initial build

The site: home, nine service pages, work, a three-step request flow, 404 and
error pages. Dark, motion-led, deliberately light on text.

**Decisions worth keeping:**

- **The request form is controlled, not DOM-driven.** The first version kept
  values in the inputs and rendered hidden copies of the inactive steps so one
  submit would carry everything. That loses data: `FormData.get` returns the
  first match, so on the last step the hidden empty copy of step one won and
  the business name and brief submitted blank. The values now live in one state
  object and the steps are free to unmount.

- **The reference code is generated in `actions.js`, not by Postgres.** The
  insert originally used `.select("reference").single()` to read back the
  column default. Under RLS that also applies the table's SELECT policy, and
  `service_requests` deliberately has none, so every insert failed with "new
  row violates row-level security policy". Adding a SELECT policy would have
  let anyone with the public key read every lead. Generating the code app-side
  keeps the table write-only.

- **A missing database never blocks a lead.** `submitRequest` checks whether
  Supabase is configured and, if it is not, still returns success with the
  WhatsApp link. Same if the insert errors. The message reaching the phone
  matters more than the row.

- **`[data-animate]` hides, GSAP shows.** The global rule that sets
  `opacity: 0` on that attribute hid the hero heading, because the timeline
  animated the heading's *spans* rather than the heading. The hero now marks
  its heading `data-lines`, which nothing hides.

- **Work is drawn, not screenshotted.** Most of these projects are behind a
  login and are not ours to publish. `WorkMock` draws the kind of screen each
  one is, so nothing goes stale and nothing pretends to be a photo.

## Branch: feature/real-screenshots

- **The header is bigger.** 72px to 88px, with a larger mark, wordmark and nav
  links. Every offset derived from it moved with it (`pt-[88px]`,
  `pt-[152px]`, `top-[88px]`); they are hardcoded in five files, so a future
  resize means the same sweep.

- **The hero chip was unreadable.** Small muted grey text sat directly on the
  cyan glow behind it. It is now a denser, darker pill with full-strength text
  at a larger size, so it stops depending on whatever the glow is doing behind
  it.

- **Work cards take real screenshots.** `WorkMock` renders `shot` when a
  project has one and falls back to the drawing otherwise. Adding a screenshot
  is a file in `public/work/` plus one field in `services-data.js`.

  Verified both paths render together before shipping: a card with a real
  screenshot sitting beside three drawn ones looks like one grid, which is why
  the image area is a fixed 16:10 regardless of which is used.

- **No screenshots included yet, deliberately.** The candidates that are
  publicly reachable are either login screens (the pump manager, PMC) or a
  course demo carrying someone else's banner (the-wild-oasis), and a client's
  private dashboard is not ours to publish. Ammar is supplying real ones.
