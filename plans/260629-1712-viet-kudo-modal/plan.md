---
title: Viết Kudo Modal (tạo / lỗi validation / sửa)
status: completed
discipline: interactive (MoMorph two-track)
created: 2026-06-29
completed: 2026-06-29
blockedBy: []
blocks: []
buildsOn: [260628-liveboard-implementation]
---

# Plan — Viết Kudo Modal

**File MoMorph `9ypp4enmFmdK3YAFJLIu6C` ("SAA 2025 - Internal Live Coding"):**
- **Viết Kudo** — screenId `ihQ26W78P2` (26 specs, 57 test cases, có ảnh) → https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
- **Lỗi chưa điền đủ thông tin** — screenId `5c7PkAibyD` (design in_progress: KHÔNG specs/ảnh) → https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/5c7PkAibyD
- **Sửa bài viết - edit mode** — screenId `419VXmMy6I` (design in_progress: KHÔNG specs/ảnh) → https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/419VXmMy6I

**Insight cốt lõi:** 3 "màn" thực chất là **1 modal ở 3 trạng thái** — tạo mới (màn 1), lỗi validation (màn 2), chỉnh sửa pre-filled (màn 3). Đây là **đường ghi (write path)** còn thiếu của hệ Kudos: liveboard hiện chỉ có API read-only (+ like). Build trên backend Supabase thật đã có.

**Scope:** Modal Viết/Sửa Kudo (dùng `useDialog` đã có), rich-text editor Tiptap, autocomplete người nhận, hashtag picker, upload ảnh Supabase Storage, validation đầy đủ, tạo + sửa thật vào DB, hiển thị trong feed. VN default + EN. **Clarifications:** [clarifications.md](clarifications.md) (authoritative — không hỏi lại).

## Quyết định chính (xem clarifications)
Thêm cột `title` ("Danh hiệu") + `is_anonymous` vào `kudos` · Tiptap full (lưu HTML, feed render HTML) · upload ảnh thật lên Supabase Storage · modal dùng chung tạo+sửa, vào edit từ icon bút chì trên Kudo của mình.

## Tech stack (đã có — confirm tại forge)
Next.js 16 App Router · React 19 · Tailwind v4 + inline CSSProperties (theme `app/components/liveboard/theme.ts`) · TS · next-intl (VN default) · Supabase local Postgres + Storage · Tiptap (mới thêm).

## Execution model (MoMorph two-track — parallel-runnable, KHÔNG block giữa A và B)
**Track A (UI)** = component trình bày từ design (mock/design data). **Track B (logic)** = schema + data layer + API + form/validation. Integration nối 2 track ở cuối.

| # | Phase | Track | blockedBy | Status |
|---|-------|-------|-----------|--------|
| a1 | [Modal shell + form layout (màn 1)](phase-a1-modal-shell-ui.md) | A · UI | — | completed |
| a2 | [Rich-text editor Tiptap + toolbar + @mention](phase-a2-rich-text-editor-ui.md) | A · UI | — | completed |
| a3 | [Field components: recipient / hashtag / image / anonymous](phase-a3-field-components-ui.md) | A · UI | — | completed |
| b1 | [Migration schema + Supabase Storage bucket](phase-b1-schema-storage-migration.md) | B · logic | — | completed |
| b2 | [Data layer + API tạo/sửa + sunner search + upload](phase-b2-data-layer-and-apis.md) | B · logic | — | completed |
| b3 | [Hook form state + validation (màn 2)](phase-b3-form-state-validation-hook.md) | B · logic | — | completed |
| int | [Integration · entry points · feed render · i18n · temper](phase-int-integration.md) | A+B | a1,a2,a3,b1,b2,b3 | completed |

## Rủi ro chính
1. **Feed card phải đổi** — render `title` + content HTML (Tiptap) thay cho plain text; ảnh hưởng component liveboard đã hoàn thành (`kudos-post-card.tsx`). buildsOn liveboard (đã completed → không block).
2. **Tiptap + Next 16 RSC** — editor phải là client component (`"use client"`); kiểm tra SSR/hydration. Sanitize HTML khi render feed (chống XSS).
3. **Supabase Storage local** — cần khởi tạo bucket trong config/migration; xác thực upload qua server (service_role), không lộ key client.
4. **Conflict spec vs design** — "Danh hiệu" lấy theo design render (authoritative); màn 2/3 suy từ test cases + tên (không có specs).

## Out of scope
Thông báo real-time tới người nhận · phân quyền sửa của người khác (chỉ sửa Kudo của chính mình) · xoá Kudo · upload video · gợi ý hashtag bằng AI.

## Execution Summary

**Track A (UI):** Implemented 8 components in `app/components/kudos/` — kudo-modal (orchestrator), kudo-compose-modal (entry), kudo-editor (Tiptap + sanitized render), kudo-editor-toolbar (formatting), kudo-recipient-select (searchable autocomplete), kudo-title-input, kudo-hashtag-picker, kudo-image-upload. All wired with design-accurate mocks from MoMorph specs.

**Track B (Logic):** Schema migration (20260629120000, adds kudos.title + kudos.is_anonymous + storage bucket kudo-images); data layer in `app/lib/kudos/` — validation.ts, use-kudo-form.ts, upload-image.ts; APIs — POST /api/kudos, PATCH /api/kudos/[id], POST /api/kudos/upload; searchSunners in user-queries.ts; createKudo/updateKudo + ownership guard in `app/lib/liveboard/kudos-write.ts`; server-side HTML sanitization on write (isomorphic-dompurify).

**Integration:** kudos-post-card renders title + sanitized HTML, anonymizes sender on read, Edit pencil gated to isMine; feed/section threads track isMine + onEdit callback; compose modal mounted in liveboard-screen; FAB writeKudos → /kudos?compose=1 auto-open; useLiveboardData prependKudo/replaceKudo on form submit; full i18n (VI/EN) writeKudos namespace.

**Quality:** tsc clean, 450 vitest pass (validation + anonymity + isMine + image upload + recipient search), build green. Reviewer 4 critical issues resolved (anonymous masked server-side, upload magic-byte + 5MB limit, resolveUserId fallback gated to dev, server HTML sanitize). Deferred documented: Tiptap ref ESLint, setState-in-effect, aria-controls, large component splits, orphaned-image cleanup, unit tests.
