import { Suspense } from "react";

import RequestForm from "@/app/_components/request/RequestForm";
import Reveal from "@/app/_components/ui/Reveal";
import { RunningHead } from "@/app/_components/ui/Section";

export const metadata = {
  title: "Request a service",
  description:
    "Tell us what you need in two minutes. We reply with a plan and a fixed price, usually the same day.",
};

export default function RequestPage() {
  return (
    <section className="min-h-screen pb-24 pt-[104px] md:pt-[120px]">
      <div className="container-x">
        <Reveal direction="none">
          <RunningHead index="05" label="Start a project" note="Replies within 24h" />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal delay={0.05} className="lg:col-span-8">
            <h1 className="text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.92]">
              Two minutes. <span className="em">Three questions.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-4">
            <p className="max-w-sm text-lg leading-relaxed text-[var(--color-muted)]">
              Then we reply on WhatsApp with a plan and a fixed price.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 md:mt-16">
          {/* useSearchParams needs a Suspense boundary to keep the page static. */}
          <Suspense fallback={<FormSkeleton />}>
            <RequestForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function FormSkeleton() {
  return <div className="panel mx-auto h-[520px] max-w-3xl animate-pulse" aria-hidden />;
}
