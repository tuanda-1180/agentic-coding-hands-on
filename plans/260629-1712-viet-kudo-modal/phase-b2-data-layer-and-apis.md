# Phase B2 — Data layer + API tạo/sửa + sunner search + upload ảnh

**Track B · logic** · blockedBy: — (dùng output b1 khi integrate) · Priority: High

## Context
- Read-only hiện có: `app/lib/liveboard/kudos-queries.ts` (KUDOS_SELECT, getFeed, getFilters), `user-queries.ts` (resolveUserId by email, toggleLike), `app/lib/supabase/server-client.ts` (service_role, server-only).
- Chưa có: write query, sunner search, upload action, POST/PATCH route.

## Requirements
1. **Write queries** (`app/lib/liveboard/kudos-queries.ts` hoặc file mới `kudos-write.ts`):
   - `createKudo(input)` → INSERT (sender_id từ currentUserId, receiver_id, title, content(HTML), category, tags[], images[], is_anonymous) → trả KudosPost qua mapper.
   - `updateKudo(id, input)` → UPDATE, **chỉ khi `sender_id === currentUserId`** (ownership guard) → trả KudosPost.
2. **Sunner search** (`user-queries.ts`): `searchSunners(q, limit)` — query `sunners` theo name/email ILIKE, trả `{id,name,avatarUrl,department,title}`. Dùng cho recipient + @mention.
3. **Hashtag source**: tái dùng `getFilters()` (danh sách hashtag sẵn có) cho picker.
4. **Image upload action** (`app/lib/kudos/upload-image.ts`): nhận File(s), validate mime (jpg/png/webp) + ≤5, upload bucket `kudo-images` qua server client, trả public URL[].
5. **API routes:**
   - `POST /api/kudos` → body { receiverId, title, content, category, tags, images, isAnonymous } → createKudo. Validate server-side (required, ≤5 tags/images). 401 nếu chưa login, 400 nếu invalid.
   - `PATCH /api/kudos/[id]` → updateKudo (ownership 403 nếu không phải chủ).
   - `GET /api/sunners/search?q=` → searchSunners.
   - `POST /api/kudos/upload` → nhận multipart, gọi upload action, trả URLs.

## Files
- Create: `app/lib/liveboard/kudos-write.ts`, `app/lib/kudos/upload-image.ts`, `app/api/kudos/route.ts`, `app/api/kudos/[id]/route.ts`, `app/api/sunners/search/route.ts`, `app/api/kudos/upload/route.ts`
- Modify: `app/lib/liveboard/user-queries.ts` (searchSunners), reuse `currentUserId()` (từ profile plan)

## Todo
- [ ] createKudo / updateKudo (+ ownership guard) + mapper
- [ ] searchSunners + GET /api/sunners/search
- [ ] upload-image action + POST /api/kudos/upload (validate mime/count)
- [ ] POST /api/kudos + PATCH /api/kudos/[id] (validate, auth, 400/401/403)
- [ ] Unit test pure logic: validate payload, ownership check (KHÔNG mock server boundary)

## Success
4 endpoint hoạt động (verify bằng curl/psql): tạo Kudo thật → xuất hiện ở `/api/liveboard/kudos`; sửa Kudo của mình OK; sửa Kudo người khác → 403; search trả đúng; upload trả URL truy cập được.

## Security
Auth bắt buộc (currentUserId); ownership guard cho PATCH; validate mime/size/count server-side; service_role chỉ ở server; sanitize/limit độ dài content & title.

## MoMorph refs:
- Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
- Clarifications: plans/260629-1712-viet-kudo-modal/clarifications.md
