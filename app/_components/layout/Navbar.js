"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/app/_lib/siteConfig";
import Button from "@/app/_components/ui/Button";

const links = [
  { href: "/#services", label: "Services", n: "01" },
  { href: "/#process", label: "Process", n: "02" },
  { href: "/work", label: "Work", n: "03" },
];

// The wordmark is the logo. A letter in a coloured square is what every
// generated site ships as a placeholder mark; a name set in the display face
// with a full stop in the accent is how a studio signs its own work.
export function Wordmark({ className = "text-[1.9rem]" }) {
  return (
    <span className={`font-display leading-none tracking-tight ${className}`}>
      {siteConfig.name}
      <span className="text-[var(--color-red)]">.</span>
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The drawer is fixed and full height, so the page behind it must not scroll.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-[var(--color-bg)] transition-[border-color] duration-300 ${
        scrolled || open ? "border-b border-[var(--color-ink)]" : "border-b border-transparent"
      }`}
    >
      <nav className="container-x flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={`${siteConfig.name} home`} className="tap">
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group font-mono text-[0.78rem] uppercase tracking-[0.12em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
            >
              <span className="mr-1.5 text-[var(--color-red)]">{l.n}</span>
              <span className="link-draw">{l.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Button href="/request" size="sm">
            Start a project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center border border-[var(--color-ink)] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[72px] z-50 overflow-y-auto bg-[var(--color-bg)] md:hidden"
          >
            <div className="container-x flex min-h-full flex-col pb-24 pt-6">
              <ul>
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                    className="border-b border-[var(--color-border-soft)]"
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 py-5"
                    >
                      <span className="font-mono text-xs text-[var(--color-red)]">{l.n}</span>
                      <span className="font-display text-4xl">{l.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <Button
                href="/request"
                onClick={() => setOpen(false)}
                className="mt-8 w-full"
                size="lg"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <p className="mt-auto pt-10 font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                {siteConfig.whatsappDisplay} · replies within 24h
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
