// What Kodexa has built, in enough detail to answer a real question about it.
//
// Every fact here comes from the project's own repository, not from memory:
// saam-s-store, Petrol-Pump-Management-Software and its Electron build,
// The-Ledger-Mobile and its Windows original, and PMC-Hospital. If a claim is
// not in one of those repos it does not belong here.
//
// Two rules when editing:
//
// 1. **Nothing that is not ours to publish.** These projects run real
//    businesses. Describe what the software does, never a client's actual
//    numbers, customers or staff.
// 2. **Re-run `npm run seed:knowledge` after any change**, or the assistant
//    keeps answering from the old version.

export const projects = [
  // ---------------------------------------------------------------------
  {
    slug: "saams-store",
    name: "SAAM'S Store",
    chunks: [
      {
        topic: "overview",
        content:
          "SAAM'S Store is a complete online store we built and it is live at " +
          "saam-s-store.vercel.app, so anyone can go and use it. It sells everyday " +
          "products: baby care, grocery, hardware, pet care. A customer can browse by " +
          "category, search, filter by price, open a product, add it to a cart that " +
          "survives closing the tab, and check out. It is the clearest example of what " +
          "we mean by an online store rather than a catalogue with a buy button.",
      },
      {
        topic: "how-it-works",
        content:
          "Behind the shop is an admin panel the owner uses daily. Add and edit products " +
          "and categories, import a whole spreadsheet of products at once instead of " +
          "typing them in, see every order and move it through its statuses, read " +
          "messages customers send, and watch a revenue chart. Customers can sign in " +
          "with Google to keep an order history, save several delivery addresses with " +
          "one marked default, and keep a wishlist. Guests can still check out without " +
          "an account, which matters more than it sounds: forcing a signup is where " +
          "most small stores lose the sale.",
      },
      {
        topic: "tech",
        content:
          "SAAM'S Store is built with Next.js and React, with Supabase for the database, " +
          "logins and file storage, and Tailwind for the styling. Every table has row " +
          "level security, so the database itself decides who may read what rather than " +
          "trusting the app to ask nicely. Payments are wired through Stripe, with bank " +
          "transfer as an option. It is deployed on Vercel. The client owns all of it.",
      },
      {
        topic: "story",
        content:
          "The store also has an AI assistant built into it, and it is the same idea as " +
          "the assistant you are talking to now, pointed at a shop instead of a studio. " +
          "Ask it about a return policy and it answers from the store's own policy page. " +
          "Ask it for anything under thirty dollars in baby care and it answers from the " +
          "live product table, with links to the products. Ask it to compare prices and " +
          "it draws a small chart from the real figures. It can also take a question by " +
          "voice and answer out loud.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    slug: "petrol-pump-manager",
    name: "Petrol Pump Manager",
    chunks: [
      {
        topic: "overview",
        content:
          "Petrol Pump Manager runs a fuel station's day. Staff enter the day's meter " +
          "readings, the app works out the litres sold and the money that should be in " +
          "the drawer, and the owner sees stock, customer credit and the month's profit " +
          "without adding anything up by hand. It replaced a paper register and a pile " +
          "of spreadsheets. This is the project behind what we call business software " +
          "and dashboards.",
      },
      {
        topic: "how-it-works",
        content:
          "The daily routine drives the screens rather than the other way round: " +
          "readings first, then fuel deliveries, then credit customers paying something " +
          "off. It tracks tank stock, each customer's running balance, cash against credit, " +
          "and produces a monthly report you can export as PDF or Excel. Owner and staff " +
          "see different things: staff enter the day, the owner sees the money.",
      },
      {
        topic: "tech",
        content:
          "The money rules live in the database as constraints and triggers, not in the " +
          "screens. A balance that must not go negative, a reading that must not overlap " +
          "another day, a ledger entry that must not be quietly edited: Postgres refuses " +
          "those outright, so a second device or a future change cannot walk past them. " +
          "It is a Next.js app with Supabase, and it also ships as a Windows desktop " +
          "program.",
      },
      {
        topic: "story",
        content:
          "The desktop version is the interesting part. The same app is packaged with " +
          "Electron and runs on one Windows laptop with no internet at all: it starts " +
          "its own bundled Postgres database on the machine itself, so there is nothing " +
          "in the cloud and no monthly subscription to anybody. It installs like a " +
          "normal program, creates the owner account on first run, and checks for new " +
          "versions in the background, downloading and asking before it installs. No " +
          "internet at launch is a normal silent no-op, not an error, because the app " +
          "has no internet dependency for daily use.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    slug: "committee-ledger",
    name: "Committee Ledger",
    chunks: [
      {
        topic: "overview",
        content:
          "Committee Ledger is an Android app for running a monthly committee, the " +
          "rotating savings pool where ten people each pay in every month and one of " +
          "them takes the pot in turn. It keeps the whole thing on the phone and never " +
          "touches the internet. There is a Windows version of the same app as well, " +
          "and the two share their rules and their wording.",
      },
      {
        topic: "how-it-works",
        content:
          "It shows the balance, who has paid this month, what each member's stake is, " +
          "and what is safe to hand over. Two things make a committee harder than it " +
          "looks, and the app is built around both: someone repaying a withdrawal can " +
          "pay more than the installment, which ends the repayment sooner rather than " +
          "lowering it, and someone taking a payout can take less than the agreed " +
          "amount. Receipts print or share straight to WhatsApp.",
      },
      {
        topic: "story",
        content:
          "The reason the app exists is a timing problem the bank balance hides. With " +
          "ten members the turn comes round every ten months, but a withdrawal is repaid " +
          "over fifteen, so for the first year full payouts go out while the repayments " +
          "behind them are still building up. An account that looks comfortable today " +
          "can bottom out months later. The app simulates the months ahead, finds the " +
          "largest payout that never breaches the cushion, and distinguishes between " +
          "cannot afford this and cannot afford this yet, which are different answers.",
      },
      {
        topic: "tech",
        content:
          "It is a React Native app built with Expo, storing everything in a SQLite " +
          "database on the phone, and it installs from an APK you can hand someone " +
          "directly. The ledger is append-only: nothing can be updated or deleted by " +
          "anyone, and a mistake is corrected by writing the opposite entry so both stay " +
          "visible. A withdrawal larger than the account holds is refused outright, and " +
          "no override gets past it, because the money is not there.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    slug: "pmc-hospital",
    name: "PMC Hospital",
    chunks: [
      {
        topic: "overview",
        content:
          "PMC is a records and ledger system for a paediatric hospital: a 24 hour " +
          "children's emergency, a neonatal intensive care unit, a paediatric intensive " +
          "care unit, a measles ward, a general ward, the pharmacy and the laboratory. " +
          "The whole system sits behind a login and has no public pages at all, which is " +
          "why we show a drawing of it rather than a screenshot.",
      },
      {
        topic: "how-it-works",
        content:
          "It keeps ward and patient records, pharmacy stock and lab work in one place " +
          "instead of separate registers, so the hospital can see what happened on a " +
          "given day without walking between departments. Staff see only what their role " +
          "needs. It is the kind of internal system we mean when we say business " +
          "software: nobody browses it, a few people live in it every day.",
      },
      {
        topic: "tech",
        content:
          "Next.js with Supabase for the database and logins, and row level security on " +
          "the tables so access is enforced by the database rather than by the screens. " +
          "Built with a strict typed codebase and a proper component library, because a " +
          "system people use all day is a system that gets changed often and has to stay " +
          "safe to change.",
      },
    ],
  },
];

/** Flattened for embedding: one row per chunk. */
export function buildProjectChunks() {
  return projects.flatMap((project) =>
    project.chunks.map((chunk) => ({
      project: project.slug,
      title: project.name,
      topic: chunk.topic,
      content: `${project.name}. ${chunk.content}`,
    }))
  );
}
