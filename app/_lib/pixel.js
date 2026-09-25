import { siteConfig } from "@/app/_lib/siteConfig";

// Meta Pixel events from anywhere in the client. A no-op without a Pixel ID
// or on the server, so callers never need to check.
//
// The queue is created on first use, whoever uses it first: a page's own
// event (ViewContent on a service page) runs its effect before the layout's
// MetaPixel does, and an event sent before the queue existed was lost.
// init and the first PageView always go in first, so Meta accepts the rest.
// Meta's fbevents.js loads later (see MetaPixel.js) and drains the queue.
//
// `eventId` lets a server-side (Conversions API) copy of the same event be
// counted once: send the same id from both.

let ready = false;

export function ensurePixel() {
  if (typeof window === "undefined" || !siteConfig.metaPixelId) return false;
  if (ready) return true;
  if (typeof window.fbq !== "function") {
    const n = (window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
  }
  window.fbq("init", siteConfig.metaPixelId);
  window.fbq("track", "PageView");
  ready = true;
  return true;
}

export function track(event, params = {}, eventId) {
  if (!ensurePixel()) return;
  if (eventId) window.fbq("track", event, params, { eventID: eventId });
  else window.fbq("track", event, params);
}
