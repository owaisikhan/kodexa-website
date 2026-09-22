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
  "AI agents",
  "pgvector",
];

// What we build with, as a slow line of italic serif between two rules. Set
// like a ticker on a masthead rather than a strip of logos, because a logo
// wall is what every agency site uses to borrow credibility, and these are
// tools, not clients.
//
// Duplicated once so the loop has something to scroll into; aria-hidden on
// the copy so a screen reader hears the list once.
export default function Marquee() {
  return (
    <div className="container-x">
      <div className="relative flex overflow-hidden border-y border-[var(--color-ink)] py-4">
        <div className="marquee-track flex shrink-0 items-center">
          {items.map((t) => (
            <Item key={t} label={t} />
          ))}
        </div>
        <div className="marquee-track flex shrink-0 items-center" aria-hidden>
          {items.map((t) => (
            <Item key={t} label={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Item({ label }) {
  return (
    <span className="flex items-center whitespace-nowrap font-display text-2xl italic text-[var(--color-text)] md:text-3xl">
      {label}
      <span className="mx-7 font-mono text-sm not-italic text-[var(--color-red)] md:mx-10" aria-hidden>
        /
      </span>
    </span>
  );
}
