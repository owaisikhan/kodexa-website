# Progress

## Where this stands (24 September 2026)

The site is **complete and on `main`**. Work happens on
`feature/easy-navigation`, which is merged into `main` with `--no-ff` whenever
the owner asks, then fast-forwarded back to `main`. `admin`, `chatbot`,
`chat-links`, `real-screenshots`, `genz-redesign` and `genz-muted` are merged
and can be deleted. `editorial`, `lime-mono` and `palette-refresh` are design
directions that were compared and not chosen (see the changelog); keep them
only as a record.

- Pages: home, services index and nine service pages, our work, request,
  about, contact, FAQ, privacy, terms, 404, error, admin.
- Supabase project **Kodexa** (`ap-south-1`) is live: requests taking inserts
  and refusing reads, admin working, chatbot knowledge seeded (24 September:
  contact, about and 12 FAQ chunks added through the Supabase connector,
  because `SUPABASE_SERVICE_ROLE_KEY` is empty in `.env.local`).
- WhatsApp `+92 339 0391420` and email `kodexa77@gmail.com` are real.
- The origin remote reports that the repo moved to
  `github.com/owaisikhan/kodexa-website`; pushes to the old URL still work.

Verified on 24 September, all passing: production build, lint, the skill's
site audit on nine pages, element-level overflow at 320 to 414px on every page
and state, 30 builder and form checks, in-page link tests (7 desktop, 3 phone
menu), anti-slop scan. The chatbot was checked through the real pipeline; its
answer model returned intermittent 503s from Google that day.

## Open, roughly in order

1. **Delete test leads from the live database.** Form tests run against a
   build with Supabase env may have stored rows named "Hamid" with contact
   "+92 300 1234567" (briefs like "A site for my shop" or "test"). Remove them
   in `/admin` or the Supabase table editor. Submit tests now run against a
   copy built without Supabase env (see CLAUDE.md).
2. **Confirm the working hours.** `siteConfig.hours` (Monday to Saturday,
   10 am to 8 pm Pakistan time) is a placeholder, and the reply badge and the
   Contact page state it as fact. The Contact page also says English or Urdu
   are both fine; confirm.
3. **Vercel env:** `GEMINI_API_KEY`, `PAGESPEED_API_KEY`, and `GEMINI_MODEL`
   (the owner chose `gemini-flash-lite-latest`; `.env.local` pins
   `gemini-3.5-flash-lite`).
4. **Rotate the Gemini and PageSpeed keys**; both were pasted into a session
   chat. Put `SUPABASE_SERVICE_ROLE_KEY` into `.env.local` (never Vercel) so
   the seed runs normally.
5. **Chatbot resilience:** retry once and fall back to the alias on a 503
   ("model overloaded"), as it already does on a 404 (`agent.js`).
6. **Legal read-through by the owner:** quotes valid 30 days, data requests
   within 30 days, liability capped at the amount paid, Pakistani law.
7. **Before any Meta pixel or analytics:** add a cookie and tracking section
   to `legal-data.js` and decide on consent. There is no analytics today, so
   there is no way to tell which service ad traffic wants.
8. **The hero drawing says "Anything under $30?"** (`HeroVisual.js`) while the
   Facebook cover advertises Rs 5,000. The site publishes no prices; decide
   whether the drawing should use rupees.
9. **Real screenshots** of our work: drop files in `public/work/` and set
   `shot` (see `public/work/README.md`).
10. **The domain.** `siteConfig.url` is `kodexa.dev`, a placeholder.
11. **kodexa-builder learnings L-008 to L-012** in `.claude/kodexa-learnings.md`
    are `ready` to promote into the next skill version.

## The admin login

One account: `owasikhan22@gmail.com`, created through the Supabase signup
endpoint and confirmed directly in `auth.users`, with its email seeded into
`app_admins`.

**Change that password in the Supabase dashboard.** It was generated in a
session transcript, which is not where a production password should live.

## Marketing made outside the repo

Delivered to the owner as files, not committed: Facebook profile picture and
cover (2048x1154, "Rs 5,000"), two organic videos (a 4:5 phone promo and a
16:9 laptop "How to order" walkthrough with a voice-over), and six Meta ad
videos with music and subtitles, no voice: phone and PC-screen versions, each
in 9:16 (Reels, Stories), 4:5 (Feed) and 1:1 (Marketplace, search). The
generator scripts lived in a session scratchpad and are gone with it;
`docs/CHANGELOG.md` records how they were built so they can be rebuilt.

## Known gaps

- The hero stats ("9 services", "20+ projects", "24h reply") are hand-written.
  Keep them true.
- The chatbot has no voice I/O, on purpose: a second paid call per answer for
  a marketing widget.
- The Playwright checks used in these sessions (overflow, form, builder, links)
  were not committed; only the skill's `site_audit.mjs` and `slop_scan.py`
  travel with the kodexa-builder skill.
