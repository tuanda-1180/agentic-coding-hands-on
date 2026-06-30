# Phase B1 — Migration schema + Supabase Storage bucket

**Track B · logic** · blockedBy: — · Priority: High

## Context
- Schema hiện tại: `supabase/migrations/20260628113200_liveboard_schema.sql` — bảng `kudos(id, sender_id, receiver_id, content, category, tags[], images[], created_at)`.
- Thiếu: cột `title` ("Danh hiệu", bắt buộc), `is_anonymous`. Chưa có Storage bucket cho ảnh.

## Requirements
1. **Migration mới** `supabase/migrations/<ts>_kudo_write_fields.sql`:
   - `alter table public.kudos add column title text;` (nullable ở DB để tương thích seed cũ; **bắt buộc ở tầng API/form** — xem b3). Backfill seed nếu cần (vd. set title từ category) — optional.
   - `alter table public.kudos add column is_anonymous boolean not null default false;`
2. **Storage bucket** `kudo-images`:
   - Tạo bucket (public read) qua migration SQL (`storage.create_bucket`/insert vào `storage.buckets`) hoặc script seed; cho phép upload từ server (service_role).
   - Giới hạn: chỉ image mime (jpg/png/webp), ≤ 5 ảnh/kudo (enforce ở API), size limit hợp lý.
3. **Types/mappers**: cập nhật `app/lib/liveboard/types.ts` (`KudosRow`, `KudosPost` thêm `title`, `isAnonymous`) + `mappers.ts` (map 2 field mới; khi anonymous → ẩn sender name ở mapper hoặc giữ flag để UI xử lý).

## Files
- Create: `supabase/migrations/<ts>_kudo_write_fields.sql`
- Modify: `app/lib/liveboard/types.ts`, `app/lib/liveboard/mappers.ts`, (nếu cần) `supabase/seed.sql`

## Todo
- [ ] Viết migration add `title`, `is_anonymous`
- [ ] Tạo bucket `kudo-images` (public read, server write)
- [ ] Cập nhật types + mappers (title, isAnonymous, ẩn danh)
- [ ] `supabase db reset` chạy migration sạch; build + test types xanh

## Success
Migration apply không lỗi; KudosPost có `title`/`isAnonymous`; bucket tồn tại; mapper test (theo memory: test pure mapper logic) xanh.

## Security
Upload chỉ qua server service_role; bucket public-read nhưng write hạn chế; validate mime + count phía server.

## MoMorph refs:
- Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
- Clarifications: plans/260629-1712-viet-kudo-modal/clarifications.md
