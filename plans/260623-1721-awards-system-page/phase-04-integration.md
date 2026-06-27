# Phase 04 — Integration · Temper · Deliver (Track A + B)

**Screen refs:** Hệ thống giải · [MoMorph](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD) (`zFYDgyj_pD`)
**Clarifications:** [clarifications.md](clarifications.md)
**blockedBy:** 01, 02, 03

## Overview
**Priority:** High · **Status:** ✓ completed
Join the presentational page (01) with the award data/i18n (02) and scroll-spy behavior (03).
Replace mock data with the real data module, wire the nav hook, mount the page at `/awards`,
verify deep-link anchors, then temper (lint + tests + visual validation).

## Requirements
- Replace `app/awards/page.tsx` stub with the real page: render hero banner, left nav (consuming
  `useScrollSpy`), 6 award sections from `award-data.ts` + i18n, Sun\* Kudos banner.
- Each section `id={slug}` + `scroll-margin-top`; nav `items` derive from the same data (slug parity).
- Sun\* Kudos "Chi tiết" → `/kudos`.
- Header "Award Information" active on `/awards`.
- Verify homepage `/awards#slug` links scroll to the right section (manual + ideally a test).
- VN/EN both render; VN is default.

## Related code files
- Modify: `app/awards/page.tsx` (stub → real), award section/nav components, `site-header.tsx`
- Read: phases 01–03 outputs, `app/components/homepage/awards-section.tsx`

## Implementation steps
1. Compose page: hero + sticky left nav + sections + Kudos banner.
2. Wire `useScrollSpy(slugs)` → nav `activeSlug` / `onSelect`; sections render data + i18n.
3. Point Kudos "Chi tiết" at `/kudos`; set header active for `/awards`.
4. Visual-validate against the design screen (MoMorph `get_frame_image`); fix gaps.
5. `npm run lint` + `npx tsc --noEmit`; run/extend tests (slug parity, award-href still green).

## Deliverables
- Real `/awards` page fully operational: hero + sticky left scroll-spy nav + 6 award sections + Kudos banner
- Nav wired to `useScrollSpy` hook; sections render award data + i18n (VN default, EN switchable)
- Kudos CTA points to `/kudos`; header "Award Information" nav active on `/awards` route
- Homepage `/awards#slug` deep links verified (scroll to correct section below header)
- All tests passing (142 passing); linting clean; type-check clean
- Responsive CSS fully implemented and tested

## Todo
- [x] Real page mounted at /awards (stub replaced)
- [x] Nav wired to useScrollSpy; sections from award-data
- [x] Kudos CTA → /kudos; header active on /awards
- [x] Homepage /awards#slug deep links verified
- [x] lint + tsc + tests green; visual validation vs design
- [x] Review fixes applied and validated

## Success criteria
`/awards` matches the design (hero, left scroll-spy nav, 6 award sections with quantity + prize,
Kudos banner). Deep links land correctly. VN/EN switch works. Lint, type-check, tests all pass.
Test cases ID-3..ID-12 satisfied (ID-0/ID-1 auth N/A per clarifications; ID-14 friendly error is
inherent to Next.js stub-route navigation).

## Risk
Slug drift between data module and homepage breaks existing deep links — assert parity. Sticky
offset regressions — re-check after final header height.
