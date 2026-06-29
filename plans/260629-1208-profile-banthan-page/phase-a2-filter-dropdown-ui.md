# Phase A2 — Received/Sent filter dropdown UI (Track A · parallel)

**Status:** COMPLETED

**Goal:** Code the "Đã nhận / Đã gửi" filter dropdown (open state of the `mms_C` trigger on the profile screen). Activate `momorph-implement-design`.

**Delivered:** `app/components/profile/received-sent-filter.tsx` — controlled dropdown component.

**Build approach:** No dedicated MoMorph design (screen `rQqxNoXoii` in_progress). Built from trigger pattern in screen 1 (`mms_C.3_Button` = "Đã gửi (5)") + clarifications. Matches `theme.ts` palette and existing dropdown styling (liveboard filter pattern).

**Behavior:** two options — "Đã nhận (N)" and "Đã gửi (N)" with counts; default selected = **"Đã gửi"**; selecting one emits `onFilterChange("received" | "sent")`; closes on outside click / select.

**Props:** `value`, `counts`, `onChange`. Integrated in phase-a1 awards-feed-header.

**Out of scope:** the feed query itself (Track B), animation polish beyond existing dropdown convention.

## MoMorph refs:
- Dropdown-filter đã nhận/gửi: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/rQqxNoXoii
- Clarifications: plans/260629-1208-profile-banthan-page/clarifications.md
