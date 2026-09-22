import { ArrowUpRight } from "lucide-react";

import { work } from "@/app/_lib/services-data";
import WorkMock from "@/app/_components/ui/WorkMock";
import Reveal from "@/app/_components/ui/Reveal";
import Section from "@/app/_components/ui/Section";
import CtaBand from "@/app/_components/home/CtaBand";

export const metadata = {
  title: "Work",
  description:
    "Projects Kodexa has built and shipped: online stores, business dashboards, offline desktop software and Android apps.",
};

export default function WorkPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-[152px] pb-10">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="container-x relative">
          <Reveal>
            <p className="kicker mb-4">Work</p>
            <h1 className="max-w-3xl text-[clamp(2.4rem,6.5vw,4.4rem)]">
              Built, shipped, in daily use
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">
              Every one of these runs a real business. Some are behind a login,
              so what you see here is drawn, not screenshotted.
            </p>
          </Reveal>
        </div>
      </section>

      <Section tight>
        <div className="container-x grid gap-5 md:grid-cols-2">
          {work.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.1}>
              <article className="panel panel-hover h-full overflow-hidden">
                <WorkMock shot={item.shot} mock={item.mock} title={item.title} />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink)]">
                    {item.kind}
                  </p>
                  <h2 className="mt-3 text-2xl">{item.title}</h2>
                  <p className="mt-2.5 leading-relaxed text-[var(--color-muted)]">
                    {item.body}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-[4px] border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]"
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
                      className="tap mt-3 gap-1.5 text-sm font-semibold text-[var(--color-ink)] hover:underline"
                    >
                      Visit the live site
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand title="Want something like this?" />
    </>
  );
}
