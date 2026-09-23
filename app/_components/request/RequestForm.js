"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  PartyPopper,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";

import { services } from "@/app/_lib/services-data";
import { submitRequest } from "@/app/_lib/actions";
import { needsSentence } from "@/app/_lib/finder-data";
import ServiceIcon, { accentVar, accentInk } from "@/app/_components/ui/ServiceIcon";
import Button from "@/app/_components/ui/Button";
import WhatsAppIcon from "@/app/_components/ui/WhatsAppIcon";

// Three steps, one question each.
//
// Every field is controlled and the answers live in one state object, not in
// the DOM. That is what lets a step animate out and back in without losing
// what was typed: the inputs are free to unmount, because the values never
// lived in them. The hidden inputs at the bottom are what the Server Action
// actually reads.

const STEPS = ["What do you need", "About the project", "How we reply"];

const EMPTY = { business: "", brief: "", name: "", contact: "" };

// A half-typed request survives closing the tab: saved on this device only,
// in this browser's storage, never sent anywhere until the visitor presses
// send. Old drafts expire so a stranger on a shared phone does not inherit
// one from weeks ago. Storage can be missing or blocked (private windows,
// strict settings), so every access is wrapped and the form works without it.
const DRAFT_KEY = "kodexa:request-draft";
const DRAFT_DAYS = 14;

function hasContent(values) {
  return Object.values(values).some((v) => v.trim());
}

function readDraft() {
  try {
    const d = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "null");
    if (!d?.savedAt || Date.now() - d.savedAt > DRAFT_DAYS * 86400000) {
      window.localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    const values = { ...EMPTY, ...d.values };
    return hasContent(values) ? { service: d.service || "", values } : null;
  } catch {
    return null;
  }
}

