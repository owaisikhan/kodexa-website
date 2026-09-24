# Kodexa

The studio site. It exists to turn Facebook and ad traffic into service
requests, so every page ends in the same place: pick a service, send a short
brief, land in WhatsApp with the message already written.

Everything about the offer is data, never component copy:

| Want to change | Edit |
|---|---|
| WhatsApp number, email, working hours, stats | `app/_lib/siteConfig.js` |
| Services, what they include, timelines, the four process steps, work items | `app/_lib/services-data.js` |
| Finder questions and the optional extras per service | `app/_lib/finder-data.js` |
| The named lead (Hamid Javed), the four promises, the FAQ | `app/_lib/company-data.js` |
| Privacy policy and terms of service | `app/_lib/legal-data.js` |
| Project facts the chatbot knows | `app/_lib/chatbot/projects-data.js` |
| Colours, spacing, panels | `app/_styles/globals.css` |

After editing siteConfig, services-data or company-data, re-seed the chatbot
(below).

## Pages

| Route | What it is |
|---|---|
| `/` | Hero, nine services, the finder, Process steps, work, why us, closing band |
| `/services`, `/services/<slug>` | The index with a side-by-side list; one page per service with prev and next links |
| `/work` | "Our work": projects, with drawn mocks that can be tried |
| `/request` | The three-step request form and the WhatsApp handoff |
| `/about`, `/contact`, `/faq` | Company pages (footer; Questions is also in the phone menu) |
| `/privacy`, `/terms` | Legal pages (footer, and privacy is linked under the request form) |
| `/admin` | Sign-in and the leads list |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | SEO and the link preview card shown on Facebook and WhatsApp |

## What a visitor does

1. Lands on `/`, sees nine services, or answers the **finder** ("what is
   getting in the way?") and gets one service back.
2. Optionally ticks **extras** in the finder's answer (cash on delivery,
   barcode scanning...). They ride into the form and the WhatsApp message as
   "I would also like ...".
3. Opens `/request` with the service chosen: what they need, about it, how to
   reply. A half-typed form is kept on the device for 14 days, with a Start
   fresh button.
4. Submitting stores the request (when Supabase is configured) and opens
   WhatsApp with the whole brief written out, plus a reference like
   `KDX-4H7QW2`. They press send.

The WhatsApp handoff is the point. A stored row nobody reads is not a lead.

Other pieces:

- **Free speed check** on `/services/website-audit`: Google PageSpeed on a
  phone profile, score, five metrics in plain words, top three fixes, and "get
  these fixed" into the form. Only renders with `PAGESPEED_API_KEY`. Public
  http(s) addresses only, five runs per visitor per ten minutes, cached ten
  minutes.
- **Reply badge**: "Online now" or "Back at 10 am tomorrow", worked out in the
  browser from `siteConfig.hours` in Pakistan time.
- **Process steps open** to show what the visitor has in hand after each
  (`receive` in `process`).
- **The work drawings can be tried** (add to cart, switch the dashboard's
  period, tick a committee member) and show an animated tapping hand until
  used.
- **"Ask a question" on a service page** opens the chatbot pointed at that
  service (`ASK_EVENT` in `ChatWidget.js`).

## Running it

```bash
npm install
cp .env.example .env.local
npm run dev
```

Every key is optional, and each missing one only switches its feature off:

| Variable | Without it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The form still hands off to WhatsApp; no row is stored |
| `NEXT_PUBLIC_SITE_URL` | Nothing today: only `absoluteUrl()` in `helpers.js` reads it, and nothing calls that. Canonical URLs, the sitemap and the share image use `siteConfig.url` |
| `GEMINI_API_KEY` | No chatbot widget |
| `GEMINI_MODEL` | Uses `gemini-flash-lite-latest` (also the fallback if a pinned model 404s) |
| `GEMINI_EMBEDDING_MODEL` | Uses `gemini-embedding-001` |
| `PAGESPEED_API_KEY` | No speed check (in development a notice says why) |
| `SUPABASE_SERVICE_ROLE_KEY` | Only `npm run seed:knowledge` needs it; never set it in Vercel |

