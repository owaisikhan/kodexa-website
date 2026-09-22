"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { process } from "@/app/_lib/services-data";
import Section, { SectionHeader } from "@/app/_components/ui/Section";

// The four steps, set as four columns under one rule. The rule draws across as
// you scroll, and each step's numeral lands as the rule reaches it, so the
// page reads left to right in the order the work actually happens.

export default function ProcessTimeline() {
  const root = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray("[data-step]");

      if (reduced) {
        gsap.set(steps, { opacity: 1, y: 0 });
        gsap.set("[data-rail-fill]", { scaleX: 1 });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        "[data-rail-fill]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-rail]", start: "top 80%", end: "top 35%", scrub: 0.5 },
        }
      );

      gsap.fromTo(
        steps,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-rail]", start: "top 78%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="process" className="bg-[var(--color-bg-2)]">
      <div ref={root} className="container-x">
        <SectionHeader
          index="02"
          kicker="Process"
          note="No meeting to start"
          title={
            <>
              Four steps. <span className="em">Nothing starts</span> until you say yes.
            </>
          }
          body="You never pay to find out what something costs, and you see a working link early, not a reveal at the end."
        />

        <div data-rail className="relative mt-14 md:mt-20">
          <div className="rule-soft" aria-hidden />
          <div data-rail-fill className="absolute inset-x-0 top-0 h-[2px] origin-left bg-[var(--color-ink)]" aria-hidden />

          <ol className="grid md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <li
                key={step.n}
                data-step
                className={`border-b border-[var(--color-border-soft)] py-8 md:pr-8 lg:border-b-0 lg:py-10 ${
                  i > 0 ? "lg:border-l lg:pl-8" : ""
                } ${i % 2 === 1 ? "md:border-l md:pl-8" : ""}`}
              >
                <span className="block font-display text-[5.5rem] leading-[0.8] text-[var(--color-red)] md:text-[7rem]">
                  {step.n}
                </span>
                <h3 className="mt-6 text-[1.75rem] leading-[1.1]">{step.title}</h3>
                <p className="mt-3 max-w-xs leading-relaxed text-[var(--color-muted)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
