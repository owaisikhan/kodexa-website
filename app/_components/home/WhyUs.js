import { Clock, Code2, Eye, Wallet } from "lucide-react";

import Section, { SectionHeader } from "@/app/_components/ui/Section";
import Reveal from "@/app/_components/ui/Reveal";

// Four objections, answered before they are raised. Deliberately the only
// text-heavy block on the page, and still only a sentence each.

const points = [
  {
    icon: Clock,
    title: "You see it early",
    body: "A working link in the first week, not a reveal at the end you cannot change.",
  },
  {
    icon: Wallet,
    title: "A fixed price, first",
    body: "You approve the number before anything is built. No hourly surprises.",
  },
  {
    icon: Code2,
    title: "You own everything",
    body: "The code, the domain, the database, the accounts. Nothing is rented from us.",
  },
  {
    icon: Eye,
    title: "Built to be handed over",
    body: "Documented and deployed properly, so another developer could pick it up.",
  },
];

export default function WhyUs() {
  return (
    <Section>
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeader
            kicker="Why us"
            title="The boring promises that actually matter"
            body="Most of what goes wrong on a software project is not technical. These four are how we stop it."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="panel panel-hover h-full p-6">
                  <p.icon
                    className="h-6 w-6 text-[var(--color-primary)]"
                    strokeWidth={1.6}
                  />
                  <h3 className="mt-4 text-lg">{p.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-muted)]">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
