# Phase A1 — Modal shell + form layout (màn Viết Kudo)

**Track A · UI** · blockedBy: — · Priority: High

**Goal:** Build vỏ modal Viết/Sửa Kudo từ design màn 1 — nền kem, tiêu đề "Gửi lời cám ơn và ghi nhận đến đồng đội", khung chứa các field theo thứ tự (Người nhận, Danh hiệu, editor, Hashtag, Image, checkbox ẩn danh), footer 2 nút "Hủy" / "Gửi". Dùng `useDialog` (`app/components/ui/use-dialog.ts`) + theme `app/components/liveboard/theme.ts`. Presentational, mock data từ Figma.

**Files (dự kiến):** `app/components/kudos/kudo-modal.tsx`, `app/components/kudos/kudo-modal.styles.ts`

**Integration contract (cho phase-int):** nhận props `mode: "create"|"edit"`, `onSubmit`, `onCancel`, `loading`, `error`; slot cho các field component (a2/a3); nút Gửi nhận `disabled`.

**Out of scope:** logic submit/validate (b3/int), nội dung field con (a2/a3), wiring API.

## MoMorph refs:
- Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
- Clarifications: plans/260629-1712-viet-kudo-modal/clarifications.md
