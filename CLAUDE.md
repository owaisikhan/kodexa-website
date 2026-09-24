# Working in this repo

A marketing site for Kodexa, read once by strangers on phones, usually arriving
from a Facebook post or an ad. They are not technical and they are not patient.

**The whole site has one job: get a service request sent.** Every change should
make that faster or clearer. Anything that makes it slower needs a reason.

> Built with the kodexa-builder skill (v1.2.0). Load it for any new feature or
> design work, and log preferences, corrections and reversals to
> `.claude/kodexa-learnings.md` as they happen.

Where to look next: `PROGRESS.md` (what is open right now), `README.md` (what
the site does, every feature, setup and env vars), `docs/UI_CONVENTIONS.md`
(what to match), `docs/CHANGELOG.md` (why things are the way they are, and what
was reverted).

## Ground rules

- **Plain JavaScript, App Router, Tailwind v4.** No TypeScript, no UI kit.
- **Every read lives in `app/_lib/data-service.js`, every write in
  `app/_lib/actions.js`.** Reads are the admin's (`getRequests`,
  `getRequestCounts`); the public pages are static data.
- **Actions return `{ ok, message, ... }`**, always, so one renderer handles
  every form.
- **`app/_components/ui/` knows nothing about Kodexa.** If a component mentions
  services or WhatsApp, it belongs in a domain folder.
- **Identity and content are data, never component copy.** `siteConfig.js`
  (name, number, email, hours, stats), `services-data.js` (services, process,
  work), `finder-data.js` (finder questions and extras), `company-data.js`
  (the lead, promises, FAQ), `legal-data.js` (privacy, terms).
- **Hamid Javed is the only person named on the site or in ads** (`lead` in
  company-data.js, GitHub EmeDev27). Never add other names or GitHub links
  that carry them.
- **No em or en dashes anywhere**, including comments and docs. Run the
  skill's `slop_scan.py` before committing UI.
- **Never write a secret into a tracked file.** Keys live in `.env.local` and
  Vercel only.

## Load-bearing things

Move one of these and something breaks somewhere else.

- **The navbar is 88px.** Hardcoded as `pt-[88px]` (hero, 404, error),
  `pt-[152px]` (inner pages, via `ui/PageHero.js`), `top-[88px]` (phone
  drawer, Services panel) and `scroll-padding-top: 104px` in `globals.css`.
  Change the header height and all of them move.
- **Lenis owns the scroll.** Any panel with its own `overflow-y-auto` needs
  `data-lenis-prevent` plus `overscroll-contain`, or the wheel scrolls the page
  behind it. In-page links (`/#process`, `#finder`, `#compare`) work only
  because `SmoothScroll.js` sets Lenis `anchors: true` and
  `stopInertiaOnNavigate: true`; without them a repeat click, or a click
  mid-scroll, lands wherever Lenis was already gliding.
- **`[data-animate]` is `opacity: 0` in CSS until GSAP animates it back.** A
  heading carrying it whose *children* get animated stays invisible forever
  (shipped once; the hero uses `data-lines` because of it).
- **`service_requests` is a letterbox.** Anon may INSERT only; no SELECT
  policy. Never add one. That is why the reference is made in `actions.js`,
  not read back with `INSERT ... RETURNING`.
- **Finder extra ids travel in URLs** (`?needs=cod,delivery`). Never rename a
  shipped id.
- **The privacy policy must stay true of the code.** Add analytics, a Meta
  pixel, a newsletter or a new place visitor data is stored, and update
  `legal-data.js` in the same commit with `updated` set to that day.
- **The chatbot's knowledge is derived** from services-data, siteConfig and
  company-data. Edit any of them and re-seed (see README), or the chatbot and
  the site disagree.
- **The phone menu's rows are 48px** so "Start a project" stays on the first
  screen of a 360x640 phone. Add a row and re-check that.

## Rules by area