function writeDraft(service, values) {
  try {
    if (hasContent(values)) {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ service, values, savedAt: Date.now() }));
    } else {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  } catch {
    // Storage unavailable: the form still works, it just will not remember.
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

function safeSite(raw) {
  if (!raw || raw.length > 200) return "";
  try {
    const u = new URL(raw);
    return ["http:", "https:"].includes(u.protocol) && u.hostname.includes(".") ? u.toString() : "";
  } catch {
    return "";
  }
}

// The finder sends ticked extras as ?needs=a,b and the speed check sends
// ?site=; each becomes one line in the brief ("I also need: ...", "My site:
// ..."). A new line replaces an old one with the same start rather than
// stacking under it, because a restored draft often carries the last visit's.
const LINE_STARTS = ["I also need:", "My site:"];

function withNeeds(brief, sentence) {
  if (!sentence) return brief;
  const incoming = sentence.split("\n");
  const replaced = LINE_STARTS.filter((start) => incoming.some((l) => l.startsWith(start)));
  const kept = brief
    .split("\n")
    .filter((l) => !replaced.some((start) => l.startsWith(start)))
    .join("\n")
    .trimEnd();
  return kept ? `${kept}\n${sentence}` : sentence;
}

export default function RequestForm() {
  const params = useSearchParams();
  const preset = params.get("service");
  const presetValid = services.some((s) => s.slug === preset);

  const needsKey = params.get("needs") || "";
  // The speed check sends ?site=; only a plain http(s) address is accepted,
  // so a crafted link cannot drop arbitrary text into someone's form.
  const site = safeSite(params.get("site"));
  const sentence = [presetValid ? needsSentence(preset, needsKey.split(",")) : "", site ? `My site: ${site}` : ""]
    .filter(Boolean)
    .join("\n");

  // This component only renders in the browser (useSearchParams inside the
  // page's Suspense boundary), so reading storage while choosing the first
  // state is safe and avoids a flash of an empty form.
  const [draft] = useState(() => readDraft());
  const [restored, setRestored] = useState(Boolean(draft));
  const [service, setService] = useState(presetValid ? preset : draft?.service ?? "");
  const [step, setStep] = useState(presetValid || draft?.service ? 1 : 0);
  const [values, setValues] = useState(() => {
    const start = draft?.values ?? EMPTY;
    return { ...start, brief: withNeeds(start.brief, sentence) };
  });
  const [state, formAction, pending] = useActionState(submitRequest, null);

  useEffect(() => {
    if (!state?.ok) writeDraft(service, values);
  }, [service, values, state]);

  // Sent: the draft has done its job.
  useEffect(() => {
    if (state?.ok) clearDraft();
  }, [state]);

  function startFresh() {
    clearDraft();
    setRestored(false);
    setValues({ ...EMPTY, brief: sentence });
    if (!presetValid) {
      setService("");
      setStep(0);
    }
  }

  // Follow the URL when it changes under us.
  //
  // The initial useState above runs once. Arriving at /request?service=x from
  // somewhere else remounts the component and picks the right service up, but
  // a link clicked while already on /request only changes the query string:
  // same route, no remount, so the form quietly kept whatever was selected
  // before and disagreed with the address bar. The chat widget makes that easy
  // to hit, since its buttons are tappable from the request page itself.
  //
  // This is React's "adjust state when a prop changes" pattern: compare
  // against the last value during render and update immediately, rather than
  // in an effect that would render the wrong service first and correct it on
  // the next pass.
  const presetKey = `${preset}|${needsKey}|${site}`;
  const [lastPreset, setLastPreset] = useState(presetKey);
  if (presetKey !== lastPreset) {
    setLastPreset(presetKey);
    if (presetValid && preset !== service) {
      setService(preset);
      setStep(1);
    }
    if (sentence && withNeeds(values.brief, sentence) !== values.brief) {
      setValues((v) => ({ ...v, brief: withNeeds(v.brief, sentence) }));
    }
  }

  const chosen = useMemo(
    () => services.find((s) => s.slug === service) || null,
    [service]
  );

  useEffect(() => {
    if (state && state.ok === false) toast.error(state.message);
  }, [state]);

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function next() {
    if (step === 0 && !service) {
      toast.error("Pick a service to continue.");
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  if (state?.ok) return <Success state={state} />;

  return (
    <div className="mx-auto max-w-3xl">
      {restored ? (
        <div
          role="status"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border-2 border-[var(--color-ink)] bg-[var(--color-surface)] px-4 py-2"
        >
          <p className="text-sm">We kept what you typed last time. It is saved on this device only.</p>
          <button
            type="button"
            onClick={startFresh}
            className="tap gap-1.5 px-1 text-sm font-semibold underline decoration-2 underline-offset-4"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Start fresh
          </button>
        </div>
      ) : null}

      <Progress step={step} />

      <form
        action={formAction}
        // Only the last step sends. Anything that submits earlier (Enter in a
        // field on step two, say) moves on a step instead of sending a
        // request with no name and no contact.
        onSubmit={(e) => {
          if (step < STEPS.length - 1) {
            e.preventDefault();
            next();
          }
        }}
        // Enter in a one-line field means "next", as it does on the last
        // step. Browsers will not submit a form with no submit button on
        // screen, so without this Enter on step two did nothing at all.
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.tagName === "INPUT" && step < STEPS.length - 1) {
            e.preventDefault();
            next();
          }
        }}
        className="panel relative mt-8 p-6 md:p-10"
      >
        {/* Bots fill every field they can find. People never see this one. */}
        <div className="pointer-events-none absolute left-[-9999px] top-0" aria-hidden>
          <label>
            Company website
            <input name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <input type="hidden" name="service" value={service} />
        <input type="hidden" name="business" value={values.business} />
        <input type="hidden" name="brief" value={values.brief} />
        <input type="hidden" name="name" value={values.name} />
        <input type="hidden" name="contact" value={values.contact} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -26 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 ? <StepService service={service} onPick={setService} /> : null}
            {step === 1 ? <StepProject chosen={chosen} values={values} set={set} /> : null}
            {step === 2 ? <StepContact values={values} set={set} /> : null}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--color-border-soft)] pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex min-h-11 min-w-11 items-center gap-2 px-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)] disabled:opacity-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {/* Different keys, so React builds a new <button> for Send instead
              of turning Continue's into it mid-click. Reusing one element
              changed its type to "submit" while the browser was still
              handling the click, and pressing Continue on step two sent the
              form, with no name yet. */}
          {step < STEPS.length - 1 ? (
            <Button key="continue" type="button" onClick={next}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button key="send" type="submit" disabled={pending} variant="whatsapp">
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <WhatsAppIcon className="h-4.5 w-4.5" />
                  Send request
                </>
              )}
            </Button>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-dim)]">
        No obligation. We reply with a plan and a price before anything starts.
      </p>
    </div>
  );
}

