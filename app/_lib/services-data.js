// The nine services, as data. Every page that shows a service reads from here,
// so the site, the request form and the WhatsApp handoff can never disagree
// about what Kodexa sells.
//
// Each entry carries: what it is (one line a stranger understands), what they
// get (the ticks), how it works, and who it is for. Copy is deliberately short.
// The site sells with motion and structure, not paragraphs.

export const services = [
  {
    slug: "website",
    title: "Website Development",
    short: "A fast site you own, not one you rent from a page builder.",
    icon: "Globe",
    accent: "primary",
    for: "Any business with no site, or a site that embarrasses them.",
    outcomes: [
      "Loads fast on any device, phone or laptop",
      "Looks right at every screen size",
      "Pages you can add to as you grow",
      "Found on Google for your own name",
    ],
    includes: [
      "Up to 6 pages, designed and built",
      "Contact form that reaches you",
      "Google-ready titles and previews",
      "Deployed live, domain connected",
    ],
    timeline: "1 to 2 weeks",
  },
  {
    slug: "online-store",
    title: "E-Commerce Stores",
    short: "A real online store, not a catalogue with a buy button stuck on.",
    icon: "ShoppingBag",
    accent: "secondary",
    for: "Shops selling by WhatsApp screenshots who want real orders.",
    outcomes: [
      "Customers order without messaging you",
      "Stock and prices in one place",
      "Card payments, or bank transfer",
      "Every order recorded, none lost",
    ],
    includes: [
      "Product catalogue, search and filters",
      "Cart, checkout and order confirmation",
      "Admin panel to run the whole store",
      "Bulk product import from a spreadsheet",
    ],
    timeline: "2 to 4 weeks",
  },
  {
    slug: "business-software",
    title: "Business Software & Dashboards",
    short: "Stock, sales, customers and daily cash on one screen.",
    icon: "LayoutDashboard",
    accent: "primary",
    for: "Businesses running on registers, notebooks and Excel files.",
    outcomes: [
      "One place instead of five notebooks",
      "Numbers that cannot quietly drift",
      "See today and this month at a glance",
      "Staff see only what they should",
    ],
    includes: [
      "Daily entry screens built to your routine",
      "Inventory, ledgers and customer credit",
      "Charts, monthly reports, PDF and Excel export",
      "Role-based login for owner and staff",
    ],
    timeline: "3 to 6 weeks",
  },
  {
    slug: "offline-desktop",
    title: "Offline Desktop Software",
    short: "Installs like a normal program and runs with no internet at all.",
    icon: "MonitorDown",
    accent: "success",
    for: "One shop, one counter, bad internet, no monthly fees.",
    outcomes: [
      "Keeps working when the internet dies",
      "No monthly subscription to anyone",
      "Your data stays on your machine",
      "Updates arrive by themselves",
    ],
    includes: [
      "Windows installer your staff can run",
      "Database bundled inside the app",
      "Automatic background updates",
      "Backup and restore built in",
    ],
    timeline: "3 to 6 weeks",
  },
  {
    slug: "android-app",
    title: "Android App Development",
    short: "An app that keeps working when there is no signal.",
    icon: "Smartphone",
    accent: "secondary",
    for: "Owners who want the business in their pocket.",
    outcomes: [
      "Check the business from anywhere",
      "Works offline, syncs when it can",
      "Share a receipt straight to WhatsApp",
      "Installable now, Play Store when ready",
    ],
    includes: [
      "Android app built with React Native",
      "Data stored on the phone itself",
      "Printing and PDF sharing",
      "Installable APK you can hand out",
    ],
    timeline: "3 to 6 weeks",
  },
  {
    slug: "ai-assistant",
    title: "AI Chatbots & AI Agents",
    short: "An assistant that answers from your real products and policies.",
    icon: "Bot",
    accent: "primary",
    for: "Anyone answering the same customer questions all day.",
    outcomes: [
      "Customers answered at 3am",
      "Never quotes a price you do not charge",
      "Sends people to the right product",
      "You see what everyone is asking",
    ],
    includes: [
      "Chat widget on your site or store",
      "Answers from your catalogue and policies",
      "Charts drawn from your live data",
      "Voice questions and spoken answers",
    ],
    timeline: "2 to 4 weeks",
  },
  {
    slug: "website-audit",
    title: "Website Audit & Speed",
    short: "We test your site on a real phone and prove every problem.",
    icon: "Gauge",
    accent: "warning",
    for: "Sites that feel slow, or ads that are not converting.",
    outcomes: [
      "Know exactly what is costing you sales",
      "Every finding proved with a screenshot",
      "Fixes ordered by what they are worth",
      "A price on each fix before you commit",
    ],
    includes: [
      "Speed and Core Web Vitals on real hardware",
      "Technical SEO and mobile usability",
      "Security exposure check",
      "Plain-English report, no jargon",
    ],
    timeline: "2 to 4 days",
  },
  {
    slug: "ui-design",
    title: "UI & Design Systems",
    short: "Every page consistent, light and dark, phone to desktop.",
    icon: "Palette",
    accent: "secondary",
    for: "Products that grew fast and now look like three products.",
    outcomes: [
      "One look across every screen",
      "New pages take hours, not days",
      "Readable for everyone, tested",
      "Dark mode that is not an afterthought",
    ],
    includes: [
      "Colour, type and spacing tokens",
      "A component library your devs reuse",
      "Light and dark, fully responsive",
      "Scroll and motion design",
    ],
    timeline: "1 to 3 weeks",
  },
  {
    slug: "support",
    title: "Maintenance & Support",
    short: "We do not disappear after launch.",
    icon: "LifeBuoy",
    accent: "success",
    for: "Anyone whose developer stopped replying.",
    outcomes: [
      "Someone answers when it breaks",
      "Small changes without a new project",
      "Speed kept up as content grows",
      "Nothing goes stale or insecure",
    ],
    includes: [
      "Bug fixes and small changes",
      "New features when you need them",
      "Versioned releases and rollbacks",
      "Deployments and uptime checks",
    ],
    timeline: "Ongoing, monthly",
  },
];

