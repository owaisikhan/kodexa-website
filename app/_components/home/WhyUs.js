import { Clock, Code2, Eye, Wallet } from "lucide-react";

import Section, { SectionHeader } from "@/app/_components/ui/Section";
import Reveal from "@/app/_components/ui/Reveal";
import { promises as points } from "@/app/_lib/company-data";

// Four objections, answered before they are raised. Deliberately the only
// text-heavy block on the page, and still only a sentence each. The words live
// in company-data.js, because the About page makes the same four promises.

export const promiseIcons = { clock: Clock, wallet: Wallet, code: Code2, eye: Eye };

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
            {points.map((p, i) => {
              const Icon = promiseIcons[p.icon];
              return (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="panel panel-hover h-full p-6">
                  <Icon
                    className="h-6 w-6 text-[var(--color-ink)]"
                    strokeWidth={1.6}
                  />
                  <h3 className="mt-4 text-lg">{p.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-muted)]">
                    {p.body}
                  </p>
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
