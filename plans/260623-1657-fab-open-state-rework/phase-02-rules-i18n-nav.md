# Phase 02 — /rules stub · i18n · nav wiring (Track B · logic)

**Track:** B · **blockedBy:** — · **Status:** ✓ completed (2026-06-23)

**Goal:** Add the `/rules` stub route, fix the Thể lệ target, and align i18n copy.

## Context
- Spec items (screen `Sv7DFwBw1h`): A = Button Thể lệ, B = Button Viết KUDOS, C = Button Hủy (cancel).
- Current wiring (to fix): `saaRules → /awards` is semantically wrong; `writeKudos → /kudos` is correct.
- Existing stub pattern: [app/awards/page.tsx](../../app/awards/page.tsx), [app/kudos/page.tsx](../../app/kudos/page.tsx).
- i18n messages: [messages/vi.json](../../messages/vi.json), [messages/en.json](../../messages/en.json).

## Steps
1. **Create `/rules` stub** — `app/rules/page.tsx`, mirroring the awards/kudos stub
   (centered title, `#00101A` bg). Add `nav.rules` key: VN "Thể lệ" / EN "Rules".
2. **i18n copy** — keep `fab.writeKudos`; add/adjust `fab` label for rules so the pill reads
   **"Thể lệ"** (VN) / **"Rules"** (EN) per design (current `saaRules` = "Thể lệ SAA"). Add
   `fab.cancel` aria-label (VN "Đóng" / EN "Close").
3. **Nav targets** — define the action list: Viết KUDOS → `/kudos`, Thể lệ → `/rules`.
   Cancel → close panel (no navigation).

## Out of scope
Rules/awards/kudos page real content. FAB visual layout (Track A).

## Success criteria
`/rules` renders a stub; Thể lệ resolves to `/rules`; `fab.cancel` + `nav.rules` exist in both
locales; build clean.
