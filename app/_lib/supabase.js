import { createBrowserClient } from "@supabase/ssr";

// Browser client. Anon key only, RLS applies. Used by nothing that writes
// business data directly today, but kept so the shape matches the other apps.
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
