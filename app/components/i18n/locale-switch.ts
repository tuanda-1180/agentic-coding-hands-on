"use server";

import { cookies } from "next/headers";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Server action to switch the application locale.
 * Persists the chosen locale via a cookie so next-intl middleware
 * picks it up on subsequent requests.
 *
 * The header-level UI wiring happens in Phase 07; this action
 * just exposes the mechanism.
 */
export async function setLocale(locale: Locale): Promise<void> {
  if (!routing.locales.includes(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    httpOnly: false, // Client-readable for JS locale detection
  });
}
