import { ArrowRight } from "lucide-react";

import { whatsappHref } from "@/app/_lib/siteConfig";
import Button from "@/app/_components/ui/Button";
import Reveal from "@/app/_components/ui/Reveal";
import { RunningHead } from "@/app/_components/ui/Section";

// The last thing on every page, and the one place the page inverts: ink
// ground, paper type. One inverted block per page is enough to make it the
// end of the page without a single effect.

export default function CtaBand({
  title,
  body = "Two minutes, three questions. We reply with a plan and a price, usually the same day.",
  service,
}) {
  return (
    <section className="bg-[var(--color-ink)] py-16 text-[var(--color-on-dark)] md:py-24">
      <div className="container-x">
        <RunningHead invert index="05" label="Start" note="Replies within 24h" />

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <h2 className="text-[clamp(3rem,8.5vw,7.5rem)] leading-[0.92]">
              {title ?? (
                <>
                  Tell us what you <span className="italic text-[var(--color-primary)]">need.</span>
                </>
              )}
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <p className="max-w-sm text-lg leading-relaxed text-[var(--color-on-dark-muted)]">{body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button href={service ? `/request?service=${service}` : "/request"} variant="paper" size="lg">
                Request a service
                <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button href={whatsappHref({ service: service || "a project" })} external variant="whatsapp" size="lg">
                WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
