// The "which service do I need?" finder, as data.
//
// It asks about the visitor's problem in their words, never ours: nobody
// arriving from a Facebook post knows whether they need "business software"
// or an "offline desktop" build, but they know their orders get lost.
//
// Each option either names a service by slug (the answer) or opens one
// follow-up question. Keep it to one follow-up at most: a third question is
// where people give up. `why` is the one sentence shown with the answer, so it
// should say why this service fits the problem they just picked.

export const finder = {
  question: "What is getting in the way right now?",
  options: [
    {
      id: "found",
      label: "People cannot find us online",
      hint: "No website yet, or one that looks old",
      service: "website",
      why: "A fast site of your own, found on Google for your name, is the fix for being invisible.",
    },
    {
      id: "orders",
      label: "Orders come in on WhatsApp and get lost",
      hint: "Screenshots, voice notes, missed messages",
      service: "online-store",
      why: "A store takes orders without anyone messaging you, with stock and prices in one place, so nothing gets lost in a chat.",
    },
    {
      id: "records",
      label: "Stock, sales or cash live in registers or Excel",
      hint: "Numbers that never quite add up",
      next: {
        question: "Where will it be used most?",
        options: [
          {
            id: "counter-online",
            label: "At the counter, and the internet is reliable",
            hint: "Open it from any browser, phone or laptop",
            service: "business-software",
            why: "A dashboard puts stock, sales and daily cash on one screen, with today and this month at a glance.",
          },
          {
            id: "counter-offline",
            label: "At the counter, but the internet often drops",
            hint: "Load shedding, weak signal, no Wi-Fi",
            service: "offline-desktop",
            why: "Offline software installs like a normal program and keeps working when the internet does not.",
          },
          {
            id: "phone",
            label: "On my phone, wherever I am",
            hint: "Check the business away from the shop",
            service: "android-app",
            why: "An Android app keeps the business in your pocket, and keeps working when there is no signal.",
          },
        ],
      },
    },
    {
      id: "questions",
      label: "Customers ask the same questions all day",
      hint: "Prices, timings, stock, delivery",
      service: "ai-assistant",
      why: "An assistant that answers from your real products and policies, at any hour, and shows you what everyone asks.",
    },
    {
      id: "slow",
      label: "Our website is slow or brings no customers",
      hint: "Visitors leave, ads do not convert",
      service: "website-audit",
      why: "An audit finds what is slowing the site and losing visitors, with the fixes ranked by payoff.",
    },
    {
      id: "messy",
      label: "Our app or site looks messy and inconsistent",
      hint: "Every screen seems designed by someone else",
      service: "ui-design",
      why: "A design system gives every screen the same parts, so the product looks like one thing again.",
    },
    {
      id: "care",
      label: "We have software but nobody looks after it",
      hint: "Bugs, updates, the developer left",
      service: "support",
      why: "A monthly plan keeps it fixed, updated and deployed, with someone who answers when it breaks.",
    },
  ],
};

// The optional parts a visitor can tick once the finder has named their
// service. They shape the brief, not a price: we quote per project, so ticking
// more says "expect the longer end of the timeline", never a number of weeks
// or rupees we have not worked out. `id` travels in the request URL
// (?needs=payments,delivery), so keep ids short and never rename one that has
// shipped, or old links lose the extra.
//
// Two rules for every entry:
// - It must be something the service does NOT already include (check that
//   service's `includes` in services-data.js). Ticking "staff logins" on a
//   service that always comes with them tells us nothing and reads as extra
//   cost.
// - `label` is the checkbox, `phrase` is how it reads in the message: "I would
//   also like " + phrase + "." with one box ticked, and one "- phrase" line
//   each with more. Read both out loud before shipping a change.
export const extras = {
  website: [
    { id: "urdu", label: "An Urdu version", phrase: "an Urdu version" },
    { id: "booking", label: "Bookings or enquiries online", phrase: "online bookings or enquiries" },
    { id: "blog", label: "A news or blog page", phrase: "a news or blog page" },
    { id: "pages", label: "More than 6 pages", phrase: "more than 6 pages" },
  ],
  "online-store": [
    { id: "cod", label: "Cash on delivery", phrase: "cash on delivery" },
    { id: "payments", label: "JazzCash or Easypaisa payments", phrase: "JazzCash or Easypaisa payments" },
    { id: "delivery", label: "Delivery areas and charges", phrase: "delivery areas and charges" },
    { id: "assistant", label: "A chat assistant for customers", phrase: "a chat assistant for customers" },
  ],
  "business-software": [
    { id: "branches", label: "More than one branch", phrase: "more than one branch in the same system" },
    { id: "barcode", label: "Barcode scanning", phrase: "barcode scanning" },
    { id: "invoices", label: "Printed invoices and receipts", phrase: "printed invoices and receipts" },
    { id: "offline", label: "A copy that works offline", phrase: "a copy that works offline" },
  ],
  "offline-desktop": [
    { id: "counters", label: "More than one counter", phrase: "more than one counter" },
    { id: "receipts", label: "Printed receipts", phrase: "printed receipts" },
    { id: "barcode", label: "Barcode scanning", phrase: "barcode scanning" },
  ],
  "android-app": [
    { id: "staff", label: "Separate logins for staff", phrase: "separate logins for staff" },
    { id: "sync", label: "Sync with a website or dashboard", phrase: "the app synced with a website or dashboard" },
    { id: "playstore", label: "A Play Store listing", phrase: "a Play Store listing" },
  ],
  "ai-assistant": [
    { id: "urdu", label: "Urdu and Roman Urdu", phrase: "answers in Urdu and Roman Urdu" },
    { id: "live", label: "Answers from live stock and prices", phrase: "answers from live stock and prices" },
    { id: "whatsapp", label: "The assistant on WhatsApp too", phrase: "the assistant on WhatsApp too" },
  ],
  "website-audit": [
    { id: "fixes", label: "Fix the problems for us", phrase: "the problems fixed for us" },
    { id: "ads", label: "Check our ad landing pages", phrase: "a check of our ad landing pages" },
  ],
  "ui-design": [
    { id: "brand", label: "A logo and brand colours", phrase: "a logo and brand colours" },
    { id: "app", label: "Screens for a mobile app too", phrase: "screens for a mobile app too" },
  ],
  support: [
    { id: "content", label: "Content updates (prices, photos)", phrase: "content updates, such as new prices and photos" },
    { id: "renewals", label: "Hosting and domain renewals handled", phrase: "hosting and domain renewals handled" },
  ],
};

export function extrasFor(slug) {
  return extras[slug] ?? [];
}

// "I would also like an Urdu version." for one extra, and a short list for
// more, for the brief and the WhatsApp message. A list because several
// phrases already contain "and" ("delivery areas and charges"), which turns
// one long sentence into a puzzle. Unknown ids are dropped, so a hand-edited
// URL cannot put arbitrary text into the form.
export function needsSentence(slug, ids) {
  const picked = extrasFor(slug).filter((e) => ids.includes(e.id)).map((e) => e.phrase);
  if (!picked.length) return "";
  if (picked.length === 1) return `I would also like ${picked[0]}.`;
  return `I would also like:\n${picked.map((p) => `- ${p}`).join("\n")}`;
}
