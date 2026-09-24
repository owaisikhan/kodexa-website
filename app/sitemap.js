import { services } from "@/app/_lib/services-data";
import { siteConfig } from "@/app/_lib/siteConfig";

// Every public page, for search engines. A new page is not findable until it
// is listed here. /admin and /api are left out on purpose (see robots.js).
export default function sitemap() {
  const url = (path) => new URL(path, siteConfig.url).toString();
  const pages = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/request", priority: 0.9 },
    { path: "/work", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/faq", priority: 0.6 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];
  return [
    ...pages.map((p) => ({ url: url(p.path), changeFrequency: "monthly", priority: p.priority })),
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), changeFrequency: "monthly", priority: 0.8 })),
  ];
}
