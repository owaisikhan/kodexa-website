"use client";

import Image from "next/image";
import { motion } from "motion/react";

// The plate at the top of a work feature.
//
// A real screenshot if there is one (`shot`), otherwise an interface drawn
// as line art (`mock`). The drawings exist because most of these systems sit
// behind a login: a client's private dashboard is not ours to publish, and a
// stock photo of a laptop says nothing.
//
// Drawn like a technical plate in a book: ink hairlines on paper, one element
// in red to show where the eye should go. No fills, no fake screenshots, no
// coloured window buttons.
//
// To swap a drawing for the real thing: drop the file in public/work/ and set
// `shot` on that project in services-data.js. Nothing here needs changing.

export default function WorkMock({ shot, mock = "store", title }) {
  if (shot) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-surface)]">
        <Image
          src={shot}
          alt={`${title} screenshot`}
          fill
          sizes="(min-width: 768px) 55vw, 100vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-surface)]">
      <div className="relative flex h-full items-center justify-center p-6 md:p-10">
        {mock === "phone" ? <PhoneMock /> : null}
        {mock === "dashboard" ? <DashboardMock /> : null}
        {mock === "store" ? <StoreMock /> : null}
      </div>
      <span className="sr-only">{title} interface illustration</span>
    </div>
  );
}

const rise = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const line = "bg-[var(--color-border-soft)]";

function Chrome({ children }) {
  return (
    <div className="w-full max-w-[540px] border border-[var(--color-ink)] bg-[var(--color-bg)]">
      <div className="flex items-center gap-1.5 border-b border-[var(--color-ink)] px-3 py-2">
        <span className="h-2 w-2 rounded-full border border-[var(--color-ink)]" />
        <span className="h-2 w-2 rounded-full border border-[var(--color-ink)]" />
        <span className="h-2 w-2 rounded-full border border-[var(--color-ink)]" />
        <span className={`ml-3 h-1.5 w-24 ${line}`} />
      </div>
      <div className="p-3 md:p-4">{children}</div>
    </div>
  );
}

function StoreMock() {
  return (
    <Chrome>
      <div className="mb-3 flex items-center justify-between">
        <span className="h-1.5 w-16 bg-[var(--color-ink)]" />
        <span className="border border-[var(--color-ink)] px-2 py-0.5 font-mono text-[8px] uppercase">Cart 2</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            {...rise}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="border border-[var(--color-ink)] p-1.5"
          >
            {/* A product plate is a box with a cross through it: the
                draughtsman's convention for "image goes here". */}
            <div className="relative mb-1.5 h-9 border border-[var(--color-border-soft)] md:h-11">
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
                <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--color-border-soft)" strokeWidth="1" />
                <line x1="100%" y1="0" x2="0" y2="100%" stroke="var(--color-border-soft)" strokeWidth="1" />
              </svg>
            </div>
            <div className={`h-1 w-10 ${line}`} />
            <div className={`mt-1 h-1 w-5 ${i === 1 ? "bg-[var(--color-primary)]" : "bg-[var(--color-ink)]"}`} />
          </motion.div>
        ))}
      </div>
    </Chrome>
  );
}

function DashboardMock() {
  const bars = [38, 62, 45, 78, 56, 90, 70];
  return (
    <Chrome>
      <div className="grid grid-cols-3 gap-2">
        {["Today", "Stock", "Credit"].map((label, i) => (
          <motion.div
            key={label}
            {...rise}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="border border-[var(--color-ink)] p-2"
          >
            <div className="font-mono text-[7px] uppercase tracking-wider text-[var(--color-muted)]">{label}</div>
            <div className="mt-1.5 h-2 w-12 bg-[var(--color-ink)]" />
          </motion.div>
        ))}
      </div>
      <div className="mt-2 flex h-20 items-end gap-1.5 border border-[var(--color-ink)] p-2 md:h-24">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 2 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className={`flex-1 ${i === 5 ? "bg-[var(--color-primary)]" : "border border-[var(--color-ink)] bg-transparent"}`}
          />
        ))}
      </div>
    </Chrome>
  );
}

function PhoneMock() {
  return (
    <div className="h-full w-[150px] border border-[var(--color-ink)] bg-[var(--color-bg)] p-2.5">
      <div className="mx-auto mb-2.5 h-1 w-8 bg-[var(--color-ink)]" />
      <div className="border border-[var(--color-ink)] p-2">
        <div className="font-mono text-[7px] uppercase tracking-wider text-[var(--color-muted)]">Balance</div>
        <div className="mt-1 h-2.5 w-16 bg-[var(--color-primary)]" />
      </div>
      <div className="mt-2 space-y-1.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            {...rise}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex items-center gap-1.5 border-b border-[var(--color-border-soft)] pb-1.5"
          >
            <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-[var(--color-ink)]" />
            <span className={`h-1 flex-1 ${line}`} />
            <span className="h-1 w-4 bg-[var(--color-ink)]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
