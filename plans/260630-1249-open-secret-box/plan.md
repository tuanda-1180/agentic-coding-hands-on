# Plan — Open Secret Box

**Screen:** Open secret box (J3-4YFIpMM) · file 9ypp4enmFmdK3YAFJLIu6C · "SAA 2025 - Internal Live Coding"
**Discipline:** interactive (Takumi) · MoMorph two-track
**Goal:** Một modal Secret Box 2 trạng thái (chưa mở → click → hiện huy hiệu ngẫu nhiên), mở từ menu FAB, logic random + giảm count xử lý server-side trên bảng `secret_boxes` có sẵn.

## Decisions (clarifications.md)
- Full flow, server-side random, FAB entry, badge assets = placeholder + name mapping.
- Unopened title = "KHÁM PHÁ SECRET BOX CỦA BẠN" (design); success title = "MỞ SECRET BOX THÀNH CÔNG" (spec).

## Badge probabilities (server-side, must sum 100%)
Stay Gold 30 · Flow to Horizon 25 · Touch of Light 20 · Beyond the Boundary 10 · Revival 10 · Root Further 5

## Phases
| # | Phase | Track | Status |
|---|-------|-------|--------|
| B1 | [Badge catalog + weighted random + open logic](phase-b1-badge-logic.md) | B (logic) | completed |
| B2 | [API: POST open + GET count](phase-b2-api.md) | B (logic) | completed |
| A  | [Modal success-state rendering](phase-a-success-state.md) | A (UI) | completed |
| INT | [Provider + FAB action + layout wiring](phase-int-wiring.md) | integration | completed |

Track A unopened-state UI (`secret-box-modal.tsx` + `public/saa/secret-box-closed.png` + i18n) already built by background agent.
Tests (distribution, validation, open guard) + review run in Takumi Stage 4–5.

## Key files
- New: `app/lib/secret-box/badges.ts`, `secret-box-write.ts`; `app/api/secret-boxes/open/route.ts`, `app/api/secret-boxes/route.ts`; `app/components/secret-box/secret-box-provider.tsx`
- Edit: `app/components/secret-box/secret-box-modal.tsx`, `app/components/homepage/fab.tsx`, `fab-with-rules.tsx`, `app/layout.tsx`, `messages/{vi,en}.json`
- Reuse: `getServiceClient()`, `currentIdentity()` (user-queries.ts), `use-dialog.ts`
