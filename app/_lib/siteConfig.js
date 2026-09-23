// Identity as data. Changing the studio's name, number or links is one edit
// here, never a grep across components.

export const siteConfig = {
  name: "Kodexa",
  tagline: "We build the software your business runs on",
  description:
    "Kodexa builds websites, online stores, business dashboards, offline desktop software, Android apps and AI assistants. Tell us what you need and get a quote.",

  // The WhatsApp number every request is handed off to. Digits only, with the
  // country code and no plus sign, because that is the format wa.me expects.
  whatsapp: "923390391420",
  whatsappDisplay: "+92 339 0391420",

  email: "hello@kodexa.dev",
  location: "Pakistan, working worldwide",

  url: "https://kodexa.dev",

  // Shown in the hero and the footer. Keep these honest.
  stats: [
    { value: "9", label: "services we actually ship" },
    { value: "20+", label: "projects in the repos" },
    { value: "24h", label: "typical reply time" },
  ],

  // When someone is at the phone to reply, in Pakistan time. The reply badge
  // reads this, so it must be true: change it the day the hours change.
  // Days are 0 = Sunday to 6 = Saturday; hours are 24h, close exclusive.
  // PLACEHOLDER: confirm the real hours before this ships.
  hours: {
    timeZone: "Asia/Karachi",
    days: [1, 2, 3, 4, 5, 6],
    open: 10,
    close: 20,
  },

  social: {
    facebook: "https://facebook.com/",
    github: "https://github.com/owaisikhan",
  },
};

// The message pre-filled into WhatsApp when a request is handed off.
export function whatsappHref({ service, name, business, brief } = {}) {
  const lines = [
    `Hi Kodexa, I would like to request: ${service || "a project"}.`,
    name ? `Name: ${name}` : null,
    business ? `Business: ${business}` : null,
    brief ? `What I need: ${brief}` : null,
  ].filter(Boolean);

  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    lines.join("\n")
  )}`;
}
