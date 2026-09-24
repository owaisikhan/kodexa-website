import { terms } from "@/app/_lib/legal-data";
import LegalPage from "@/app/_components/legal/LegalPage";

export const metadata = {
  title: "Terms of service",
  description: "How quotes, payments, ownership and support work when Kodexa builds your website, store or app.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage doc={terms} path="/terms" other={{ href: "/privacy", label: "privacy policy" }} />;
}
