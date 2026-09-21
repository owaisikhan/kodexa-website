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
      <div
        className="glow left-1/2 top-1/2 h-[320px] w-[520px] -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{ background: "var(--color-primary)" }}
        aria-hidden
      />

      <div className="container-x relative">
        <div className="panel mx-auto max-w-md p-8 md:p-10">
          <p className="kicker mb-3">Kodexa</p>
          <h1 className="text-3xl">Admin sign in</h1>
          <p className="mt-3 text-[var(--color-muted)]">
            Requests from the site land here.
          </p>

          <Suspense fallback={<div className="mt-8 h-52 animate-pulse rounded-xl bg-white/[0.03]" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
