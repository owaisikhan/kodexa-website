import Section, { SectionHeader } from "@/app/_components/ui/Section";
import Reveal from "@/app/_components/ui/Reveal";

// Four objections, answered before they are raised. Set as a ruled table of
// numbered clauses rather than four icon cards, because these are promises
// and a promise reads better as a clause than as a feature tile.

const points = [
  {
    title: "You see it early",
    body: "A working link in the first week, not a reveal at the end you cannot change.",
  },
  {
    title: "A fixed price, first",
    body: "You approve the number before anything is built. No hourly surprises.",
  },
  {
    title: "You own everything",
    body: "The code, the domain, the database, the accounts. Nothing is rented from us.",
  },
  {
    title: "Built to be handed over",
    body: "Documented and deployed properly, so another developer could pick it up.",
  },
];

export default function WhyUs() {
  return (
    <Section>
      <div className="container-x">
        <SectionHeader
          index="04"
          kicker="Terms"
          note="The boring part"
          title={
            <>
              The promises that <span className="em">actually</span> matter.
            </>
          }
          body="Most of what goes wrong on a software project is not technical. These four are how we stop it."
        />

        <ol className="mt-12 grid border-t border-[var(--color-ink)] md:mt-16 md:grid-cols-2">
          {points.map((p, i) => (
            <Reveal
              key={p.title}
              as="li"
              delay={(i % 2) * 0.08}
              className={`grid grid-cols-[3rem_1fr] gap-x-4 border-b border-[var(--color-ink)] py-8 md:py-10 ${
                i % 2 === 1 ? "md:border-l md:pl-10" : "md:pr-10"
              }`}
            >
              <span className="font-mono text-sm text-[var(--color-red)]">
                {["i", "ii", "iii", "iv"][i]}.
              </span>
              <div>
                <h3 className="text-[2rem] leading-[1.05] md:text-[2.4rem]">{p.title}</h3>
                <p className="mt-3 max-w-sm text-lg leading-relaxed text-[var(--color-muted)]">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
