import { work } from "@/app/_lib/services-data";
import Reveal from "@/app/_components/ui/Reveal";
import Section, { RunningHead } from "@/app/_components/ui/Section";
import WorkFeature from "@/app/_components/ui/WorkFeature";
import CtaBand from "@/app/_components/home/CtaBand";

export const metadata = {
  title: "Work",
  description:
    "Projects Kodexa has built and shipped: online stores, business dashboards, offline desktop software and Android apps.",
};

export default function WorkPage() {
  return (
    <>
      <section className="pt-[104px] md:pt-[120px]">
        <div className="container-x">
          <Reveal direction="none">
            <RunningHead index="03" label="Work" note={`${work.length} projects`} />
          </Reveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <Reveal delay={0.05} className="lg:col-span-8">
              <h1 className="text-[clamp(3rem,8vw,7rem)] leading-[0.92]">
                Built, shipped, <span className="em">in daily use.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12} className="lg:col-span-4">
              <p className="max-w-md text-lg leading-relaxed text-[var(--color-muted)]">
                Every one of these runs a real business. Some sit behind a
                login, so what you see is drawn from the build, not screenshotted.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Section tight>
        <div className="container-x space-y-16 md:space-y-24">
          {work.map((item, i) => (
            <WorkFeature key={item.title} item={item} index={i} headingLevel="h2" />
          ))}
        </div>
      </Section>

      <CtaBand
        title={
          <>
            Want something <span className="italic text-[var(--color-primary)]">like this?</span>
          </>
        }
      />
    </>
  );
}