**Admin.** Three fences, none assuming another ran: `proxy.js` redirects
without a session, `(protected)/layout.js` checks for an admin, RLS checks
again through `public.is_admin()`. Every admin action re-checks with
`getAdmin()`; signed in is not admin. The login page sits outside
`(protected)/` or it redirects to itself forever. Public chrome lives in
`(site)/layout.js`, not the root layout, or the navbar covers the admin header.

**Chatbot.** Scope is enforced by retrieval, not the prompt: nothing above the
similarity floor means the fixed out-of-scope line, with no model call. Never
let it invent a price. Links in answers are allowlisted in
`_components/chat/linkify.js` (`STATIC_ROUTES` and `PATTERN`); a new public
page the assistant should link to goes there. The SSE stream is closed only in
the route's `finally`. Only first-turn questions are cached.
`project_chunks` facts must come from that project's own repo, never a
client's numbers or staff.

**Finder and request form.** Finder `why` lines must be true of the service
page. Extras must be things the service does not already include, each with a
checkbox `label` and a message `phrase` ("I would also like ..." for one, a
"- item" list for more). The multi-step form keeps distinct `key`s on Continue
and Send, or React morphs one into the other and the form submits early.

**Pages and SEO.** A new public page goes into `app/sitemap.js`. Inner pages
use `ui/PageHero.js`. The terms never state a deposit percentage or a free
bug-fix period; they defer to the project's quote.

**Navigation.** Top menu: Services, Our work, Process, plus the "Start a
project" button. Labels must not share a word ("Work" and "How it works" read
as one link and were renamed). Privacy, terms, About and Contact stay in the
footer; the phone menu adds Questions.

**Motion.** GSAP for scroll and timelines, Motion for entrances and exits,
Lenis for the scroll. Reach for `ui/Reveal.js` before writing a tween. Reduced
motion is honoured in `globals.css` and re-checked in every GSAP effect.

**Screenshots of our work.** A real screenshot when there is one, a drawn mock
otherwise; never an invented screen or anything carrying another company's
branding. `public/work/README.md` has the procedure.

## Verifying a change

`npm run build` and `npx eslint .` catch imports and typos, not a page that
looks wrong. Then run the regression checks against a production build:

```bash
npm run build && npm start      # one terminal
npm run check                   # another; --base, --only form,builder,links,overflow
```

They cover the bugs that shipped or nearly did: the form sending on Continue,
the extras message, in-page links on a repeat or mid-scroll click, the phone
menu's call to action at 360x640, and anything past a phone's edge at 320 to
414px. By default the form check aborts every POST in the browser, so it is
safe against any build. Add a check in `scripts/checks/` when a new bug of
that kind is fixed. Then look at it:

- A real browser at 1440px and at 390px and 360px, scrolling the whole page.
- The kodexa-builder skill's `scripts/site_audit.mjs` (CTA above the fold at
  seven sizes, no sideways scroll, 44px tap targets, clean console) and
  `scripts/slop_scan.py`.
- The request flow end to end, including Back, and pressing Continue on step
  two sends nothing.
- In-page links: a repeat click and a click made mid-scroll.

**Never submit the request form in a test against a build that has the
Supabase env.** It writes real rows into the live leads table (it happened:
see PROGRESS). For the full send path, copy the repo, build it without
`.env.local`, start it, and run `npm run check -- --base <that url> --only form
--allow-submit`; it reaches "Almost done" and stores nothing.
When running `next start` for a test, pass `PAGESPEED_API_KEY` at runtime too,
or the speed check reports "not set up".

## Things already tried

- `lucide-react` v1 has no `Github` icon; use `GitBranch` or an inline SVG.
- `INSERT ... RETURNING` on `service_requests` fails under RLS, on purpose.
- `whitespace-nowrap` on every button pushed long labels ("Open WhatsApp with
  your details") off narrow phones inside clipped sections. Buttons now wrap
  below `sm` and stay on one line from `sm` up.
- One label per finder extra, used both as the checkbox and inside the
  message, produced "I also need: You make the fixes too." Each extra now has
  a separate `phrase`.
- Starting the phone menu with Services open pushed everything else below the
  fold. It starts closed.
