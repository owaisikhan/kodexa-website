// Nothing gated here on purpose.
//
// /admin/login lives under /admin, and Next composes nested layouts rather
// than replacing them, so an auth check in this file would also wrap the login
// page: signed out, the login page would redirect to itself forever. The gate
// lives in (protected)/layout.js instead, which the login page is outside of.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminSectionLayout({ children }) {
  return children;
}
