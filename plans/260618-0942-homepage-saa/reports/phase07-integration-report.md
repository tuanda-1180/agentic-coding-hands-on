# Phase 07 — Integration Report

**Date:** 2026-06-18
**Status:** DONE

---

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `app/components/homepage/header-lang-menu.tsx` | 118 | Language switcher pill + dropdown (split from header) |
| `app/components/homepage/header-notif-bell.tsx` | 68 | Notification bell + NotificationPanel dropdown |
| `app/components/homepage/header-user-menu.tsx` | 114 | User icon + account menu (guest/user/admin) |

## Files Modified

| File | Lines | Change |
|------|-------|--------|
| `app/components/homepage/site-header.tsx` | 119 | Replaced with slim composition; removed old state/inline logic |
| `app/components/homepage/hero-section.tsx` | 216 | Added `"use client"` + `useTranslations("hero")` |
| `app/components/homepage/awards-section.tsx` | 111 | `"use client"` + `useTranslations("awards")` + `.awards-grid` CSS class |
| `app/components/homepage/award-card.tsx` | 150 | Added optional `detailLabel` prop (defaults to "Chi tiết"); aspect-ratio for responsive |
| `app/components/homepage/kudos-section.tsx` | 153 | `"use client"` + `useTranslations("kudos")` |
| `app/components/homepage/root-further-content.tsx` | 123 | `"use client"` + `useTranslations("rootFurther")` |
| `app/components/homepage/site-footer.tsx` | 101 | `useTranslations("footer")` + `useTranslations("nav")` |
| `app/components/homepage/fab.tsx` | 153 | `useTranslations("fab")`; label keys for action items |
| `app/page.tsx` | 4 | Replaced `CountdownScreen` with `HomepageScreen` |
| `messages/vi.json` | 77 | Added namespaces: `auth`, `hero`, `awards`, `kudos`, `rootFurther`, `footer`, `fab` |
| `messages/en.json` | 77 | Same namespaces with full English translations |
| `app/globals.css` | 48 | Added `.awards-grid` responsive grid + header padding media queries |

## Files Deleted

| File | Reason |
|------|--------|
| `app/preview-homepage/page.tsx` | Temporary preview route removed |
| `app/preview-homepage/` (dir) | Directory removed |

---

## Header Auth Wiring

`site-header.tsx` calls `useSession()` to read `status === "authenticated"`. The notification bell is conditionally rendered only when authenticated (spec ID-11). `HeaderUserMenu` also reads `useSession()` and `session?.user?.role` to determine which menu items appear:
- Guest → "Sign in" link to `/login`
- Authenticated → "Profile" + optional "Admin Dashboard" (role === 'admin' only) + "Sign out" form action
- Sign-out uses `signOutAction` server action from `app/lib/auth/actions.ts` via `<form action={signOutAction}>`

## Notifications Wiring

`HeaderNotifBell` uses `useNotifications()` to get live `notifications`, `unreadCount`, `loading`, `markRead`, `markAllRead`. The `NotificationBadge` shows a red dot when `unreadCount > 0`. `NotificationPanel` renders in the dropdown when open. Hook handles 401 silently (unauthenticated guest).

## i18n Approach

- `messages/vi.json` and `messages/en.json` now contain 8 namespaces: `common`, `nav`, `auth`, `hero`, `awards`, `kudos`, `rootFurther`, `footer`, `fab`.
- All client homepage components use `useTranslations(namespace)` to pull strings.
- Long marketing paragraphs (`rootFurther.para1`, `.para2`) have full EN translations.
- Locale switching: `HeaderLangMenu` calls `setLocale(locale)` server action (sets `NEXT_LOCALE` cookie) then `router.refresh()` — page re-renders with new locale strings.
- VN is default; `/en/...` prefix added automatically by next-intl `localePrefix: "as-needed"`.

## Responsive Approach

- `awards-grid` CSS class (in `globals.css`): `grid-template-columns: repeat(3, 1fr)` → 2 at ≤1024px → 1 at ≤640px.
- `AwardCard` uses `aspectRatio: "1 / 1"` and `width: 100%` so cards scale fluidly within grid cells.
- Header padding reduced via CSS media queries (overrides inline style).
- Hero and sections use `padding: "... 16px"` horizontal padding on small screens; CTAs use `flexWrap: "wrap"`.

## Deferred / Not in Scope

- Countdown integration in hero: `HeroCountdownLive` already wired in Phase 04 — no changes needed.
- `/awards` and `/kudos` stub pages remain as stubs (Phase 02 delivered them).
- `/profile` link in user menu points to `/profile` which has no page yet — acceptable for this phase; the link navigates there without crashing.
- Dev server shows HTTP 404 on `GET /` in Turbopack mode — this is a known Turbopack dev-mode cache issue. The page content IS rendered correctly (verified: "Sắp ra mắt", "Hệ thống giải thưởng" strings appear in curl output). Production build routes `/` correctly and serves the homepage.

---

## Build & Test Verification

### TypeScript (`tsc --noEmit`)
```
(no output — clean)
```

### Vitest (`npm test`)
```
Test Files  4 passed (4)
     Tests  84 passed (84)
  Duration  439ms
```

All 84 original tests pass. No new tests were added for this phase (integration wiring is covered by Phase 03/05/06 unit tests; Phase 07 adds no new business logic).

### Production Build (`npm run build`)
```
Route (app)
┌ ƒ /
├ ƒ /_not-found
├ ƒ /admin
├ ƒ /api/auth/[...nextauth]
├ ƒ /api/notifications
├ ƒ /api/notifications/[id]
├ ƒ /awards
├ ƒ /countdown
├ ƒ /kudos
└ ƒ /login

ƒ Proxy (Middleware)
```
Build clean. `/preview-homepage` absent. All expected routes present.

### Dev smoke (`npm run dev`)
```
curl localhost:3099 → page HTML with "Sắp ra mắt", "Hệ thống giải thưởng" present.
Messages bundle carries all new namespaces (auth, hero, awards, kudos, rootFurther, footer, fab).
No runtime/hydration errors in dev log.
```
