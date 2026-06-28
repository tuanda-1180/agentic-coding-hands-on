# Plan — Dropdown-profile Redesign

MoMorph: Dropdown-profile — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/z4sCl3_Qtk
Clarifications: ./clarifications.md

## Goal
Restyle the existing account dropdown ([header-user-menu.tsx](../../app/components/homepage/header-user-menu.tsx))
to match the MoMorph "Dropdown-profile" design — dark rounded card, bold menu items with
trailing icons, hover/focus glow — while preserving guest/user/admin behavior and next-auth wiring.

## Design facts (from MoMorph)
- Dark rounded card (~16px radius, like lang-menu), padding around items.
- `Profile`: bold label left + user icon right; lit/glow background on hover/focus only; 119×56px.
- `Logout`: bold label left + right chevron `>`; highlight on hover.
- Font: Montserrat 700; white text.

## Approach
Reuse `useDropdown`, `signOutAction`, next-intl translations — only the presentation layer changes.
Match lang-menu's visual language (radius 16, item height 56, montserrat 700) for site consistency.
Items become flex space-between (label left, icon right) with a shared `MenuItem` sub-component
that owns the hover/focus glow state.

## Scope (confirmed)
- Restyle authenticated menu (Profile + Logout) to the design.
- Keep guest state (Sign in) and admin state (Admin Dashboard) — styled consistently.
- Profile glow = hover/focus only.

## Out of scope
- /profile page itself, auth logic, new routes, mobile-specific layout.

## Assets
- Reuse `/saa/icon-user.svg` (Profile). Create `/saa/chevron-right.svg` (thin stroke, for Logout) —
  existing `chevron-down.svg` is a filled triangle, wrong shape.

## Files
- Modify: app/components/homepage/header-user-menu.tsx
- Create: public/saa/chevron-right.svg
- Test: app/lib/__tests__/ (presentation/wiring assertions, mirroring lang-menu.test.ts)

## Stages
1. ✅ **Forge** — create chevron-right.svg + restyle header-user-menu.tsx
   - Chevron-right SVG created at `public/saa/chevron-right.svg`
   - Component restyled: dark rounded card, MenuItem with bold label + icon right, Profile glow on hover/focus, Logout with chevron
   - Guest/admin states preserved, styling consistent across all states
   
2. ✅ **Temper** — tester/debugger: build + tests pass
   - Full suite: 248/248 tests passing
   - Type check: `npx tsc --noEmit` clean
   - Linting: no errors
   - New test file `app/lib/__tests__/dropdown-profile.test.ts` added (36 assertions)
   - Coverage: wiring, semantics, asset integration, i18n parity verified
   
3. ✅ **Inspect** — reviewer
   - Review applied: nav items switched to `next/link <Link>` for proper navigation
   - Distinct `aria-labelledby` added to menu container for a11y
   - All wiring verified: useDropdown, useSession, signOutAction, i18n intact
   
4. ✅ **Deliver** — ready for merge
   - All tests passing, no regressions
   - Assets deployed, wiring unchanged
   - Ready to push to main

---

## Completion Summary

**Date completed:** 2026-06-28  
**Branch:** `feat/language-dropdown-redesign` (ready for merge to main)

### Deliverables Completed
- ✅ `app/components/homepage/header-user-menu.tsx` — Restyled per MoMorph design
- ✅ `public/saa/chevron-right.svg` — New asset created
- ✅ `app/lib/__tests__/dropdown-profile.test.ts` — Full test coverage (36 assertions)

### Quality Gates Passed
- ✅ 248/248 tests pass (no failures, no flakes)
- ✅ TypeScript: no errors
- ✅ Linting: clean
- ✅ Wiring: useDropdown, useSession, signOutAction, i18n all verified
- ✅ Accessibility: role, aria-label, aria-hidden correct
- ✅ No breaking changes to existing functionality

### Design Conformance
- ✅ Dark rounded card (16px radius)
- ✅ Profile: bold label + user icon right, glow on hover/focus only
- ✅ Logout: bold label + chevron-right, highlight on hover
- ✅ Guest state (Sign in) & Admin state (Admin Dashboard) styled consistently
- ✅ Font: Montserrat 700, white text
