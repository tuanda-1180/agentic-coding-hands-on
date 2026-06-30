# Clarifications — Open Secret Box

MoMorph refs:
- Open secret box (chưa mở): https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/J3-4YFIpMM
- Open secret box (action bấm mở / success): https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/p0qHd6DJ6A (no render available)

## Session 2026-06-30

- Q: Scope — chỉ trạng thái chưa mở hay cả luồng mở? → A: Cả luồng đầy đủ (1 modal, 2 trạng thái: chưa mở → click → success hiện huy hiệu)
- Q: Logic random huy hiệu + giảm count xử lý ở đâu? → A: Server-side (API route + bảng secret_boxes)
- Q: Người dùng mở modal từ đâu? → A: Menu FAB (thêm mục "Mở Secret Box", giống Viết Kudo)
- Q: Asset huy hiệu lấy từ đâu (crop MoMorph không khả thi — không có render, Figma export lỗi 500, node tree rỗng)? → A: Placeholder + map tên; code sẵn mapping prize→asset, thả PNG vào public/saa/ sau
- Q: Title unopened vs success (design "KHÁM PHÁ SECRET BOX CỦA BẠN" vs spec "MỞ SECRET BOX THÀNH CÔNG")? → A: Unopened dùng title design; success dùng title spec
