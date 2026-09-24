# Progress

## Where this stands

The site is **built, deployed-ready and working end to end**. `main` carries
the live-ready version. `feature/real-screenshots` carries the header and
screenshot work described below, waiting on the team to test it.

- Home, nine service pages, work, request flow, 404 and error pages: done.
- Request flow: tested end to end, stores a row and opens WhatsApp with the
  brief written out.
- Supabase project **Kodexa** (`ap-south-1`) is live, migration applied,
  `service_requests` taking inserts and refusing reads.
- WhatsApp number is the real one: `923390391420`.

## Next, in order

1. **Real screenshots.** The team is supplying them, including screens behind a
   login that no session can reach on its own. Drop each file in
   `public/work/` and set `shot` in `app/_lib/services-data.js`. See
   `public/work/README.md`. Nothing else changes.

2. **The `/admin` page: done**, on `feature/admin`. Sign in at `/admin/login`,
   see every request newest first, filter by status, move a lead through
   `new → contacted → quoted → won → lost`, write private notes, and reply
   straight to their WhatsApp. Reads are in `data-service.js`, writes in
   `actions.js`, and access is `app_admins` + `is_admin()` + RLS.

   Verified against the live database: anon sees 0 rows, a signed-in
   non-admin sees 0 rows and `is_admin()` returns false, the admin sees
   everything, and even the admin cannot rewrite a customer's brief because
   UPDATE is granted on `status` and `notes` only.

3. **The chatbot: done**, on `feature/chatbot`. Ask it anything about Kodexa
   and it answers from the site's own content; ask it anything else and it
   says it can only help with Kodexa. Needs `GEMINI_API_KEY` in Vercel, and
   `npm run seed:knowledge` re-run whenever services or contact details
   change.

4. **Deploy.** Vercel, region `bom1` to sit beside the database, with
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
   `NEXT_PUBLIC_SITE_URL` set.

## The admin login

One account: `owasikhan22@gmail.com`, created through the Supabase signup
endpoint and confirmed directly in `auth.users`, with its email seeded into
`app_admins`.

**Change that password in the Supabase dashboard.** It was generated in a
session transcript, which is not where a production password should live.

## Known gaps

- `siteConfig.url` (`kodexa.dev`) is a placeholder until the domain is
  bought. The WhatsApp number and the email (kodexa77@gmail.com) are real.
- The stats in the hero ("9 services", "20+ projects", "24h reply") are
  hand-written. Keep them true.
- The chatbot has no voice I/O. The store's pipeline speaks answers aloud
  through `GEMINI_TTS_MODEL`; here it would be a second paid call per answer
  for a marketing widget, so it was left out rather than half-built. The
  agent is one function away from it if it is ever wanted.
- No analytics. Worth adding before any ad spend, or there is no way to tell
  which service the traffic actually wants.
