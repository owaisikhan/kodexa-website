import { Suspense } from "react";

import LoginForm from "@/app/_components/admin/LoginForm";

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0 grid-bg" aria-hidden />

      <div className="container-x relative">
        <div className="panel mx-auto max-w-md p-8 md:p-10">
          <p className="kicker mb-3">Kodexa</p>
          <h1 className="text-3xl">Admin sign in</h1>
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
