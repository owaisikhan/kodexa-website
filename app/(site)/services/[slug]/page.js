import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock, Target, Users } from "lucide-react";

// Imported as `steps`: named `process` it would hide Node's process.env here.
import { getService, services, process as steps } from "@/app/_lib/services-data";
import { siteConfig } from "@/app/_lib/siteConfig";
import ServiceIcon, { accentVar, accentInk } from "@/app/_components/ui/ServiceIcon";
import Section, { SectionHeader } from "@/app/_components/ui/Section";
import Reveal from "@/app/_components/ui/Reveal";
import Button from "@/app/_components/ui/Button";
import Breadcrumbs from "@/app/_components/ui/Breadcrumbs";
import CtaBand from "@/app/_components/home/CtaBand";
import AskAboutService from "@/app/_components/chat/AskAboutService";
import { isChatConfigured } from "@/app/_lib/chatbot/config";
import { isSpeedConfigured } from "@/app/_lib/speed/psi";
import SpeedCheck from "@/app/_components/speed/SpeedCheck";

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
  const ink = accentInk[service.accent] ?? accentInk.primary;
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  // Previous and next wrap around, so every page has both and a visitor can
  // walk all nine without going back to a list.
  const at = services.findIndex((s) => s.slug === service.slug);
  const prev = services[(at - 1 + services.length) % services.length];
  const next = services[(at + 1) % services.length];

  return (
    <>
      <section className="relative overflow-hidden pt-[152px] pb-16 md:pb-24">
        <div className="absolute inset-0 grid-bg" aria-hidden />

        <div className="container-x relative">
          <Breadcrumbs
            base={siteConfig.url}
            items={[
              { href: "/", label: "Home" },
              { href: "/services", label: "Services" },
              { href: `/services/${service.slug}`, label: service.title },
            ]}
          />

          <Reveal delay={0.05}>
            <span
              className="mt-8 grid h-16 w-16 place-items-center rounded-[6px] border-2 border-[var(--color-ink)] shadow-[4px_4px_0_var(--color-ink)]"
              style={{ color: ink, background: accent }}
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
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={`/request?service=${service.slug}`} size="lg">
                Request this service
                <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              {isChatConfigured() ? <AskAboutService title={service.title} /> : null}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Only on the audit page, and only with a key: a check that cannot run
          is worse than no check. */}
      {service.slug === "website-audit" ? (
        isSpeedConfigured() ? (
          <SpeedCheck />
        ) : process.env.NODE_ENV === "development" ? (
          <SpeedCheckMissingKey />
        ) : null
      ) : null}

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
            {steps.map((step, i) => (
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
                  <span
                    className="grid h-9 w-9 place-items-center rounded-[4px] border-2 border-[var(--color-ink)]"
                    style={{
                      color: accentInk[o.accent] ?? accentInk.primary,
                      background: accentVar[o.accent] ?? accentVar.primary,
                    }}
                  >
                    <ServiceIcon name={o.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-base">{o.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--color-muted)]">{o.short}</p>
                </Link>
              </Reveal>
            ))}
          </div>

          <nav
            aria-label="More services"
            className="mt-10 grid gap-3 border-t border-[var(--color-border-soft)] pt-8 sm:grid-cols-2"
          >
            <Link
              href={`/services/${prev.slug}`}
              rel="prev"
              className="panel panel-hover group flex items-center gap-3 p-4"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" aria-hidden />
              <span className="min-w-0">
                <span className="kicker block">Previous</span>
                <span className="mt-1 block font-display font-bold">{prev.title}</span>
              </span>
            </Link>
            <Link
              href={`/services/${next.slug}`}
              rel="next"
              className="panel panel-hover group flex items-center justify-end gap-3 p-4 text-right"
            >
              <span className="min-w-0">
                <span className="kicker block">Next</span>
                <span className="mt-1 block font-display font-bold">{next.title}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </nav>
        </div>
      </Section>

      <CtaBand
        title={
          <>
            Ready for <KeepHyphens text={service.title.toLowerCase()} />?
          </>
        }
        body="Send the brief and we will come back with a plan and a fixed price."
        service={service.slug}
      />
    </>
  );
}

// "E-Commerce" at display size breaks after its hyphen, leaving "E-" alone at
// the end of a line. Hold each hyphenated word together; spaces still wrap.
function KeepHyphens({ text }) {
  return text.split(" ").map((word, i) => (
    <span key={i}>
      {i > 0 ? " " : null}
      {word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
    </span>
  ));
}

// Development only: says why the speed check is not showing, instead of an
// absence that looks like a bug. Never rendered in a production build.
function SpeedCheckMissingKey() {
  return (
    <div className="container-x py-8">
      <div className="rounded-[4px] border-2 border-dashed border-[var(--color-ink)] bg-[var(--color-surface)] p-5 text-sm">
        <p className="font-bold">Speed check hidden: PAGESPEED_API_KEY is not set.</p>
        <p className="mt-2 text-[var(--color-muted)]">
          Add <code className="font-mono">PAGESPEED_API_KEY=your-key</code> to .env.local (with an equals
          sign, no quotes, no spaces), then restart npm run dev. Only you see this notice; it is not
          part of the production build.
        </p>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 text-sm text-[var(--color-muted)]">
      <Icon className="h-4 w-4 text-[var(--color-dim)]" />
      {label}
    </span>
  );
}
