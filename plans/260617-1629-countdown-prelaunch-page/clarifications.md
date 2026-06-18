# Clarifications — Countdown Prelaunch Page

Screen: Countdown - Prelaunch page
MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU
fileKey: 9ypp4enmFmdK3YAFJLIu6C · screenId: 8PJQswPZmU

## Session 2026-06-17
- Q: Where does the countdown target launch datetime come from? → A: Env variable (NEXT_PUBLIC_LAUNCH_DATE, ISO 8601)
- Q: Where should the countdown page live in routing? → A: Home page (/) — replace app/page.tsx
- Q: What happens when the countdown reaches zero? → A: Freeze at 00:00:00 (all units clamp to '00' and stay)
- Q: Should the prelaunch page be public or gated? → A: Fully public (no auth)
