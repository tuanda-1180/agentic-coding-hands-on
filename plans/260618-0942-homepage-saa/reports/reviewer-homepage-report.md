# Code Review — Homepage SAA (Full Integration)

**Reviewer:** reviewer agent  
**Date:** 2026-06-18  
**Branch:** feat/countdown-prelaunch-page  
**Files reviewed:** 35+ files across app/, i18n/, auth.ts, proxy.ts, messages/, types/

---

## Scope

| Category | Files |
|----------|-------|
| Auth | `auth.ts`, `proxy.ts`, `app/lib/auth/users.ts`, `app/lib/auth/actions.ts`, `app/admin/page.tsx`, `app/login/page.tsx` |
| i18n | `i18n/request.ts`, `i18n/routing.ts`, `app/components/i18n/locale-switch.ts`, `messages/vi.json`, `messages/en.json` |
| Header | `app/components/homepage/site-header.tsx`, `header-lang-menu.tsx`, `header-notif-bell.tsx`, `header-user-menu.tsx` |
| Notifications | `app/components/notifications/*`, `app/lib/notifications/store.ts`, `app/api/notifications/**` |
| Homepage | `app/components/homepage/*`, `app/lib/awards/award-href.ts`, `app/lib/countdown-config.ts` |
| Shell | `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next.config.ts`, `types/next-auth.d.ts` |

**Build:** TypeScript — clean (0 errors). Tests — 84/84 passed.  
**Linting (app files):** 3 rule violations (2 `no-html-link-for-pages`, 1 `react-hooks/set-state-in-effect`).

---

## Overall Assessment

Solid feature work with well-structured components, proper JWT role propagation, and full i18n message coverage. Tests pass clean. **One critical deployment-blocking defect** (admin middleware completely inactive), two high-severity issues (broken post-login redirect, `<a>` instead of `<Link>` causing full page reloads), and a cluster of medium issues. TypeScript is rigorous — no `any` escapes, declarations clean.

**Score: 5.5/10**  
**Verdict: CHANGES REQUESTED** (critical issue blocks secure deploy)

---

## Critical Issues

### C1 — `proxy.ts` is NOT loaded as Next.js middleware — admin route is unprotected

**File:** `proxy.ts`  
**Severity:** critical  

Next.js only recognises a middleware file named exactly `middleware.ts` (or `middleware.js`) at the project root (or inside `src/`). The admin guard is in `proxy.ts` — a file Next.js never loads.

**Impact:** `GET /admin` is completely open. No session check runs. Anyone who navigates to `/admin` will hit the page-level `auth()` guard in `app/admin/page.tsx`, but **only because that page also calls `auth()` directly**. The middleware guard is dead code.

While the page-level guard happens to catch this for the current `/admin/page.tsx`, any future route added under `/admin/` that omits its own server-side check will be unprotected. The defence-in-depth layer (middleware) is absent.

**Fix:** Rename `proxy.ts` → `middleware.ts` (Next.js convention). No logic changes needed.

```bash
mv proxy.ts middleware.ts
```

---

## High Priority

### H1 — Post-login redirect always goes to `/`, ignoring `callbackUrl`

**Files:** `proxy.ts:22,31`, `app/lib/auth/actions.ts:19`  
**Severity:** high (UX breakage)  

`proxy.ts` sets `?callbackUrl=<pathname>` before redirecting to `/login`, but `signInAction` hardcodes `redirectTo: "/"`. The `callbackUrl` query param is never read and never honoured.

**Impact:** After a user is redirected to login from `/admin`, successful auth always lands them on `/` instead of `/admin`. This is confusing and a functional regression vs. the middleware's stated intent.

**Fix:**

```ts
// app/login/page.tsx — pass callbackUrl into the form as a hidden field
// app/lib/auth/actions.ts — read it back
export async function signInAction(formData: FormData): Promise<void> {
  const callbackUrl = (formData.get("callbackUrl") as string | null) ?? "/";
  // Validate: must be a relative path to prevent open redirect
  const safePath = callbackUrl.startsWith("/") ? callbackUrl : "/";
  await signIn("credentials", { email, password, redirectTo: safePath });
}
```

### H2 — `<a href="/">` in header and footer causes full-page navigation (lint error)

**Files:** `app/components/homepage/site-header.tsx:34`, `app/components/homepage/site-footer.tsx:38`  
**Severity:** high (lint error + perf)  

