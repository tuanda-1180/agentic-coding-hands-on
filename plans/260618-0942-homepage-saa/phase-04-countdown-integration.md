# Phase 04 — Countdown integration (reuse) (Track B)

**Track:** B (logic) · **blockedBy:** 02 · **Status:** ✓ completed (2026-06-18)

**Goal:** Reuse the existing countdown for the hero — NOT a rewrite. Configure it to the homepage spec.

## Reuse (from completed countdown-prelaunch plan)
- `app/lib/use-countdown.ts` (`computeCountdown` + `useCountdown`), `app/lib/countdown-config.ts`,
  `app/components/countdown/{led-digit,countdown-unit,countdown-display}.tsx`.

## Required changes (DRY — extend, don't duplicate)
- **Configurable units:** `CountdownDisplay` must support showing DAYS/HOURS/MINUTES only
  (homepage hero, per spec B1.3 — *no seconds*) while `/countdown` keeps the 4-unit (seconds) variant.
  Add a `units`/`showSeconds` prop rather than forking the component.
- **"Coming soon" toggle:** hero subtitle visible while counting; **hidden when countdown completes**
  (target reached → all 00). Expose a `complete`/`isComplete` flag from `useCountdown` (e.g. derived
  `days+hours+minutes+seconds === 0 && now >= target`) so the hero can hide "Coming soon" (ID-41/42/43).
- **Env target:** hero uses `NEXT_PUBLIC_LAUNCH_DATE` (ISO-8601). Invalid → fallback without crash (ID-56/57/60).
  Note: homepage hero should NOT use the 7s relative demo default — confirm a real event datetime is set.

## Behavior (test cases)
- ID-12: 3 units, 2-digit. ID-39: minute auto-update. ID-40: leading zero. ID-41: zero → 00 00 00 + hide "Coming soon".

## Success criteria
Hero shows D/H/M from env target; `/countdown` unaffected (still has seconds); "Coming soon" hides at zero; existing 46→ countdown unit tests still pass + new tests for `isComplete` and unit-config.

## Out of scope
Hero visual layout (Track A). Re-implementing countdown math (already done + tested).
