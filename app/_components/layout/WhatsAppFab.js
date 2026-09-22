"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle } from "lucide-react";

import { siteConfig, whatsappHref } from "@/app/_lib/siteConfig";

// The shortcut for visitors who will never fill in a form. It appears after
// the first screen so it does not compete with the hero's own call to action.

export default function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.65);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.a
          href={whatsappHref({ service: "a project" })}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="group fixed bottom-[5.25rem] right-4 z-40 flex h-12 items-center gap-2 bg-[#25D366] px-4 font-medium text-[var(--color-ink)] transition-[filter] hover:brightness-95 sm:right-5"
          aria-label={`Message ${siteConfig.name} on WhatsApp`}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm transition-all duration-300 group-hover:max-w-[140px] sm:max-w-[140px]">
            Chat on WhatsApp
          </span>
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
