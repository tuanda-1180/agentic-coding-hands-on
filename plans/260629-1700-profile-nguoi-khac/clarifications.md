# Clarifications — Profile người khác

MoMorph refs:
- Profile người khác (target, no data): https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/w4WUvsJ9KI
- Reference (done): Profile bản thân — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/3FoIx6ALVb
- Màn Sửa bài viết (deferred): https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/419VXmMy6I
- Reference (done): Viết Kudo — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2

## Session 2026-06-29
- Q: 2 frame mục tiêu chưa có data trong MoMorph (no node/style/spec/image). Nguồn design? → A: Chỉ làm Profile người khác trước; dùng frame done "Profile bản thân" làm tham chiếu (đã code sẵn). Hoãn màn Sửa bài viết.
- Q: Profile người khác khác gì profile bản thân? → A: Ẩn phần cá nhân — ẩn nút "Mở quà"/secret box + icon collection; giữ header + thống kê + feed kudos (lọc nhận/gửi) của user đó; route /profile/[id].
- Q: Màn Sửa bài viết — entry point & quyền? (deferred) → A: Nút Sửa trên kudos của chính mình; chỉ sender sửa được; không đổi người nhận; PUT /api/kudos/[id].
- Q: Mức độ build màn Sửa bài viết? (deferred) → A: Full theo design (rich-text toolbar, hashtag, tối đa 5 ảnh, gửi ẩn danh).
