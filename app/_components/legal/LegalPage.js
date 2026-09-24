import Link from "next/link";

import { siteConfig } from "@/app/_lib/siteConfig";
import PageHero from "@/app/_components/ui/PageHero";
import Section from "@/app/_components/ui/Section";

// One template for the privacy policy and the terms. A contents list first,
// because these pages are read by people looking for one answer ("do you sell
// my number?"), then numbered sections they can link to.

function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function LegalPage({ doc, path, other }) {
  return (
    <>
      <PageHero
        base={siteConfig.url}
        crumbs={[
          { href: "/", label: "Home" },
          { href: path, label: doc.title },
        ]}
        title={doc.title}
        body={doc.intro}
      >
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-dim)]">
          Last updated <time dateTime={doc.updated}>{formatDate(doc.updated)}</time>
        </p>
      </PageHero>

      <Section tight className="pt-4!">
        <div className="container-x grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="kicker">On this page</p>
            <ol className="mt-4 space-y-1 text-sm">
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex min-h-11 items-center gap-3 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  >
                    <span className="font-mono text-xs text-[var(--color-dim)]">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-2xl">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-[var(--color-border-soft)] py-8 first:border-t-0 first:pt-0">
                <h2 className="flex items-baseline gap-3 text-2xl">
                  <span className="font-mono text-sm text-[var(--color-dim)]">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-text)]">
                  {s.body.map((b, j) =>
                    typeof b === "string" ? (
                      <p key={j}>{b}</p>
                    ) : (
                      <ul key={j} className="list-disc space-y-2 pl-5 marker:text-[var(--color-dim)]">
                        {b.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              </section>
            ))}

            <p className="mt-6 border-t-2 border-[var(--color-ink)] pt-6 text-sm text-[var(--color-muted)]">
              See also our{" "}
              <Link href={other.href} className="tap font-semibold text-[var(--color-text)] underline decoration-2 underline-offset-4">
                {other.label}
              </Link>
              , or{" "}
              <Link href="/contact" className="tap font-semibold text-[var(--color-text)] underline decoration-2 underline-offset-4">
                contact us
              </Link>{" "}
              with a question.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
