# Clarifications

## Session 2026-06-29
- Q: "Bộ sưu tập icon của tôi" làm thế nào (DB chưa có bảng/asset icon)? → A: Hiển thị N slot cố định; slot sáng = số secret_boxes đã mở của user, còn lại để xám, dùng 1 icon generic, không tạo bảng icon riêng.
- Q: Nút "Mở Secret Box" hoạt động ra sao (chưa có feature mở box)? → A: Placeholder / "coming soon" hoặc no-op; mở quà thực sự ngoài phạm vi.
- Q: Màn 2 (Dropdown-filter đã nhận/gửi) mặc định và lọc thế nào (màn 2 chưa có specs/ảnh)? → A: Mặc định "Đã gửi"; dropdown chuyển feed giữa kudos đã gửi / đã nhận của user; số trong ngoặc = tổng mỗi loại.
- Q: Nguồn dữ liệu trang Profile? → A: Dữ liệu thật từ Supabase qua currentUserId() (email đăng nhập, fallback is_current_user), tái sử dụng getStats() + query kudos theo user.
