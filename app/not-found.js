import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Button from "@/app/_components/ui/Button";
import { services } from "@/app/_lib/services-data";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden pt-[88px]">
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div className="container-x relative text-center">
        <p className="kicker mb-4">404</p>
        <h1 className="text-[clamp(2.2rem,6vw,3.6rem)]">This page does not exist</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-[var(--color-muted)]">
          The link may be old, or we may have moved something.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href="/">Back to the home page</Button>
          <Button href="/request" variant="ghost">
            Start a project
          </Button>
        </div>

        {/* Most dead links here are old service URLs, so offer the nine real
            ones rather than making the visitor start over from the top. */}
        <nav aria-label="Services" className="mx-auto mt-14 max-w-2xl text-left">
          <p className="kicker text-center">Or go straight to a service</p>
          <ul className="mt-5 grid gap-x-6 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-[var(--color-border-soft)]">
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex min-h-12 items-center justify-between gap-3 font-medium hover:text-[var(--color-ink)]"
                >
                  {s.title}
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