Regression checks: `npm run check` against a running production build (see
"Verifying a change" in CLAUDE.md). Playwright is a dev dependency; outside
Claude Code on the web, run `npx playwright install chromium` once.

A plumbing failure must never cost a lead: if the insert fails, the visitor is
still handed to WhatsApp.

## Where requests go

- **WhatsApp**, immediately, with the brief written out. This is the one that
  gets replied to.
- **`service_requests` in Supabase**, as the record, read at `/admin`.

**The table is a letterbox.** The public key may INSERT and nothing else. There
is no SELECT policy, so nobody who lifts the key out of the page source can read
a lead back. That is why the reference is generated in `actions.js` rather
than returned by the database: `INSERT ... RETURNING` would need a SELECT
policy, which would open the whole table.

## Reading the leads

Sign in at `/admin`. Requests are listed newest first with filters for each
status (`new`, `contacted`, `quoted`, `won`, `lost`), a private note field, and
a button that replies on WhatsApp. UPDATE is granted on `status` and `notes`
only, so even an admin cannot rewrite a customer's brief.

Access is an email in `app_admins`. To add someone: create their Supabase Auth
user **and** insert their email into that table. Either one alone leaves them
signed in to an empty screen.

## The chatbot

Answers questions about Kodexa and nothing else. Pipeline: embed the question
(with the last few turns), check an in-memory semantic cache, retrieve from
`kb_chunks` and `project_chunks` through `match_kb_chunks` /
`match_project_chunks`, stream an answer from Gemini grounded in what came back.

- **Two knowledge bases, searched separately and merged.** `kb_chunks` is what
  we sell and how working with us goes (services, process, pricing, contact,
  about, FAQ); `project_chunks` is what we have built (SAAM'S Store, Petrol
  Pump Manager, Committee Ledger, PMC Hospital, about four chunks each). In one
  table, project detail lost out to nine service descriptions that embed
  nearby.
- **Out of scope is decided by retrieval.** Nothing above `RAG_MIN_SIMILARITY`
  means the fixed "I can only help with Kodexa" line, with no model call.
- **Model fallback.** A pinned `GEMINI_MODEL` that 404s is retried once on the
  alias, which that instance then keeps. A 503 ("model overloaded", common on
  busy days) is not retried yet; the visitor sees "Something went wrong".
- **Links are allowlisted.** The model writes bare paths; `linkify.js` decides
  whether the route exists and how to label it, and splits trailing
  punctuation back off paths and phone numbers.
- Both tables have RLS on and no policies; browsers only reach them through
  the SECURITY DEFINER match functions.

After editing `services-data.js`, `siteConfig.js`, `company-data.js` or
`projects-data.js`:

```bash
npm run seed:knowledge     # needs SUPABASE_SERVICE_ROLE_KEY in .env.local
```

It embeds everything first and only then replaces the tables, so a failed run
leaves the live knowledge untouched. The seed script keeps its own copy of the
chunk builder (it runs under plain node, without the `@/` alias): change
`app/_lib/chatbot/knowledge.js` and `scripts/seedKnowledge.mjs` together. Data
modules it imports use relative imports for the same reason.

## Adding a screenshot of your work

Put the image in `public/work/`, then set `shot: "/work/<file>"` on that
project in `app/_lib/services-data.js`. Cards without a screenshot draw an
interface mock instead, which is the honest default for systems behind a
login. `public/work/README.md` has the size, the crop and what to blur out.

## Deploying

Vercel, from `main`. Set the Supabase URL and anon key, `GEMINI_API_KEY`, `GEMINI_MODEL` (or leave it unset for the alias) and
`PAGESPEED_API_KEY`. Pin the region to `bom1` to sit beside the database in
`ap-south-1`. When the real domain is bought, change `siteConfig.url` (it is
`kodexa.dev`, a placeholder). Migrations are in `supabase/migrations/` (0001 requests, 0002
admin access, 0003 chatbot knowledge, 0004 project knowledge).
