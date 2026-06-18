# Plan — Countdown Prelaunch Page

**Screen:** Countdown - Prelaunch page · [MoMorph](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU)
**Decisions:** [clarifications.md](clarifications.md)

A full-viewport prelaunch countdown landing page (home `/`). Counts down to a launch
datetime from `NEXT_PUBLIC_LAUNCH_DATE`. Shows DAYS / HOURS / MINUTES as LED 7-segment
digit pairs over decorative artwork. Freezes at `00 00 00` on completion. Fully public.

## Two-Track Execution (MoMorph)
- **Track A (UI, delegated to `implementer`):** presentational components from authoritative
  Figma data + page/layout/font wiring with mock values. Files: `app/layout.tsx`,
  `app/globals.css`, `app/page.tsx`, `app/components/countdown/*`, `app/fonts/*`, `public/*`.
- **Track B (logic, main thread):** launch-date config + `useCountdown` tick hook. Files: `app/lib/*`.
- **Integration:** wire `useCountdown` into the page, replacing mock values. Main thread, after Track A.

Tracks are independent (no `blocks`/`blockedBy`); integration is the only join point.

## Phases
| # | Phase | Track | Status |
|---|-------|-------|--------|
| 01 | [UI from design](phase-01-ui-from-design.md) | A | ✓ COMPLETED |
| 02 | [Countdown logic + config](phase-02-countdown-logic.md) | B | ✓ COMPLETED |
| 03 | [Integration + temper + deliver](phase-03-integration.md) | A+B | ✓ COMPLETED |

## Completion Summary
All phases delivered 2026-06-17. Track A (UI) + Track B (logic) executed in parallel per plan; integration + testing completed. All 39 unit tests pass. Build clean. Review feedback (C1, M2, M3) resolved; H2 intentional. Ready for deployment.

## Authoritative design values
- Frame 1512×1077, bg `#00101A`; overlay `linear-gradient(18deg,#00101A 15.48%,rgba(0,18,29,.46) 52.13%,rgba(0,19,32,0) 63.41%)`
- Background asset: `public/countdown-bg.png` (cover, no-repeat)
- Title: Montserrat 700, 36px/48px, white, centered — "Sự kiện sẽ bắt đầu sau"
- Block: column gap 24 (title→row); row gap 60 (units); unit gap 21 (digits→label); digit-pair gap 21
- Digit box: 76.8×122.88, radius 12, border .75px `#FFEA9E`, bg `linear-gradient(180deg,#FFF,rgba(255,255,255,.1))`, opacity .5, backdrop-blur 24.96
- Digit glyph: DSEG7-Classic (LED), white, ~73.7px; Labels: Montserrat 700 36px white uppercase
- Mock values from design: 00 / 05 / 20
