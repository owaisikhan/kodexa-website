"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { work } from "@/app/_lib/services-data";
import Section, { SectionHeader } from "@/app/_components/ui/Section";
import WorkMock from "@/app/_components/ui/WorkMock";

// Proof, shown rather than claimed. Each card draws its own interface mock, so
// there are no screenshots to go stale and nothing pretends to be a photo of
// something it is not.

export default function WorkShowcase() {
  return (
    <Section id="work" className="bg-[var(--color-bg-2)]">
      <div className="container-x">
        <SectionHeader
          kicker="Recent work"
          title="Built, shipped, in daily use"
          body="Real projects running real businesses. Not concepts."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {work.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="panel panel-hover group overflow-hidden"
            >
              <WorkMock shot={item.shot} mock={item.mock} title={item.title} />

              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
                  {item.kind}
                </p>
                <h3 className="mt-3 text-2xl">{item.title}</h3>
                <p className="mt-2.5 leading-relaxed text-[var(--color-muted)]">{item.body}</p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap mt-3 gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    Visit the live site
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}
