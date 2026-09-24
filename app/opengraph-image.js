import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { siteConfig } from "@/app/_lib/siteConfig";

// The card Facebook, WhatsApp and LinkedIn show when someone shares a link to
// the site. Without it they show a blank grey box, or whatever image they
// guess at. Drawn in the site's own colours, so a shared link looks like us.

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The site's own fonts, bundled as files (both under the SIL Open Font
// Licence) because next/font does not hand its files to ImageResponse, and
// fetching them from Google at build time would fail a build that is offline.
const font = (file) => readFile(join(process.cwd(), "app/_assets/fonts", file));

export default async function OpengraphImage() {
  const [display, sans] = await Promise.all([
    font("BricolageGrotesque-ExtraBold.ttf"),
    font("DMSans-Medium.ttf"),
  ]);
  const ink = "#1c1b19";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#f4f2ea",
          color: ink,
          fontFamily: "DM Sans",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 18,
              background: "#e0b64a",
              border: `4px solid ${ink}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontFamily: "Bricolage",
            }}
          >
            K
          </div>
          <div style={{ fontSize: 40, fontFamily: "Bricolage" }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontFamily: "Bricolage", lineHeight: 1, letterSpacing: -2, textTransform: "uppercase", maxWidth: 1000 }}>
            We build the software your business runs on
          </div>
          <div style={{ marginTop: 26, fontSize: 30, color: "#56534c" }}>
            Websites, online stores, dashboards, Android apps and AI assistants
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}>
          <div style={{ display: "flex", background: "#25D366", border: `3px solid ${ink}`, padding: "10px 20px" }}>
            WhatsApp {siteConfig.whatsappDisplay}
          </div>
          <div style={{ display: "flex", color: "#56534c" }}>A plan and a fixed price, usually the same day</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: display, weight: 800, style: "normal" },
        { name: "DM Sans", data: sans, weight: 500, style: "normal" },
      ],
    }
  );
}
