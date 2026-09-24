"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

import { process } from "@/app/_lib/services-data";
import Section, { SectionHeader } from "@/app/_components/ui/Section";

// The four steps, drawn as a line that fills as you scroll. The point is to
// answer "what actually happens if I send this form" before it is asked.
//
// Each step opens to show what the visitor actually has in hand at the end
// of it (`receive` in services-data.js): the concrete answer to "and then
// what?", for the people who want it, without lengthening the page for
// everyone else.

export default function ProcessTimeline() {
  const root = useRef(null);
  const [open, setOpen] = useState([]);
  const reduce = useReducedMotion();

  const toggle = (n) => {
    setOpen((o) => (o.includes(n) ? o.filter((x) => x !== n) : [...o, n]));
    // Opening a step makes the section taller, so every ScrollTrigger below
    // it would fire at the old offsets. Measure again once the panel is in.
    setTimeout(() => ScrollTrigger.refresh(), reduce ? 50 : 320);
  };

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
          kicker="Process"
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
                {step.receive?.length ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggle(step.n)}
                      aria-expanded={open.includes(step.n)}
                      aria-controls={`receive-${step.n}`}
                      className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold underline decoration-2 underline-offset-4"
                    >
                      What you get at this step
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${open.includes(step.n) ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {open.includes(step.n) ? (
                        <motion.div
                          id={`receive-${step.n}`}
                          initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                          animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                          exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <ul className="panel mt-3 max-w-xl space-y-2.5 p-5">
                            {step.receive.map((r) => (
                              <li key={r} className="flex gap-2.5">
                                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" strokeWidth={3} aria-hidden />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
