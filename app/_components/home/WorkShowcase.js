import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { work } from "@/app/_lib/services-data";
import Section, { SectionHeader } from "@/app/_components/ui/Section";
import WorkFeature from "@/app/_components/ui/WorkFeature";

// Proof, shown rather than claimed. Two features on the home page, the rest
// one click away, so the page stays a page and not a portfolio.

export default function WorkShowcase() {
  return (
    <Section id="work">
      <div className="container-x">
        <SectionHeader
          index="03"
          kicker="Work"
          note="Built, shipped, in daily use"
          title={
            <>
              Real businesses run on these. <span className="em">Not concepts.</span>
            </>
          }
        />

        <div className="mt-12 space-y-16 md:mt-16 md:space-y-24">
          {work.slice(0, 2).map((item, i) => (
            <WorkFeature key={item.title} item={item} index={i} />
          ))}
        </div>

        <div className="mt-16 flex justify-end border-t border-[var(--color-ink)] pt-5">
          <Link href="/work" className="tap group inline-flex items-center gap-2 text-lg">
            <span className="link-draw">All {work.length} projects</span>
            <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
