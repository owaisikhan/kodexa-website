import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { getService, services, process } from "@/app/_lib/services-data";
import ServiceIcon from "@/app/_components/ui/ServiceIcon";
import Section, { RunningHead } from "@/app/_components/ui/Section";
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

// A service page is set as an article: headline, standfirst, a facts box, then
// two numbered lists. The facts box is the part a skimming visitor reads, so
// it sits beside the headline rather than below the fold.
export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const number = String(services.findIndex((s) => s.slug === service.slug) + 1).padStart(2, "0");
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="pt-[104px] pb-14 md:pt-[120px] md:pb-20">
        <div className="container-x">
          <Reveal direction="none">
            <RunningHead
              index={number}
              label={
                <Link href="/#services" className="tap link-draw hover:text-[var(--color-ink)]">
                  Services
                </Link>
              }
              note={`${number} of ${String(services.length).padStart(2, "0")}`}
            />
          </Reveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <Reveal delay={0.05}>
                <h1 className="text-[clamp(3rem,8vw,7rem)] leading-[0.92]">{service.title}</h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-7 max-w-2xl text-xl leading-relaxed text-[var(--color-muted)] md:text-2xl">
                  {service.short}
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Button href={`/request?service=${service.slug}`} size="lg">
                    Request this service
                    <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="lg:col-span-4">
              <dl className="border-t border-[var(--color-ink)]">
                <Fact label="Service">
                  <span className="inline-flex items-center gap-2.5">
                    <ServiceIcon name={service.icon} className="h-5 w-5" />
                    {service.title}
                  </span>
                </Fact>
                <Fact label="Typical timeline">{service.timeline}</Fact>
                <Fact label="Right for">{service.for}</Fact>
                <Fact label="Price">Fixed, quoted before we start</Fact>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <Section tight className="bg-[var(--color-bg-2)]">
        <div className="container-x grid gap-14 md:grid-cols-2 md:gap-10">
          <NumberedList heading="What it does for you" items={service.outcomes} />
          <NumberedList heading="What you get" items={service.includes} />
        </div>
      </Section>

      <Section tight>
        <div className="container-x">
          <RunningHead label="How it works" note="Same four steps for every project" />
          <ol className="mt-2 grid md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <Reveal
                key={step.n}
                delay={i * 0.06}
                as="li"
                className={`border-b border-[var(--color-border-soft)] py-8 md:pr-8 lg:border-b-0 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 === 1 ? "md:border-l md:pl-8" : ""}`}
              >
                <span className="font-display text-6xl leading-none text-[var(--color-red)]">{step.n}</span>
                <h3 className="mt-4 text-2xl leading-[1.1]">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-muted)]">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Section tight className="pt-0 md:pt-0">
        <div className="container-x">
          <RunningHead label="You might also need" />
          <ul className="mt-2">
            {others.map((o) => {
              const n = String(services.findIndex((s) => s.slug === o.slug) + 1).padStart(2, "0");
              return (
                <li key={o.slug} className="border-b border-[var(--color-ink)]">
                  <Link
                    href={`/services/${o.slug}`}
                    className="group grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-4 py-5 md:grid-cols-[3rem_1fr_1fr_auto] md:gap-6"
                  >
                    <span className="font-mono text-sm text-[var(--color-red)]">{n}</span>
                    <span className="font-display text-3xl leading-tight transition-transform duration-300 group-hover:translate-x-1">
                      {o.title}
                    </span>
                    <span className="hidden text-[var(--color-muted)] md:block">{o.short}</span>
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <CtaBand
        title={
          <>
            Ready for <span className="italic text-[var(--color-primary)]">{service.title.toLowerCase()}?</span>
          </>
        }
        body="Send the brief and we will come back with a plan and a fixed price."
        service={service.slug}
      />
    </>
  );
}

function Fact({ label, children }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-[var(--color-border-soft)] py-4">
      <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-muted)]">{label}</dt>
      <dd className="text-[0.98rem]">{children}</dd>
    </div>
  );
}

function NumberedList({ heading, items }) {
  return (
    <div>
      <h2 className="border-b border-[var(--color-ink)] pb-4 text-[2.4rem] leading-none">{heading}</h2>
      <ol>
        {items.map((item, i) => (
          <Reveal
            key={item}
            as="li"
            delay={i * 0.05}
            className="grid grid-cols-[2.25rem_1fr] gap-3 border-b border-[var(--color-border-soft)] py-4"
          >
            <span className="font-mono text-sm text-[var(--color-red)]">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-lg">{item}</span>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