Both use `<a href="/">` for the logo/home links. ESLint (`@next/next/no-html-link-for-pages`) correctly flags this. In Next.js App Router, bare `<a>` bypasses the client-side router — every logo click causes a full HTML reload, losing React state including the open session.

**Fix:** Replace with `<Link href="/" ...>` from `next/link`.

### H3 — Notification bell panel missing `menuProps` spread — Escape key broken

**File:** `app/components/homepage/header-notif-bell.tsx:49-58`  
**Severity:** high (a11y/functional)  

The `useDropdown` hook returns `menuProps = { role: "menu", onKeyDown: handleMenuKeyDown }`. The user menu and language menu both spread `{...menuProps}` on their container. The notification panel wrapper does NOT:

```tsx
// current — missing:
<div ref={menuRef as React.RefObject<HTMLDivElement>} style={{...}}>
  <NotificationPanel ... />
</div>

// should be:
<div ref={menuRef as React.RefObject<HTMLDivElement>} {...menuProps} style={{...}}>
```

**Impact:** (1) No `role="menu"` on the container → screen readers don't announce it as a menu. (2) Pressing Escape inside the notification panel does NOT call `close()` — users cannot keyboard-dismiss it.

---

## Medium Priority

### M1 — `/profile` route does not exist — authenticated users get 404

**File:** `app/components/homepage/header-user-menu.tsx:78`  
**Severity:** medium  

The "Profile" menu item links to `/profile` which has no corresponding route under `app/`. Every authenticated user who clicks "Profile" hits a 404. The plan acknowledges this as a stub but it should be flagged for prioritised creation before shipping, or the menu item should be disabled/omitted until the route exists.

### M2 — `callbackUrl` dead code in `proxy.ts` (pre-existing once renamed)

Related to H1. Once `proxy.ts` is renamed to `middleware.ts`, the `callbackUrl` param is still useless until H1 is also fixed. Track them together.

### M3 — `react-hooks/set-state-in-effect` lint violation in `use-notifications.ts:51`

**File:** `app/components/notifications/use-notifications.ts:51`  
**Severity:** medium (correctness risk)  

`void fetchNotifications()` calls `setState` synchronously inside the effect body. ESLint (react-hooks/set-state-in-effect) flags this as triggering cascading renders. The actual risk here is low because `fetchNotifications` is async and the `setState` calls happen inside awaited promises — but the linter cannot verify that, and the pattern can cause problems if the effect re-fires mid-fetch.

A clean fix: extract the fetch into a startup effect that doesn't depend on `fetchNotifications` being stable:

```ts
useEffect(() => {
  let cancelled = false;
  fetch("/api/notifications")
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (cancelled || !data) return;
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setLoading(false);
    });
  return () => { cancelled = true; };
}, []);
```

### M4 — `setRequestLocale` called without i18n routing active

**Files:** `app/admin/page.tsx:19`, `app/awards/page.tsx:7`, `app/kudos/page.tsx:7`  
**Severity:** medium (misleading)  

`setRequestLocale` is the next-intl API for locale propagation in the "with routing" mode (URL-based, with `[locale]` segment). In "without routing" mode (cookie-based, as implemented here), `request.ts` already resolves locale from the cookie — `setRequestLocale` is redundant and implies the wrong architecture. Per next-intl docs, in cookie mode you call `getLocale()` (which `layout.tsx` correctly does) and that's sufficient. These calls should be removed to avoid confusion.

### M5 — `i18n/routing.ts` exports `defineRouting` with `localePrefix: "as-needed"` — inconsistent with "without routing" intent

**File:** `i18n/routing.ts`  
**Severity:** medium  

`defineRouting` with `localePrefix: "as-needed"` is the configuration for URL-based locale routing (e.g., `/en/about`). The codebase uses cookie-only routing and has no `[locale]` segment. The `routing` export is only used in `locale-switch.ts` for the `routing.locales` array — that could be a plain constant instead. Having `defineRouting` here risks a future developer wiring up next-intl's `createNavigation` or the routing middleware and breaking the URL scheme.

**Fix:** Replace with a plain locale list constant:
```ts
export const LOCALES = ["vi", "en"] as const;
export type Locale = (typeof LOCALES)[number];
```

### M6 — No `id="about"` anchor on any homepage section

**Files:** `app/components/homepage/site-header.tsx:47`, all `homepage/*.tsx`  
**Severity:** medium  

