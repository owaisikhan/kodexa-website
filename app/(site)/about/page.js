import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { lead } from "@/app/_lib/company-data";
import { process, services } from "@/app/_lib/services-data";
import { siteConfig } from "@/app/_lib/siteConfig";
import PageHero from "@/app/_components/ui/PageHero";
import Section, { SectionHeader } from "@/app/_components/ui/Section";
import Reveal from "@/app/_components/ui/Reveal";
import Button from "@/app/_components/ui/Button";
import WhyUs from "@/app/_components/home/WhyUs";
import CtaBand from "@/app/_components/home/CtaBand";

export const metadata = {
  title: "About",
  description:
    "Kodexa is a software studio in Pakistan, led by Hamid Javed. You deal with the person responsible for your project, not a sales team.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        base={siteConfig.url}
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
        ]}
        title="A small studio. One person in charge."
        body={`${siteConfig.name} is a software studio in Pakistan. We build the websites, stores and systems small businesses run on, and you talk to us directly, not to a sales team.`}
      />

      <Section tight className="pt-6!">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeader
            kicker="Who you will talk to"
            title="One person responsible, start to finish"
            body={`Every project is led by ${lead.name}, from the first message to launch and the support after it. You always know who to ask, and nothing is handed to someone you have never spoken to.`}
          />
          <Reveal>
            <div className="panel flex h-full items-center gap-6 p-7 md:p-9">
              <span
                className="grid h-20 w-20 shrink-0 place-items-center rounded-[6px] border-2 border-[var(--color-ink)] bg-[var(--color-primary)] font-display text-3xl font-bold text-[var(--color-ink)] shadow-[4px_4px_0_var(--color-ink)]"
                aria-hidden
              >
                {lead.name.split(" ").map((w) => w[0]).join("")}
              </span>
              <div>
                <h3 className="text-2xl">{lead.name}</h3>
                <p className="mt-1 text-[var(--color-muted)]">
                  {lead.role}, {siteConfig.name}
                </p>
                <p className="mt-3 text-sm text-[var(--color-muted)]">
                  Reachable on WhatsApp {siteConfig.whatsappDisplay}
                </p>
                <a
                  href={lead.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap mt-3 gap-1.5 text-sm font-semibold text-[var(--color-text)] underline decoration-2 underline-offset-4"
                >
                  Code on GitHub
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tight className="border-t border-[var(--color-border-soft)] bg-[var(--color-bg-2)]">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeader
              kicker="What we build"
              title={`${services.length} services, one standard`}
              body="Websites, online stores, business dashboards, offline desktop software, Android apps and AI assistants, plus audits, design and monthly support."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/services">
                See the services
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button href="/work" variant="ghost">
                See our work
              </Button>
            </div>
          </div>
          <dl className="grid content-start gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {siteConfig.stats.map((s) => (
              <div key={s.label} className="panel p-5">
                <dt className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">{s.label}</dt>
                <dd className="mt-1 font-display text-4xl font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <WhyUs />

      <Section tight className="border-t border-[var(--color-border-soft)]">
        <div className="container-x">
          <SectionHeader kicker="How we work" title="Four steps, no meetings needed" />
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <li key={p.n} className="panel p-6">
                <span className="font-mono text-sm text-[var(--color-dim)]">{p.n}</span>
                <h3 className="mt-3 text-lg">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-muted)]">{p.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[var(--color-muted)]">
            Questions about price, payments or ownership?{" "}
            <Link href="/faq" className="tap font-semibold text-[var(--color-text)] underline decoration-2 underline-offset-4">
              Read the answers
            </Link>
            .
          </p>
        </div>
      </Section>

      <CtaBand title="Work with us" />
    </>
  );
}
