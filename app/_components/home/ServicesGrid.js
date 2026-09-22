"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { services } from "@/app/_lib/services-data";
import ServiceIcon from "@/app/_components/ui/ServiceIcon";
import Section, { SectionHeader } from "@/app/_components/ui/Section";

// The whole offer as an index, not a wall of cards. Nine rows, each one a
// number, a name, one line, a timeline and a link. A visitor from an ad can
// run their eye down one column and stop at the thing they came for, which a
// three-by-three grid of identical boxes makes harder, not easier.

export default function ServicesGrid() {
  return (
    <Section id="services">
      <div className="container-x">
        <SectionHeader
          index="01"
          kicker="Services"
          note={`${services.length} things we ship`}
          title={
            <>
              Pick the one you need. <span className="em">We quote the rest.</span>
            </>
          }
          body="Every row opens the detail, and every detail page ends in one button."
        />

        <ol className="mt-12 border-t border-[var(--color-ink)] md:mt-16">
          {services.map((s, i) => (
            <Row key={s.slug} service={s} index={i} />
          ))}
        </ol>
      </div>
    </Section>
  );
}

function Row({ service, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-[var(--color-ink)]"
    >
      <Link
        href={`/services/${service.slug}`}
        className="group relative grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4 gap-y-2 overflow-hidden px-3 py-6 md:grid-cols-[3rem_2rem_minmax(0,1.1fr)_minmax(0,1fr)_8rem_1.5rem] md:items-center md:gap-x-6 md:px-5 md:py-7"
      >
        {/* The hover is a fill that wipes in from the left, turning the row
            to ink. It is the one strong movement in the list, so it lands. */}
        <span
          className="absolute inset-0 origin-left scale-x-0 bg-[var(--color-ink)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
          aria-hidden
        />

        <span className="relative font-mono text-sm text-[var(--color-red)] transition-colors group-hover:text-[var(--color-primary)]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="relative hidden text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-on-dark)] md:block">
          <ServiceIcon name={service.icon} className="h-5 w-5" />
        </span>

        <h3 className="relative text-[1.85rem] leading-[1.05] transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-on-dark)] md:text-[2.4rem]">
          {service.title}
        </h3>

        <ArrowUpRight className="relative h-5 w-5 self-center text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-primary)] md:hidden" />

        <p className="relative col-start-2 col-end-4 text-[0.98rem] leading-relaxed text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-on-dark-muted)] md:col-auto">
          {service.short}
        </p>

        <span className="relative col-start-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-on-dark-muted)] md:col-auto md:text-right">
          {service.timeline}
        </span>

        <ArrowUpRight className="relative hidden h-5 w-5 justify-self-end text-[var(--color-ink)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)] md:block" />
      </Link>
    </motion.li>
  );
}
