# Phase INT — Integration · entry points · feed render · i18n · temper

**Track A+B** · blockedBy: a1,a2,a3,b1,b2,b3 · Priority: High

## Goal
Nối Track A (modal + field + editor) với Track B (hook + API + data), hoàn thiện 3 trạng thái: tạo / lỗi / sửa.

## Requirements
1. **Wire form:** ráp `kudo-modal` (a1) + editor (a2) + field components (a3) vào `useKudoForm` (b3); recipient & @mention dùng `GET /api/sunners/search`; hashtag dùng getFilters; ảnh upload qua `POST /api/kudos/upload` rồi set URL.
2. **Create mode:** submit → `POST /api/kudos`; thành công → đóng modal + refresh feed (Kudo mới hiện ngay). Loading state nút Gửi.
3. **Error state (màn 2):** hiển thị viền đỏ + message từ errors của hook trên các field bắt buộc khi submit thiếu.
4. **Edit mode (màn 3):** `initFromKudo` pre-fill; submit → `PATCH /api/kudos/[id]`; entry = **icon bút chì** trên `kudos-post-card.tsx` (chỉ Kudo của chính mình — so sánh sender với currentUserId).
5. **Entry tạo mới:** mở modal từ FAB "Write KUDOS" (`app/components/homepage/fab.tsx`) + input banner liveboard (`liveboard-banner.tsx`). Quản lý open state ở parent phù hợp (vd. provider/route-level).
6. **Feed render đổi:** `kudos-post-card.tsx` hiển thị `title` (Danh hiệu) làm tiêu đề + render `content` HTML đã **sanitize** (chống XSS); Kudo ẩn danh → ẩn tên người gửi.
7. **i18n:** thêm namespace `writeKudos` (labels, placeholder, helper, validation messages, nút Hủy/Gửi, tiêu đề) vào `messages/en.json` + `messages/vi.json` (VN default).

## Files
- Modify: `app/components/liveboard/kudos-post-card.tsx`, `app/components/homepage/fab.tsx`, `app/components/liveboard/liveboard-banner.tsx`, `messages/en.json`, `messages/vi.json`
- Create: wrapper/provider mở modal nếu cần (`app/components/kudos/kudo-modal-provider.tsx`)

## Todo
- [ ] Wire modal + field + editor + hook; recipient/mention/hashtag/upload nối API
- [ ] Create flow → POST, refresh feed, loading
- [ ] Error state hiển thị viền đỏ + message
- [ ] Edit flow → PATCH, entry icon bút chì (own kudos), pre-fill
- [ ] Entry FAB + banner mở modal tạo mới
- [ ] Feed card render title + HTML sanitize + ẩn danh
- [ ] i18n writeKudos VI/EN
- [ ] `npm run build` xanh; `npm test` xanh (Node 22 qua nvm); review bằng `reviewer` agent

## Success (acceptance)
Tạo Kudo đầy đủ field → hiện trong feed với Danh hiệu + nội dung format; submit thiếu field → lỗi đúng màn 2; sửa Kudo của mình qua icon bút chì → cập nhật; sửa của người khác bị chặn (403); ảnh upload hiện thật; VI/EN đủ; build + test xanh.

## Security
Sanitize HTML khi render feed (XSS); ownership guard PATCH; auth cho mọi write; không lộ service_role.

## MoMorph refs:
- Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
- Lỗi validation: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/5c7PkAibyD
- Sửa bài viết: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/419VXmMy6I
- Clarifications: plans/260629-1712-viet-kudo-modal/clarifications.md
