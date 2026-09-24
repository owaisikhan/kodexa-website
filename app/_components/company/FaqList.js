import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { faqs } from "@/app/_lib/company-data";

// Questions as native <details>: they open with a tap, work without
// JavaScript, and a screen reader announces them as expandable. Every answer
// is in the HTML, so search engines read them too.

export default function FaqList({ items = faqs, className }) {
  return (
    <div className={className}>
      {items.map((f) => (
        <details key={f.q} className="group border-b border-[var(--color-border-soft)] first:border-t">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus
              className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-45"
              aria-hidden
            />
          </summary>
          <div className="max-w-2xl pb-6 leading-relaxed text-[var(--color-muted)]">
            <p>{f.a}</p>
            {f.link ? (
              <Link
                href={f.link.href}
                className="tap mt-3 gap-1.5 font-semibold text-[var(--color-text)] underline decoration-2 underline-offset-4"
              >
                {f.link.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}
