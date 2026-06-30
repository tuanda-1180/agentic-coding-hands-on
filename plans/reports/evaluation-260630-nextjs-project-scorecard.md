# Báo cáo đánh giá & chấm điểm dự án — Takumi (Sun* Asterisk Awards)

> **Ngày đánh giá:** 2026-06-30
> **Phạm vi:** Toàn bộ dự án (branch `main` @ `439dcc1`)
> **Phương pháp:** Black-box (build + run production + kiểm tra runtime) **và** White-box (soi mã nguồn)
> **Stack:** Next.js 16.2.9 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind v4 · next-intl 4 · NextAuth v5 · Supabase

---

## 1. Điểm tổng quan

| Hạng mục | Trọng số | Điểm | Đạt |
|---|---|---|---|
| **PHẦN 1 — Sản phẩm thực tế (Black-box)** | 30 | **22.0** | 73% |
| **PHẦN 2 — Chất lượng mã nguồn (White-box)** | 70 | **58.5** | 84% |
| **TỔNG** | **100** | **80.5** | **B+ (Khá–Giỏi)** |

**Nhận định chung:** Dự án có nền tảng kỹ thuật **vững và chuyên nghiệp** — TypeScript strict gần như không dùng `any`, kiến trúc tách lớp sạch, bảo mật được chú trọng (sanitize HTML, validation dùng chung, chống race condition), và tận dụng tốt các component tối ưu của Next.js. Điểm trừ tập trung ở **SEO/metadata**, **thiếu các file đặc biệt của App Router** (`loading/error/not-found`), và **kỷ luật kích thước file**.

---

## PHẦN 1 — ĐÁNH GIÁ SẢN PHẨM THỰC TẾ (Black-box) — 22.0/30

Build production chạy thành công (`next build` exit 0, compile 3.0s, TypeScript pass). Server `next start` được khởi động thực tế trên cổng 3100 để kiểm tra runtime.

### 1.1. Tính năng cốt lõi & Edge cases — 8.5/10
- ✅ **Build sạch**, 12 trang sinh thành công, TypeScript pass.
- ✅ **Xử lý 404 đúng:** route không tồn tại → `404`; `/profile/<id-sai>` → `404` (gọi `notFound()` sau khi validate UUID/user).
- ✅ **Bảo vệ API:** `POST /api/secret-boxes/open` không đăng nhập → `401`; `/admin` được guard bởi middleware (`proxy.ts`) theo cả auth lẫn `role: admin`.
- ✅ **Đọc công khai hợp lý:** `GET /api/liveboard/kudos` → `200` (feed công khai, đúng thiết kế).
- ✅ 492 test logic pass — gián tiếp bảo chứng business logic (validation, mappers, pagination, badge).
- ⚠️ Không thể chạy đầy đủ các luồng tương tác (spam-click, submit form sai định dạng trên UI thật) trong môi trường headless — đánh giá dựa trên validation tầng code.

### 1.2. Hiệu năng & Core Web Vitals — 6.5/8
- ✅ Turbopack production build; code-splitting theo route; `next/font` preload font (`woff2` + `crossorigin`) đã xuất hiện trong response header → giảm FOIT/FOUT (tốt cho CLS).
- ✅ Dùng `next/image` (định dạng tối ưu, lazy-load) và `priority` cho ảnh hero banner (tốt cho LCP).
- ⚠️ **Chưa đo Lighthouse thực tế** (môi trường không có trình duyệt đo LCP/INP/CLS). Đánh giá dựa trên các primitive tối ưu có sẵn.
- ⚠️ **Tất cả route đều `ƒ (Dynamic)` — server-rendered on demand**, không có trang SSG/ISR nào. TTFB phụ thuộc Supabase mỗi request → bỏ lỡ cơ hội cache cho nội dung tĩnh.

