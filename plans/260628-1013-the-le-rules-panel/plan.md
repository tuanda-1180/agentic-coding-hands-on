---
status: completed
completed: 2026-06-28
blockedBy: []
blocks: []
reuses: [260623-1657-fab-open-state-rework, 260618-0942-homepage-saa]
created: 2026-06-28
---

# Plan — Thể lệ Rules Panel

**Screens (MoMorph, fileKey `9ypp4enmFmdK3YAFJLIu6C`):**
- Content: [Thể lệ UPDATE](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/b1Filzi9i6) (`b1Filzi9i6`) · 4 specs — **new work**
- FAB closed: [Floating Action Button](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/_hphd32jN2) (`_hphd32jN2`) · already built
- FAB open: [Floating Action Button 2](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/Sv7DFwBw1h) (`Sv7DFwBw1h`) · already built

**Decisions:** [clarifications.md](clarifications.md) · **Test cases:** none in MoMorph (rely on specs + design images)

## Summary
The FAB "Thể lệ" action currently `router.push("/rules")` to a stub. The "Thể lệ UPDATE"
design is the **real content** — a dark **overlay panel anchored right**, sliding over the
homepage. Sections: title **Thể lệ**, **Người nhận Kudos** (4 Hero badge tiers: New / Rising /
Super / Legend, each with badge image + description), **Người gửi Kudos** (grid of 6 collectible
icons: Revival, Touch of Light, Stay Gold, Flow to Horizon, Beyond the Boundary, Root Further),
**Kudos Quốc Dân**, and a footer with **Đóng** + **Viết KUDOS** buttons. This plan builds that
panel, wires it to the FAB, and adds VI+EN copy. FAB closed/open visuals are unchanged.

## Scope (confirmed)
- New overlay panel component rendering the Thể lệ content from design (real badge + icon images).
- Re-wire FAB "Thể lệ" to **open the panel** instead of navigating; FAB closed/open look untouched.
- VI + EN i18n for all rules copy. Footer Viết KUDOS → close + `/kudos`; Đóng → close.
- a11y: Esc / click-outside / focus-return, internal scroll, responsive.

## Out of scope
Kudos compose form, awards page content, the `/rules` route page redesign (stays stub/redirect),
FAB animation polish beyond a simple slide/fade.

## Two-track structure (MoMorph — parallel-runnable; integration joins at the end)
**Track A (UI)** = phase 01 (panel UI from design, presentational, mock copy + real assets).
**Track B (logic)** = phase 02 (i18n VI+EN + panel open/close state + FAB rewire contract +
/rules redirect). No `blocks`/`blockedBy` between A and B.

| # | Phase | Track | blockedBy | Status |
|---|-------|-------|-----------|--------|
| 01 | [Thể lệ panel UI from design](phase-01-rules-panel-ui.md) | A | — | ✓ completed |
| 02 | [i18n · panel state · FAB rewire](phase-02-i18n-state-wiring.md) | B | — | ✓ completed |
| 03 | [Integration · a11y · verify](phase-03-integration.md) | A+B | 01,02 | ✓ completed |

## Cross-plan note
Builds on the **completed** [fab-open-state-rework](../260623-1657-fab-open-state-rework/plan.md):
that plan left `/rules` a stub and FAB "Thể lệ" pointing at it. This plan fills the content as an
overlay and changes only the trigger behaviour. Reuses `useDropdown` (a11y) and the i18n setup
from [homepage-saa](../260618-0942-homepage-saa/plan.md). No blocking dependency (both completed).

## Key risks
1. **FAB regression** — only the Thể lệ trigger changes (push → open panel); closed/open pill
   visuals and Viết KUDOS / cancel behaviour must not regress.
2. **Asset fidelity** — 4 Hero badges + 6 collectible icons must be exported from Figma, not
   invented; verify each renders crisp at design size.
3. **a11y on overlay** — moving to a modal-style panel needs Esc / click-outside / focus-trap /
   scroll-lock without breaking the existing FAB dropdown a11y.
4. **i18n EN copy** — long Vietnamese marketing copy needs faithful EN; keep keys structured.

## Outcome & Follow-ups (Completed 2026-06-28)

**Status: COMPLETE** — All 3 phases done; 307/307 tests pass; `npm run build` clean.

**What shipped:**
- Phase 01: `app/components/homepage/rules-panel.tsx` + sub-components `rules-hero-tier.tsx`, `rules-collectible-icon.tsx`; placeholder asset `public/saa/icon-close.svg`.
- Phase 02: `rules` i18n namespace (VI + EN) in messages/{vi,en}.json; FAB "Thể lệ" rewired to open panel (no navigation); `/rules` → permanentRedirect("/").
- Phase 03: `app/components/homepage/fab-with-rules.tsx` client wrapper; homepage-screen renders <FabWithRules/>; full a11y (Esc, backdrop, focus-trap, scroll-lock); internal scroll for content overflow.

**Real assets — RESOLVED (2026-06-28):** The MoMorph image-export APIs were down
(`get_figma_image` 500, `get_media_file`/`get_media_files` 401/null), so the 10 PNGs were
instead **cropped from the full-res frame render** (`get_frame_image` url, 1440×1796, 1:1) using
their absolute node bounds (`get_node`): 4 Hero pills 126×22, 6 collectible circles 64×64 (the
real circle size, white ring baked in). Saved to `public/saa/` (hero-{new,rising,super,legend}.png,
icon-{revival,touch-of-light,stay-gold,flow-to-horizon,beyond-the-boundary,root-further}.png).
Components now render the real artwork; CSS fallback retained behind `<Image onError>` as a safety net.

**Deferred follow-ups (documented, non-blocking):**
1. **Retina assets** — crops are 1× (frame render is 1×). If a higher-DPI source becomes available,
   re-export at 2× for sharper icons. Current 1× matches the design display size.
2. **SR isolation** — background scroll-lock implemented; consider adding inert + aria-hidden on
   background (low priority, review #5).

**Reviewer fixes applied:** hooks-order comment, focus-restore isConnected guard, SSR typeof-document guards, backdrop onClick for mobile, type="button" on footer buttons.

## Execute
`/tkm:takumi plans/260628-1013-the-le-rules-panel/plan.md --parallel`
