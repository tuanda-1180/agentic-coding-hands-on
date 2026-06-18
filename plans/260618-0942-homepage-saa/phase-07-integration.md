# Phase 07 — Integration · temper · deliver

**Track:** A+B · **blockedBy:** 01, 04, 05, 06 (transitively 02, 03) · **Status:** ✓ completed (2026-06-18)

**Goal:** Wire the Track A presentational homepage to the Track B systems, verify against test cases, deliver.

## Integration
1. Mount Homepage SAA at `/` (replace current countdown home); confirm `/countdown` still serves the standalone prelaunch page.
2. Header: feed `authState` (guest/user/admin) from Auth.js session; render notification bell + panel (Phase 05), account menu (Phase 03), language switcher (Phase 02). Active nav state for "About SAA 2025".
3. Hero: drop in the reused countdown (Phase 04), `showComingSoon = !isComplete`.
4. Awards grid: feed 6-category data + hash-nav handlers (Phase 06).
5. FAB: wire quick-action menu (Phase 06). Footer + CTA nav links (Phase 02).
6. i18n: replace hardcoded strings with catalog keys; verify VN↔EN.
7. Responsive: awards grid 3/2/1 (ID-15/16); sections stack on small screens.

## Temper (MUST spawn `tester`/`debugger`)
- Reuse + extend countdown tests; add tests for auth role gating, i18n switch, notifications unread/mark-read, dropdown a11y. Run full suite (Node 22 via nvm). Build clean.

## Inspect (MUST spawn `reviewer`)
- Design fidelity vs MoMorph, auth correctness/security, no broken links (ID-59), a11y (keyboard menus).

## Deliver (MUST spawn all three)
- `project-manager` (reconcile plan/phases) · `doc-writer` (README/docs + env vars: NEXT_PUBLIC_LAUNCH_DATE, auth secret) · `git-manager` (commit/push after approval). Then `/tkm:write-journal`.

## Success criteria
Homepage at `/` matches design across auth states + locales; countdown + notifications + FAB + nav all functional per the 62 test cases (those in-scope); standalone `/countdown` intact; tests green; build clean.