### 1.3. Rendering & SEO — 3.5/7  ⬅️ **điểm yếu lớn nhất**
- ✅ **SSR hoạt động đúng:** HTML thô của `/` trả về **72KB có nội dung thật** (Kudos, Secret Box, Sun*, Countdown) — không phải vỏ rỗng kiểu CSR.
- ❌ **Metadata tĩnh & generic toàn site:** mọi trang đều dùng chung `<title>Sự kiện sẽ bắt đầu sau</title>` + `<meta description="Countdown prelaunch page">`. Không có `generateMetadata` động cho `/profile/[id]`, `/awards`...
- ❌ **Không có Open Graph / og:image** → chia sẻ mạng xã hội không có preview.
- ❌ **`robots.txt` → 404** và **`sitemap.xml` → 404** (thiếu `robots.ts` / `sitemap.ts`).
- ⚠️ Đây là app có trang công khai (profile, awards, liveboard) nên SEO đáng lẽ phải được đầu tư.

### 1.4. UI/UX & Responsive — 3.5/5
- ✅ Tối ưu tài nguyên tốt: `next/image` + `next/font` (Montserrat với subset **`vietnamese`** → hiển thị tiếng Việt chuẩn, không lỗi font).
- ✅ Tailwind v4 — nền tảng responsive tốt.
- ⚠️ **Chưa kiểm thử responsive trên nhiều breakpoint thực tế** (Mobile/Tablet/Desktop) trong môi trường headless — không thể khẳng định layout không vỡ.