function Progress({ step }) {
  return (
    <ol className="flex items-start gap-3">
      {STEPS.map((label, i) => (
        <li key={label} className="flex-1">
          <div className="h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
            <motion.div
              className="h-full rounded-full bg-[var(--color-primary)]"
              initial={false}
              animate={{ width: i <= step ? "100%" : "0%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <p
            className={`mt-2.5 text-xs transition-colors sm:text-sm ${
              i <= step ? "text-[var(--color-text)]" : "text-[var(--color-dim)]"
            }`}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">Step {i + 1}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}

function StepService({ service, onPick }) {
  return (
    <fieldset>
      <legend className="text-2xl md:text-3xl">What do you need?</legend>
      <p className="mt-3 text-[var(--color-muted)]">
        Pick the closest one. We will sort the details out together.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {services.map((s) => {
          const active = service === s.slug;
          const accent = accentVar[s.accent] ?? accentVar.primary;
          const ink = accentInk[s.accent] ?? accentInk.primary;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => onPick(s.slug)}
              aria-pressed={active}
              className={`flex items-start gap-3 rounded-[4px] border-2 p-4 text-left transition-all duration-200 ${
                active
                  ? "border-[var(--color-ink)] bg-[var(--color-primary)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-dim)] hover:bg-[var(--color-surface-2)]"
              }`}
            >
              <span
                className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[4px] border-2 border-[var(--color-ink)]"
                style={{ color: ink, background: accent }}
              >
                <ServiceIcon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-semibold">
                  {s.title}
                  {active ? <Check className="h-4 w-4 text-[var(--color-ink)]" /> : null}
                </span>
                <span className="mt-1 block text-sm leading-snug text-[var(--color-muted)]">
                  {s.short}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-[var(--color-muted)]">
        {label}
        {hint ? <span className="text-[var(--color-dim)]"> ({hint})</span> : null}
      </span>
      {children}
    </label>
  );
}

function StepProject({ chosen, values, set }) {
  return (
    <fieldset>
      <legend className="text-2xl md:text-3xl">Tell us about it</legend>
      <p className="mt-3 text-[var(--color-muted)]">
        A few lines is plenty.
        {chosen ? ` You picked ${chosen.title}.` : ""} What are you trying to fix?
      </p>

      <div className="mt-8 space-y-5">
        <Field label="Business name" hint="optional">
          <input
            className="field"
            value={values.business}
            onChange={(e) => set("business", e.target.value)}
            placeholder="e.g. Saam's Store"
            maxLength={120}
          />
        </Field>

        <Field label="What do you need?" hint="optional">
          <textarea
            rows={5}
            className="field resize-y"
            value={values.brief}
            onChange={(e) => set("brief", e.target.value)}
            maxLength={2000}
            placeholder="e.g. We take orders on WhatsApp and lose track of them. We want a proper online store with delivery."
          />
        </Field>
      </div>
    </fieldset>
  );
}

function StepContact({ values, set }) {
  return (
    <fieldset>
      <legend className="text-2xl md:text-3xl">How should we reply?</legend>
      <p className="mt-3 text-[var(--color-muted)]">
        We answer on WhatsApp, usually within a few hours.
      </p>

      <div className="mt-8 space-y-5">
        <Field label="Your name">
          <input
            className="field"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Hamid"
            maxLength={80}
            autoComplete="name"
          />
        </Field>

        <Field label="WhatsApp number or email">
          <input
            className="field"
            value={values.contact}
            onChange={(e) => set("contact", e.target.value)}
            placeholder="e.g. +92 300 1234567"
            maxLength={60}
            autoComplete="tel"
          />
        </Field>
      </div>
    </fieldset>
  );
}

function Success({ state }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="panel mx-auto max-w-2xl p-8 text-center md:p-12"
    >
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-success)]/12 text-[var(--color-success)]">
        <PartyPopper className="h-8 w-8" strokeWidth={1.6} />
      </span>

      {/* "Received" only when it was stored; otherwise WhatsApp is how it
          reaches us, so the heading says the job is not quite done. */}
      <h2 className="mt-7 text-3xl">{state.stored ? "Request received" : "Almost done"}</h2>
      <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-[var(--color-muted)]">
        {state.message}
      </p>

      {state.reference ? (
        <p className="mt-5 inline-block rounded-[4px] border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)]">
          Reference {state.reference}
        </p>
      ) : null}

      <div className="mt-9">
        <Button href={state.whatsappUrl} external variant="whatsapp" size="lg" className="w-full sm:w-auto">
          <WhatsAppIcon className="h-5 w-5" />
          Open WhatsApp with your details
        </Button>
      </div>

      <p className="mt-6 text-sm text-[var(--color-dim)]">
        Your message is already written. Just press send.
      </p>
    </motion.div>
  );
}
