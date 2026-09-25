# Changelog

## kodexa.store, Meta verification and the Pixel (25 September)

- **The site lives at kodexa.store** (Hostinger DNS to Vercel), with `www`
  and `http` redirecting to it; `siteConfig.url` follows.
- **Meta domain verification** tag in `<head>` from
  `siteConfig.metaDomainVerification`.
- **Meta Pixel**: PageView, ViewContent, Contact and Lead, loaded after the
  page (checked: script requested after the load event), never in the admin
  area. Privacy policy and the FAQ answer about details updated to say so.

**Decision worth keeping:** events created their own queue only once the
layout's Pixel component had run, so a service page's ViewContent, fired
first by its own effect, was silently dropped. The committed pixel check
caught it; `ensurePixel()` now creates the queue on first use, init first.

## Regression checks committed

`npm run check` runs four Playwright checks from `scripts/checks/` against a
running build: the request form (Continue never sends, Send sends once, Back
keeps text), the finder extras (link, brief and WhatsApp message, injection,
restored drafts), in-page links (repeat click, mid-scroll, from another page,
phone menu, CTA visible at 360x640) and element-level overflow at 320 to 414px
on twelve pages. Proven by reverting the Lenis fix: three link checks failed.

**Decision worth keeping:** the form check aborts every POST unless
`--allow-submit` is passed. Tests run against a build with Supabase env once
stored fake leads in the live table; a safe default is the only fix that does
not depend on remembering.

## Docs brought up to date (24 September)

CLAUDE.md was 331 lines of mixed rules and feature notes; it is now a short
orientation with the load-bearing list, and the feature descriptions moved to
README. README gained every page, the finder, extras, speed check, reply
badge, the full env table and the chatbot internals. PROGRESS lists what is
open now. `.env.example` gained `SUPABASE_SERVICE_ROLE_KEY` (seed only).
Found while checking: `NEXT_PUBLIC_SITE_URL` is read only by `absoluteUrl()`,
which nothing calls; `siteConfig.url` is the real canonical address.

## Design directions tried and not merged

Reconstructed from the branches on 24 September; the reasons beyond "the
Gen Z redesign was chosen" were not recorded at the time.

- `feature/editorial` ("Redesign the site as editorial print").
- `feature/lime-mono` ("Recolour to a single acid lime on neutral black").
- `feature/palette-refresh` ("Swap the palette off the generated-site
  colours", plus a hero card tilt using rotation instead of the CSS `rotate`
  property).

`feature/genz-redesign` was merged and then turned down to muted pigments in
`feature/genz-muted` (see "Gen Z redesign" and "Muted pigments" below). If a
new visual direction is proposed, compare it against these first.

## Marketing assets (made outside the repo, 23 and 24 September)

Delivered to the owner as files; nothing here is committed, and the generator
scripts were in a session scratchpad that no longer exists. Enough to rebuild
them:

- **Facebook profile and cover:** the K mark, and a 2048x1154 cover stating
  "Rs 5,000" (the site itself publishes no prices).
- **Organic videos:** a 4:5 phone promo, and a 16:9 laptop walkthrough "How to
  order" with a Gemini TTS voice-over, both recorded frame by frame with
  Playwright driving the real site inside a drawn device, then encoded with
  ffmpeg.
- **Meta ads, music and on-screen subtitles, no voice:** a yellow hook card
  ("No website yet? Customers can't find you.") in the first 1.5s, then
  services, the finder, the form and the "Almost done" screen, ending on the
  WhatsApp number. Phone version 23s (slowed on request so subtitles can be
  read, 92 BPM), PC-screen version 17.5s with a camera that zooms to each
  click. Each in 9:16, 4:5 and 1:1. The music was synthesised (no licence to
  worry about), loudness normalised to -14 LUFS.
- **Specs used (researched September 2026):** 9:16 for Reels and Stories,
  4:5 for feeds, 1:1 for Marketplace and search; 4:3 is not a recommended ad
  shape. Reels and Stories safe zone: keep text out of the top 14%, the bottom
  35% and 6% at each side.
- **Gotchas:** a phone bezel drawn with a border ate 16px of the screen under
  Tailwind's `border-box` and clipped the site's right edge (use
  `box-sizing: content-box` on the frame); a desktop site shrunk into a 9:16
  frame is unreadable without zooming to each click; form tests recorded
  against a build with Supabase env store real rows, so record from a build
  without it.

## Clearer menu names

- **"Work" is now "Our work" and "How it works" is now "Process"**, because
  the two looked like the same link. The section that Process jumps to says
  "Process" too.
