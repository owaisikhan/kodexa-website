"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Lenis drives the scroll; GSAP's ScrollTrigger has to be told about it or
// pinned sections fire at the wrong offsets. Both are disabled outright when
// the visitor asked for reduced motion.

export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      // In-page links (/#process, #finder) scroll through Lenis. Without this
      // a native jump fought Lenis's own glide: a second click on "How it
      // works", or a click while the page was still gliding, left the page
      // where Lenis was heading instead of at the section. Lenis reads the
      // scroll-padding-top in globals.css, so sections land below the navbar.
      anchors: true,
      // Following a link to another page drops any glide still in progress,
      // so it cannot carry on and override where the new page lands.
      stopInertiaOnNavigate: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
