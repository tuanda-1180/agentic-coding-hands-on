# Takumi — Prelaunch Countdown

Full-viewport countdown landing page built with Next.js 16. Counts down to a configurable launch datetime using LED 7-segment digit displays (DAYS / HOURS / MINUTES / SECONDS), ticking every second. Freezes at 00/00/00/00 on completion.

## Requirements

- Node 20.9+ (Next.js 16 requires it — default shell may be older, use nvm)

```bash
nvm use 22
```

## Configuration

Copy `.env.example` and set the launch datetime:

```
NEXT_PUBLIC_LAUNCH_DATE="2026-12-31T00:00:00+07:00"  # ISO 8601, any timezone offset
```

If unset or unparseable, the app counts down a short relative duration from page load
(`COUNTDOWN_DURATION_SECONDS`, default 7s) — so the countdown is visibly ticking for demos
rather than appearing frozen on a far-future date.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm test         # vitest (scoped to app/**)
```
