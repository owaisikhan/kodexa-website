import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { getAdmin } from "@/app/_lib/helpers";
import { signOutAction } from "@/app/_lib/actions";
import { siteConfig } from "@/app/_lib/siteConfig";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The gate. proxy.js redirected anyone without a session, this checks that the
// session is actually an admin, and RLS checks again in the database. Three
// fences, none of which assumes another ran.
export default async function AdminLayout({ children }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-ink)] bg-[var(--color-bg)]">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-baseline gap-3">
            <span className="font-display text-2xl leading-none">
              {siteConfig.name}
              <span className="text-[var(--color-red)]">.</span>
            </span>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Requests
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[var(--color-dim)] sm:inline">
              {admin.email}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 border border-[var(--color-ink)] px-4 py-2 text-sm transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-on-dark)]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container-x py-10">{children}</main>
    </div>
  );
}
