"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/app/components/homepage/site-header";
import SiteFooter from "@/app/components/homepage/site-footer";

/**
 * Routes rendered WITHOUT the shared header/footer chrome — full-screen / bare
 * pages. Locale is cookie-based (no URL prefix), so paths are clean.
 *  - /login, /countdown: bare per product decision (no header/footer)
 *  - /admin: dashboard, intentionally chromeless (preserves prior behavior)
 */
const BARE_ROUTES = ["/login", "/countdown", "/admin"];

function isBareRoute(pathname: string): boolean {
  return BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Shared site chrome. Wraps marketing pages with the common SiteHeader and
 * SiteFooter so they are defined once instead of per page. Bare routes render
 * their children alone.
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (isBareRoute(pathname)) {
    return <>{children}</>;
  }

  // Wrap in a flow block that grows to the full content height so the sticky
  // header's containing block spans the whole page — otherwise (e.g. directly
  // under a viewport-tall `body`, which is `height: 100%` from globals.css) the
  // header un-sticks after one screen of scrolling.
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
