# Phase B1 — Badge catalog + weighted random + open logic

**Track:** B (backend/logic) · **Priority:** high · **Status:** completed

## Goal
Pure, testable badge selection + the server-only "open one box" mutation against existing `secret_boxes`.

## Files
- Create `app/lib/secret-box/badges.ts`
  - `BADGES: Badge[]` where `Badge = { id, nameKey, weight, asset }`.
    - ids/weights: `stay_gold` 30, `flow_to_horizon` 25, `touch_of_light` 20, `beyond_the_boundary` 10, `revival` 10, `root_further` 5.
    - `asset`: placeholder path under `/saa/badges/<id>.png` (real PNGs dropped in later). Provide a single fallback `/saa/badges/_fallback.png`.
    - `nameKey`: i18n key under `secretBox.badges.<id>`.
  - `pickWeightedBadge(rand = Math.random): Badge` — weighted pick. Deterministic when a seeded `rand` is injected (enables distribution tests).
  - `getBadge(id): Badge | null` — lookup with fallback resolution for invalid/corrupt prize ids (TC: fallback image for invalid badge).
- Create `app/lib/secret-box/secret-box-write.ts` (`import "server-only"`)
  - `openSecretBox(): Promise<{ badge: Badge; unopenedRemaining: number }>`
    1. `currentIdentity()` → throw typed error if null (401 upstream).
    2. Select oldest unopened box for the user (`is_opened=false`, order by `created_at`, limit 1). If none → throw "NO_UNOPENED" (TC: click disabled / denied at 0).
    3. `pickWeightedBadge()`, update that row `is_opened=true, prize=badge.id`.
    4. Recount unopened for the user, return `{ badge, unopenedRemaining }`.
  - All DB via `getServiceClient()`. Count never trusts the client (TC security).

## Out of scope
- HTTP layer (B2), UI (A/INT).

## Success criteria
- `pickWeightedBadge` distribution within tolerance over N seeded draws.
- `openSecretBox` flips exactly one row, sets a valid prize id, decrements remaining; throws on no-box / no-auth.
