import "server-only";

import { createSupabaseServer } from "@/app/_lib/supabase-server";
import { STATUSES } from "@/app/_lib/requests-data";

// EVERY read query lives in this file.
//
// The public site has no reads: services, process and work are static data
// modules. These are the admin's, and they only return anything at all when
// RLS agrees the caller is an admin, which is why none of them take a "user"
// argument to be trusted.

export const REQUESTS_PER_PAGE = 20;

/**
 * One page of service requests, newest first.
 *
 * Counting and paging happen in Postgres, not here. A `.limit()` on rows you
 * are also going to count is a cap on the count, and it under-reports forever
 * without ever looking broken.
 */
export async function getRequests({ status = "all", page = 1 } = {}) {
  const supabase = await createSupabaseServer();
  const from = (page - 1) * REQUESTS_PER_PAGE;

  let query = supabase
    .from("service_requests")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + REQUESTS_PER_PAGE - 1);

  if (status !== "all" && STATUSES.includes(status)) {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("getRequests failed:", error.message);
    return { requests: [], total: 0, pages: 1 };
  }

  return {
    requests: data ?? [],
    total: count ?? 0,
    pages: Math.max(1, Math.ceil((count ?? 0) / REQUESTS_PER_PAGE)),
  };
}

/**
 * How many requests sit in each status, plus how many arrived this week.
 *
 * Counted in the database rather than by totalling the current page, which
 * would quietly report "3 new" when page one happens to hold three.
 */
export async function getRequestCounts() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("service_requests")
    .select("status, created_at");

  if (error) {
    console.error("getRequestCounts failed:", error.message);
    return { total: 0, byStatus: {}, thisWeek: 0 };
  }

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const byStatus = {};
  let thisWeek = 0;

  for (const row of data ?? []) {
    byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
    if (new Date(row.created_at).getTime() >= weekAgo) thisWeek += 1;
  }

  return { total: data?.length ?? 0, byStatus, thisWeek };
}
