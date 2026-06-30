# Phase B3 — Hook form state + validation (bao trùm màn 2 "Lỗi")

**Track B · logic** · blockedBy: — · Priority: High

## Context
Màn 2 "Lỗi chưa điền đủ thông tin đã ấn gửi" = **trạng thái validation error của modal** (không có design data riêng). Suy từ test cases màn 1: ID-7/50 (Người nhận trống → viền đỏ + lỗi), ID-11/51 (nội dung trống → "Không được để trống"), ID-14/52 (Hashtag trống → lỗi), ID-48/49 (enable/disable nút Gửi), ID-56 (tất cả trống → lỗi tất cả field bắt buộc), ID-17/53 (max 5 hashtag), ID-18-24/54-55 (max 5 ảnh + mime).

## Requirements
`app/lib/kudos/use-kudo-form.ts` — hook quản lý state thuần (testable, không gọi server trực tiếp; nhận các action create/update/upload qua tham số):
1. **State:** receiver, title, contentHtml, tags[], images[], isAnonymous, anonymousName(optional), errors{}, submitting.
2. **Validation rules:**
   - Bắt buộc: receiver, title ("Danh hiệu"), content (HTML rỗng/chỉ whitespace = invalid), tags ≥ 1.
   - tags ≤ 5, images ≤ 5; mime ảnh ∈ {jpg,png,webp} (file khác → lỗi định dạng).
   - Nút Gửi **disabled** khi thiếu field bắt buộc (ID-48/49); khi ấn Gửi mà thiếu → set errors (viền đỏ + message), không submit (ID-56).
3. **Messages** (i18n key, int sẽ thêm VI/EN): "Không được để trống", "Tối đa 5 hashtag", "Định dạng file không hợp lệ".
4. **Init từ edit mode:** hàm `initFromKudo(kudo)` pre-fill toàn bộ field (màn 3).
5. **submit():** gọi callback create/update do int truyền; xử lý loading + error trả về từ API.

## Files
- Create: `app/lib/kudos/use-kudo-form.ts`, `app/lib/kudos/validation.ts`
- Test: `app/lib/kudos/__tests__/use-kudo-form.test.ts` (pure validation + enable/disable + init edit)

## Todo
- [ ] validation.ts: rule thuần cho từng field + payload tổng
- [ ] use-kudo-form: state + errors + disabled + submit + initFromKudo
- [ ] Unit test: required (ID-7,11,14,56), max tags (ID-17), mime ảnh (ID-23), enable/disable (ID-48,49), init edit pre-fill

## Success
Test pure logic xanh, phủ các test case validation màn 1/2; nút Gửi disabled/enabled đúng; edit mode pre-fill đúng.

## MoMorph refs:
- Lỗi validation: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/5c7PkAibyD
- Clarifications: plans/260629-1712-viet-kudo-modal/clarifications.md
