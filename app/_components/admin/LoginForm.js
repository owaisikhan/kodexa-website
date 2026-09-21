"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";

import { signInAction } from "@/app/_lib/actions";
import Button from "@/app/_components/ui/Button";

export default function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [state, formAction, pending] = useActionState(signInAction, null);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />

      <label className="block">
        <span className="mb-2 block text-sm text-[var(--color-muted)]">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          className="field"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-[var(--color-muted)]">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className="field"
          required
        />
      </label>

      {/* One message component for every action, because every action returns
          the same { ok, message } shape. */}
      {state && !state.ok ? (
        <p
          role="alert"
          className="rounded-xl border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)]"
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Sign in
          </>
        )}
      </Button>
    </form>
  );
}
