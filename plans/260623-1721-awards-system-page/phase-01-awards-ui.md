# Phase 01 — Award Page UI from Design (Track A)

**Status:** ✓ completed

**Screen:** Hệ thống giải · [MoMorph](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD) (`zFYDgyj_pD`) · fileKey `9ypp4enmFmdK3YAFJLIu6C`
**Clarifications:** [clarifications.md](clarifications.md)

**Goal:** Code the presentational `/awards` page UI pixel-faithful to the design — keyvisual hero
banner, sticky left category nav (6 items), 6 award info sections (image + title + description +
quantity + prize value), Sun\* Kudos promo banner with "Chi tiết" CTA. Use design content as mock
data; wire to real data/behavior in phase 04.

**Run via `momorph-implement-design` skill.** Reuse homepage patterns: dark `#00101A` bg, Montserrat,
gold `#FFEA9E` headings, `award-bg.png` + `name-*.png` composite for the 336×336 award images,
existing `site-header` / `site-footer` / `fab`.

**Out of scope:** scroll-spy behavior, IntersectionObserver, i18n wiring, real data, anchor IDs,
Sun\* Kudos page (stays stub) — all handled in Track B / integration.

**Integration contract (props the page/components expose):**
- Award section component takes: `{ slug, title, description, quantityLabel, quantityValue, prizeLines[], nameImage }`.
- Left nav takes: `items: { slug, label }[]` + accepts an `activeSlug` and `onSelect(slug)` (behavior injected in phase 03/04).
- Kudos banner "Chi tiết" exposes an `href` prop (defaults `/kudos`).

## Deliverables
- `app/awards/page.tsx` — full page with hero banner, sticky left nav, 6 award info sections, Kudos banner
- `app/components/awards/awards-hero.tsx` — keyvisual banner ("ROOT FURTHER" / "Hệ thống giải...")
- `app/components/awards/awards-category-nav.tsx` — left sticky nav (6 items, design mock data)
- `app/components/awards/award-info-section.tsx` — individual award section (image + title + description + quantity + prize)
- `app/components/awards/awards-section-title.tsx` — section heading
- `app/components/awards/awards-kudos-banner.tsx` — Sun* Kudos promo CTA
- `app/globals.css` — responsive CSS (award-info-row, award-info-picture, awards-section-title classNames wired)

## Todo
- [x] Hero banner coded
- [x] Left nav (6 categories) coded
- [x] Award info sections (image + quantity + prize) coded
- [x] Kudos banner coded
- [x] Responsive CSS wired to components
- [x] Review fixes applied (contrast, aria-current, btn type, classNames)
