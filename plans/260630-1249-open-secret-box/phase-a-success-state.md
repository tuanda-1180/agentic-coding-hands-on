# Phase A — Modal success-state rendering

**Track:** A (UI) · **Priority:** high · **Status:** completed
**Ref:** Open secret box J3-4YFIpMM · Clarifications: clarifications.md

## Goal
Extend the existing presentational `secret-box-modal.tsx` to render the success state (badge revealed) in addition to the unopened state. Still presentational — no fetch.

## Contract change
- Add prop `prize: { id; name; asset } | null` (the last badge won this session).
  - `prize === null` → unopened state: closed-box image, title "KHÁM PHÁ SECRET BOX CỦA BẠN", instruction shown when `unopenedCount > 0`.
  - `prize !== null` → success state: title "MỞ SECRET BOX THÀNH CÔNG", badge image + name shown in the box area; instruction "Click vào box để tiếp tục mở" when `unopenedCount > 0` (hidden at 0).
- Box button: click → `onOpenBox` when `unopenedCount > 0 && !opening`; disabled at 0. Works in both states (open next box from success state).
- Badge `<img>` uses fallback asset on error (TC: invalid/corrupt badge → fallback, no crash). Alt = badge name (no raw HTML — XSS-safe).
- Keep file < 200 lines (current 301 — split closed/success box area + counter into small subcomponents).

## i18n keys to add (namespace `secretBox`)
`successTitle`, `instructionContinue`, `badges.{stay_gold,flow_to_horizon,touch_of_light,beyond_the_boundary,revival,root_further}` — both vi.json & en.json.

## Success criteria
- Toggling `prize` switches title + box content faithfully; counter zero-pads ("05"); 0-count disables box & hides instruction in both states.
