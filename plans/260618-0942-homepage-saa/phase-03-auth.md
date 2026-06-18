# Phase 03 — Authentication + roles (Track B)

**Track:** B (logic) · **blockedBy:** 02 · **Status:** ✓ completed (2026-06-18)

**Goal:** Real authentication with roles so the homepage adapts: guest (public) vs logged-in (bell + account menu) vs admin (+ "Admin Dashboard").

## Step 1 — Compatibility (RESOLVED — see research/researcher-compat-report.md)
- Install **`next-auth@beta`** (resolves 5.0.0-beta.31). Plain `next-auth` installs v4 — WRONG.
- Files: `auth.ts` (`NextAuth({ providers:[Credentials], session:{strategy:'jwt'}, callbacks })`), `app/api/auth/[...nextauth]/route.ts` (`export const { GET, POST } = handlers`), `types/next-auth.d.ts` (augment `Session`/`User`/`JWT` with `role`).
- Role claim: `jwt({token,user})` → `if(user) token.role=user.role`; `session({session,token})` → `session.user.role=token.role`.
- ⚠️ Middleware lives in **`proxy.ts`** (shared with next-intl) — compose: run intl middleware first; if it returns a redirect, return it; else run auth. Credentials provider lacks built-in CSRF — handle on the login form. Credentials + bcrypt = Node runtime (not Edge).

## Architecture (proposed — confirm)
- **Auth.js v5** Credentials provider; JWT session carrying `role: "regular" | "admin"`.
- **Mock user store**: seed users (one regular, one admin) in an in-memory/JSON data layer behind Route Handlers — NO database. Designed to swap for Postgres/Prisma later (single data-access module).
- Session accessible in Server Components via `auth()` and in Client via a session provider.
- Login page/route (`/login` or modal) + sign-out action.

## Behavior (from test cases)
- ID-0: public content loads for unauthenticated users.
- ID-1/11: authenticated → notification bell + account menu + personalized options.
- ID-5/37: admin account menu shows **Admin Dashboard**; ID-6/38: regular user does not.
- ID-36: account menu = Profile + Sign out (+ Admin Dashboard if admin).
- Admin Dashboard link → guarded `/admin` stub (role check; redirect/403 if not admin).

## Deliverables
- Auth config + session provider, login + signout, role-aware `useSession`/server helper, mock user data layer + API routes, admin route guard.

## Success criteria
Can log in as regular and admin seed users; session role drives header variants; admin guard blocks regular users; build clean; no secrets committed (.env for auth secret, gitignored).

## Out of scope
Real user database, registration, password reset, OAuth/SSO (future). Header UI rendering (Phase 07 wires it).
