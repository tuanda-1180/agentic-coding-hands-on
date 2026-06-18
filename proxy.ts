import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// i18n uses "without routing" mode (locale via cookie, see i18n/request.ts), so NO
// next-intl middleware is needed here — adding it would rewrite every request to a
// locale path with no matching route and 404 the whole app. This middleware only
// guards authenticated/admin routes.
const PROTECTED_PATHS = ["/admin"];
const ADMIN_PATHS = ["/admin"];

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const needsAuth = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (!needsAuth) return NextResponse.next();

  const session = await auth();
  if (!session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const needsAdmin = ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (needsAdmin && session.user.role !== "admin") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only the guarded routes need middleware now.
  matcher: ["/admin/:path*"],
};
