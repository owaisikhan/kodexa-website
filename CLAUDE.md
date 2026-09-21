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

## The chatbot

`/api/chat` answers questions about Kodexa and nothing else. The pipeline, in
order: embed the question (with the last few turns folded in), check the
semantic cache, retrieve from `kb_chunks` through the `match_kb_chunks`
function, then stream an answer from Gemini grounded in what came back.

**Scope is enforced twice, and the retrieval half is the real one.** The prompt
tells the model to refuse anything that is not about Kodexa, but a prompt is
not a boundary. Retrieval only ever returns Kodexa's own knowledge, so a
question about the weather clears no chunk above the similarity floor and there
is nothing to answer from: the route sends the fixed out-of-scope line without
calling the model at all. Lower `RAG_MIN_SIMILARITY` and that fence weakens.

**There are two knowledge bases, searched separately and merged.** `kb_chunks`
is what we sell and how working with us goes; `project_chunks` is what we have
actually built, roughly four chunks per project (overview, how it works, the
tech, the story worth telling). Separate tables rather than one with a `kind`
column, because in a single table a question about a project competes with nine
service descriptions that embed nearby, and the project detail gets pushed out
of the top matches by things that merely sound similar.

`project_chunks` is edited in `app/_lib/chatbot/projects-data.js`. Two rules
there: every fact comes from that project's own repository, and nothing that is
not ours to publish. These run real businesses, so describe what the software
does, never a client's actual numbers, customers or staff.

**The knowledge base is derived, never written by hand.** Every chunk is built
from `services-data.js` and `siteConfig.js`, so the assistant cannot quote a
service we do not sell, a timeline the page disagrees with, or an old phone
number. **Edit either file and re-run `npm run seed:knowledge`**, or the
chatbot and the site start telling visitors different things.

**Never let it invent a price.** We quote per project. The pricing chunk says
so and the system prompt says so; keep both.

**Links in answers are allowlisted, not trusted.** The model writes bare paths
(`/request?service=online-store`) because that is the one format it cannot get
wrong; `_components/chat/linkify.js` then decides whether that route actually
exists and what to label it. A path to a service we do not sell stays plain
text rather than becoming a link to a 404, and a phone number that is not ours
never becomes a tappable WhatsApp link. Asking the model for markdown or full
URLs instead would invite a confident link to somewhere we did not choose.

Things to know before changing it:
- The SSE controller is closed in exactly one place, the `finally` in the
  route. Early returns fall through to it. Closing it in a branch as well
  throws "Controller is already closed" and the visitor gets an empty reply.
- The path pattern runs to the next space, and the phone pattern allows spaces
  inside the number, so both swallow the character that follows them. Both are
  split off and pushed back as text; without that, every answer quietly loses
  its full stop and glues the number to the next word.
- Only first-turn questions are cached. A follow-up embeds close to its
  neighbours while meaning something different, so caching those serves a
  confident wrong answer.
- `kb_chunks` has RLS on and no policies. Reading goes through
  `match_kb_chunks` (SECURITY DEFINER), so a browser can ask for the best few
  matches and cannot page through the whole knowledge base. Writing needs the
  service-role key, which only the seed script has.

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
