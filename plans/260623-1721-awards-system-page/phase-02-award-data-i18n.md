# Phase 02 — Award Content Data + i18n (Track B)

**Screen refs:** Hệ thống giải · [MoMorph](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD) (`zFYDgyj_pD`)
**Clarifications:** [clarifications.md](clarifications.md)

## Overview
**Priority:** High · **Status:** ✓ completed
Single source of truth for the 6 award categories: slug (anchor), title, full description, quantity
label/value, prize value lines, and image. Plus VN (default) + EN i18n content. This data drives
both the award sections and the left nav, and the slugs MUST match the homepage's existing slugs.

## Key insights
- Existing `app/components/homepage/awards-section.tsx` hardcodes the 6 awards with slugs
  `top-talent`, `top-project`, `top-project-leader`, `best-manager`, `signature-2025-creator`, `mvp`.
  **Reuse these exact slugs** — homepage links `/awards#slug` and `awardHref()` depend on them.
- Existing `messages/{en,vi}.json` `awards.*` keys hold short titles/descriptions. The full-page
  descriptions + quantity + prize values are NEW; extend the i18n namespace (do not break homepage keys).
- Prize/quantity content from specs (VN authoritative):

| slug | quantity | prize |
|------|----------|-------|
| top-talent | 10 Đơn vị | 7.000.000 VNĐ / mỗi giải |
| top-project | 02 Tập thể | 15.000.000 VNĐ / mỗi giải |
| top-project-leader | 03 Cá nhân | 7.000.000 VNĐ |
| best-manager | 01 Cá nhân | 10.000.000 VNĐ |
| signature-2025-creator | 01 | 5.000.000 VNĐ (cá nhân) + 8.000.000 VNĐ (tập thể) |
| mvp | 01 | 15.000.000 VNĐ |

## Requirements
- Typed data module (e.g. `app/lib/awards/award-data.ts`) exporting an ordered array of award
  entries: `{ slug, titleKey, descKey, quantityKey, quantityValue, prizeKeys/prizeValues, nameImage }`.
- Quantity + prize **values** are language-neutral numerics/units rendered with i18n labels
  ("Số lượng giải thưởng" / "Award quantity", "Giá trị giải thưởng" / "Prize value").
- EN translations authored for all 6 full descriptions (extend, don't reuse the short homepage ones).
- Signature 2025 prize has **two lines** (individual + collective) — data shape supports `prizeLines: string[]`.

## Related code files
- Create: `app/lib/awards/award-data.ts`
- Modify: `messages/vi.json`, `messages/en.json` (add `awardsPage.*` namespace; keep existing `awards.*`)
- Read for context: `app/components/homepage/awards-section.tsx`, `app/lib/awards/award-href.ts`

## Implementation steps
1. Define the typed award entry interface + ordered array with the 6 slugs above.
2. Add `awardsPage` i18n namespace (VN from specs verbatim; EN authored) — titles, full
   descriptions, quantity labels, prize labels, section/hero/banner copy, nav labels.
3. Add the Sun\* Kudos banner copy keys ("Phong trào ghi nhận" / "Sun\* Kudos" / summary / "Chi tiết").
4. Verify slugs exactly equal homepage slugs (write a tiny assertion test if cheap).

## Deliverables
- `app/lib/awards/award-data.ts` — typed award interface + 6 entries with slug↔key↔image↔imageOnRight; exported AWARD_SLUGS
- `messages/vi.json` — `awardsPage.*` namespace with VN titles, descriptions, quantity labels, prize labels
- `messages/en.json` — `awardsPage.*` namespace with EN translations (authored, not reused from homepage)
- Test coverage: `app/lib/__tests__/awards-data.test.ts` (58 tests — slug parity, awardHref round-trip, i18n completeness)

## Todo
- [x] award-data.ts typed module with 6 entries
- [x] VN + EN i18n keys (descriptions, quantity, prize, hero, banner, nav)
- [x] Slug parity with homepage confirmed (tested in awards-data.test.ts)

## Success criteria
Data module + i18n cover all 6 awards with full description, quantity, prize line(s); slugs match
homepage; `npx tsc --noEmit` clean. VN renders specs content verbatim.

## Risk
EN copy gap — author all 6; do not silently fall back to short homepage descriptions.
