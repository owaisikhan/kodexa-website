import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import "server-only";

// Server client, session-bound. Every write goes through this, so RLS is the
// access control rather than a promise the app makes to itself.
export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // The proxy refreshes the session, so this is safe to ignore.
          }
        },
      },
    }
  );
}

// True only when both keys are present. The request form stays usable without
// Supabase (it still hands off to WhatsApp), so every caller checks this
// rather than throwing at import time and taking the whole page down.
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
