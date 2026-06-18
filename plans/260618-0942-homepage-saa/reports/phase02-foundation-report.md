# Phase 02 — App Shell · Routing · i18n — Foundation Report

**Date:** 2026-06-18
**Status:** DONE

---

## Files Created / Modified

| File | Action | Lines |
|------|--------|-------|
| `i18n/routing.ts` | Created | 8 |
| `i18n/request.ts` | Created | 14 |
| `proxy.ts` | Created | 14 |
| `next.config.ts` | Modified | 10 |
| `app/layout.tsx` | Modified | 39 |
| `messages/vi.json` | Created | 14 |
| `messages/en.json` | Created | 14 |
| `app/components/i18n/locale-switch.ts` | Created | 24 |
| `app/awards/page.tsx` | Created | 22 |
| `app/kudos/page.tsx` | Created | 22 |
| `app/admin/page.tsx` | Created | 22 |

---

## next-intl Wiring (v4.13.0)

### Routing (`i18n/routing.ts`)
- `defineRouting({ locales: ['vi','en'], defaultLocale: 'vi', localePrefix: 'as-needed' })`
- `localePrefix: 'as-needed'` → Vietnamese (default) at `/`, `/en/...` prefix only for English
- Exports `Locale` type (`"vi" | "en"`)

### Request Config (`i18n/request.ts`)
- `getRequestConfig` callback awaits `requestLocale`, falls back to `"vi"` if undefined or invalid
- Dynamically imports `messages/${locale}.json` at request time (server-side only)

### Proxy Middleware (`proxy.ts`)
- `createMiddleware(routing)` as default export (Next.js 16 `proxy.ts` convention, not `middleware.ts`)
- Matcher excludes: `api`, `_next/static`, `_next/image`, `favicon.ico`, `fonts`, and all static file extensions
- Auth middleware composition in Phase 03: import this middleware's handler and wrap it — pattern is `const intlResult = intlMiddleware(request); if (intlResult) return intlResult; /* then auth logic */`

### Plugin (`next.config.ts`)
- `createNextIntlPlugin('./i18n/request.ts')` wraps the base `NextConfig`

### Root Layout (`app/layout.tsx`)
- `getLocale()` + `setRequestLocale(locale)` for static rendering support
- `getMessages()` fetches the locale's message bundle server-side
- `NextIntlClientProvider` wraps `{children}` with `locale` and `messages` props
- Montserrat + DSEG7 font setup preserved unchanged

### Message Catalogs
- `messages/vi.json` and `messages/en.json`: `common` namespace (comingSoon, language) + `nav` namespace (aboutSaa, awardsInfo, sunKudos, generalCriteria)

---

## Locale Switch Mechanism

**File:** `app/components/i18n/locale-switch.ts`

Server action `setLocale(locale: Locale)`:
- Validates locale against `routing.locales`
- Sets `NEXT_LOCALE` cookie (path `/`, 1-year maxAge, `sameSite: lax`, `httpOnly: false`)
- next-intl middleware reads this cookie on subsequent requests to resolve locale

Header UI wiring deferred to Phase 07. The action is already callable from any Client Component via `import { setLocale } from "@/app/components/i18n/locale-switch"`.

---

## Stub Routes

All three stub pages:
- Dark background `#00101A`, white text, centered `<h1>`
- Uses translated strings from `nav` / `common` namespace
- `/awards` — "Thông tin giải thưởng" / "Awards Information"
- `/kudos` — "Sun* Kudos" (same in both locales)
- `/admin` — "Admin Dashboard — Sắp ra mắt" / "Admin Dashboard — Coming soon"
  - Auth guard placeholder comment: `// Auth guard will be added in Phase 03`

---

## Build & Test Results

### TypeScript (`tsc --noEmit`)
```
(no output — clean)
```

### Vitest (`npm test`)
```
 Test Files  1 passed (1)
      Tests  46 passed (46)
   Duration  215ms
```

### Production Build (`npm run build`)
```
Route (app)
┌ ƒ /
├ ƒ /_not-found
├ ƒ /admin
├ ƒ /awards
├ ƒ /countdown
└ ƒ /kudos

ƒ Proxy (Middleware)
```
All routes present. No errors. No i18n errors.

---

## Phase 03 Auth Composition Notes

To compose auth middleware in `proxy.ts` without breaking i18n:

```ts
// proxy.ts (Phase 03 pattern)
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default function proxy(request: NextRequest) {
  // Run intl first — it handles locale detection + redirect
  const intlResponse = intlMiddleware(request);
  if (intlResponse.headers.get("location")) return intlResponse; // redirects pass through

  // Then run auth logic
  // ...
  return intlResponse; // or NextResponse.next() if auth passes
}
```

The key point: `createMiddleware` returns a function, not a singleton — it can be called inside a custom `proxy` default export without loss of functionality.
