# Phase A3 — Field components (recipient / danh hiệu / hashtag / image / anonymous)

**Track A · UI** · blockedBy: — · Priority: High

**Goal:** Các field con của modal theo design màn 1 (presentational, mock từ Figma):
- **Recipient select** — input "Tìm kiếm" + dropdown arrow, autocomplete list Sunner (label "Người nhận *").
- **Danh hiệu** — text input "Dành tặng một danh hiệu cho đồng đội" + helper ví dụ ("Danh hiệu *").
- **Hashtag picker** — label "Hashtag *", nút "+ Hashtag" (note "Tối đa 5"), chips có nút xoá.
- **Image upload** — label "Image", thumbnail row + nút "x" mỗi ảnh, nút "+ Image" (note "Tối đa 5", ẩn khi đủ 5).
- **Anonymous** — checkbox "Gửi lời cám ơn và ghi nhận ẩn danh".

**Files (dự kiến):** `app/components/kudos/kudo-recipient-select.tsx`, `kudo-title-input.tsx`, `kudo-hashtag-picker.tsx`, `kudo-image-upload.tsx`, `kudo-anonymous-toggle.tsx`

**Integration contract:** mỗi field controlled (`value`/`onChange`/`error`); recipient & hashtag nhận source list từ b2; image upload nhận callback `onUpload(files)` (thực thi upload ở b2/int).

**Out of scope:** gọi API search/upload thật (b2), validation rules (b3).

## MoMorph refs:
- Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
- Clarifications: plans/260629-1712-viet-kudo-modal/clarifications.md
