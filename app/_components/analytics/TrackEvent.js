"use client";

import { useEffect } from "react";

import { track } from "@/app/_lib/pixel";

// Fires one Pixel event when a server-rendered page mounts, e.g. ViewContent
// on a service page. Renders nothing.
export default function TrackEvent({ event, params }) {
  const key = JSON.stringify(params ?? {});
  useEffect(() => {
    track(event, JSON.parse(key));
  }, [event, key]);
  return null;
}
