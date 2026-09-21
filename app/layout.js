import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "@/app/_styles/globals.css";
import { siteConfig } from "@/app/_lib/siteConfig";
import Navbar from "@/app/_components/layout/Navbar";
import Footer from "@/app/_components/layout/Footer";
import SmoothScroll from "@/app/_components/layout/SmoothScroll";
import WhatsAppFab from "@/app/_components/layout/WhatsAppFab";

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
      <body>
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-[#04121a]"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFab />
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
