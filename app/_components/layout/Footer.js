import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { siteConfig, whatsappHref } from "@/app/_lib/siteConfig";
import { services } from "@/app/_lib/services-data";

// The colophon. Three columns of small print, then the name set as large as
// the page allows, the way a book signs off its last page.

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg)] pt-16 md:pt-20">
      <div className="container-x">
        <div className="grid gap-10 border-t border-[var(--color-ink)] pt-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="kicker">Contact</p>
            <ul className="mt-5 space-y-2 text-lg">
              <li>
                <a
                  href={whatsappHref({ service: "a project" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap link-draw"
                >
                  WhatsApp {siteConfig.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="tap link-draw">
                  {siteConfig.email}
                </a>
              </li>
              <li className="text-[var(--color-muted)]">{siteConfig.location}</li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="kicker">Services</p>
            <ul className="mt-5 space-y-1.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="tap text-[0.95rem] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="kicker">Studio</p>
            <ul className="mt-5 space-y-1.5 text-[0.95rem]">
              <li>
                <Link href="/work" className="tap text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/#process" className="tap text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                  Process
                </Link>
              </li>
              <li>
                <Link href="/request" className="tap text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                  Request a service
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap inline-flex items-center gap-1 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                >
                  GitHub
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sized in vw so the name always spans the measure exactly, whatever
            the screen. aria-hidden because the name is already in the header. */}
        <p
          className="mt-14 select-none font-display leading-[0.78] tracking-[-0.04em] md:mt-20"
          style={{ fontSize: "clamp(5rem, 24.5vw, 22rem)" }}
          aria-hidden
        >
          {siteConfig.name}
          <span className="text-[var(--color-red)]">.</span>
        </p>

        <div className="mt-6 flex flex-col justify-between gap-2 border-t border-[var(--color-ink)] py-5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-muted)] sm:flex-row">
          <p>&copy; {year} {siteConfig.name}. All rights reserved.</p>
          <p>Set in Instrument Serif and IBM Plex. Built by us, in the open.</p>
        </div>
      </div>
    </footer>
  );
}
