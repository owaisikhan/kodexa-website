import "server-only";

// Shared server-side logic. Reads request headers and cookies, so it must never
// reach a client bundle. Anything a client component needs goes in
// format-helpers.js or date-helpers.js instead.

// The site has no auth today. When an admin screen is added, the role check
// lives here and is mirrored by an RLS policy that says the same thing
// independently.
export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(path, base).toString();
}
