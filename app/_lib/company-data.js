// The studio itself: who we are, what we promise, and the questions people ask
// before they send a request. Content is data here for the same reason the
// services are: the About page, the FAQ page, the home page and the chatbot's
// knowledge base all read it, so they can never disagree.

import { getService } from "./services-data.js";
import { siteConfig } from "./siteConfig.js";

// The public face of the studio: the person clients deal with, named on the
// About page and in the chatbot's knowledge. Only people listed here are
// named anywhere on the site.
export const lead = { name: "Hamid Javed", role: "Founder", github: "https://github.com/EmeDev27" };

// The four promises. Shown on the home page ("Why us") and the About page.
// Each one must stay true of how every project is actually run.
export const promises = [
  {
    icon: "clock",
    title: "You see it early",
    body: "A working link in the first week, not a reveal at the end you cannot change.",
  },
  {
    icon: "wallet",
    title: "A fixed price, first",
    body: "You approve the number before anything is built. No hourly surprises.",
  },
  {
    icon: "code",
    title: "You own everything",
    body: "The code, the domain, the database, the accounts. Nothing is rented from us.",
  },
  {
    icon: "eye",
    title: "Built to be handed over",
    body: "Documented and deployed properly, so another developer could pick it up.",
  },
];

const store = getService("online-store");
const website = getService("website");

// Every answer must be true of the site and of how we work. No prices, rates
// or discounts: we quote per project. `link` is an optional next step.
export const faqs = [
  {
    q: "How much does a project cost?",
    a: "It depends on what the project needs, so we quote each one. Send a short brief and we reply with one fixed price and a timeline, usually the same day. The price does not change unless you ask for something new.",
    link: { href: "/request", label: "Ask for a quote" },
  },
  {
    q: "Do I pay anything to get a quote?",
    a: "No. Asking costs nothing and commits you to nothing. Nothing starts, and nothing is charged, until you approve the quote.",
  },
  {
    q: "How long does it take?",
    a: `Each service page shows its usual timeline. For example, ${website?.title ?? "a website"} usually takes ${website?.timeline ?? "a few weeks"}, and ${store?.title ?? "an online store"} usually takes ${store?.timeline ?? "a few weeks"}. Your quote gives the exact timeline for your project.`,
    link: { href: "/services", label: "Compare all services" },
  },
  {
    q: "How do payments work?",
    a: "The payment schedule is written into your quote before anything starts, so you know every amount and when it is due. You never get an invoice you did not agree to.",
    link: { href: "/terms", label: "Read the terms" },
  },
  {
    q: "Who owns the website or app?",
    a: "You do. The domain, hosting, database and accounts are set up in your name, and the code we write for your project is yours once it is paid for. Nothing is rented from us.",
  },
  {
    q: "Can I see the work while it is being built?",
    a: "Yes. You get a private link to the working build early on, and the same link is updated at every step, so you can try it as it grows and ask for changes before launch.",
  },
  {
    q: "Do I need to prepare anything?",
    a: "Only a few lines on what you want to fix. If you have a logo, photos, a price list or a domain, send them along, but they are not needed to start. We help with whatever is missing.",
  },
  {
    q: "Can you work on a website or app I already have?",
    a: "Yes. We can check and speed up an existing site, fix what is broken, add features, or look after it every month.",
    link: { href: "/services/website-audit", label: "Website Audit & Speed" },
  },
  {
    q: "What happens after launch?",
    a: "We hand over every login and account, and we stay reachable. If something we built does not work as agreed, we fix it. New features and changes are quoted separately, or covered by a monthly maintenance plan.",
    link: { href: "/services/support", label: "Maintenance & Support" },
  },
  {
    q: "Do you work with clients outside Pakistan?",
    a: `Yes. We are based in Pakistan and work with clients anywhere over WhatsApp and email.`,
  },
  {
    q: "How do I contact you?",
    a: `WhatsApp ${siteConfig.whatsappDisplay} is the fastest way, or email ${siteConfig.email}. For a project, the request form is quickest: it writes the WhatsApp message for you.`,
    link: { href: "/contact", label: "All the ways to reach us" },
  },
  {
    q: "What do you do with my details?",
    a: "We use them to reply to your request and to run your project, and for nothing else. We do not sell them or add you to a mailing list.",
    link: { href: "/privacy", label: "Read the privacy policy" },
  },
];