export function getService(slug) {
  return services.find((s) => s.slug === slug) || null;
}

export const serviceTitles = services.map((s) => s.title);

// The four steps every project goes through. Shown on the home page and reused
// on each service page so the promise is identical in both places.
export const process = [
  {
    n: "01",
    title: "You tell us what you need",
    body: "One form, three questions, two minutes. No meeting needed to start.",
    // What the visitor actually has in hand at the end of this step. Shown
    // when a step is opened on the home page; keep every line true of how we
    // work, because this is the promise.
    receive: [
      "A reference number for your request",
      "Your message already written in WhatsApp, ready to send",
    ],
  },
  {
    n: "02",
    title: "We reply with a plan and a price",
    body: "A fixed quote and a timeline, usually the same day. Nothing starts until you say yes.",
    receive: [
      "A written plan of what gets built, in what order",
      "One fixed price and a timeline",
      "Nothing to pay just to find out",
    ],
  },
  {
    n: "03",
    title: "We build it, you watch it grow",
    body: "You see a working link early and at every step, not a surprise at the end.",
    receive: [
      "A private link to the working build, early on",
      "The same link updated at every step, so you can try it as it grows",
    ],
  },
  {
    n: "04",
    title: "Live, and still supported",
    body: "We deploy it, hand over everything, and stay reachable after launch.",
    receive: [
      "It live, on your domain or your devices",
      "Every login, account and the code, in your name",
      "Someone to message when something needs changing",
    ],
  },
];

// Proof. Every item here is a real shipped project.
//
// `shot` is the real screenshot, and it wins when it is set. Leave it empty and
// the card draws the mock in `_components/ui/WorkMock.js` instead, chosen by
// `mock`. Dropping a file into public/work/ and filling in `shot` is the whole
// job: no component changes, no layout changes.
export const work = [
  {
    title: "SAAM'S Store",
    kind: "Online store, admin panel, AI assistant",
    body: "A full storefront with cart, checkout and a chatbot that answers from the live catalogue.",
    href: "https://saam-s-store.vercel.app/",
    shot: "",
    mock: "store",
    tags: ["E-Commerce", "AI Assistant", "Admin Panel"],
  },
  {
    title: "Petrol Pump Manager",
    kind: "Business software, offline desktop",
    body: "Daily readings, stock, customer credit and monthly profit. Also ships as a Windows app that needs no internet.",
    shot: "",
    mock: "dashboard",
    tags: ["Dashboard", "Offline Desktop", "Reports"],
  },
  {
    title: "Committee Ledger",
    kind: "Android app, offline first",
    body: "A monthly committee's books on the phone, with the timing problem the bank balance hides made visible.",
    shot: "",
    mock: "phone",
    tags: ["Android", "Offline", "Ledger"],
  },
  {
    title: "PMC Hospital",
    kind: "Internal system behind a login",
    body: "Wards, pharmacy and lab records for a paediatric hospital. No public pages at all.",
    shot: "",
    mock: "dashboard",
    tags: ["Internal Tool", "Auth", "Records"],
  },
];
