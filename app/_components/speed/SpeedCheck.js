"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Gauge, Loader2 } from "lucide-react";
import clsx from "clsx";

import { whatsappHref } from "@/app/_lib/siteConfig";
import Section, { SectionHeader } from "@/app/_components/ui/Section";
import Button from "@/app/_components/ui/Button";
import WhatsAppIcon from "@/app/_components/ui/WhatsAppIcon";

// A free, real speed test on the Website Audit page. It gives the visitor a
// finding about their own site before they have told us anything, which is
// the most convincing thing an audit page can do, and it ends on "want us to
// fix this?" with their address already filled in.

const WORDS = { good: "Good", "needs-work": "Needs work", poor: "Slow", unknown: "No score" };
// Colour is never the only cue: every rating is also written out.
const TONE = {
  good: "bg-[var(--color-success)] text-[var(--color-on-dark)]",
  "needs-work": "bg-[var(--color-primary)] text-[var(--color-ink)]",
  poor: "bg-[var(--color-danger)] text-[var(--color-on-dark)]",
  unknown: "bg-[var(--color-surface-2)] text-[var(--color-ink)]",
};

export default function SpeedCheck() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const resultHeading = useRef(null);
  const reduce = useReducedMotion();

  // Google takes 20 to 40 seconds. A counting clock says "still working"
  // honestly, where a spinner alone starts to look stuck after ten.
  useEffect(() => {
    if (!busy) return;
    const started = Date.now();
    const id = setInterval(() => setElapsed(Math.round((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(id);
  }, [busy]);

  useEffect(() => {
    if (result) resultHeading.current?.focus();
  }, [result]);

  async function run(e) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setResult(null);
    setElapsed(0);
    setBusy(true);
    try {
      const response = await fetch("/api/speed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "The speed test is unavailable right now.");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const brief = result
    ? `My site: ${result.url}. The free speed check scored it ${result.score} out of 100 on a phone.`
    : "";

  return (
    <Section id="speed-check" tight className="border-t border-[var(--color-border-soft)]">
      <div className="container-x">
        <SectionHeader
          kicker="Free speed check"
          title="How fast is your site on a phone?"
          body="Type your address. Google tests it on a simulated mid-range phone, and you get the score and the three biggest fixes. Nothing to sign up for."
        />

        <form onSubmit={run} className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Your website address</span>
            <input
              className="field"
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="e.g. yourshop.pk"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              maxLength={200}
              required
              disabled={busy}
            />
          </label>
          <Button type="submit" disabled={busy || !url.trim()}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Gauge className="h-4 w-4" aria-hidden />}
            {busy ? "Testing" : "Test my site"}
          </Button>
        </form>

        <div aria-live="polite" className="mt-6 max-w-2xl">
          {busy ? (
            <div className="panel p-5">
              <p className="font-semibold">Testing on a phone. This takes up to 40 seconds.</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full border border-[var(--color-ink)] bg-[var(--color-surface-2)]" aria-hidden>
                <motion.div
                  className="h-full bg-[var(--color-primary)]"
                  initial={{ width: "4%" }}
                  animate={{ width: `${Math.min(92, 4 + elapsed * 2.2)}%` }}
                  transition={{ duration: reduce ? 0 : 0.8, ease: "linear" }}
                />
              </div>
              <p className="mt-2 font-mono text-xs text-[var(--color-muted)] tabular-nums">{elapsed}s</p>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="rounded-[4px] border-2 border-[var(--color-danger)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold">
              {error}
            </p>
          ) : null}
        </div>

        {result ? (
          <div className="panel mt-2 max-w-3xl p-5 md:p-8">
            <div className="flex flex-wrap items-center gap-5">
              <span
                className={clsx(
                  "grid h-24 w-24 shrink-0 place-items-center rounded-[6px] border-2 border-[var(--color-ink)] font-display text-4xl font-extrabold shadow-[4px_4px_0_var(--color-ink)]",
                  TONE[result.rating]
                )}
              >
                {result.score}
              </span>
              <div className="min-w-0">
                <h3 ref={resultHeading} tabIndex={-1} className="text-2xl outline-none">
                  {WORDS[result.rating]} on a phone
                  <span className="sr-only">, {result.score} out of 100</span>
                </h3>
                <p className="mt-1 break-all text-sm text-[var(--color-muted)]">{result.url}</p>
              </div>
            </div>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {result.metrics.map((m) => (
                <li key={m.label} className="flex items-center justify-between gap-3 rounded-[4px] border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] px-3 py-2">
                  <span className="text-sm">{m.label}</span>
                  <span className="flex items-center gap-2 whitespace-nowrap font-mono text-sm font-bold tabular-nums">
                    {m.value}
                    <span className={clsx("rounded-[3px] border border-[var(--color-ink)] px-1.5 py-0.5 font-sans text-[0.65rem] uppercase tracking-wide", TONE[m.rating])}>
                      {WORDS[m.rating]}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            {result.fixes.length ? (
              <>
                <h4 className="mt-6 font-display text-lg font-bold">The biggest fixes</h4>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-[var(--color-muted)]">
                  {result.fixes.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ol>
              </>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={`/request?service=website-audit&site=${encodeURIComponent(result.url)}`}>
                Get these fixed
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href={whatsappHref({ service: "Website Audit & Speed", brief })} external variant="whatsapp">
                <WhatsAppIcon className="h-4.5 w-4.5" />
                Send this on WhatsApp
              </Button>
            </div>
            <p className="mt-4 text-xs text-[var(--color-dim)]">
              Scores change between runs by a few points; the full audit tests on real hardware.
            </p>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
