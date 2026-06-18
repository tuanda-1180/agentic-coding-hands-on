import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

// "Without i18n routing" mode: locale is NOT in the URL — it is read from the
// NEXT_LOCALE cookie (set by the language switcher). This keeps `/` clean (no /vi
// prefix) and lets all pages live at the top level of app/ (no [locale] segment).
const LOCALES = ["vi", "en"] as const;
const DEFAULT_LOCALE = "vi";

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get("NEXT_LOCALE")?.value;
  const locale = LOCALES.includes(cookieLocale as (typeof LOCALES)[number])
    ? (cookieLocale as string)
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
