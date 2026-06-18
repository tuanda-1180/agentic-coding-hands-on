# Phase 03 — Authentication + Roles · Report

**Date:** 2026-06-18
**Status:** DONE

---

## Files Created / Modified

| File | Action | Lines |
|------|--------|-------|
| `types/next-auth.d.ts` | Created | 18 |
| `app/lib/auth/users.ts` | Created | 63 |
| `app/lib/auth/actions.ts` | Created | 44 |
| `app/lib/__tests__/auth-users.test.ts` | Created | 73 |
| `auth.ts` | Created | 60 |
| `app/api/auth/[...nextauth]/route.ts` | Created | 4 |
| `app/login/page.tsx` | Created | 65 |
| `proxy.ts` | Modified | 62 |
| `app/layout.tsx` | Modified | 52 |
| `app/admin/page.tsx` | Modified | 34 |
| `.env.local` | Created | (gitignored) |
| `.env.example` | Modified | 11 |

---

## Packages Installed

- `next-auth@5.0.0-beta.31` (installed via `npm install next-auth@beta`)
- `bcryptjs@^2.4.3` + `@types/bcryptjs`

---

## Middleware Composition Pattern Used (`proxy.ts`)

intl-first, then auth check on protected routes:

```
1. If path is /api/auth/* → NextResponse.next() (bypass intl + auth)
2. Run intlMiddleware(request)
3. If intl returns 3xx redirect → return it immediately (locale negotiation)
4. If path is in PROTECTED_PATHS (/admin) → call auth() for session
   a. No session → redirect to /login?callbackUrl=...
   b. Path is in ADMIN_PATHS and role !== 'admin' → redirect to /login
5. Return intlResponse (passes through with intl headers set)
```

Key: `createIntlMiddleware(routing)` returns a callable function (not a singleton), so it can be embedded inside the custom `proxy` default export without losing functionality. The `auth()` call in middleware uses JWT — no DB hit, edge-compatible.

---

## Role Flow Through Session

1. Sign in → `authorize()` returns `{ id, email, name, role }` from mock store
2. Auth.js `jwt` callback: `token.role = user.role` (persisted into JWT cookie)
3. Auth.js `session` callback: `session.user.role = token.role` (exposed to app)
4. Server Components: `const session = await auth()` → `session.user.role`
5. Client Components: `const { data: session } = useSession()` → `session.user.role`
   - Requires `SessionProvider` wrapper (added to `app/layout.tsx`)

---

## Seed Credentials (Dev Demo Only)

| Role | Email | Password |
|------|-------|----------|
| regular | `user@sun.example` | `user1234` |
| admin | `admin@sun.example` | `admin1234` |

Passwords are bcrypt-hashed at module load time in `app/lib/auth/users.ts`. The mock store is behind `findUserByEmail` / `verifyCredentials` — swap this module for a Prisma query when a real DB is ready.

---

## Admin Guard

Implemented in two layers (defense-in-depth):
1. **Middleware (`proxy.ts`)**: redirects unauthenticated or non-admin requests to `/login` before the page renders
2. **Page (`app/admin/page.tsx`)**: `await auth()` server-side guard as a fallback — redirects to `/login` if role check fails

---

## Credentials Provider Caveat

Auth.js v5 Credentials provider has no built-in CSRF protection. The sign-in action (`app/lib/auth/actions.ts`) is a Next.js Server Action called from a `<form action={signInAction}>`, which is POST-only by the App Router's native behavior — this is sufficient CSRF mitigation for the current scope. Documented in `users.ts` and `actions.ts`.

---

## How the Header Should Read Session (for Phase 07)

**Server Component:**
```ts
import { auth } from "@/auth";
const session = await auth();
const role = session?.user?.role; // "regular" | "admin" | undefined
```

**Client Component:**
```ts
"use client";
import { useSession } from "next-auth/react";
const { data: session, status } = useSession();
const role = session?.user?.role;
const isLoggedIn = status === "authenticated";
```

The `SessionProvider` is already mounted in `app/layout.tsx`, so `useSession()` is available to any client component in the app without additional wrapping.

Sign-out from a client button:
```ts
import { signOutAction } from "@/app/lib/auth/actions";
<form action={signOutAction}><button type="submit">Sign out</button></form>
```

---

## TypeScript

One explicit cast added: `session.user.role = token.role as "regular" | "admin"` in the `session` callback. This is safe — the `jwt` callback only sets `token.role` from `user.role` which is already typed as the same union. The cast resolves an Auth.js v5 beta internal type variance.

---

## Build & Test Results

### TypeScript (`tsc --noEmit`)
```
(no output — clean)
```

### Vitest (`npm test`)
```
 Test Files  2 passed (2)
      Tests  62 passed (62)   (50 original + 12 new auth tests)
   Duration  426ms
```

### Production Build (`npm run build`)
```
Route (app)
┌ ƒ /
├ ƒ /_not-found
├ ƒ /admin
├ ƒ /api/auth/[...nextauth]
├ ƒ /awards
├ ƒ /countdown
├ ƒ /kudos
├ ƒ /login
└ ƒ /preview-homepage

ƒ Proxy (Middleware)
```
All routes present. No errors. Existing i18n routes intact.

---

## Deviations from Plan

None. All spec items implemented as described. The `proxy.ts` composition pattern follows the "intl first" recommendation from the compat research report. The two-layer admin guard (middleware + page) adds defense-in-depth beyond the minimum spec requirement.
