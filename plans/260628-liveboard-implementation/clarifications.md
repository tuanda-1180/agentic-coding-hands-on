# Clarifications — Sun* Kudos Live board

MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ/items
Screen: Sun* Kudos - Live board (screenId: MaZUn5xHXZ, fileKey: 9ypp4enmFmdK3YAFJLIu6C)

## Session 2026-06-28

- Q: Phạm vi màn Live board (repo chưa có backend/DB Kudos) → A: UI + API mock layer — thêm route handler /api trả mock JSON, UI fetch API thật nhưng dữ liệu là mock, chuẩn bị sẵn để cắm DB sau
- Q: Mức độ Spotlight board (word cloud, pan/zoom, tooltip, click node) → A: Interactive đầy đủ — pan/zoom thật, hover tooltip (tên + thời gian), click node placeholder
- Q: Các màn/dialog liên kết ngoài design (gửi kudos, Mở quà/Secret Box, chi tiết kudos, profile) → A: Placeholder/no-op — nút bấm được nhưng chỉ placeholder, build ở task riêng
- Q: Ngôn ngữ hiển thị màn Live board → A: Song ngữ VI/EN — thêm namespace "liveboard" vào messages/vi.json và en.json, dùng useTranslations
- **DECISION CHANGE (mid-build):** Upgraded to Supabase local (Postgres) + seed data — UI + API mock layer → UI + Supabase backend. Track B implemented real DB schema, seed (48 sunners, 388 kudos, 6521 hearts), server client, data layer, 7 real endpoints. All integration complete.
