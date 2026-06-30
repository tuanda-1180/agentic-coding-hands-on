# Clarifications — Viết Kudo Modal

## Session 2026-06-29
- Q: Field "Danh hiệu" có trong design render màn 1 nhưng thiếu trong specs CSV và bảng kudos → A: Thêm cột `title` vào bảng kudos (migration), field bắt buộc, hiển thị làm tiêu đề Kudo trong feed
- Q: Mức độ rich text editor cho ô soạn thảo (B/I/S/list/link/quote + @mention) → A: Tiptap đầy đủ — 6 nút format hoạt động thật + @mention, lưu HTML, cập nhật card feed render HTML
- Q: Cách lưu ảnh đính kèm (tối đa 5) khi chưa có hạ tầng upload → A: Supabase Storage thật — tạo bucket, upload thật, lưu URL vào kudos.images
- Q: Phạm vi màn 3 "Sửa bài viết - edit mode" (không có design data) → A: Tái dùng chung modal cho tạo & sửa, vào edit từ icon bút chì trên Kudo của chính mình, pre-fill toàn bộ field, PATCH update thật
- Q: Nguồn hashtag cho dropdown "+ Hashtag" → A: Dùng danh sách hashtag có sẵn từ getFilters() (searchable picker), tối thiểu 1 / tối đa 5
- Q: Persistence model cho tạo/sửa Kudo → A: INSERT/UPDATE thật vào Supabase (khớp pattern liveboard) để Kudo xuất hiện ngay trong feed
- Q: Màn 2 "Lỗi chưa điền đủ thông tin" là gì → A: Trạng thái validation error của chính modal màn 1 (viền đỏ + "Không được để trống" trên Người nhận / Danh hiệu / nội dung / Hashtag), suy từ test cases ID-7,11,14,50-52,56
