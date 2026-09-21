"use client";

import { motion } from "motion/react";

// Interface mocks drawn in the browser. A screenshot of a client's private
// dashboard is not ours to publish, and a stock photo of a laptop says nothing,
// so each project gets a small honest drawing of the kind of screen it is.
//
// `variant` is the image path in services-data.js, kept as a path so swapping
// in real screenshots later is a one-line change per project.

export default function WorkMock({ variant, title }) {
  const kind = String(variant || "").includes("ledger")
    ? "phone"
    : String(variant || "").includes("pump") || String(variant || "").includes("hospital")
      ? "dashboard"
      : "store";

  return (
    <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />
      <div
        className="glow -left-10 -top-10 h-56 w-56 opacity-30"
        style={{ background: "var(--color-primary)" }}
        aria-hidden
      />
      <div
        className="glow -bottom-16 -right-8 h-56 w-56 opacity-25"
        style={{ background: "var(--color-secondary)" }}
        aria-hidden
      />

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
    <div className={`w-full max-w-[420px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#070b14] shadow-2xl ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] px-3 py-2">
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
        <span className="h-2 w-16 rounded-full bg-[var(--color-border)]" />
        <span className="h-4 w-10 rounded-md bg-[var(--color-primary)]/70" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            {...rise}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2"
          >
            <div className="mb-1.5 h-8 rounded bg-gradient-to-br from-[var(--color-primary)]/25 to-[var(--color-secondary)]/15" />
            <div className="h-1.5 w-10 rounded-full bg-[var(--color-border)]" />
            <div className="mt-1 h-1.5 w-6 rounded-full bg-[var(--color-primary)]/60" />
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
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2"
          >
            <div className="h-1.5 w-8 rounded-full bg-[var(--color-border)]" />
            <div className="mt-2 h-2.5 w-12 rounded-full bg-[var(--color-text)]/70" />
          </motion.div>
        ))}
      </div>
      <div className="mt-2 flex h-20 items-end gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 4 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 rounded-sm bg-gradient-to-t from-[var(--color-primary)]/40 to-[var(--color-primary)]"
          />
        ))}
      </div>
    </Chrome>
  );
}

function PhoneMock() {
  return (
    <div className="h-full w-[148px] overflow-hidden rounded-[22px] border-[6px] border-[#0f1726] bg-[#070b14] shadow-2xl">
      <div className="mx-auto mt-1.5 h-1 w-10 rounded-full bg-[var(--color-border)]" />
      <div className="space-y-2 p-2.5">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2">
          <div className="h-1.5 w-10 rounded-full bg-[var(--color-border)]" />
          <div className="mt-1.5 h-3 w-16 rounded-full bg-[var(--color-success)]/80" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            {...rise}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1.5"
          >
            <span className="h-4 w-4 shrink-0 rounded-full bg-[var(--color-secondary)]/50" />
            <span className="h-1.5 flex-1 rounded-full bg-[var(--color-border)]" />
            <span className="h-1.5 w-4 rounded-full bg-[var(--color-primary)]/70" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
