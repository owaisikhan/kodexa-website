"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import WorkMock from "@/app/_components/ui/WorkMock";

// One project, set as a magazine feature: a plate on one side, the caption
// on the other, a figure number under the plate. Alternating sides down the
// page so four projects read as a sequence of spreads rather than a grid of
// four identical tiles. Shared by the home page and /work so the two can
// never drift apart.

export default function WorkFeature({ item, index, headingLevel = "h3" }) {
  const Heading = headingLevel;
  const flip = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-8 border-t border-[var(--color-ink)] pt-8 md:grid-cols-12 md:gap-10 md:pt-10"
    >
      <figure className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
        <div className="group overflow-hidden border border-[var(--color-ink)]">
          <WorkMock shot={item.shot} mock={item.mock} title={item.title} />
        </div>
        <figcaption className="mt-3 flex justify-between gap-4 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-muted)]">
          <span>
            <span className="text-[var(--color-red)]">Fig. {index + 1}</span> · {item.shot ? "Screenshot" : "Drawn from the build"}
          </span>
          <span className="hidden sm:inline">{item.tags.join(" · ")}</span>
        </figcaption>
      </figure>

      <div className={`flex flex-col md:col-span-5 ${flip ? "md:order-1" : ""}`}>
        <p className="kicker">{item.kind}</p>
        <Heading className="mt-4 text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1]">{item.title}</Heading>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--color-muted)]">{item.body}</p>

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1 sm:hidden">
          {item.tags.map((t) => (
            <li key={t} className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-muted)]">
              {t}
            </li>
          ))}
        </ul>

        {item.href ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="tap group mt-6 inline-flex w-fit items-center gap-2 text-[var(--color-ink)]"
          >
            <span className="link-draw font-medium">Visit the live site</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ) : (
          <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-muted)]">
            Private system, behind a login
          </p>
        )}
      </div>
    </motion.article>
  );
}
