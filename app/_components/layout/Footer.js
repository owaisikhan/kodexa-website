import Link from "next/link";
import { ArrowUpRight, GitBranch, Mail, MapPin, MessageCircle } from "lucide-react";

import { siteConfig, whatsappHref } from "@/app/_lib/siteConfig";
import { services } from "@/app/_lib/services-data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border-soft)] bg-[var(--color-bg-2)]">

      <div className="container-x relative py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-primary)] text-[var(--color-ink)]">
                <span className="font-display text-lg font-bold">K</span>
              </span>
              <span className="font-display text-lg font-bold">{siteConfig.name}</span>
            </div>
            <p className="mt-5 max-w-sm text-[var(--color-muted)]">
              {siteConfig.tagline}. Websites, online stores, dashboards, desktop
              software, Android apps and AI assistants.
            </p>

            <div className="mt-6 flex flex-col gap-3 text-sm text-[var(--color-muted)]">
              <a
                href={whatsappHref({ service: "a project" })}
                target="_blank"
                rel="noopener noreferrer"
                className="tap gap-2 hover:text-[var(--color-text)]"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                {siteConfig.whatsappDisplay}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="tap gap-2 hover:text-[var(--color-text)]"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.email}
              </a>
              <span className="tap gap-2">
                <MapPin className="h-4 w-4" />
                {siteConfig.location}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.22em] text-[var(--color-dim)]">
              Services
            </h3>
            <ul className="mt-5 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="tap text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.22em] text-[var(--color-dim)]">
              Company
            </h3>
            <ul className="mt-5 space-y-2.5">
              <li>
                <Link href="/work" className="tap text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/#process" className="tap text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/request" className="tap text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                  Request a service
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                >
                  <GitBranch className="h-3.5 w-3.5" />
                  GitHub
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col items-center justify-between gap-3 text-sm text-[var(--color-dim)] sm:flex-row">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Built by us, in the open.</p>
        </div>
      </div>
    </footer>
  );
}