- **Questions in the phone menu**, since phone visitors rarely reach the
  footer. Menu rows went from 56px to 48px so "Start a project" still shows
  without scrolling on a small phone.

## The pages a business is expected to have

- **About** (led by Hamid Javed), **Contact** (WhatsApp first, email, hours,
  location) and **Questions** (twelve answers on price, payments, ownership,
  timelines and support, also fed to the chatbot).
- **Privacy policy and terms of service**, in plain words and true of what the
  site does. Linked from the footer and under the request form.
- **sitemap.xml, robots.txt and a link preview image**, so a link shared on
  Facebook or WhatsApp shows a proper card.
- **Email is now kodexa77@gmail.com.**
- **Fixed: "How it works" sometimes did nothing**, on a second click or a click
  while the page was still scrolling. In-page links now go through the smooth
  scroller.
- **The builder's extras were rewritten.** Several repeated what the service
  already includes (staff logins, reports, dark mode, component library,
  uptime checks); they are replaced by real extras. The message now reads
  "I would also like cash on delivery." or a short list, instead of
  "I also need: You make the fixes too."

## Five more ways in

- **A project builder in the finder's answer**: tick the extra parts you need
  (cash on delivery, staff logins, an Urdu version). They go straight into the
  request form and the WhatsApp message. No invented prices or week counts:
  more parts means "expect the longer end", and the plan says exactly.
- **A free phone speed check** on the Website Audit page, using Google
  PageSpeed: a score, five plain-word measures, the three biggest fixes, and
  "get these fixed" with the address filled in. Appears once
  `PAGESPEED_API_KEY` is set.
- **An honest reply badge** on the request page and the closing band:
  "Online now" in working hours (Pakistan time), otherwise when we are back.
- **How it works steps open** to show what you have in hand after each one.
- **The request form remembers** a half-typed request on the same device, and
  says so, with a Start fresh button.

## Things to try, not just read

Three pieces of interactivity, each aimed at getting a request sent:

