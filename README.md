# Kodexa

The studio site. It exists to turn Facebook and ad traffic into service
requests, so every page ends in the same place: pick a service, send a short
brief, land in WhatsApp with the message already written.

Live services, the process and the work are all data in
`app/_lib/services-data.js`. Nothing about the offer is hard-coded into a
component, so changing what Kodexa sells is one file.

## What a visitor does

1. Lands on `/` and sees nine services on one screen.
2. Opens the one they recognise (`/services/<slug>`): what it does for them,
   what they get, how long it takes.
3. Hits "Request this service", which opens `/request` with that service
   already chosen.
4. Answers three short steps: what, about it, how to reply.
5. Submitting stores the request and hands them to WhatsApp with the whole
   brief pre-filled. They press send.

The WhatsApp handoff is the point. A stored row nobody reads is not a lead.

## Running it

```bash
npm install
cp .env.example .env.local     # fill in the Supabase values
npm run dev
```

The site runs fine with no Supabase keys at all. The form still works and
still hands off to WhatsApp, it just does not store a row. That is deliberate:
a plumbing failure must never cost a lead.

## Where requests go

Two places, on purpose:

- **WhatsApp**, immediately, with the brief written out. This is the one that
  gets replied to.
- **`service_requests` in Supabase**, as the record. Every row gets a short
  reference (`KDX-4H7QW2`) shown to the visitor so they can quote it.

Read them in the Supabase dashboard: Table Editor > `service_requests`.

**The table is a letterbox.** The public key may INSERT and nothing else. There
is no SELECT policy, so a stranger, or anyone who lifts the key out of the
page source, cannot read a single lead back. That is why the reference is
generated in `actions.js` rather than returned by the database: reading it
back would have meant `INSERT ... RETURNING`, which needs a SELECT policy,
which would have opened the whole table.

## Adding a screenshot of your work

Put the image in `public/work/`, then set `shot: "/work/<file>"` on that
project in `app/_lib/services-data.js`. Cards without a screenshot draw an
interface mock instead, which is the honest default for the systems that sit
behind a login.

`public/work/README.md` has the size, the crop and the list of things to blur
out before shooting.

## The chatbot

The widget bottom right answers questions about Kodexa: what we build, what a
service includes, how long it takes, how to request it. It answers from the
site's own content, and says plainly that it can only help with Kodexa when a
question is about anything else.

It needs `GEMINI_API_KEY`. Without one the widget simply does not render and
the rest of the site is unaffected.

It knows two things: what Kodexa sells (built from `services-data.js` and
`siteConfig.js`) and what Kodexa has built (`app/_lib/chatbot/projects-data.js`,
covering SAAM'S Store, Petrol Pump Manager, Committee Ledger and PMC Hospital in
enough depth to answer a real question about any of them).

After editing `services-data.js`, `siteConfig.js` or `projects-data.js`:

```bash
npm run seed:knowledge     # needs SUPABASE_SERVICE_ROLE_KEY in .env.local
```

That rebuilds what the assistant knows from those two files. Skip it and the
chatbot keeps quoting the old timelines.

## Reading the leads

Sign in at `/admin`. Requests are listed newest first with filters for each
status, a note field, and a button that replies to the sender on WhatsApp.

Access is one email in the `app_admins` table. To add someone: create their
Supabase Auth user **and** insert their email into that table. Either one on
its own leaves them signed in to an empty screen.

## Changing the important things

| Want to change | Edit |
|---|---|
| WhatsApp number, email, stats | `app/_lib/siteConfig.js` |
| Services, what they include, timelines | `app/_lib/services-data.js` |
| The four process steps | `app/_lib/services-data.js` |
| Projects in the work section | `app/_lib/services-data.js` |
| Colours, spacing, panels | `app/_styles/globals.css` |

**Set the real WhatsApp number before this goes live.** `siteConfig.whatsapp`
ships with a placeholder (`923001234567`), and every button on the site points
at it.

## Deploying

Vercel, with the two `NEXT_PUBLIC_SUPABASE_*` values set in the project's
environment variables, plus `NEXT_PUBLIC_SITE_URL` set to the real domain.
Pin the Vercel region to `bom1` to sit beside the database in `ap-south-1`.
