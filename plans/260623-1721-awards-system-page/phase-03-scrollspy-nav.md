# Phase 03 — Scroll-spy Nav + Anchors + Header Active (Track B)

**Screen refs:** Hệ thống giải · [MoMorph](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD) (`zFYDgyj_pD`)
**Clarifications:** [clarifications.md](clarifications.md)

## Overview
**Priority:** High · **Status:** ✓ completed
Behavior for the left category nav: active item tracks scroll position (IntersectionObserver) AND
updates on click (smooth-scroll to the target section). Section anchors match homepage slugs so
deep links (`/awards#top-talent`) land correctly. Header "Award Information" nav item goes active
on `/awards`.

## Key insights
- Specs C / C.1–C.6: active item = gold color + underline; click → smooth scroll to D.x section.
- TC ID-9 (click scrolls + activates), ID-11 (active is exclusive — only one at a time),
  ID-10 (hover highlight), ID-13 (invalid section → no JS error).
- Sticky header exists (`site-header.tsx`) — sections need `scroll-margin-top` and the observer
  needs a matching `rootMargin` top offset so the active item flips at the right moment.
- `header-nav-link.tsx` already supports an `active` prop; currently `aboutSaa` is hardcoded active.

## Requirements
- Client hook `useScrollSpy(slugs: string[]): { activeSlug, scrollTo(slug) }` using a single
  IntersectionObserver over the section elements.
- `scrollTo` uses `scrollIntoView({ behavior: "smooth" })`; guards against unknown slug (no throw — TC ID-13).
- Active state is exclusive; default active = first section on load.
- Each award section renders `id={slug}` + `scroll-margin-top` = header height.
- Header: `/awards` route → "Award Information" link `active`. Keep it route-aware (e.g. `usePathname`).

## Related code files
- Create: `app/components/awards/use-scroll-spy.ts` (or `app/lib/...`)
- Modify: `app/components/homepage/site-header.tsx`, `app/components/homepage/header-nav-link.tsx`
  (route-aware active), award section + nav components (consume hook in phase 04)
- Read for context: `app/components/ui/use-dropdown.ts` (hook patterns)

## Implementation steps
1. Build `useScrollSpy` (observer setup/cleanup, rootMargin top offset = header height, exclusive active).
2. `scrollTo(slug)` smooth-scrolls; unknown slug is a no-op.
3. Make header nav active state route-aware via `usePathname()`.
4. Define section `scroll-margin-top` token shared with the observer offset.

## Deliverables
- `app/components/ui/use-scroll-spy.ts` — custom hook with IntersectionObserver, exclusive active state, scrollTo smooth-scroll with guard
- Modified `app/components/homepage/site-header.tsx` — route-aware active state for `/awards` route
- Integrated `scroll-margin-top` in award section components aligned with header height + observer rootMargin offset

## Todo
- [x] useScrollSpy hook (IntersectionObserver, exclusive active, cleanup)
- [x] scrollTo smooth-scroll + unknown-slug guard
- [x] route-aware header active state
- [x] scroll-margin-top / rootMargin offset aligned to header height

## Success criteria
Scrolling updates the active nav item exactly one-at-a-time; clicking smooth-scrolls to the
section; `/awards#slug` deep link lands below the header; no JS error on invalid section (ID-13).

## Risk
Offset mismatch between `scroll-margin-top` and observer `rootMargin` → active lags or sections
hide under header. Derive both from one header-height constant.
