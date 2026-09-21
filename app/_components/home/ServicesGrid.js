"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { services } from "@/app/_lib/services-data";
import ServiceIcon, { accentVar } from "@/app/_components/ui/ServiceIcon";
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
  const ref = useRef(null);

  // The glow follows the cursor across the card. Written straight to a CSS
  // custom property rather than through React state, because this fires on
  // every mousemove and a re-render per pixel is not worth a nicer API.
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const accent = accentVar[service.accent] ?? accentVar.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        ref={ref}
        href={`/services/${service.slug}`}
        onMouseMove={onMove}
        className="panel panel-hover group relative block h-full overflow-hidden p-6"
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, ${accent} 16%, transparent), transparent 62%)`,
          }}
          aria-hidden
        />

        <div className="relative flex h-full flex-col">
          <span
            className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--color-border)] transition-colors duration-300"
            style={{ color: accent, background: `color-mix(in oklab, ${accent} 10%, transparent)` }}
          >
            <ServiceIcon name={service.icon} />
          </span>

          <h3 className="mt-5 text-xl">{service.title}</h3>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-[var(--color-muted)]">
            {service.short}
          </p>

          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            See what you get
            <ArrowUpRight className="h-4 w-4" />
          </span>

          <span className="mt-auto pt-4 text-xs uppercase tracking-[0.18em] text-[var(--color-dim)]">
            {service.timeline}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
