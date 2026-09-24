import { services } from "@/app/_lib/services-data";
import { siteConfig } from "@/app/_lib/siteConfig";

// Turns the paths and numbers in an answer into things you can tap.
//
// The model writes plain paths ("/request?service=online-store") because that
// is the one format it cannot get wrong. Asking it for markdown or full URLs
// invites a confidently broken link to a page we do not have, or to somebody
// else's site entirely. So: the model names a destination, and this file
// decides whether that destination exists and what to call it.
//
// **The allowlist is the point.** A path that is not a real route on this site
// stays plain text. Nothing the model emits can become a live link to
// somewhere we did not choose.

const SERVICE_SLUGS = new Set(services.map((s) => s.slug));

const STATIC_ROUTES = {
  "/": "Home",
  "/request": "Request a service",
  "/work": "See our work",
  "/services": "All services",
  "/about": "About us",
  "/contact": "Contact us",
  "/faq": "Common questions",
  "/privacy": "Privacy policy",
  "/terms": "Terms of service",
};

// A query string runs to the next space, so it happily swallows the full stop
// at the end of the sentence. Split that punctuation off and hand it back, or
// answers quietly lose their final "." every time they link to a service.
export function splitTrailingPunctuation(raw) {
  const match = raw.match(/[.,;:!?)\]]+$/);
  if (!match) return { path: raw, trailing: "" };
  return { path: raw.slice(0, -match[0].length), trailing: match[0] };
}

/**
 * Resolve a path the model wrote into a link, or null to leave it as text.
 * Returns the label a human should see rather than the raw path.
 */
export function resolvePath(raw) {
  const { path: cleaned } = splitTrailingPunctuation(raw);
  const [pathname, query = ""] = cleaned.split("?");

  if (pathname === "/request") {
    const slug = new URLSearchParams(query).get("service");
    if (slug && SERVICE_SLUGS.has(slug)) {
      const service = services.find((s) => s.slug === slug);
      return { href: cleaned, label: `Request ${service.title}` };
    }
    return { href: "/request", label: STATIC_ROUTES["/request"] };
  }

  if (pathname.startsWith("/services/")) {
    const slug = pathname.slice("/services/".length);
    const service = services.find((s) => s.slug === slug);
    // A made-up service page is left as text rather than linked to a 404.
    if (!service) return null;
    return { href: `/services/${slug}`, label: service.title };
  }

  if (STATIC_ROUTES[pathname]) {
    return { href: pathname, label: STATIC_ROUTES[pathname] };
  }

  return null;
}

// Paths, the WhatsApp number in any spacing, and the one external site we
// actually point people at. Everything else stays text.
const PATTERN = new RegExp(
  [
    "(?<path>\\/(?:request|work|about|contact|faq|privacy|terms|services(?:\\/[a-z-]+)?)(?:\\?[^\\s)]*)?)",
    "(?<whatsapp>\\+92[\\d\\s-]{9,15})",
    "(?<store>saam-s-store\\.vercel\\.app)",
  ].join("|"),
  "g"
);

/**
 * Split an answer into plain strings and link descriptors, in order.
 *
 * Returning descriptors rather than JSX keeps this testable and keeps the
 * widget free to render them however it likes.
 */
export function parseAnswer(text) {
  const parts = [];
  let cursor = 0;

  for (const match of text.matchAll(PATTERN)) {
    const { path, whatsapp, store } = match.groups;
    const start = match.index;

    if (start > cursor) parts.push({ type: "text", value: text.slice(cursor, start) });
    cursor = start + match[0].length;

    if (path) {
      const link = resolvePath(path);
      if (link) {
        parts.push({ type: "link", ...link });
        const { trailing } = splitTrailingPunctuation(path);
        if (trailing) parts.push({ type: "text", value: trailing });
      } else {
        parts.push({ type: "text", value: match[0] });
      }
      continue;
    }

    if (whatsapp) {
      // The number pattern allows spaces inside the number, which means it
      // also eats the space after it and glues the link to the next word.
      const trailingSpace = whatsapp.match(/\s+$/)?.[0] ?? "";
      const number = whatsapp.slice(0, whatsapp.length - trailingSpace.length);
      const digits = number.replace(/\D/g, "");
      // Only our own number becomes a link. A number the model invented is
      // not something to hand a visitor a button for.
      if (digits === siteConfig.whatsapp) {
        parts.push({
          type: "external",
          href: `https://wa.me/${digits}`,
          label: siteConfig.whatsappDisplay,
        });
        if (trailingSpace) parts.push({ type: "text", value: trailingSpace });
      } else {
        parts.push({ type: "text", value: match[0] });
      }
      continue;
    }

    if (store) {
      parts.push({
        type: "external",
        href: "https://saam-s-store.vercel.app/",
        label: "saam-s-store.vercel.app",
      });
    }
  }

  if (cursor < text.length) parts.push({ type: "text", value: text.slice(cursor) });

  return parts;
}
