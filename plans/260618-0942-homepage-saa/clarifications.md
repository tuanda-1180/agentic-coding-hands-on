# Clarifications — Homepage SAA

Screen: Homepage SAA
MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
fileKey: 9ypp4enmFmdK3YAFJLIu6C · screenId: i87tDx10uM

## Session 2026-06-18
- Q: Phạm vi auth (header thích ứng theo đăng nhập, admin thấy Admin Dashboard)? → A: Làm auth thật (login/session/role regular+admin)
- Q: Mức độ i18n VN/EN? → A: Dựng i18n thật (next-intl), VN mặc định + EN
- Q: Định tuyến & link điều hướng tới trang chưa tồn tại? → A: / = Homepage SAA; giữ /countdown; Awards Information / Sun* Kudos = route stub; About SAA = anchor cuộn
- Q: Widget phụ (notifications, FAB, account menu)? → A: Làm đầy đủ (notification có dữ liệu + FAB quick actions)
- Q: Persistence/backend (planner default, cần xác nhận khi forge)? → A (assumption): Mock data layer qua Route Handlers + Auth.js Credentials, không DB; swappable sang Postgres/Prisma sau

## Deferred Follow-ups (completed, noted for future work)
- /profile page (user profile screen — separate plan, follow-up task)
- notification-panel i18n strings (notification text localization — future enhancement)
- i18n/routing.ts defineRouting cleanup (technical debt — optional refactor)
- bcrypt cold-start optimization (perf tuning — optional enhancement)
- countdown days-cap-99 (feature request — future consideration)
- FAB close()-before-push (UX polish — future refinement)
