import Navbar from "@/app/_components/layout/Navbar";
import Footer from "@/app/_components/layout/Footer";
import SmoothScroll from "@/app/_components/layout/SmoothScroll";
import WhatsAppFab from "@/app/_components/layout/WhatsAppFab";
import ChatWidget from "@/app/_components/chat/ChatWidget";
import { isChatConfigured } from "@/app/_lib/chatbot/config";

// The marketing chrome, and only the marketing chrome.
//
// It used to live in the root layout, which meant /admin rendered the public
// navbar and the WhatsApp button on top of the admin header. The fixed navbar
// sat over the admin's own controls and swallowed clicks meant for them.
export default function SiteLayout({ children }) {
  return (
    <>
      <SmoothScroll />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-[#1c0d05]"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFab />
      {/* No API key, no widget: the site keeps working, it just does not offer
          a chat it cannot answer. */}
      {isChatConfigured() ? <ChatWidget /> : null}
    </>
  );
}
