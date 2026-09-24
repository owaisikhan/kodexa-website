import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin } from "lucide-react";

import { faqs } from "@/app/_lib/company-data";
import { hoursText } from "@/app/_lib/reply-hours";
import { siteConfig, whatsappHref } from "@/app/_lib/siteConfig";
import PageHero from "@/app/_components/ui/PageHero";
import Section from "@/app/_components/ui/Section";
import Button from "@/app/_components/ui/Button";
import WhatsAppIcon from "@/app/_components/ui/WhatsAppIcon";
import ReplyBadge from "@/app/_components/contact/ReplyBadge";
import FaqList from "@/app/_components/company/FaqList";

export const metadata = {
  title: "Contact",
  description: `Reach Kodexa on WhatsApp ${siteConfig.whatsappDisplay} or by email at ${siteConfig.email}. We usually reply within a few hours.`,
  alternates: { canonical: "/contact" },
};

// The page people look for when they want a person, not a form. WhatsApp
// first because that is where we answer; the request form is offered as the
// quicker path for a project, never as the only door.
export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.whatsappDisplay.replace(/\s/g, ""),
    address: { "@type": "PostalAddress", addressCountry: "PK" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: siteConfig.whatsappDisplay.replace(/\s/g, ""),
      email: siteConfig.email,
      availableLanguage: ["English", "Urdu"],
    },
  };

  return (
    <>
      <PageHero
        base={siteConfig.url}
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/contact", label: "Contact" },
        ]}
        title="Talk to us"
        body="WhatsApp is the fastest way to reach us. A real person answers, usually within a few hours."
      />

      <Section tight className="pt-6!">
        <div className="container-x grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="panel flex flex-col justify-between gap-8 bg-[var(--color-surface)] p-7 md:p-9">
            <div>
              <p className="kicker">Fastest</p>
              <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)]">WhatsApp</h2>
              <p className="mt-2 font-display text-2xl font-bold">{siteConfig.whatsappDisplay}</p>
              <p className="mt-3 max-w-md text-[var(--color-muted)]">
                Ask a question, send a voice note or a photo of what you have now. English or Urdu, both fine.
              </p>
            </div>
            <div>
              <Button href={whatsappHref({ service: "a project" })} external variant="whatsapp" size="lg">
                <WhatsAppIcon className="h-5 w-5" />
                Message on WhatsApp
              </Button>
              <ReplyBadge className="mt-4" />
            </div>
          </div>

          <div className="grid gap-4">
            <a
              href={`mailto:${siteConfig.email}`}
              className="panel panel-hover flex items-start gap-4 p-6"
            >
              <Mail className="mt-1 h-5 w-5 shrink-0" aria-hidden />
              <span>
                <span className="block font-display text-lg font-bold">Email</span>
                <span className="mt-1 block break-all text-[var(--color-muted)]">{siteConfig.email}</span>
              </span>
            </a>
            <div className="panel flex items-start gap-4 p-6">
              <Clock className="mt-1 h-5 w-5 shrink-0" aria-hidden />
              <span>
                <span className="block font-display text-lg font-bold">Hours</span>
                <span className="mt-1 block text-[var(--color-muted)]">{hoursText(siteConfig.hours)}</span>
                <span className="mt-1 block text-sm text-[var(--color-dim)]">Messages sent outside these hours are answered the next working morning.</span>
              </span>
            </div>
            <div className="panel flex items-start gap-4 p-6">
              <MapPin className="mt-1 h-5 w-5 shrink-0" aria-hidden />
              <span>
                <span className="block font-display text-lg font-bold">Where we are</span>
                <span className="mt-1 block text-[var(--color-muted)]">{siteConfig.location}</span>
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Section tight className="border-y-2 border-[var(--color-ink)] bg-[var(--color-primary)]">
        <div className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] text-[var(--color-ink)]">Starting a project?</h2>
            <p className="mt-2 max-w-xl text-[var(--color-ink)]">
              The request form takes two minutes and writes the WhatsApp message for you, with everything we need to quote.
            </p>
          </div>
          <Button href="/request" size="lg" variant="ghost">
            Request a service
            <ArrowRight className="h-4.5 w-4.5" aria-hidden />
          </Button>
        </div>
      </Section>

      <Section tight>
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="kicker">Before you ask</p>
            <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)]">Common questions</h2>
            <Link
              href="/faq"
              className="tap mt-4 gap-1.5 font-semibold underline decoration-2 underline-offset-4"
            >
              All questions
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <FaqList items={faqs.slice(0, 5)} />
        </div>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
