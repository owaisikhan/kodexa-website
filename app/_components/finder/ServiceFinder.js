"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Clock, RotateCcw } from "lucide-react";

import { finder } from "@/app/_lib/finder-data";
import { getService } from "@/app/_lib/services-data";
import ServiceIcon, { accentVar, accentInk } from "@/app/_components/ui/ServiceIcon";
import Section, { SectionHeader } from "@/app/_components/ui/Section";
import Button from "@/app/_components/ui/Button";

// "Which one do I need?" in one or two taps, for the visitor who read nine
// service names and recognised none of them. It ends on one service and a
// request form with that service already chosen, which is the site's one job.
//
// State is a path of chosen option ids, so Back is just dropping the last one
// and there is no separate "step" number to fall out of sync.

function walk(path) {
  let question = finder;
  let answer = null;
  for (const id of path) {
    const option = question.options.find((o) => o.id === id);
    if (!option) break;
    if (option.next) question = option.next;
    else answer = option;
  }
  return { question, answer };
}

export default function ServiceFinder({ id = "finder", className }) {
  const [path, setPath] = useState([]);
  const { question, answer } = walk(path);
  const service = answer ? getService(answer.service) : null;
  const reduce = useReducedMotion();

  // Each step replaces the last, so focus has to move to the new heading or a
  // keyboard or screen reader user is left on a button that no longer exists.
  // The step focuses itself when it mounts, because with mode="wait" it only
  // appears after the old one has animated out. Only after a choice, though:
  // the page must not jump to the finder on load.
  const wantFocus = useRef(false);
  const go = (next) => {
    wantFocus.current = true;
    setPath(next);
  };

  const step = service ? "answer" : path.length === 0 ? "first" : "second";
  const slide = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } };

  return (
    <Section id={id} className={className}>
      <div className="container-x">
        <SectionHeader
          kicker="Not sure which?"
          title="Find yours in two taps"
          body="Pick what is getting in the way. We will point you at the one service that fixes it."
        />

        <div className="panel mt-12 overflow-hidden">
          <div className="flex min-h-12 items-center justify-between gap-4 border-b-2 border-[var(--color-ink)] bg-[var(--color-surface-2)] px-5 py-2">
            <span className="kicker">
              {step === "answer" ? "Your match" : step === "first" ? "Question 1" : "Question 2"}
            </span>
            {path.length > 0 ? (
              <button
                type="button"
                onClick={() => go(path.slice(0, -1))}
                className="tap gap-1.5 px-1 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back
              </button>
            ) : null}
          </div>

          {/* No aria-live here: focus moves to each new heading, which reads it
              out. A live region as well would announce every step twice. */}
          <div className="p-5 md:p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={path.join("/") || "start"} {...slide} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
                {service ? (
                  <Answer service={service} why={answer.why} wantFocus={wantFocus} onRestart={() => go([])} />
                ) : (
                  <Question
                    question={question}
                    wantFocus={wantFocus}
                    onPick={(optionId) => go([...path, optionId])}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}

function useFocusOnMount(wantFocus) {
  const ref = useRef(null);
  useEffect(() => {
    if (wantFocus.current) ref.current?.focus();
  }, [wantFocus]);
  return ref;
}

function Question({ question, wantFocus, onPick }) {
  const labelId = useId();
  const heading = useFocusOnMount(wantFocus);
  return (
    <div role="group" aria-labelledby={labelId}>
      <h3 ref={heading} id={labelId} tabIndex={-1} className="text-[clamp(1.4rem,3vw,1.9rem)] outline-none">
        {question.question}
      </h3>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {question.options.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => onPick(o.id)}
              className="group flex h-full min-h-20 w-full items-center justify-between gap-3 rounded-[4px] border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-4 text-left shadow-[3px_3px_0_var(--color-ink)] transition-[transform,box-shadow,background] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[var(--color-primary)] hover:shadow-[1px_1px_0_var(--color-ink)]"
            >
              <span>
                <span className="block font-display font-bold leading-snug">{o.label}</span>
                <span className="mt-1 block text-sm text-[var(--color-muted)] group-hover:text-[var(--color-ink)]">
                  {o.hint}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-[var(--color-muted)]">
        None of these?{" "}
        <Link href="/request" className="tap font-semibold text-[var(--color-text)] underline decoration-2 underline-offset-4">
          Describe it in your own words
        </Link>
        .
      </p>
    </div>
  );
}

function Answer({ service, why, wantFocus, onRestart }) {
  const heading = useFocusOnMount(wantFocus);
  const accent = accentVar[service.accent] ?? accentVar.primary;
  const ink = accentInk[service.accent] ?? accentInk.primary;

  return (
    <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
      <span
        className="grid h-16 w-16 place-items-center rounded-[6px] border-2 border-[var(--color-ink)] shadow-[4px_4px_0_var(--color-ink)]"
        style={{ color: ink, background: accent }}
        aria-hidden
      >
        <ServiceIcon name={service.icon} className="h-8 w-8" />
      </span>

      <div>
        <h3 ref={heading} tabIndex={-1} className="text-[clamp(1.6rem,3.6vw,2.4rem)] outline-none">
          <span className="sr-only">We suggest </span>
          {service.title}
        </h3>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--color-text)]">{why}</p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <Clock className="h-4 w-4 text-[var(--color-dim)]" aria-hidden />
          {/* "Usually 2 to 4 weeks", but "Ongoing, monthly" as written. */}
          {/^\d/.test(service.timeline) ? `Usually ${service.timeline}` : service.timeline}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button href={`/request?service=${service.slug}`}>
            Request this
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href={`/services/${service.slug}`} variant="ghost">
            See what you get
          </Button>
          <button
            type="button"
            onClick={onRestart}
            className="tap gap-1.5 px-2 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
