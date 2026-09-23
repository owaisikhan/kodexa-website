"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, ShoppingCart } from "lucide-react";

// The picture at the top of a work card.
//
// A real screenshot if there is one (`shot`), otherwise an interface drawn in
// the browser (`mock`). The drawings exist because most of these systems sit
// behind a login: a client's private dashboard is not ours to publish, and a
// stock photo of a laptop says nothing.
//
// To swap a drawing for the real thing: drop the file in public/work/ and set
// `shot` on that project in services-data.js. Nothing here needs changing.

export default function WorkMock({ shot, mock = "store", title }) {
  if (shot) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-[var(--color-ink)] bg-[var(--color-bg-2)]">
        <Image
          src={shot}
          alt={`${title} screenshot`}
          fill
          sizes="(min-width: 768px) 46vw, 100vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {/* The card's own text sits below, so the fade is only to stop a bright
            screenshot fighting the dark panel edge. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--color-surface)] to-transparent"
          aria-hidden
        />
      </div>
    );
  }

  const kind = mock;

  return (
    // Taller on phones: the drawings carry real controls now, and at 16:10 a
    // phone-width card leaves no room for a 44px button beside the chart.
    <div
      role="group"
      aria-label={`${title}: a drawing of the interface you can try`}
      // The phone drawing stands upright with three 44px rows, so it needs a
      // square frame on a phone; everything else fits at 4:3.
      className={`relative overflow-hidden border-b-2 border-[var(--color-ink)] bg-[var(--color-bg-2)] sm:aspect-[16/10] ${
        kind === "phone" ? "aspect-square" : "aspect-[4/3]"
      }`}
    >
      <div className="absolute inset-0 dot-bg opacity-70" aria-hidden />

      <span className="absolute left-3 top-3 z-10 rounded-[3px] border-2 border-[var(--color-ink)] bg-[var(--color-surface)] px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--color-ink)]">
        Try it
      </span>

      <div className="relative flex h-full items-center justify-center p-4 pt-9 sm:p-6">
        {kind === "phone" ? <PhoneMock /> : null}
        {kind === "dashboard" ? <DashboardMock /> : null}
        {kind === "store" ? <StoreMock /> : null}
      </div>
    </div>
  );
}

const rise = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

// Controls inside the drawings follow the site's own rules: real buttons,
// labelled for screen readers, and at least 44px tall so a thumb can hit them.
const control =
  "min-h-11 rounded-[3px] border-2 border-[var(--color-ink)] font-mono text-[0.7rem] font-bold uppercase tracking-[0.08em] transition-colors";

function Chrome({ children, className = "" }) {
  return (
    <div className={`w-full max-w-[420px] overflow-hidden rounded-[4px] border-2 border-[var(--color-ink)] bg-[var(--color-surface)] shadow-[5px_5px_0_var(--color-ink)] ${className}`}>
      <div className="flex items-center gap-1.5 border-b-2 border-[var(--color-ink)] bg-[var(--color-surface-2)] px-3 py-1.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
      </div>
      <div className="p-2.5 sm:p-3">{children}</div>
    </div>
  );
}

const PRODUCTS = [
  { swatch: "var(--color-primary)" },
  { swatch: "var(--color-secondary)" },
  { swatch: "var(--color-accent)" },
];

function StoreMock() {
  const [cart, setCart] = useState([0, 0, 0]);
  const [last, setLast] = useState(null);
  const count = cart.reduce((a, b) => a + b, 0);

  const add = (i) => {
    setCart((c) => c.map((n, j) => (j === i ? Math.min(n + 1, 9) : n)));
    setLast(i);
  };

  return (
    <Chrome>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="h-2 w-16 rounded-full bg-[var(--color-border-soft)]" aria-hidden />
        <span className="relative inline-flex h-8 items-center gap-1.5 rounded-[3px] border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-2 font-mono text-[0.7rem] font-bold">
          <ShoppingCart className="h-3.5 w-3.5" aria-hidden />
          <motion.span key={count} initial={{ scale: 1.6 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>
            {count}
          </motion.span>
          <span className="sr-only">items in the cart</span>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={i}
            {...rise}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="relative rounded-[3px] border border-[var(--color-ink)] bg-[var(--color-surface-2)] p-1.5"
          >
            <div className="mb-1.5 h-8 rounded sm:h-10" style={{ background: p.swatch }} aria-hidden />
            <div className="h-1.5 w-10 rounded-full bg-[var(--color-border-soft)]" aria-hidden />
            <div className="mt-1 mb-1.5 h-1.5 w-6 rounded-full bg-[var(--color-primary)]" aria-hidden />
            {cart[i] > 0 ? (
              <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-surface)] px-1 font-mono text-[0.6rem] font-bold" aria-hidden>
                {cart[i]}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => add(i)}
              aria-label={`Add product ${i + 1} to the cart`}
              className={`${control} w-full bg-[var(--color-surface)] hover:bg-[var(--color-primary)]`}
            >
              Add
            </button>
          </motion.div>
        ))}
      </div>

      {/* Said once per add, so a screen reader hears what the badge shows. */}
      <p aria-live="polite" className="sr-only">
        {last === null ? "" : `Product ${last + 1} added. ${count} in the cart.`}
      </p>
    </Chrome>
  );
}

