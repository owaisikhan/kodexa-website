import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Next 16 renamed middleware.js to proxy.js. Two jobs:
//
// 1. Refresh the Supabase session cookie on every request, or a signed-in
//    admin gets logged out the moment their access token expires.
// 2. Gate /admin. This is the first fence, not the only one: the admin layout
//    checks again, and RLS checks again in the database. Middleware alone is
//    not access control, it is a redirect that saves a wasted render.

export async function proxy(request) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // No Supabase configured: the public site still works, so let it through
  // rather than 500ing every page.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminArea && !isLoginPage && !user) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (isLoginPage && user) {
    const admin = request.nextUrl.clone();
    admin.pathname = "/admin";
    admin.search = "";
    return NextResponse.redirect(admin);
  }

  return response;
}

export const config = {
  // Everything except static assets. The session refresh has to run on normal
  // page requests, not just /admin, or the cookie goes stale while someone is
  // reading the public site in another tab.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
