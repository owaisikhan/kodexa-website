# Working in this repo

A marketing site for Kodexa, read once by strangers on phones, usually arriving
from a Facebook post or an ad. They are not technical and they are not patient.

**The whole site has one job: get a service request sent.** Every change should
make that faster or clearer. Anything that makes it slower needs a reason.

## Ground rules

- **Plain JavaScript, App Router, Tailwind v4.** No TypeScript, no UI kit.
- **Every read lives in `app/_lib/data-service.js`, every write in
  `app/_lib/actions.js`.** There are no reads yet; the content is static data.
- **Actions return `{ ok, message, ... }`**, always, so one renderer handles
  every form.
- **`app/_components/ui/` knows nothing about Kodexa.** If a component mentions
  services or WhatsApp, it belongs in a domain folder.
- **Identity is data.** Name, number, email and stats live in `siteConfig.js`.
  Changing the number is one edit.
- **Content is data.** Services, process and work live in `services-data.js`.
  Never write a service's copy into a component.

## Motion

GSAP for anything tied to the scroll or a timeline, Motion (Framer) for
component entrances and exits, Lenis for the scroll itself.

- The shared entrance is `_components/ui/Reveal.js`. Reach for that before
  writing a new tween, so the page keeps one rhythm.
- **Anything hidden by `[data-animate]` must be animated back by GSAP.** The
  global CSS sets `opacity: 0` on that attribute. A heading that carries
  `data-animate` but whose *children* get animated stays invisible forever.
  That bug shipped once already; the hero now uses `data-lines` for exactly
  this reason.
- `prefers-reduced-motion` is honoured in `globals.css` and checked again in
  every GSAP effect. Test it: DevTools > Rendering > Emulate CSS media.

## Screenshots of our work

The work cards show a **real screenshot when there is one, and a drawn mock
otherwise**. Most of these systems are behind a login, so the drawings are the
honest default rather than a placeholder waiting to be replaced.

To add a real one:

1. Put the file in `public/work/` (see `public/work/README.md` for the size,
   the crop and what must be blurred out first).
2. Set `shot: "/work/<file>"` on that project in `app/_lib/services-data.js`.

That is the entire change. `WorkMock` picks the screenshot over the drawing on
its own, and no component needs touching. Leave `mock` in place: it is the
fallback if the file is ever removed.

**Never invent a screenshot.** No stock photos, no mockups of screens that do
not exist, and nothing from a project that carries someone else's branding. A
course-project demo with a banner across the top is not our work.

## The admin area

`/admin` reads and works the leads. Three things about it are not negotiable:

**Never grant SELECT on `service_requests` to `anon`.** The publishable key is
in the page source of a public site. An anon read policy hands every lead, with
phone numbers, to anyone who opens DevTools. Admin access goes through
`public.is_admin()`, which checks the caller's email against the `app_admins`
table.

**Three fences, and none of them assumes another ran.** `proxy.js` redirects a
request with no session, `(protected)/layout.js` checks the session is an
admin, and RLS checks again in the database. Middleware is a redirect that
saves a wasted render, not access control.

**Signed in is not admin.** Every admin action re-checks with `getAdmin()`
before touching a row. The moment anything else can sign up, that check is the
only thing standing between them and the leads.

Layout notes: the login page sits **outside** `(protected)/`, because Next
composes nested layouts rather than replacing them, so a gate in
`app/admin/layout.js` would wrap the login page and redirect it to itself
forever. Public chrome lives in `(site)/layout.js`, not the root layout, or the
fixed marketing navbar renders over the admin header and eats its clicks.

Adding an admin: insert their email into `app_admins` (Supabase dashboard or
SQL) **and** create the Supabase Auth user. Both, or they sign in to an empty
table.

## The navbar height is load-bearing

The header is `h-[88px]`. Pages that start underneath it hardcode that:
`pt-[88px]` on full-height sections (hero, 404, error) and `pt-[152px]` on
pages with a heading block (services, request, work), plus `top-[88px]` on the
mobile drawer. **Change the header height and all five move**, or content hides
behind the header on one page and floats on another.

## Verifying a change

`npm run build` catches imports and typos. It does not catch a page that looks
wrong, so **look at it**:

- A real browser at 1440px and at ~390px.
- Scroll the whole page. Reveals that never fire are the usual failure.
- The request flow end to end, including stepping **back** a step: the form is
  controlled, and losing a typed value on Back is a regression.

## Things already tried

- **`lucide-react` has no `Github` icon** in v1. Brand icons were dropped. Use
  `GitBranch` or an inline SVG.
- **`INSERT ... RETURNING` on `service_requests` fails under RLS.** The table
  has no SELECT policy on purpose. Generate values app-side instead.
