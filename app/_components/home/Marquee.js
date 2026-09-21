const items = [
  "Next.js",
  "React",
  "Supabase",
  "Postgres",
  "Stripe",
  "React Native",
  "Electron",
  "Tailwind",
  "GSAP",
  "Vercel",
  "AI Agents",
  "pgvector",
];

// A single strip of what we build with. Duplicated once so the loop has
// something to scroll into; aria-hidden on the copy so it is not read twice.
export default function Marquee() {
  return (
    <div className="relative flex overflow-hidden border-y border-[var(--color-border-soft)] bg-[var(--color-bg-2)] py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--color-bg-2)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--color-bg-2)] to-transparent" />

      <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
        {items.map((t) => (
          <Item key={t} label={t} />
        ))}
      </div>
      <div className="marquee-track flex shrink-0 items-center gap-10 pr-10" aria-hidden>
        {items.map((t) => (
          <Item key={t} label={t} />
        ))}
      </div>
    </div>
  );
}

function Item({ label }) {
  return (
    <span className="flex items-center gap-10 whitespace-nowrap font-display text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-dim)]">
      {label}
      <span className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
    </span>
  );
}
