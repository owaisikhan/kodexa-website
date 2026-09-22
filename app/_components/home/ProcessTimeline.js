"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { process } from "@/app/_lib/services-data";
import Section, { SectionHeader } from "@/app/_components/ui/Section";

// The four steps, drawn as a line that fills as you scroll. The point is to
// answer "what actually happens if I send this form" before it is asked.

export default function ProcessTimeline() {
  const root = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray("[data-step]");

      if (reduced) {
        gsap.set(steps, { opacity: 1, y: 0 });
        gsap.set("[data-line-fill]", { scaleY: 1 });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      // The rail fills across the whole section rather than per step, so the
      // line and the steps cannot disagree about progress.
      gsap.fromTo(
        "[data-line-fill]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-rail]",
            start: "top 72%",
            end: "bottom 60%",
            scrub: 0.4,
          },
        }
      );

      steps.forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 82%" },
          }
        );

        gsap.fromTo(
          step.querySelector("[data-dot]"),
          { scale: 0.4, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: { trigger: step, start: "top 76%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="process">
      <div ref={root} className="container-x">
        <SectionHeader
          kicker="How it works"
          title="Four steps, no meetings to get started"
          body="You never pay to find out what something costs, and nothing starts until you say yes."
        />

        <div data-rail className="relative mt-16 pl-12 md:pl-20">
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-[var(--color-border)] md:left-[26px]" aria-hidden />
          <div
            data-line-fill
            className="absolute left-[18px] top-2 bottom-2 w-0.5 origin-top bg-[var(--color-ink)] md:left-[26px]"
            aria-hidden
          />

          <ol className="space-y-12 md:space-y-16">
            {process.map((step) => (
              <li key={step.n} data-step className="relative">
                <span
                  data-dot
                  className="absolute -left-12 top-1 grid h-9 w-9 place-items-center rounded-[4px] border-2 border-[var(--color-ink)] bg-[var(--color-primary)] font-mono text-xs font-bold text-[var(--color-ink)] md:-left-20 md:h-[52px] md:w-[52px] md:text-sm"
                >
                  {step.n}
                </span>
                <h3 className="text-2xl md:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
