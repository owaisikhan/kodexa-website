import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Clock, Target, Users } from "lucide-react";

import { getService, services, process } from "@/app/_lib/services-data";
import ServiceIcon, { accentVar } from "@/app/_components/ui/ServiceIcon";
import Section, { SectionHeader } from "@/app/_components/ui/Section";
import Reveal from "@/app/_components/ui/Reveal";
import Button from "@/app/_components/ui/Button";
import CtaBand from "@/app/_components/home/CtaBand";

// Nine static pages, generated at build time. No database, no request-time work.
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.short,
    openGraph: { title: service.title, description: service.short },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const accent = accentVar[service.accent] ?? accentVar.primary;
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden pt-[152px] pb-16 md:pb-24">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div
          className="glow left-[10%] top-0 h-[360px] w-[420px] opacity-25"
          style={{ background: accent }}
          aria-hidden
        />

        <div className="container-x relative">
          <Reveal direction="none">
            <Link
              href="/#services"
              className="tap text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
            >
              &larr; All services
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <span
              className="mt-8 grid h-16 w-16 place-items-center rounded-2xl border border-[var(--color-border)]"
              style={{ color: accent, background: `color-mix(in oklab, ${accent} 12%, transparent)` }}
            >
              <ServiceIcon name={service.icon} className="h-8 w-8" />
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-7 max-w-3xl text-[clamp(2.4rem,6.5vw,4.4rem)]">
              {service.title}
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[var(--color-muted)]">
              {service.short}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Badge icon={Clock} label={service.timeline} />
              <Badge icon={Users} label={service.for} />
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-10">
              <Button href={`/request?service=${service.slug}`} size="lg">
                Request this service
                <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Section tight className="border-y border-[var(--color-border-soft)] bg-[var(--color-bg-2)]">
        <div className="container-x grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="flex items-center gap-2.5 text-2xl">
              <Target className="h-5 w-5" style={{ color: accent }} />
              What it does for you
            </h2>
            <ul className="mt-7 space-y-4">
              {service.outcomes.map((o, i) => (
                <Reveal key={o} delay={i * 0.06} as="li" className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0" style={{ color: accent }} />
                  <span className="text-lg text-[var(--color-text)]">{o}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl">What you get</h2>
            <ul className="mt-7 space-y-3">
              {service.includes.map((inc, i) => (
                <Reveal key={inc} delay={i * 0.06} as="li">
                  <div className="panel px-5 py-4 text-[var(--color-muted)]">{inc}</div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-x">
          <SectionHeader kicker="How it works" title="From your message to live" />

          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {process.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08} as="li">
                <div className="panel h-full p-6">
                  <span className="font-display text-sm font-bold" style={{ color: accent }}>
                    {step.n}
                  </span>
                  <h3 className="mt-3 text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Section tight className="border-t border-[var(--color-border-soft)]">
        <div className="container-x">
          <h2 className="text-2xl">You might also need</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {others.map((o, i) => (
              <Reveal key={o.slug} delay={i * 0.08}>
                <Link href={`/services/${o.slug}`} className="panel panel-hover block h-full p-5">
                  <ServiceIcon
                    name={o.icon}
                    className="h-5 w-5"
                    style={{ color: accentVar[o.accent] }}
                  />
                  <h3 className="mt-3 text-base">{o.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--color-muted)]">{o.short}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand
        title={`Ready for ${service.title.toLowerCase()}?`}
        body="Send the brief and we will come back with a plan and a fixed price."
        service={service.slug}
      />
    </>
  );
}

function Badge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/[0.02] px-4 py-2 text-sm text-[var(--color-muted)]">
      <Icon className="h-4 w-4 text-[var(--color-dim)]" />
      {label}
    </span>
  );
}
