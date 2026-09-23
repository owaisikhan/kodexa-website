import Hero from "@/app/_components/home/Hero";
import Marquee from "@/app/_components/home/Marquee";
import ServicesGrid from "@/app/_components/home/ServicesGrid";
import ServiceFinder from "@/app/_components/finder/ServiceFinder";
import ProcessTimeline from "@/app/_components/home/ProcessTimeline";
import WorkShowcase from "@/app/_components/home/WorkShowcase";
import WhyUs from "@/app/_components/home/WhyUs";
import CtaBand from "@/app/_components/home/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <ServicesGrid />
      <ServiceFinder className="border-y border-[var(--color-border-soft)] bg-[var(--color-bg-2)]" />
      <ProcessTimeline />
      <WorkShowcase />
      <WhyUs />
      <CtaBand />
    </>
  );
}
