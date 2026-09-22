import { Suspense } from "react";

import LoginForm from "@/app/_components/admin/LoginForm";

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">

      <div className="container-x relative">
        <div className="panel mx-auto max-w-md p-8 md:p-10">
          <p className="kicker border-b border-[var(--color-ink)] pb-2">
            <span className="text-[var(--color-red)]">Kodexa</span> / Admin
          </p>
          <h1 className="mt-6 text-5xl">Sign in.</h1>
          <p className="mt-3 text-[var(--color-muted)]">
            Requests from the site land here.
          </p>

          <Suspense fallback={<div className="mt-8 h-52 animate-pulse rounded-xl bg-[var(--color-surface-2)]" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
