---
status: completed
blockedBy: []
blocks: []
reuses: [260618-0942-homepage-saa]
created: 2026-06-23
completed: 2026-06-23
---

# Plan — Award System Page (Hệ thống giải)

**Screen:** Hệ thống giải · [MoMorph](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD) (screenId `zFYDgyj_pD`, fileKey `9ypp4enmFmdK3YAFJLIu6C`)
**Decisions:** [clarifications.md](clarifications.md) · **Specs:** 22 items · **Test cases:** 15

The full **`/awards`** page (currently a stub). A read-only marketing page listing the 6 SAA 2025
award categories: keyvisual hero banner ("ROOT FURTHER" / "Hệ thống giải thưởng SAA 2025"), a
sticky **left scroll-spy nav** (6 categories, gold + underline active state), 6 **award info
sections** (image 336×336 + title + description + quantity + prize value), and a **Sun\* Kudos**
promo banner with a "Chi tiết" CTA → `/kudos`. VN default + EN. Public (no auth gating).

## Scope (confirmed)
Build the full `/awards` page replacing the stub. Reuse homepage award slugs
(`top-talent`…`mvp`) so existing homepage links (`/awards#slug`) and `awardHref` land on the
matching section anchors. Scroll-spy left nav (IntersectionObserver + smooth-scroll). Header
"Award Information" nav goes active on this route. Sun\* Kudos "Chi tiết" → `/kudos` (stub).
Award images reuse existing `award-bg.png` + `name-*.png` composite.

## Out of scope
Auth gating / login redirect (page stays public — TC ID-0/ID-1 N/A). Dedicated 336×336 per-award
renders (composite reuse). Sun\* Kudos page content (`/kudos` stays a stub). General Criteria /
Rules pages. Mobile-specific layout beyond what the design shows (responsive via existing patterns).

## Tech stack (existing — confirm at forge)
Next.js 16 App Router · React 19 · Tailwind v4 · TS · `next-intl` (VN default + EN). No DB —
award content is static data in i18n messages + a typed data module. Scroll-spy via
`IntersectionObserver` in a small client hook.

## Two-track structure (MoMorph — parallel-runnable; integration joins at the end)
**Track A (UI)** = phase 01 (presentational page from design, mock/design data).
**Track B (logic)** = phases 02 + 03 (independent). No `blocks`/`blockedBy` between A and B.

| # | Phase | Track | blockedBy | Status |
|---|-------|-------|-----------|--------|
| 01 | [Award page UI from design](phase-01-awards-ui.md) | A | — | ✓ completed |
| 02 | [Award content data + i18n (VN/EN)](phase-02-award-data-i18n.md) | B | — | ✓ completed |
| 03 | [Scroll-spy nav + anchors + header active](phase-03-scrollspy-nav.md) | B | — | ✓ completed |
| 04 | [Integration · temper · deliver](phase-04-integration.md) | A+B | 01,02,03 | ✓ completed |

## Key risks
1. **Anchor/slug alignment** — section `id`s on this page MUST match homepage slugs
   (`top-talent`, `top-project`, `top-project-leader`, `best-manager`, `signature-2025-creator`,
   `mvp`) or existing `/awards#slug` links break. Single source of truth in phase 02 data module.
2. **Sticky-nav scroll-spy offset** — sticky header height must offset `scroll-margin-top` and
   the IntersectionObserver rootMargin, or active state lags / sections hide under the header.
3. **i18n completeness** — full VN descriptions + quantities + prize values extracted from specs;
   EN must be authored for all 6 (existing EN descriptions are short summaries — extend, don't reuse blindly).

## Follow-ups (deferred)
1. **Footer link `/awards#criteria` (General Criteria):** Currently a dangling stub—belongs to a separate General Criteria feature. No `#criteria` section exists on the awards page by design.
2. **Homepage awards slug DRY:** `app/components/homepage/awards-section.tsx` hardcodes its own award slug array. Could adopt `app/lib/awards/award-data.ts` AWARD_SLUGS for consistency, deferred to next refactor.
3. **Category nav target icons:** Icons in category nav render as empty 24×24 placeholders (MM_MEDIA icons not in design assets)—blocks on design asset availability.
