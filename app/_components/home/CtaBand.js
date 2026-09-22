import { ArrowRight, MessageCircle } from "lucide-react";

import { whatsappHref } from "@/app/_lib/siteConfig";
import Button from "@/app/_components/ui/Button";
import Reveal from "@/app/_components/ui/Reveal";

// The last thing on every page. Two ways to start, no form to read first.

export default function CtaBand({
  title = "Tell us what you need",
  body = "Two minutes, three questions. We reply with a plan and a price, usually the same day.",
  service,
}) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div
        className="glow left-1/2 top-1/2 h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/2 opacity-25"
        style={{ background: "var(--color-primary-dim)" }}
        aria-hidden
      />

      <div className="container-x relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-[clamp(2.2rem,6vw,4rem)]">
            {title}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">
            {body}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={service ? `/request?service=${service}` : "/request"}
              size="lg"
            >
              Request a service
              <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              href={whatsappHref({ service: service || "a project" })}
              external
              variant="whatsapp"
              size="lg"
            >
              <MessageCircle className="h-4.5 w-4.5" />
              Message on WhatsApp
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
