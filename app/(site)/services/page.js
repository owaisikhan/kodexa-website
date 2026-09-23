import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { services } from "@/app/_lib/services-data";
import { siteConfig } from "@/app/_lib/siteConfig";
import { ServiceCards } from "@/app/_components/home/ServicesGrid";
import ServiceIcon, { accentVar, accentInk } from "@/app/_components/ui/ServiceIcon";
import Breadcrumbs from "@/app/_components/ui/Breadcrumbs";
import Section from "@/app/_components/ui/Section";
import Reveal from "@/app/_components/ui/Reveal";
import Button from "@/app/_components/ui/Button";
import CtaBand from "@/app/_components/home/CtaBand";
import ServiceFinder from "@/app/_components/finder/ServiceFinder";

export const metadata = {
  title: "Services",
  description:
    "Everything Kodexa builds, side by side: websites, online stores, business dashboards, offline desktop software, Android apps, AI assistants, audits, design and support.",
};

// The page the breadcrumb and the Services menu point at. The home page shows
// the same cards to people browsing; this page adds the side-by-side list for
// people deciding, because "which one do I need?" is the question that stops
// most visitors from sending a request.
export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-[152px] pb-10">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs
            base={siteConfig.url}
            items={[
              { href: "/", label: "Home" },
              { href: "/services", label: "Services" },
            ]}
          />
          <Reveal>
            <h1 className="mt-8 max-w-3xl text-[clamp(2.4rem,6.5vw,4.4rem)]">
              Nine services. Pick one, or ask.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">
              Each card opens what you get, how long it takes and who it suits. Not sure which one
              fits? Answer one or two questions, or see them side by side.
            </p>
            {/* Buttons, not a pair of underlined links: on a phone the links
                stacked into one block and the finder was easy to miss. */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#finder">
                Find yours in two taps
                <ArrowRight className="h-4 w-4 rotate-90" aria-hidden />
              </Button>
              <Button href="#compare" variant="ghost">
                Compare side by side
                <ArrowRight className="h-4 w-4 rotate-90" aria-hidden />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Section tight className="pt-6!">
        <div className="container-x">
          <ServiceCards />
        </div>
      </Section>

      <ServiceFinder className="border-t border-[var(--color-border-soft)]" />

      <Section tight id="compare" className="border-t border-[var(--color-border-soft)] bg-[var(--color-bg-2)]">
        <div className="container-x">
          <h2 className="text-[clamp(1.8rem,4vw,2.6rem)]">Side by side</h2>
          <p className="mt-3 max-w-xl text-[var(--color-muted)]">
            Find the line that sounds like your business.
          </p>

          {/* A list, not a table: on a phone a three-column table either
              scrolls sideways or squeezes each sentence into a few words. Here
              each row stacks on a phone and lines up in columns from md. */}
          <div className="panel mt-8 overflow-hidden">
            <div
              className="hidden border-b-2 border-[var(--color-ink)] bg-[var(--color-surface-2)] px-5 py-3 md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)_150px] md:gap-6"
              aria-hidden
            >
              <span className="kicker">Service</span>
              <span className="kicker">Best for</span>
              <span className="kicker">Usually takes</span>
            </div>
            <ul>
              {services.map((s) => (
                <li key={s.slug} className="border-b border-[var(--color-border-soft)] last:border-b-0">
                  <Link
                    href={`/services/${s.slug}`}
                    className="group grid gap-2 px-5 py-4 transition-colors hover:bg-[var(--color-surface)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)_150px] md:items-center md:gap-6"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-[4px] border-2 border-[var(--color-ink)]"
                        style={{
                          color: accentInk[s.accent] ?? accentInk.primary,
                          background: accentVar[s.accent] ?? accentVar.primary,
                        }}
                        aria-hidden
                      >
                        <ServiceIcon name={s.icon} className="h-4.5 w-4.5" />
                      </span>
                      <span className="font-display font-bold group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                        {s.title}
                      </span>
                    </span>
                    <span className="text-[var(--color-muted)]">{s.for}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
                      <Clock className="h-4 w-4 text-[var(--color-dim)]" aria-hidden />
                      {s.timeline}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Still not sure which one?"
        body="Describe the problem in your own words. We reply with the service that fits and a fixed price."
      />
    </>
  );
}