**Bảo mật runtime (phát hiện thêm):** ❌ Response **thiếu toàn bộ security header phổ biến** — không có `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.

---

## PHẦN 2 — CHẤT LƯỢNG MÃ NGUỒN (White-box) — 58.5/70

### 2.1. Tận dụng tính năng đặc thù Next.js — 19/25

| Tiêu chí | Điểm | Ghi chú |
|---|---|---|
| Server vs Client Components | 4.5/6 | Root tốt, mid-tier hơi lạm dụng |
| File đặc biệt (loading/error/not-found) | 1.5/4 | **Thiếu hoàn toàn** |
| Data fetching & caching | 5/7 | Tầng data sạch, nhưng không ISR |
| Built-in components (image/link/font) | 8/8 | **Xuất sắc** |

- ✅ **Server/Client split đúng nguyên tắc ở gốc:** `app/layout.tsx` và `app/page.tsx` là Server Component (async `getLocale`/`getMessages`, **không** `'use client'`). Trang động `app/profile/[id]/page.tsx` fetch server-side rồi `notFound()` trước khi render.
- ⚠️ **73 file `'use client'`** — một số container tầng giữa (`site-chrome.tsx`, `hero-section.tsx`, `awards-section.tsx`) gắn `'use client'` dù chủ yếu là trình bày; nên đẩy ranh giới client xuống leaf.
- ❌ **Thiếu hoàn toàn `loading.tsx` (skeleton), `error.tsx` (error boundary), `not-found.tsx` (404 tùy biến), `global-error.tsx`** trong toàn bộ `app/`. App rơi về trang mặc định của Next.
- ✅ **Tầng data tách bạch & an toàn:** `import "server-only"` ở `kudos-write.ts`, `secret-box-write.ts`, `supabase/server-client.ts` (service_role không rò rỉ xuống client). 18 route handler đều có `try/catch` + custom error class (`KudoWriteError`, `SecretBoxError`) với status code chuẩn (400/401/403/404/409).
- ✅ **Server Actions (2):** `auth/actions.ts`, `i18n/locale-switch.ts` — có `try/catch`, validate đầu vào (thủ công, **chưa dùng Zod**).
- ❌ **Không có ISR/revalidate** ở đâu cả — toàn bộ `force-dynamic`, không tận dụng `fetch` cache / `next: { revalidate }`.
- ✅ **Built-in components — gương mẫu:** **0 thẻ `<img>` thô**, **0 thẻ `<a href="/">` nội bộ** (toàn bộ dùng `next/image` + `next/link`); `next/font` dùng cho cả Google Font (Montserrat) lẫn local font (LED `dseg7`) qua CSS variable, không `@font-face` thủ công.

### 2.2. Clean Code & TypeScript — 22/25

| Tiêu chí | Điểm | Ghi chú |
|---|---|---|
| TypeScript rigor | 7.5/8 | strict, gần như zero `any` |
| Quy tắc đặt tên | 4/4 | Hoàn hảo |
| DRY / tái sử dụng | 4/5 | Tốt, có 1 chỗ lặp nhỏ |
| Separation of Concerns | 5/5 | Xuất sắc |
| Kỷ luật kích thước file | 1.5/3 | 17 component > 200 dòng |

- ✅ **TypeScript:** `strict: true`; **0 `any` trong code ứng dụng** (`app/`); 85+ interface/type tường minh, types chuẩn hóa tại `app/lib/liveboard/types.ts`. (13 `no-explicit-any` còn lại nằm ở tooling `.claude/`, không phải app.)
- ✅ **Đặt tên hoàn hảo:** 100% file kebab-case, component PascalCase, hàm/biến camelCase.
- ✅ **Tách logic/UI xuất sắc:** custom hooks (`use-kudo-form`, `use-liveboard-data`, `use-profile-data`) gom state + fetch; component chỉ nhận props, không gọi Supabase trực tiếp; hooks UI dùng chung (`use-dialog`, `use-dropdown`, `use-scroll-spy`).
- ⚠️ **Lặp nhỏ:** logic gọi like (`/api/liveboard/kudos/${id}/like`) xuất hiện ở cả `use-liveboard-data.ts` và `use-profile-data.ts` → nên tách helper chung.
- ⚠️ **17 component vượt 200 dòng** (rule dự án). Lớn nhất: `kudo-editor.tsx` (420), `kudo-recipient-select.tsx` (369), `award-info-section.tsx` (318). Nên tách subcomponent (vd MentionPopup, PrizeLine).

### 2.3. Kiến trúc thư mục — 7/8
- ✅ Cấu trúc rõ ràng theo feature: `app/components/{homepage,liveboard,kudos,profile,awards,...}`, `app/lib/{liveboard,kudos,auth,secret-box,supabase}`, `app/api/**/route.ts`. README mô tả đầy đủ routes/auth/i18n.
- ✅ Middleware đặt đúng convention Next 16 (`proxy.ts`) — có comment giải thích vì sao không dùng next-intl middleware (chế độ cookie-based).

### 2.4. Bảo mật & Error handling (chiều sâu code) — 6.5/7
- ✅ **Sanitize HTML write-time** bằng `isomorphic-dompurify` trước khi ghi DB (defense-in-depth chống stored XSS).
- ✅ **Validation dùng chung client+server** (`validation.ts`): giới hạn độ dài, whitelist loại ảnh, **chặn URL storage ngoài** (chỉ chấp nhận bucket nội bộ).
- ✅ **Auth/Authz:** kiểm tra `currentIdentity()`; chỉ sender được sửa kudo (403); secret box giới hạn theo `user_id`.
- ✅ **Chống race condition:** mở secret box dùng CAS (`.eq("is_opened", false)`) → trả 409 nếu double-open.
- ✅ Mật khẩu (provider dev) hash bằng `bcryptjs`.
- ❌ Thiếu security header tầng HTTP (đã nêu ở Phần 1).

### 2.5. Testing — 4/5
- ✅ **492 test / 21 file — tất cả pass** (Vitest), tập trung logic thuần (validation, mappers, pagination, badge, countdown, anonymity) — đúng hướng "test logic, tránh test brittle UI".
- ⚠️ Thiếu integration test (API + DB) và E2E.

### 2.6. Lint — đính chính quan trọng
- `npm run lint` báo **777 vấn đề (551 errors)** — nghe đáng lo, **nhưng 535/551 errors là `no-require-imports` + unused-vars đến từ `.claude/` (tooling agent kit) và `.venv` Python**, KHÔNG phải code ứng dụng. ESLint config (`eslint.config.mjs`, dùng `eslint-config-next` core-web-vitals + typescript) **chỉ ignore `.next/out/build`** mà quên ignore `.claude/`.
- **Lint riêng `app/`** chỉ còn **8 vấn đề (3 errors, 5 warnings)** — gần như sạch (chủ yếu unused var trong test, 1 cảnh báo `react-hooks/static-components`).
- 👉 **Khuyến nghị:** thêm `.claude/**`, `**/.venv/**` vào `globalIgnores` của ESLint để số liệu lint phản ánh đúng code thật.

---

## 3. Top điểm mạnh & điểm yếu

### 🟢 5 điểm mạnh nhất
1. **An toàn kiểu (TypeScript):** strict mode, zero `any` trong app, 85+ type tường minh.
2. **Bảo mật tầng code chắc chắn:** DOMPurify write-time, validation dùng chung, auth/authz, CAS chống race.
3. **Built-in components Next.js gương mẫu:** 0 `<img>`/`<a>` thô, `next/font` đầy đủ (kèm subset tiếng Việt).
4. **Kiến trúc tách lớp sạch:** data layer `server-only`, custom hooks, UI thuần trình bày.
5. **Đặt tên & cấu trúc nhất quán** + README chất lượng.

### 🔴 5 điểm yếu nhất (ưu tiên khắc phục)
1. **SEO yếu:** metadata tĩnh/generic, không `generateMetadata` động, không OG/og:image, **404 cho `robots.txt` & `sitemap.xml`**.
2. **Thiếu file đặc biệt App Router:** không có `loading.tsx`, `error.tsx`, `not-found.tsx`.
3. **Thiếu security header HTTP:** không CSP/X-Frame-Options/HSTS...
4. **Kỷ luật file:** 17 component > 200 dòng (3 file > 300).
5. **Không tận dụng caching/ISR:** toàn bộ `force-dynamic`; ESLint chưa ignore tooling (gây 551 lỗi nhiễu).

---

## 4. Khuyến nghị hành động (theo độ ưu tiên)

**P0 — Nhanh, tác động cao**
- [ ] Thêm `app/not-found.tsx`, `app/error.tsx`, `app/loading.tsx` (và `global-error.tsx`).
- [ ] Thêm `app/robots.ts` + `app/sitemap.ts`.
- [ ] Bổ sung `generateMetadata` cho `/profile/[id]`, `/awards`; thêm `openGraph`/`og:image` vào metadata gốc; sửa title/description generic.
- [ ] Thêm security headers qua `headers()` trong `next.config.ts` (hoặc trong `proxy.ts`).
- [ ] Thêm `.claude/**` & `**/.venv/**` vào `globalIgnores` của ESLint.

**P1 — Cải thiện chất lượng**
- [ ] Tách 3 component lớn nhất (`kudo-editor`, `kudo-recipient-select`, `award-info-section`) xuống < 200 dòng.
- [ ] Gom logic gọi like trùng lặp thành helper dùng chung.
- [ ] Rà soát `'use client'` ở các container tầng giữa, đẩy ranh giới xuống leaf.

**P2 — Dài hạn**
- [ ] Cân nhắc ISR/`revalidate` cho nội dung công khai ít đổi (awards, profile public).
- [ ] Bổ sung integration test (API + DB) và E2E cho luồng chính.
- [ ] Chuẩn hóa validation Server Actions sang schema (Zod) cho dễ bảo trì.

---

## 5. Phương pháp & giới hạn đánh giá
- **Đã làm:** `next build` + `next start` thật; kiểm tra HTML thô (SSR), header HTTP, edge case (404/401/auth); chạy `lint` + 492 test; phân tích mã nguồn toàn bộ `app/` qua 2 agent chuyên sâu (Next.js features & code quality).
- **Chưa làm được (môi trường headless):** đo Lighthouse/Core Web Vitals thực tế (LCP/INP/CLS), kiểm thử responsive đa breakpoint, và các luồng tương tác UI end-to-end. Các điểm liên quan được chấm dựa trên primitive tối ưu trong code + suy luận, đã ghi rõ.
