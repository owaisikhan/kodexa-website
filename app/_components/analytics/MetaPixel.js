"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

import { ensurePixel, track } from "@/app/_lib/pixel";

// The Meta Pixel, split in two so it never slows the page:
//
// 1. A few hundred bytes of queue (ensurePixel in _lib/pixel.js), created on
//    first use: init, the first PageView and any early event wait in it.
// 2. Meta's fbevents.js (about 90 KB) with lazyOnload: fetched only when the
//    browser is idle after the page has loaded, then it drains the queue.
//
// A PageView is sent for every client-side navigation after the first. Any
// tap on a wa.me link is a Contact. Only rendered by (site)/layout.js, so the
// admin area is never tracked.

export default function MetaPixel() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    ensurePixel();
    if (first.current) {
      first.current = false;
      return;
    }
    track("PageView");
  }, [pathname]);

  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="https://wa.me/"]');
      if (link) track("Contact", { content_name: "WhatsApp" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <Script src="https://connect.facebook.net/en_US/fbevents.js" strategy="lazyOnload" />;
}
