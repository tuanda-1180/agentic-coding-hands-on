# Phase B2 — API routes

**Track:** B (backend/logic) · **Priority:** high · **Status:** completed

## Goal
HTTP surface over B1 logic, following the `app/api/kudos/route.ts` handler pattern (Next 16 async route handlers, `NextResponse.json`).

## Files
- Create `app/api/secret-boxes/open/route.ts`
  - `POST`: call `openSecretBox()`.
    - success → `NextResponse.json({ badge, unopenedRemaining }, { status: 200 })`
    - not logged in → 401 `{ error }`
    - no unopened boxes ("NO_UNOPENED") → 409 `{ error }`
    - other → 500 `{ error }`
- Create `app/api/secret-boxes/route.ts`
  - `GET`: return `{ unopenedRemaining }` for current user (reuse `getStats()` or a small query). 0 when no user.

## Out of scope
- Random/selection logic (B1), UI wiring (INT).

## Success criteria
- POST decrements server count and returns a valid badge; rejects unauthenticated (401) and zero-box (409).
- GET reflects real backend count (TC: secured data source — client cannot inflate).