The nav "About SAA 2025" link goes to `#about` and the design spec says "About → `#about`/scroll-top". No section on the page has `id="about"`. Clicking the link has no visible effect (browser tries to scroll to a non-existent anchor). Only `id="awards"` exists in `awards-section.tsx:50`.

**Fix:** Add `id="about"` to the `RootFurtherContent` section (or `HeroSection`), whichever the spec intends as the "About" scroll target.

### M7 — Fragile CSS attribute selector for responsive header padding

**File:** `app/globals.css:40,46`  
**Severity:** medium  

```css
header[style*="padding: 12px 144px"] { ... }
```

This relies on React serialising the inline style exactly as `padding: 12px 144px`. It will break silently if the padding value changes in `site-header.tsx` or if React's serialisation changes. Use a CSS class or a CSS custom property instead:

```tsx
// site-header.tsx
<header className="site-header" ...>
```
```css
/* globals.css */
.site-header { padding: 12px 144px; }
@media (max-width: 1024px) { .site-header { padding: 12px 24px; } }
```

### M8 — Notification panel `"Loading..."` and `"No notifications"` are hardcoded English strings

**File:** `app/components/notifications/notification-panel.tsx:109,126,138,140`  
**Severity:** medium  

The panel renders `"Loading…"`, `"No notifications"`, `"Notifications"`, `"Mark all as read"` as hardcoded strings. These are not i18n-aware. When locale is `vi`, these will appear in English.

---

## Low Priority

### L1 — `bcryptjs.hashSync` runs at module import time (startup latency)

**File:** `app/lib/auth/users.ts:29,36`  
**Severity:** low  

Two `hashSync(…, 10)` calls execute when `users.ts` is first imported. Cost factor 10 adds ~200–400ms to each cold start. Acceptable for a demo, but on serverless (each function instance cold starts) this is noticeable. Fix: store pre-computed hash strings as constants.

### L2 — `NEXT_PUBLIC_LAUNCH_DATE` module-level evaluation in client bundle

**File:** `app/components/homepage/hero-countdown-live.tsx:10`  
**Severity:** low  

`const HERO_TARGET = getLaunchDate()` runs at module load time in a `"use client"` file. `process.env.NEXT_PUBLIC_LAUNCH_DATE` is inlined at build time — correct behaviour. No runtime risk, but changing the env var requires a rebuild.

### L3 — `days` display silently truncates to 99 when ≥ 100

**File:** `app/components/homepage/hero-countdown.tsx:84`  
**Severity:** low (carried over from countdown plan — existing open bug C1)  

`Math.min(99, ...)` caps display at `99` but shows no indicator that the value was truncated. At 100+ days, the countdown will show `99` indefinitely. Flagged in memory as open bug C1.

### L4 — `FAB` `handleAction` doesn't call `close()` before navigation

**File:** `app/components/homepage/fab.tsx:36-38`  
**Severity:** low  

```ts
const handleAction = (href: string) => {
  router.push(href);  // close() never called
};
```

The FAB menu stays visually open after `router.push`. If navigation is client-side (same origin), the menu lingers briefly. Minor UX issue since navigation unmounts the component anyway, but calling `close()` first is the correct pattern.

### L5 — `HeroCountdownUnitDisplay` uses `alignItems: "flex-start"` (known bug H2)

**File:** `app/components/homepage/hero-countdown.tsx:96`  
**Severity:** low  

Tracked in memory as open bug H2 (flex-start misalignment). The digit-pair container and the outer countdown row both use `alignItems: "flex-start"`. Design shows vertical centering of units within the row. Not new in this PR.

### L6 — `callbackUrl` open-redirect potential (low — currently not exploitable)

**File:** `proxy.ts:22,31`  
**Severity:** low (theoretical — currently `callbackUrl` is never used)  

The middleware sets `callbackUrl=pathname` where `pathname` is always the current request path (server-side, not user-supplied). Not exploitable now. But if H1 is fixed (reading `callbackUrl` back in the login action), a relative-path check must be added to prevent an attacker crafting a URL like `/login?callbackUrl=%2F%2Fattacker.com%2F` (open redirect). Noted in H1 fix above.

---

## Edge Cases Found

1. **Serverless scale-out**: notification store is module-level in-memory. Two concurrent Lambda instances will have divergent state — user marks a notification read on instance A, instance B still shows it unread. Documented in `store.ts`, acceptable for demo, but must be replaced before production.

