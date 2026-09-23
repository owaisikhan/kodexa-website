"use client";

import { useSyncExternalStore } from "react";
import clsx from "clsx";

import { siteConfig } from "@/app/_lib/siteConfig";
import { replyStatus } from "@/app/_lib/reply-hours";

// "Online now" or "Back at 10 am tomorrow", worked out in the browser from the
// studio's hours in Pakistan time. It has to run client side: the page is
// static, so a server-rendered answer would be frozen at build time and wrong
// by lunch. Re-checked every minute so an open tab rolls over on the hour.
//
// The server snapshot is null and the badge keeps its height while empty, so
// nothing below it jumps when the answer arrives.

function subscribe(onChange) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

// A string snapshot, so React sees the same value until the answer changes.
function snapshot() {
  const s = replyStatus(new Date(), siteConfig.hours);
  return s.open ? "open" : `closed:${s.back ?? ""}`;
}

export default function ReplyBadge({ tone = "light", className }) {
  const status = useSyncExternalStore(subscribe, snapshot, () => null);
  const open = status === "open";
  const back = status?.startsWith("closed:") ? status.slice(7) : "";

  return (
    <p
      className={clsx(
        "inline-flex min-h-8 items-center gap-2 text-sm font-semibold",
        tone === "dark" ? "text-[var(--color-on-dark)]" : "text-[var(--color-text)]",
        className
      )}
    >
      {status === null ? null : (
        <>
          {/* Colour is never the only cue: the words say the same thing. */}
          <span
            aria-hidden
            className={clsx(
              "h-2.5 w-2.5 shrink-0 rounded-full border-2",
              tone === "dark" ? "border-[var(--color-on-dark)]" : "border-[var(--color-ink)]",
              open ? "bg-[#25D366]" : "bg-transparent"
            )}
          />
          {open
            ? "Online now. We usually reply within a few hours."
            : back
              ? `Offline now. Back at ${back}, Pakistan time.`
              : "Offline now. We reply as soon as we are back."}
        </>
      )}
    </p>
  );
}
