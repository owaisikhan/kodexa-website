import { Suspense } from "react";

import RequestForm from "@/app/_components/request/RequestForm";
import Reveal from "@/app/_components/ui/Reveal";
import ReplyBadge from "@/app/_components/contact/ReplyBadge";

export const metadata = {
  title: "Request a service",
  description:
    "Tell us what you need in two minutes. We reply with a plan and a fixed price, usually the same day.",
};

export default function RequestPage() {
  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-[152px]">
      <div className="absolute inset-0 grid-bg" aria-hidden />

      <div className="container-x relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="kicker mb-4">Start a project</p>
          <h1 className="text-[clamp(2.2rem,6vw,3.8rem)]">
            Two minutes. Three questions.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[var(--color-muted)]">
            Then we reply on WhatsApp with a plan and a price.
          </p>
          <ReplyBadge className="mt-4" />
        </Reveal>

        <div className="mt-14">
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
  return (
    <div className="panel mx-auto h-[520px] max-w-3xl animate-pulse" aria-hidden />
  );
}
