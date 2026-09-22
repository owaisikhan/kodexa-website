"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { services } from "@/app/_lib/services-data";
import ServiceIcon, { accentVar, accentInk } from "@/app/_components/ui/ServiceIcon";
import Section, { SectionHeader } from "@/app/_components/ui/Section";

// Nine cards is the whole offer on one screen. A visitor from Facebook should
// be able to point at the one they want without reading a paragraph.

export default function ServicesGrid() {
  return (
    <Section id="services">
      <div className="container-x">
        <SectionHeader
          kicker="What we build"
          title={
            <>
              Pick the one you need.
              <br />
              <span className="text-[var(--color-dim)]">We quote the rest.</span>
            </>
          }
          body="Nine things we actually ship. Every card opens the detail, and every detail page ends in one button."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Card key={s.slug} service={s} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function Card({ service, index }) {
  // The card used to track the cursor with a radial spotlight. That is the
  // same trick as the accent glow, so it went with it: the whole card now
  // presses into its shadow instead, which is one honest movement rather than
  // a light source that is not there.
  const accent = accentVar[service.accent] ?? accentVar.primary;
  const ink = accentInk[service.accent] ?? accentInk.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/services/${service.slug}`}
        className="panel panel-hover group relative block h-full p-6"
      >
        <div className="relative flex h-full flex-col">
          <span
            className="grid h-12 w-12 place-items-center rounded-[4px] border-2 border-[var(--color-ink)]"
            style={{ color: ink, background: accent }}
          >
            <ServiceIcon name={service.icon} />
          </span>

          <h3 className="mt-5 text-xl">{service.title}</h3>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-[var(--color-muted)]">
            {service.short}
          </p>

          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink)] underline decoration-2 underline-offset-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            See what you get
            <ArrowUpRight className="h-4 w-4" />
          </span>

          <span className="kicker mt-auto pt-4">{service.timeline}</span>
        </div>
      </Link>
    </motion.div>
  );
}
