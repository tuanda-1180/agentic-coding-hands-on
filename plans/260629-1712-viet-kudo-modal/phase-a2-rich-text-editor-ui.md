# Phase A2 — Rich-text editor (Tiptap) + toolbar + @mention

**Track A · UI** · blockedBy: — · Priority: High

**Goal:** Component editor nội dung lời cảm ơn theo design: toolbar 6 nút (Bold, Italic, Strikethrough, Number list, Link, Quote) + link "Tiêu chuẩn cộng đồng", vùng soạn thảo placeholder "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!", helper "Bạn có thể '@ + tên' để nhắc tới đồng nghiệp khác". Tiptap StarterKit + Link + Mention. Client component (`"use client"`). Mock danh sách @mention từ design.

**Files (dự kiến):** `app/components/kudos/kudo-editor.tsx`, `app/components/kudos/kudo-editor-toolbar.tsx`

**Integration contract (cho phase-int):** controlled — props `value: string (HTML)`, `onChange(html)`, `mentionSource` (đẩy từ b2 sunner search), `error?`; expose nội dung dạng HTML đã sanitize.

**Out of scope:** nguồn dữ liệu mention thật (b2), lưu DB, render HTML trong feed (int).

## MoMorph refs:
- Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
- Clarifications: plans/260629-1712-viet-kudo-modal/clarifications.md
