# Clarifications — Thể lệ Rules Panel

Screens: Thể lệ UPDATE (content) + FAB closed + FAB open
MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/b1Filzi9i6 · /screens/_hphd32jN2 · /screens/Sv7DFwBw1h
fileKey: 9ypp4enmFmdK3YAFJLIu6C · screenIds: b1Filzi9i6, _hphd32jN2, Sv7DFwBw1h

## Session 2026-06-28
- Q: How should the Thể lệ panel be displayed? → A: Overlay panel anchored right, slides over homepage; Đóng closes it; /rules stays a stub/redirect
- Q: Where do the Hero badge + 6 collectible icon images come from? → A: Download from Figma design via MoMorph into public/saa/
- Q: Is an English translation needed? → A: Yes — add both VI and EN i18n keys
- Q: Panel close behaviour (defaulted)? → A: Esc + click-outside + Đóng all close; focus returns to FAB trigger. Panel is a dialog/drawer (role=dialog + aria-modal + focus-trap), NOT a menu — useDropdown stays on the FAB only
- Q: Where does panel open/close state live (defaulted)? → A: New client wrapper fab-with-rules.tsx (homepage-screen stays a Server Component); FAB gains onOpenRules prop
- Q: Footer Viết KUDOS target (defaulted)? → A: Close panel then router.push("/kudos"), same as FAB action
- Q: FAB Thể lệ wiring change (defaulted)? → A: Stop router.push("/rules"); open the overlay panel instead. FAB closed/open visuals unchanged (already match screens _hphd32jN2 / Sv7DFwBw1h)
- Q: Panel overflow + mobile (defaulted)? → A: Panel scrolls internally when content exceeds height; full-width on small screens, fixed ~520px on desktop
