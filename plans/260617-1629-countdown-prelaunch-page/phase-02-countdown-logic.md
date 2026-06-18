# Phase 02 — Countdown logic + config (Track B)

**Status:** ✓ COMPLETED

**Goal:** Compute remaining days/hours/minutes to a target datetime, ticking each second, clamped per spec.

**Owns:** `app/lib/countdown-config.ts`, `app/lib/use-countdown.ts`.

**Behavior (from specs + test cases):**
- Target from `NEXT_PUBLIC_LAUNCH_DATE` (ISO 8601); sensible fallback if unset/invalid.
- Remaining → `{ days, hours, minutes }`. Days = floor(total/86400); Hours 0–23; Minutes 0–59.
- Clamp: negative/invalid → 0. Days clamped [0,99] per C1 review feedback. Completion (≤0) → all 0 (freeze, no redirect).
- Two-digit zero-pad happens in the presentational layer (Track A).
- Internal tick: 1s (so minute rollover is timely) even though seconds aren't displayed.
- SSR-safe: avoid hydration mismatch (compute on client after mount).

**Completed artifacts:**
- `app/lib/countdown-config.ts`: env-driven NEXT_PUBLIC_LAUNCH_DATE + DEFAULT_LAUNCH_DATE fallback
- `app/lib/use-countdown.ts`: pure `computeCountdown(targetDate)` + `useCountdown()` hook with 1s interval
- `.env.example`: template for launch date config
- `app/lib/__tests__/countdown.test.ts`: 39 unit tests (all pass)

**Out of scope:** rendering, styling.

See [plan.md](plan.md).
