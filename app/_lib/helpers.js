import "server-only";

import { createSupabaseServer } from "@/app/_lib/supabase-server";

// Shared server-side logic. Reads request cookies, so it must never reach a
// client bundle. Anything a client component needs goes in format-helpers.js.

// The admin identity check, in one place.
//
// This is the app-level fence. The database has its own, independent one: RLS
// on service_requests calls public.is_admin(), which reads the app_admins
// table. Both have to agree before a lead is readable, and neither trusts the
// other to have run.
export async function getAdmin() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // "Signed in" is not "admin". Today only one account exists, but the moment
  // anything else can sign up, this is the line that stops them reading leads.
  const { data, error } = await supabase.rpc("is_admin");
  if (error || data !== true) return null;

  return user;
}

export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(path, base).toString();
}
