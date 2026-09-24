import { siteConfig } from "@/app/_lib/siteConfig";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
