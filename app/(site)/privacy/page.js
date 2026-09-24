import { privacy } from "@/app/_lib/legal-data";
import LegalPage from "@/app/_components/legal/LegalPage";

export const metadata = {
  title: "Privacy policy",
  description: "What Kodexa collects when you use this website or send a request, why, and how to have it deleted.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage doc={privacy} path="/privacy" other={{ href: "/terms", label: "terms of service" }} />;
}
