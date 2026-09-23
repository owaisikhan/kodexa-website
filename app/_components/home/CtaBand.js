import { ArrowRight } from "lucide-react";

import { whatsappHref } from "@/app/_lib/siteConfig";
import Button from "@/app/_components/ui/Button";
import Reveal from "@/app/_components/ui/Reveal";
import WhatsAppIcon from "@/app/_components/ui/WhatsAppIcon";

// The last thing on every page. Two ways to start, no form to read first.

export default function CtaBand({
  title = "Tell us what you need",
  body = "Two minutes, three questions. We reply with a plan and a price, usually the same day.",
  service,
}) {
  return (
    // A solid band of cobalt with ink rules top and bottom. The old version
    // centred a blurred accent wash behind the heading, which is the exact
    // shape of every generated call to action on the internet.
    <section className="relative overflow-hidden border-y-2 border-[var(--color-ink)] bg-[var(--color-secondary)] py-24 md:py-32">
      <div className="absolute inset-0 dot-bg opacity-40" aria-hidden />

      <div className="container-x relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-[clamp(2.2rem,6vw,4rem)] uppercase text-[var(--color-on-dark)]">
            {title}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-on-dark)]">
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
              <WhatsAppIcon className="h-5 w-5" />
              Message on WhatsApp
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
