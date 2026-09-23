# Agents

Read **`CLAUDE.md`** first. It is the working guide for this repo: the ground
rules, the motion conventions, the screenshot contract, and the mistakes
already made here so they are not made again.

Then, depending on what you are doing:

| Task | Read |
|---|---|
| Building or changing a page | `docs/UI_CONVENTIONS.md` |
| Adding a screenshot of our work | `public/work/README.md` |
| Understanding why something is the way it is | `docs/CHANGELOG.md` |
| Picking up where the last session stopped | `PROGRESS.md` |
| What the site is for, and who reads it | `README.md` |

Two rules that override anything convenient:

1. **This site exists to get a service request sent.** Judge every change by
   whether it makes that faster or clearer.
2. **Never publish a screenshot of a system you cannot honestly claim.** No
   stock photos, no invented dashboards, nothing carrying another company's
   branding. A drawn mock is always the better answer.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