// Made-up figures for a drawing, shaped like a real week: busier towards the
// weekend, a month that is roughly four weeks.
const PERIODS = {
  Today: { bars: [22, 35, 48, 62, 90, 74, 40], figures: ["48", "12", "7"] },
  Week: { bars: [55, 48, 60, 52, 70, 95, 80], figures: ["312", "64", "41"] },
  Month: { bars: [62, 70, 58, 76, 84, 72, 90], figures: ["1,284", "270", "166"] },
};

function DashboardMock() {
  const [period, setPeriod] = useState("Today");
  const reduce = useReducedMotion();
  const { bars, figures } = PERIODS[period];

  return (
    <Chrome>
      <div className="mb-2 grid grid-cols-3 gap-1.5" role="group" aria-label="Period">
        {Object.keys(PERIODS).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            aria-pressed={period === p}
            className={`${control} ${period === p ? "bg-[var(--color-ink)] text-[var(--color-on-dark)]" : "bg-[var(--color-surface)] hover:bg-[var(--color-primary)]"}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {figures.map((f, i) => (
          <div key={i} className="rounded-[3px] border border-[var(--color-ink)] bg-[var(--color-surface-2)] px-2 py-1">
            <div className="h-1.5 w-8 rounded-full bg-[var(--color-border-soft)]" aria-hidden />
            <motion.div
              key={period + f}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-0.5 font-mono text-sm font-bold tabular-nums"
            >
              {f}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="mt-1.5 flex h-14 items-end gap-1.5 rounded-[3px] border border-[var(--color-ink)] bg-[var(--color-surface-2)] p-1.5 sm:h-20" aria-hidden>
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 4 }}
            animate={{ height: `${h}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-primary)]"
          />
        ))}
      </div>
    </Chrome>
  );
}

const MEMBERS = 3;

function PhoneMock() {
  const [paid, setPaid] = useState([true, false, false]);
  const done = paid.filter(Boolean).length;

  return (
    <div className="flex h-full w-[168px] flex-col overflow-hidden rounded-[18px] border-[6px] border-[var(--color-ink)] bg-[var(--color-surface)] shadow-[5px_5px_0_var(--color-ink)]">
      <div className="mx-auto mt-1.5 h-1 w-10 shrink-0 rounded-full bg-[var(--color-border-soft)]" aria-hidden />
      <div className="flex flex-1 flex-col justify-center gap-1.5 p-2">
        <div className="rounded-[3px] border border-[var(--color-ink)] bg-[var(--color-surface-2)] px-2 py-1.5">
          <div className="font-mono text-[0.65rem] font-bold">
            {done} of {MEMBERS} paid
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full border border-[var(--color-ink)] bg-[var(--color-surface)]" aria-hidden>
            <motion.div
              className="h-full bg-[var(--color-success)]"
              animate={{ width: `${(done / MEMBERS) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        {paid.map((isPaid, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={isPaid}
            aria-label={`Member ${i + 1}, ${isPaid ? "paid" : "not paid yet"}`}
            onClick={() => setPaid((p) => p.map((v, j) => (j === i ? !v : v)))}
            className="flex min-h-11 items-center gap-1.5 rounded-[3px] border border-[var(--color-ink)] bg-[var(--color-surface-2)] px-2 text-left transition-colors hover:bg-[var(--color-primary)]"
          >
            <span className="h-4 w-4 shrink-0 rounded-full bg-[var(--color-secondary)]" aria-hidden />
            <span className="h-1.5 flex-1 rounded-full bg-[var(--color-border-soft)]" aria-hidden />
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-[3px] border-2 border-[var(--color-ink)] ${isPaid ? "bg-[var(--color-success)] text-[var(--color-on-dark)]" : "bg-[var(--color-surface)]"}`}
              aria-hidden
            >
              {isPaid ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
