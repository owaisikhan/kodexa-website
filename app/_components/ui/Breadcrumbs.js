import Link from "next/link";
import { ChevronRight } from "lucide-react";

// A trail back up the site, and the same trail for search engines. The last
// item is the page itself, so it is text marked aria-current, not a link to
// where you already are.
//
// `base` is the site's absolute URL; structured data needs full addresses and
// this component does not know whose site it is on.

export default function Breadcrumbs({ items, base }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: new URL(item.href, base).toString(),
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1 text-sm text-[var(--color-muted)]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="font-semibold text-[var(--color-text)]">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="tap underline-offset-4 transition-colors hover:text-[var(--color-ink)] hover:underline"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-[var(--color-dim)]" aria-hidden />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        // Escaping "<" keeps a label from ever closing the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </nav>
  );
}
