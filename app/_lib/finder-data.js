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
