import Link from "next/link";
import { Inbox } from "lucide-react";

import { getRequests, getRequestCounts, REQUESTS_PER_PAGE } from "@/app/_lib/data-service";
import { STATUSES, STATUS_LABELS as LABELS } from "@/app/_lib/requests-data";
import RequestCard from "@/app/_components/admin/RequestCard";

export const metadata = {
  title: "Requests",
  robots: { index: false, follow: false },
};

// Always fresh: a lead that arrived a minute ago must not be hidden behind a
// cached page.
export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }) {
  const params = await searchParams;
  const status = LABELS[params?.status] ? params.status : "all";
  const page = Math.max(1, Number(params?.page) || 1);

  const [{ requests, total, pages }, counts] = await Promise.all([
    getRequests({ status, page }),
    getRequestCounts(),
  ]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Requests</h1>
          <p className="mt-2 text-[var(--color-muted)]">
            {counts.total} in total, {counts.thisWeek} in the last 7 days.
          </p>
        </div>
      </div>

      {/* Filters are query strings, so a filtered view is a link somebody can
          bookmark or send, and the back button behaves. */}
      <nav className="mt-8 flex flex-wrap gap-2">
        {["all", ...STATUSES].map((key) => {
          const active = status === key;
          const count = key === "all" ? counts.total : counts.byStatus[key] ?? 0;
          return (
            <Link
              key={key}
              href={key === "all" ? "/admin" : `/admin?status=${key}`}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-[4px] border px-4 py-2 text-sm transition-colors ${
                active
                  ? "border-[var(--color-ink)] bg-[var(--color-primary)] text-[var(--color-text)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-dim)]"
              }`}
            >
              {LABELS[key]}
              <span className="rounded-[4px] bg-[var(--color-surface-2)] px-2 py-0.5 text-xs tabular-nums">
                {count}
              </span>
            </Link>
          );
        })}
      </nav>

      {requests.length === 0 ? (
        <div className="panel mt-8 flex flex-col items-center gap-3 px-6 py-20 text-center">
          <Inbox className="h-8 w-8 text-[var(--color-dim)]" strokeWidth={1.5} />
          <p className="text-lg text-[var(--color-text)]">
            {status === "all" ? "No requests yet" : `Nothing marked ${LABELS[status].toLowerCase()}`}
          </p>
          <p className="max-w-sm text-sm text-[var(--color-muted)]">
            {status === "all"
              ? "When someone sends the form on the site, it appears here straight away."
              : "Try another filter."}
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {requests.map((request) => (
            <li key={request.id}>
              <RequestCard request={request} />
            </li>
          ))}
        </ul>
      )}

      {pages > 1 ? (
        <nav className="mt-10 flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-dim)]">
            Page {page} of {pages}, showing up to {REQUESTS_PER_PAGE} at a time
          </p>
          <div className="flex gap-2">
            <PageLink status={status} page={page - 1} disabled={page <= 1}>
              Previous
            </PageLink>
            <PageLink status={status} page={page + 1} disabled={page >= pages}>
              Next
            </PageLink>
          </div>
        </nav>
      ) : null}
    </>
  );
}

function PageLink({ status, page, disabled, children }) {
  const query = new URLSearchParams();
  if (status !== "all") query.set("status", status);
  if (page > 1) query.set("page", String(page));
  const href = `/admin${query.toString() ? `?${query}` : ""}`;

  if (disabled) {
    return (
      <span className="rounded-[4px] border border-[var(--color-border-soft)] px-4 py-2 text-sm text-[var(--color-dim)] opacity-50">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-[4px] border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-text)]"
    >
      {children}
    </Link>
  );
}