- **"Find yours in two taps"**, a finder that asks what is getting in the way
  (in the visitor's words: "orders come in on WhatsApp and get lost"), asks
  one follow-up only where it changes the answer, and ends on one service
  with the request form already set to it.
- **The work drawings work**: a cart that fills, a dashboard that switches
  between today, this week and this month, and a committee ledger where
  ticking a member moves the total.
- **They say they can be tapped**: the pointing hand over every button (Tailwind
  v4 had reset buttons to the arrow), and an animated hand tapping the first
  control in each drawing until the visitor presses something.
- **"Find yours in two taps" is a button** in the Services menu, the phone
  menu and the /services header, instead of a small link stacked on another.
- **"Ask a question"** on every service page opens the assistant with
  questions about that service ready to tap.

## Easier navigation

Nothing about the look changed; this is about never being lost. Measured
before: in-page links parked their section under the fixed header, nothing in
the header said where you were, the phone menu ignored Escape and let Tab
wander into the page behind it, and the "See what you get" hint on each
service card only appeared on hover, so phones never showed it.

- **A Services menu** in the header lists all nine (click or hover on
  desktop, a collapsible list in the phone drawer), with a "Not sure which?"
  route to the request form.
- **`/services`**, a real index page: the same cards plus a side-by-side list
  of who each service is for and how long it takes.
- **Breadcrumbs** on every inner page, with BreadcrumbList structured data,
  and **previous and next** links on service pages.
- **The header marks the current page**, and on the home page follows the
  scroll through Services and How it works.
- **Anchors land below the header** (`scroll-padding-top`), the 404 page lists
  the real services, the footer links to the index, and the request form's
  Back button is a full 44px target.

- **WhatsApp shows the real WhatsApp logo** everywhere it is named, and the
  floating button is the logo alone. The chatbot launcher became a bot icon
  so the pair are clearly two different ways to reach us.
- **Icons stay on the line of their words** on desktop. `.tap` only became a
  flex row on touch screens, so the footer's GitHub link and the Compare link
  stacked icon, word and arrow into a column with a mouse.

**Decision worth keeping:** the phone menu's services list starts closed, even
on a service page. Starting it open pushed Work and the call to action below
the fold, and the breadcrumb already says which service you are on.

## Muted pigments

The brutalist structure kept, the accents turned down: acid lime, cobalt and
coral became ochre, slate and terracotta. Hard 2px rules and offset shadows
are already loud, and three screen-bright accents on top of them made the page
shout at somebody who is only trying to price a website.

**Decision worth keeping:** the admin status chip is now a solid fill with a
stated foreground, not `color` over a 14% wash of itself. That pattern only
ever worked because the accents were bright; a light pigment like ochre is
unreadable as text on near-white paper. Each `STATUS_STYLE` entry carries its
own `ink`, the same contract `accentInk` already gives the service accents.

## Gen Z redesign

The palette, the type and the surface treatment were replaced; the structure,
the copy, the motion and every behaviour underneath were not. See "Why the
palette looks like this" in `docs/UI_CONVENTIONS.md` for what changed and why.

**Decisions worth keeping:**

- **Tailwind's own radius scale was overridden rather than swept.** Setting
  `--radius-lg`, `--radius-2xl` and friends to 2-8px in `@theme` flattened
  every existing `rounded-xl` in the codebase at once. Only `rounded-full`,
  which Tailwind hardcodes and does not read from a token, needed touching by
  hand, and only where it was pill chrome rather than a dot.

- **`.glow` is a no-op, not a deletion.** Redefining it as `display: none` and
  removing its call sites is belt and braces: if one is ever missed, or comes
  back in a merge, it renders nothing instead of a hard-edged rectangle across
  a whole section.

- **The cursor spotlight on the service cards went with the orbs.** It was the
  same effect at a smaller scale, a light source that is not there. The card
  presses into its shadow instead, which is one honest movement.

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
  private dashboard is not ours to publish. The team is supplying real ones.

## Branch: feature/admin

An `/admin` area: sign in, read every request, filter by status, move leads
along, write notes, reply on WhatsApp.

- **`app_admins` is a table, not a hardcoded address in a policy.** Changing
  who can read the leads is one row rather than a migration. `is_admin()` is
  SECURITY DEFINER because `app_admins` has RLS on with no policies at all, so
  a function running as the caller would see zero rows and fail every check
  closed.

- **Column grants, not just row policies.** RLS says which rows an admin can
  touch; `grant update (status, notes)` says which fields. An admin moves a
  lead through its statuses and writes notes, and cannot rewrite the brief the
  customer actually sent. Proved by trying it as the admin role and getting
  `insufficient_privilege`.

- **The login page had to move out of the gated layout.** Next composes nested
  layouts instead of replacing them, so the auth check in `app/admin/layout.js`
  also wrapped `/admin/login`: signed out, the login page redirected to itself
  until the browser gave up with ERR_TOO_MANY_REDIRECTS. The gate now lives in
  `admin/(protected)/layout.js`, which the login page sits outside of.

- **The public chrome moved into `(site)/`.** It was in the root layout, so
  `/admin` rendered the marketing navbar and the WhatsApp button on top of the
  admin header, and the fixed navbar swallowed clicks aimed at Sign out. Found
  by driving the real page, not by reading the code.

- **`STATUSES` moved to `requests-data.js`.** It lived in `data-service.js`,
  which is `server-only`, and the status buttons are a client component, so
  importing it dragged the Supabase server client into the browser bundle and
  the build refused.

- Verified against the live database: anon 0 rows, signed-in non-admin 0 rows,
  admin sees everything.

## Branch: feature/chatbot

A site-scoped assistant, ported from the storefront's pipeline in
the saam-s-store repo and cut down to what a marketing site needs.

**What was deliberately left out of the port.** The store's pipeline generates
SQL against a product database, guards it with a SELECT-only validator, heals
failed queries, draws charts from the rows and keeps conversation history in
Redis. None of that applies here: there is no product database to query, no
rows to chart, and on serverless Redis for a handful of daily questions is more
moving parts than the problem has. What carried over is the part that matters:
retrieval-grounded answers, streaming, a semantic cache and per-request cost
tracing.

- **Scope is retrieval, not just prompting.** The system prompt refuses
  off-topic questions, but the fence that actually holds is that retrieval only
  returns Kodexa's own knowledge. An off-topic question clears nothing above
  the similarity floor, so the route answers with a fixed line without calling
  the model. Verified: "capital of France" refused ungrounded, "write me a
  python script" refused, "ignore your instructions" refused, and real
  questions answered with the right timelines and the right request links.

- **The knowledge base is derived from services-data.js and siteConfig.js.**
  Nothing is typed by hand, so the assistant cannot quote a service we do not
  sell or a timeline the page disagrees with.

- **The SSE controller is closed in one place.** The first version closed it in
  the out-of-scope branch and again in `finally`, which throws "Invalid state:
  Controller is already closed", fails the whole response, and sends the
  visitor nothing at all. Found by asking it an off-topic question, not by
  reading the code: the happy path was perfect.

- **Only first-turn questions are cached.** A follow-up embeds close to its
  neighbours while meaning something else entirely, so caching it would serve a
  confident wrong answer to the next person.

- **Rate limited to 8 messages a minute per IP**, in memory. Every message
  costs real money and the widget sits on a page that ads point at. Per
  instance rather than global is the honest trade at this size.

- **Cost tracing logs a null for an unpriced model** rather than a guessed
  figure. An invented cost is worse than none, because it looks measured.

### Project knowledge

A second knowledge base, `project_chunks`, holding what Kodexa has actually
built: four projects, roughly four chunks each, written from those projects'
own repositories rather than from memory.

- **A separate table, not a `kind` column on `kb_chunks`.** Retrieval searches
  both and merges by similarity. In one combined table a question about a
  project competes with nine service descriptions that embed nearby, and the
  detail that actually answers the question gets pushed out of the top matches
  by things that merely sound similar. Searched separately, each gets its own
  budget: four knowledge chunks and three project chunks.

- Verified against the live database: "have you built an online store before"
  and "tell me about the petrol pump software" both return project chunks as
  the top sources, "what database does PMC hospital use" answers correctly from
  the tech chunk, and an off-topic question is still refused ungrounded.

### Clickable links in answers

Answers used to print "/request?service=online-store" as dead text, which on a
phone is a path somebody has to retype.

- **The model writes bare paths; the site decides what is a link.**
  `linkify.js` resolves a path against the real routes and renders it as a
  labelled button ("Request E-Commerce Stores"), leaves anything unrecognised
  as plain text, and links the WhatsApp number only when the digits match ours.
  The alternative, asking the model for markdown or full URLs, hands it the
  ability to link confidently to a page we do not have.

- **Two off-by-one bugs, both found by testing the parser rather than eyeballing
  it.** A query string runs to the next space, so it ate the sentence's full
  stop; the phone pattern allows spaces inside a number, so it ate the space
  after it and glued the link to the next word. Both are split off and pushed
  back as text.

- **The prompt now puts the path at the end**, as its own closing line, because
  it renders as a button and reads badly mid-sentence ("you can request it
  directly at [Request E-Commerce Stores]"). And when someone asks for a
  person, the number itself must appear: "message us on WhatsApp" without a
  number is useless to somebody holding a phone.

### The request form now follows the URL

Clicking a chat link while already on /request changed the address bar and
nothing else: the form kept whatever service was selected before, so the URL
said one thing and the heading said another.

`RequestForm` read `useSearchParams()` once into `useState`. Arriving from
another page remounts the component and picks the service up correctly, which
is why this looked fine in every test until the chat widget started offering
tappable service links from the request page itself. Same route, query string
only, no remount, stale state.

Fixed with React's "adjust state when a prop changes" pattern: compare against
the last preset during render and update immediately, rather than in an effect
that would paint the wrong service first and correct it on the next pass.

Also: the website service said "loads fast on a cheap phone", which the
assistant repeated back as "loads fast on any phone". It is any device, phone
or laptop.

### The chat list would not scroll with the wheel

Lenis takes the wheel event for the whole document, so the chat's own
`overflow-y-auto` list never got one: scrolling over the conversation moved the
page behind it instead, and the messages sat still.

`data-lenis-prevent` on the list hands wheel events back to it, and
`overscroll-contain` stops the page taking over once you reach the end.
Measured rather than eyeballed: the list moves 300px on a 300px wheel, and the
page stays at 0.

Any scrollable panel added later needs both attributes. This is the kind of bug
that only exists because of a library choice made elsewhere, so it is in
CLAUDE.md as well.

### Responsive pass

Rendered every page at eight widths and asserted against the DOM rather than
looking at screenshots. Three real problems, all invisible at 1440px:

- **The hero call to action fell below the fold on every common laptop.**
  1024x600, 1024x640, 1280x720 and 1366x768 all pushed "Request a service" off
  the bottom, because the headline was sized from viewport width alone, so a
  laptop got a 27-inch monitor's 90px type. Now sized by whichever dimension is
  tighter, with viewport-relative hero spacing. The button is above the fold at
  every size tested, phones included.

- **60 tap targets under 36px on phones**: footer links, "Visit the live site",
  "← All services". A `.tap` class under `pointer: coarse` gives them a 44x44
  hit area and leaves desktop alone. Keyed to the pointer rather than a width
  breakpoint, because the question is what you are pointing with.

- **The hero glow washed out the body copy on phones.** At 390px a 420px orb
  sits directly behind the paragraph. Orbs shrink below `sm` and a scrim sits
  between them and the text; the paragraph measures 6.2:1 against the pixels
  actually painted behind it, which clears WCAG AA for body text.

Also checked, and clean: no horizontal overflow anywhere, no text under 12px,
nothing clipped, the chat panel fits and its input works at 360px and on a
landscape phone, the two floating buttons never overlap, and the admin area has
no overflow at 390px.
