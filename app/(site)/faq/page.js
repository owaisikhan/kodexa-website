import { faqs } from "@/app/_lib/company-data";
import { siteConfig } from "@/app/_lib/siteConfig";
import PageHero from "@/app/_components/ui/PageHero";
import Section from "@/app/_components/ui/Section";
import FaqList from "@/app/_components/company/FaqList";
import CtaBand from "@/app/_components/home/CtaBand";

export const metadata = {
  title: "Questions",
  description:
    "What a project with Kodexa costs, how long it takes, how payments work, who owns the code and what happens after launch.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  // FAQPage structured data, built from the same list the page shows, so the
  // answers in search results can never drift from the answers on the page.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <PageHero
        base={siteConfig.url}
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/faq", label: "Questions" },
        ]}
        title="Questions, answered"
        body="The things people ask before they send a request. Anything else, ask us on WhatsApp."
      />
      <Section tight className="pt-4!">
        <div className="container-x">
          <FaqList className="max-w-3xl" />
        </div>
      </Section>
      <CtaBand title="Still deciding?" body="Send a short brief. It is free, and we reply with a plan and a fixed price." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
