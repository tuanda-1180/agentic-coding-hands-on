# Phase INT — Provider + FAB action + layout wiring

**Track:** integration · **Priority:** high · **Status:** completed

## Goal
Connect UI (A) to backend (B2): a global provider drives the modal, FAB opens it, box-click calls the API.

## Files
- Create `app/components/secret-box/secret-box-provider.tsx` (mirror `kudo-compose-provider.tsx`)
  - Context `useSecretBox()` exposing `open()`.
  - State: `open`, `unopenedCount`, `prize`, `opening`.
  - `open()` → set open, `GET /api/secret-boxes` to load `unopenedRemaining`, reset `prize=null`.
  - `handleOpenBox()` → `opening=true`, `POST /api/secret-boxes/open` → on 200 set `prize=badge`, `unopenedCount=unopenedRemaining`; on 409 set count 0; always clear `opening`. Surface errors gracefully.
  - On close: reset state.
  - Renders `<SecretBoxModal open unopenedCount prize opening onClose onOpenBox />`.
- Edit `app/layout.tsx` — mount `<SecretBoxProvider>` alongside `KudoComposeProvider`.
- Edit `app/components/homepage/fab.tsx` — add third `FabAction` `openSecretBox` (icon: reuse an existing `/saa/*.svg`, e.g. fab-kudos) + `onOpenSecretBox?` prop + handler branch.
- Edit `app/components/homepage/fab-with-rules.tsx` — `const sb = useSecretBox()`; pass `onOpenSecretBox={() => { setRulesOpen(false); sb?.open(); }}`.
- i18n: add `fab.openSecretBox` (vi/en).

## Out of scope
- Random logic (B1), HTTP impl (B2), badge rendering shape (A).

## Success criteria
- FAB → "Mở Secret Box" opens modal with real unopened count.
- Click box → API → badge revealed, count decrements; at 0 box disabled.
- Unauthenticated / zero-box handled without crash.
