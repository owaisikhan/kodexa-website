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
export const extras = {
  website: [
    { id: "urdu", label: "An Urdu version" },
    { id: "booking", label: "Bookings or enquiries online" },
    { id: "blog", label: "A news or blog page" },
    { id: "pages", label: "More than 6 pages" },
  ],
  "online-store": [
    { id: "cod", label: "Cash on delivery" },
    { id: "payments", label: "Card or wallet payments online" },
    { id: "delivery", label: "Delivery areas and charges" },
    { id: "assistant", label: "A chat assistant for customers" },
  ],
  "business-software": [
    { id: "credit", label: "Customer credit and ledgers" },
    { id: "staff", label: "Separate logins for staff" },
    { id: "reports", label: "Monthly reports and Excel export" },
    { id: "offline", label: "A copy that works offline" },
  ],
  "offline-desktop": [
    { id: "counters", label: "More than one counter" },
    { id: "receipts", label: "Printed receipts" },
    { id: "backups", label: "Backups to a USB drive" },
  ],
  "android-app": [
    { id: "printing", label: "Printing and PDF receipts" },
    { id: "sync", label: "Sync with a website or dashboard" },
    { id: "playstore", label: "A Play Store listing" },
  ],
  "ai-assistant": [
    { id: "urdu", label: "Urdu and Roman Urdu" },
    { id: "live", label: "Answers from live stock and prices" },
    { id: "voice", label: "Voice questions and spoken answers" },
  ],
  "website-audit": [
    { id: "fixes", label: "You make the fixes too" },
    { id: "ads", label: "A review of our ad landing pages" },
  ],
  "ui-design": [
    { id: "dark", label: "A dark mode" },
    { id: "library", label: "A component library for our developers" },
  ],
  support: [
    { id: "features", label: "Small new features each month" },
    { id: "uptime", label: "Uptime checks and alerts" },
  ],
};

export function extrasFor(slug) {
  return extras[slug] ?? [];
}

// "I also need: an Urdu version, a news or blog page." for the brief and the
// WhatsApp message. Unknown ids are dropped, so a hand-edited URL cannot put
// arbitrary text into the form.
export function needsSentence(slug, ids) {
  const picked = extrasFor(slug).filter((e) => ids.includes(e.id));
  if (!picked.length) return "";
  const list = picked.map((e, i) => (i === 0 ? e.label : e.label.charAt(0).toLowerCase() + e.label.slice(1)));
  return `I also need: ${list.join(", ")}.`;
}
