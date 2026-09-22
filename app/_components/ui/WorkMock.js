"use client";

import Image from "next/image";
import { motion } from "motion/react";

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
    <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-[var(--color-ink)] bg-[var(--color-bg-2)]">
      <div className="absolute inset-0 dot-bg opacity-70" aria-hidden />


      <div className="relative flex h-full items-center justify-center p-6">
        {kind === "phone" ? <PhoneMock /> : null}
        {kind === "dashboard" ? <DashboardMock /> : null}
        {kind === "store" ? <StoreMock /> : null}
      </div>

      <span className="sr-only">{title} interface illustration</span>
    </div>
  );
}

const rise = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function Chrome({ children, className = "" }) {
  return (
    <div className={`w-full max-w-[420px] overflow-hidden rounded-[4px] border-2 border-[var(--color-ink)] bg-[var(--color-surface)] shadow-[5px_5px_0_var(--color-ink)] ${className}`}>
      <div className="flex items-center gap-1.5 border-b-2 border-[var(--color-ink)] bg-[var(--color-surface-2)] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function StoreMock() {
  return (
    <Chrome>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="h-2 w-16 rounded-full bg-[var(--color-border-soft)]" />
        <span className="h-4 w-10 rounded-md bg-[var(--color-primary)]" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            {...rise}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="rounded-[3px] border border-[var(--color-ink)] bg-[var(--color-surface-2)] p-2"
          >
            <div className="mb-1.5 h-8 rounded bg-[var(--color-primary)]" />
            <div className="h-1.5 w-10 rounded-full bg-[var(--color-border-soft)]" />
            <div className="mt-1 h-1.5 w-6 rounded-full bg-[var(--color-primary)]" />
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
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            {...rise}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="rounded-[3px] border border-[var(--color-ink)] bg-[var(--color-surface-2)] p-2"
          >
            <div className="h-1.5 w-8 rounded-full bg-[var(--color-border-soft)]" />
            <div className="mt-2 h-2.5 w-12 rounded-full bg-[var(--color-text)]" />
          </motion.div>
        ))}
      </div>
      <div className="mt-2 flex h-20 items-end gap-1.5 rounded-[3px] border border-[var(--color-ink)] bg-[var(--color-surface-2)] p-2">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 4 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 rounded-sm bg-[var(--color-primary)] border-2 border-[var(--color-ink)]"
          />
        ))}
      </div>
    </Chrome>
  );
}

function PhoneMock() {
  return (
    <div className="h-full w-[148px] overflow-hidden rounded-[18px] border-[6px] border-[var(--color-ink)] bg-[var(--color-surface)] shadow-[5px_5px_0_var(--color-ink)]">
      <div className="mx-auto mt-1.5 h-1 w-10 rounded-full bg-[var(--color-border-soft)]" />
      <div className="space-y-2 p-2.5">
        <div className="rounded-[3px] border border-[var(--color-ink)] bg-[var(--color-surface-2)] p-2">
          <div className="h-1.5 w-10 rounded-full bg-[var(--color-border-soft)]" />
          <div className="mt-1.5 h-3 w-16 rounded-full bg-[var(--color-success)]" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            {...rise}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex items-center gap-1.5 rounded-[3px] border border-[var(--color-ink)] bg-[var(--color-surface-2)] px-2 py-1.5"
          >
            <span className="h-4 w-4 shrink-0 rounded-full bg-[var(--color-secondary)]" />
            <span className="h-1.5 flex-1 rounded-full bg-[var(--color-border-soft)]" />
            <span className="h-1.5 w-4 rounded-full bg-[var(--color-primary)]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
