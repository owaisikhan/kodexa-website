"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { siteConfig, whatsappHref } from "@/app/_lib/siteConfig";
import { services } from "@/app/_lib/services-data";
import Button from "@/app/_components/ui/Button";

// The first screen, set like the front page of a paper: a masthead line, a
// headline large enough to be the picture, a standfirst, and an index of
// everything inside. No illustration, no orbs, no floating cards. The type
// is doing the work, so the only motion is the type arriving.

const lines = [
  ["We", "build", "the"],
  ["software", "your"],
  ["business", { em: "runs on." }],
];

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-animate], [data-lines] [data-word], [data-index-row]", { opacity: 1, x: 0, y: 0 });
        gsap.set("[data-rule]", { scaleX: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo("[data-rule]", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut", stagger: 0.08 })
        .to("[data-animate='masthead']", { opacity: 1, y: 0, duration: 0.5 }, "-=0.6")
        // Each word rises out of its own line box, which is what a mask on a
        // printed line would do. The overflow-hidden on the line is the mask.
        .to("[data-lines] [data-word]", { opacity: 1, y: 0, duration: 0.95, stagger: 0.06 }, "-=0.35")
        .to("[data-animate='sub']", { opacity: 1, y: 0, duration: 0.6 }, "-=0.55")
        .to("[data-animate='cta']", { opacity: 1, y: 0, duration: 0.6 }, "-=0.45")
        .to("[data-index-row]", { opacity: 1, x: 0, duration: 0.5, stagger: 0.04 }, "-=0.7")
        .to("[data-animate='stats']", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative pt-[72px]">
      <div className="container-x hero-pad">
        {/* Masthead. The facts a visitor wants before they read a word. */}
        <div data-rule className="rule origin-left" aria-hidden />
        <div
          data-animate="masthead"
          className="flex translate-y-2 flex-wrap items-center justify-between gap-x-8 gap-y-1 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-muted)]"
        >
          <span>Software studio</span>
          <span className="hidden sm:inline">{siteConfig.location}</span>
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            </span>
            Taking new projects
          </span>
        </div>
        <div data-rule className="rule-soft origin-left" aria-hidden />

        <div className="grid gap-12 pt-8 md:pt-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <h1 data-lines className="hero-title" aria-label="We build the software your business runs on.">
              {lines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em]" aria-hidden>
                  {line.map((w, j) =>
                    typeof w === "string" ? (
                      <span key={j} data-word className="inline-block translate-y-[105%] opacity-0">
                        {w}&nbsp;
                      </span>
                    ) : (
                      <span key={j} data-word className="em inline-block translate-y-[105%] opacity-0">
                        {w.em}
                      </span>
                    )
                  )}
                </span>
              ))}
            </h1>

            <div className="hero-gap-sm grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
              <p
                data-animate="sub"
                className="max-w-lg translate-y-3 text-lg leading-relaxed text-[var(--color-muted)] md:text-xl"
              >
                Websites, online stores, dashboards, desktop software, Android
                apps and AI assistants. Tell us what you need in two minutes
                and get a fixed price, usually the same day.
              </p>
            </div>

            <div
              data-animate="cta"
              className="hero-gap-lg flex translate-y-3 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Button href="/request" size="lg">
                Request a service
                <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button href={whatsappHref({ service: "a project" })} external variant="ghost" size="lg">
                Message us on WhatsApp
              </Button>
            </div>
          </div>

          {/* The index. Everything we sell, numbered, one click from its page. */}
          <aside className="hidden lg:col-span-4 lg:block" aria-label="Services">
            <p className="kicker border-b border-[var(--color-ink)] pb-2">In this studio</p>
            <ol>
              {services.map((s, i) => (
                <li key={s.slug} data-index-row className="translate-x-3 opacity-0">
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-baseline gap-4 border-b border-[var(--color-border-soft)] py-[0.55rem] transition-colors hover:border-[var(--color-ink)]"
                  >
                    <span className="w-6 shrink-0 font-mono text-[0.72rem] text-[var(--color-red)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[0.95rem] text-[var(--color-text)]">{s.title}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 text-[var(--color-muted)] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-[var(--color-red)] group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <dl
          data-animate="stats"
          className="mt-14 grid translate-y-3 grid-cols-3 border-t border-[var(--color-ink)] md:mt-20"
        >
          {siteConfig.stats.map((s, i) => (
            <div
              key={s.label}
              className={`pt-4 ${i > 0 ? "border-l border-[var(--color-border-soft)] pl-4 md:pl-8" : ""}`}
            >
              <dt className="font-display text-4xl leading-none md:text-6xl">{s.value}</dt>
              <dd className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-muted)] md:text-[0.72rem]">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
