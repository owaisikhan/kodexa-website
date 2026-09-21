# Progress

## Where this stands

The site is **built, deployed-ready and working end to end**. `main` carries
the live-ready version. `feature/real-screenshots` carries the header and
screenshot work described below, waiting on Ammar to test it.

- Home, nine service pages, work, request flow, 404 and error pages: done.
- Request flow: tested end to end, stores a row and opens WhatsApp with the
  brief written out.
- Supabase project **Kodexa** (`ap-south-1`) is live, migration applied,
  `service_requests` taking inserts and refusing reads.
- WhatsApp number is the real one: `923390391420`.

## Next, in order

1. **Real screenshots.** Ammar is supplying them, including screens behind a
   login that no session can reach on its own. Drop each file in
   `public/work/` and set `shot` in `app/_lib/services-data.js`. See
   `public/work/README.md`. Nothing else changes.

2. **The `/admin` page.** Agreed but not started. Leads currently have to be
   read in the Supabase dashboard. What it needs:

   - A login. Supabase Auth, one admin account, checked in
     `app/admin/layout.js` **and** enforced again by an RLS policy, because
     "authenticated" will not mean "admin" the moment anything else can sign in.
   - **A SELECT policy on `service_requests`, scoped to the admin.** The table
     has none today on purpose. Do not widen it to `anon`: the publishable key
     is in the page source, and a public SELECT policy hands every lead to
     anyone who opens DevTools.
   - Reads go in `app/_lib/data-service.js`, the status update goes in
     `app/_lib/actions.js`, returning `{ ok, message }` like everything else.
   - A list with the status column (`new`, `contacted`, `quoted`, `won`,
     `lost`), newest first, paginated, and a notes field.

3. **Deploy.** Vercel, region `bom1` to sit beside the database, with
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
   `NEXT_PUBLIC_SITE_URL` set.

## Known gaps

- `siteConfig.email` (`hello@kodexa.dev`) and `siteConfig.url` are
  placeholders. The WhatsApp number is real; these two are not.
- The stats in the hero ("9 services", "20+ projects", "24h reply") are
  hand-written. Keep them true.
- No analytics. Worth adding before any ad spend, or there is no way to tell
  which service the traffic actually wants.
