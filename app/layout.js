import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "@/app/_styles/globals.css";
import { siteConfig } from "@/app/_lib/siteConfig";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
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
  themeColor: "#05070d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      {/* The root layout carries the fonts, the tokens and the toaster only.
          Public chrome lives in (site)/layout.js so /admin does not inherit a
          marketing navbar over its own header. */}
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#0c1220",
              color: "#e9eefc",
              border: "1px solid #1b2540",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
