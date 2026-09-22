import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "@/app/_styles/globals.css";
import { siteConfig } from "@/app/_lib/siteConfig";

// Instrument Serif is the display face: a narrow, high-contrast serif that
// holds together at 130px, which is what an editorial headline asks of it.
// Plex Sans reads underneath it, and Plex Mono sets the running heads, the
// index numbers and the small print, so the page reads like a printed spec.
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}: ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: "#f3f1ec",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      {/* The root layout carries the fonts, the tokens and the toaster only.
          Public chrome lives in (site)/layout.js so /admin does not inherit a
          marketing navbar over its own header. */}
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#141414",
              color: "#f3f1ec",
              border: "none",
              borderRadius: "0",
              fontSize: "0.9rem",
            },
          }}
        />
      </body>
    </html>
  );
}
