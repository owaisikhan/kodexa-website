"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { siteConfig, whatsappHref } from "@/app/_lib/siteConfig";
import WhatsAppIcon from "@/app/_components/ui/WhatsAppIcon";

// The shortcut for visitors who will never fill in a form. It appears after
// the first screen so it does not compete with the hero's own call to action.
//
// The logo alone, no label: the green WhatsApp mark is recognised faster than
// any words, and it sits directly above the chatbot's button at the same size,
// so the two read as a pair of clearly different ways to reach us.

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
          className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-[4px] border-2 border-[var(--color-ink)] bg-[#25D366] text-white shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--color-ink)] sm:right-5"
          aria-label={`Message ${siteConfig.name} on WhatsApp`}
        >
          <WhatsAppIcon className="h-7 w-7" />
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
