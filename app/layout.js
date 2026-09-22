import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "@/app/_styles/globals.css";
import { siteConfig } from "@/app/_lib/siteConfig";

// Bricolage Grotesque does the shouting: a wide, slightly odd grotesk that
// carries a headline on its own, which is the point of a type-led layout.
// DM Sans reads quietly underneath it, and the mono is for labels and numbers
// so the small print looks like a spec sheet rather than more marketing.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
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
  themeColor: "#f4f2ea",
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
              background: "#fffefa",
              color: "#1c1b19",
              border: "2px solid #1c1b19",
              borderRadius: "4px",
              boxShadow: "4px 4px 0 #1c1b19",
              fontWeight: 500,
            },
          }}
        />
      </body>
    </html>
  );
}
