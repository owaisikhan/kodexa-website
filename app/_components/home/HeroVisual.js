"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Bot, LayoutDashboard, ShoppingBag } from "lucide-react";

// Three floating panels, one per thing we sell, drifting on their own and
// leaning towards the cursor. It is decoration, so it is aria-hidden and never
// carries information that is not also written in the copy beside it.

export default function HeroVisual() {
  const root = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.to("[data-card]", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.14,
        delay: 0.5,
        ease: "power3.out",
      });

      if (reduced) return;

      // Idle drift, so the panel group is never completely still.
      gsap.utils.toArray("[data-card]").forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -14 : 12,
          duration: 3.6 + i * 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.4 + i * 0.2,
        });
      });

      // quickTo keeps the pointer parallax on GSAP's ticker instead of firing a
      // tween per mousemove.
      //
      // The tilt is "rotation", GSAP's own transform component, not "rotate".
      // "rotate" is the standalone CSS property, which GSAP writes directly and
      // then cannot restore: every ctx.revert() logs "rotate not eligible for
      // reset", once per card, and React remounts this in development. Using
      // rotation puts the tilt in the same matrix as x, so one revert undoes
      // both.
      const setters = gsap.utils.toArray("[data-card]").map((card, i) => ({
        x: gsap.quickTo(card, "x", { duration: 0.8, ease: "power3.out" }),
        rot: gsap.quickTo(card, "rotation", { duration: 0.9, ease: "power3.out" }),
        depth: (i + 1) * 9,
      }));

      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        setters.forEach((s) => {
          s.x(nx * s.depth);
          s.rot(nx * 3 + ny * 1.5);
        });
      };

      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="pointer-events-none relative hidden h-[460px] w-full lg:block"
      aria-hidden
    >
      <Card
        className="right-[6%] top-[4%] w-[300px]"
        icon={ShoppingBag}
        label="Online store"
        accent="var(--color-primary)"
      >
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-lg border border-[var(--color-border)] p-1.5">
              <div className="h-7 rounded bg-gradient-to-br from-[var(--color-primary)]/30 to-[var(--color-secondary)]/15" />
              <div className="mt-1.5 h-1 w-8 rounded-full bg-[var(--color-border)]" />
            </div>
          ))}
        </div>
      </Card>

      <Card
        className="left-[2%] top-[30%] w-[280px]"
        icon={LayoutDashboard}
        label="Daily dashboard"
        accent="var(--color-secondary)"
      >
        <div className="flex h-[74px] items-end gap-1.5">
          {[40, 68, 52, 84, 61, 92].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 rounded-sm bg-gradient-to-t from-[var(--color-secondary)]/30 to-[var(--color-secondary)]"
            />
          ))}
        </div>
      </Card>

      <Card
        className="right-[14%] bottom-[2%] w-[286px]"
        icon={Bot}
        label="AI assistant"
        accent="var(--color-success)"
      >
        <div className="space-y-2">
          <p className="ml-auto w-fit max-w-[78%] rounded-2xl rounded-br-sm bg-[var(--color-success)]/15 px-3 py-1.5 text-[11px] text-[var(--color-text)]">
            Anything under $30?
          </p>
          <p className="w-fit max-w-[86%] rounded-2xl rounded-bl-sm bg-white/[0.05] px-3 py-1.5 text-[11px] text-[var(--color-muted)]">
            Yes, four items. Shall I show you?
          </p>
        </div>
      </Card>
    </div>
  );
}

function Card({ className, icon: Icon, label, accent, children }) {
  return (
    <div
      data-card
      className={`panel absolute translate-y-8 scale-95 p-4 opacity-0 ${className}`}
      style={{ boxShadow: `0 30px 80px -40px ${accent}` }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="grid h-7 w-7 place-items-center rounded-lg"
          style={{ color: accent, background: `color-mix(in oklab, ${accent} 14%, transparent)` }}
        >
          <Icon className="h-4 w-4" strokeWidth={1.7} />
        </span>
        <span className="text-xs font-medium tracking-wide text-[var(--color-muted)]">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
