"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

import { siteConfig, whatsappHref } from "@/app/_lib/siteConfig";
import Button from "@/app/_components/ui/Button";
import HeroVisual from "@/app/_components/home/HeroVisual";

// The first screen. One promise, two buttons, and enough motion to say
// "these people build things" without making the sentence hard to read.

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-animate], [data-lines] > span", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to("[data-animate='kicker']", { opacity: 1, y: 0, duration: 0.6 })
        .to(
          "[data-lines] > span",
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 },
          "-=0.3"
        )
        .to("[data-animate='sub']", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .to("[data-animate='cta']", { opacity: 1, y: 0, duration: 0.7 }, "-=0.45")
        .to("[data-animate='stats']", { opacity: 1, y: 0, duration: 0.7 }, "-=0.45")
        .to("[data-animate='orb']", { opacity: 1, scale: 1, duration: 1.4, stagger: 0.15 }, 0);

      // The orbs drift forever. Cheap, and it keeps the screen alive while
      // somebody reads.
      gsap.to("[data-orb='1']", {
        x: 60,
        y: -40,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to("[data-orb='2']", {
        x: -50,
        y: 50,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const words = ["We", "build", "the", "software"];

  return (
    <section
      ref={root}
      className="relative flex min-h-[92svh] items-center overflow-hidden pt-[88px]"
    >
      <div className="absolute inset-0 grid-bg" aria-hidden />

      <div
        data-animate="orb"
        data-orb="1"
        className="glow left-[8%] top-[14%] h-[200px] w-[200px] opacity-0 sm:h-[380px] sm:w-[380px]"
        style={{ background: "var(--color-primary)", transform: "scale(0.6)" }}
        aria-hidden
      />
      <div
        data-animate="orb"
        data-orb="2"
        className="glow right-[6%] bottom-[10%] h-[220px] w-[220px] opacity-0 sm:h-[420px] sm:w-[420px]"
        style={{ background: "var(--color-secondary)", transform: "scale(0.6)" }}
        aria-hidden
      />

      {/* Phones only: the orbs are unavoidably close to the text at this size,
          so this takes the wash down far enough for muted body copy to stay
          readable without flattening the effect. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[var(--color-bg)]/55 sm:hidden"
        aria-hidden
      />

      <div className="container-x hero-pad relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
        <div
          data-animate="kicker"
          className="mb-5 inline-flex translate-y-4 items-center gap-2.5 rounded-full border border-[var(--color-primary)]/35 bg-[#070c16]/85 px-5 py-2.5 backdrop-blur-md"
        >
          <Sparkles className="h-4.5 w-4.5 text-[var(--color-primary)]" />
          <span className="text-[0.95rem] font-semibold tracking-wide text-[var(--color-text)]">
            Websites, stores, dashboards, apps and AI
          </span>
        </div>

        <h1 data-lines className="hero-title max-w-4xl">
          {words.map((w, i) => (
            <span key={i} className="inline-block translate-y-8 opacity-0">
              {w}&nbsp;
            </span>
          ))}
          <span className="text-gradient inline-block translate-y-8 opacity-0">
            your business runs on
          </span>
        </h1>

        <p
          data-animate="sub"
          className="hero-gap-sm max-w-xl translate-y-5 text-lg leading-relaxed text-[var(--color-muted)] opacity-0 md:text-xl"
        >
          Tell us what you need in two minutes. We reply with a plan and a fixed
          price, usually the same day.
        </p>

        <div
          data-animate="cta"
          className="hero-gap-lg flex translate-y-5 flex-col gap-3 opacity-0 sm:flex-row sm:items-center"
        >
          <Button href="/request" size="lg">
            Request a service
            <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          <Button
            href={whatsappHref({ service: "a project" })}
            external
            variant="ghost"
            size="lg"
          >
            <MessageCircle className="h-4.5 w-4.5 text-[#25D366]" />
            Or just WhatsApp us
          </Button>
        </div>

        <dl
          data-animate="stats"
          className="hero-gap-lg flex translate-y-5 flex-wrap gap-x-12 gap-y-5 opacity-0"
        >
          {siteConfig.stats.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-3xl font-bold text-[var(--color-text)] md:text-4xl">
                {s.value}
              </dt>
              <dd className="mt-1 text-sm text-[var(--color-dim)]">{s.label}</dd>
            </div>
          ))}
        </dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