2. **Session hydration race**: `site-header.tsx` uses `status === "authenticated"` from `useSession`. During hydration, status is `"loading"` — the bell is not shown, and the user menu renders the guest state. This is correct and the standard Next.js pattern, but it means a brief flash of the guest menu for logged-in users on first render. No fix needed; documenting for awareness.

3. **`useNotifications` initial loading state**: the hook initialises `loading: true` synchronously. If an authenticated user immediately opens the notification panel before the first `fetchNotifications` completes, they see "Loading…". This is correct UX, but the hook fires only once on mount with no polling — stale data after the panel is closed and reopened is expected for a demo.

4. **`admin/page.tsx` calls `setRequestLocale` before the auth redirect guard**: `setRequestLocale` is called on line 19 after the auth checks on lines 10–16 have already called `redirect()`. The `setRequestLocale` call is therefore unreachable for unauthenticated users, but wasteful for admins. Related to M4.

---

## Positive Observations

- **TypeScript clean**: 0 tsc errors. `types/next-auth.d.ts` correctly augments `Session`, `User`, and `JWT`. No `any` casts.
- **Auth.js role flow**: JWT → session role propagation is correct and tested implicitly.
- **CSRF on login**: `signInAction` is a server action invoked via `<form action={...}>` — POST-only, no client-side fetch, meets the stated CSRF mitigation from `users.ts` comment.
- **Notification API auth**: both `GET /api/notifications` and `PATCH /api/notifications/[id]` gate on `session?.user?.email` before accessing the store. Cross-user access is structurally impossible (store keyed by email, each user only sees their own).
- **SSR-safe countdown**: `useCountdown` starts at `ZERO` on server and first client render, then syncs after mount. No hydration mismatch.
- **`useDropdown` a11y**: Enter/Space/Escape/click-outside all covered. Focus management (first item on open) correct. Properly reused across header menus.
- **i18n request.ts**: cookie locale lookup with validation against allowed list — no locale injection possible.
- **No secrets in git**: `.env.local` is in `.gitignore`, only `.env.example` with empty `AUTH_SECRET=` is committed.
- **All 84 tests pass.** Test isolation via `resetStore()` is correct.
- **File sizes**: all components are under 200 lines. Good composition.

---

## Recommended Actions (priority order)

1. **[Critical]** Rename `proxy.ts` → `middleware.ts` to activate the admin route guard.
2. **[High]** Fix post-login redirect: pass `callbackUrl` through the login form and honour it in `signInAction` (with relative-path validation).
3. **[High]** Replace `<a href="/">` with `<Link href="/">` in `site-header.tsx` and `site-footer.tsx`.
4. **[High]** Add `{...menuProps}` to the notification panel wrapper in `header-notif-bell.tsx`.
5. **[Medium]** Create `/profile` stub route or remove/disable the "Profile" menu item.
6. **[Medium]** Add `id="about"` to the hero or root-further section for the "About SAA" nav link.
7. **[Medium]** Add `i18n` strings for the notification panel ("Loading…", "No notifications", etc.).
8. **[Medium]** Remove `setRequestLocale` calls from `admin/page.tsx`, `awards/page.tsx`, `kudos/page.tsx`.
9. **[Medium]** Replace `defineRouting` in `i18n/routing.ts` with a plain locale constant.
10. **[Medium]** Replace fragile CSS attribute selector in `globals.css` with a CSS class.
11. **[Low]** Fix lint: `react-hooks/set-state-in-effect` in `use-notifications.ts`.
12. **[Low]** Call `close()` before `router.push` in FAB `handleAction`.

---

## Metrics

| Metric | Value |
|--------|-------|
| TypeScript errors | 0 |
| Test pass rate | 84/84 (100%) |
| App-file lint errors | 3 (2 `no-html-link-for-pages`, 1 `set-state-in-effect`) |
| Critical issues | 1 |
| High issues | 3 |
| Medium issues | 8 |
| Low issues | 6 |

---

## Unresolved Questions

- Should `/profile` be a stub page (like `/awards` and `/kudos`) or should the menu item be hidden until the page exists?
- Design spec says "About SAA" nav → `#about`/scroll-top: is the intent a dedicated section anchor or just scrolling to top of page?
- Is the `i18n/routing.ts` `defineRouting` export intentional for future URL-routing migration, or can it be simplified?
