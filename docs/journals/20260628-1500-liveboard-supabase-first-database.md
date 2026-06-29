# Live Board: First Database in the Project — Supabase Local Stack

**Date**: 2026-06-28
**Severity**: Low (shipped cleanly; documented for architectural significance)
**Component**: `/liveboard` route, Supabase local backend, 7 API route handlers
**Status**: Resolved

## What Happened

Implemented the Sun* Kudos Live board screen (`/liveboard`): banner, highlight-kudos carousel, interactive spotlight word-cloud with pan/zoom, all-kudos feed with infinite scroll, and a sidebar showing stats + leaderboard. Bilingual VI/EN. This is the **first persistent data layer in the project** — prior to this, the only backend was an in-memory user store for auth.

## Why This Is Architecturally Significant

Every screen before this was either static or read from in-memory state. The Live board introduced:

- **Supabase local (Postgres)** via `supabase start` (Docker), ports shifted to 553xx in `supabase/config.toml`
- A schema migration (`supabase/migrations/20260628113200_liveboard_schema.sql`) defining 6 tables (`sunners`, `kudos`, `hearts`, `secret_boxes`, `gift_recipients`, `rank_ups`) and a `kudos_with_hearts` view
- A seed file (`supabase/seed.sql`) with ~388 kudos and related fixtures
- A server-only Supabase client (`app/lib/supabase/server-client.ts`) using the `service_role` key — never exposed to the client
- 7 API route handlers under `app/api/liveboard/` (filters, highlights, kudos, leaderboards, spotlight, stats — each a separate directory)
- A data layer under `app/lib/liveboard/` (types, mappers, kudos-queries, user-queries, use-liveboard-data)
- Three new env vars (see `.env.example`):
  - `NEXT_PUBLIC_SUPABASE_URL` — defaults to `http://127.0.0.1:55321`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — printed by `supabase start`
  - `SUPABASE_SERVICE_ROLE_KEY` — server-only, bypasses RLS; printed by `supabase start`

## How to Run the Local Backend

```bash
# Requires Docker Desktop running
supabase start
# Copy the printed API URL, anon key, and service_role key into .env.local
# Then start the Next.js dev server as usual
npm run dev
```

`supabase start` applies the migration and seed automatically. To reset:

```bash
supabase db reset
```

## What Went Smoothly

The Supabase local CLI is well-isolated — adding it didn't affect the existing auth or any other route. The `server-only` import on `server-client.ts` prevents accidental client-side use at build time. The data layer (queries + mappers) is flat files with no ORM, which keeps the dependency footprint small.

## Concerns for Future Sessions

1. **Docker is now a dev dependency.** Anyone cloning the repo who wants the Live board to work must have Docker Desktop running before `supabase start`. This is not documented in the project README yet (see Next Steps).

2. **No RLS policies.** The service_role key bypasses Row Level Security. That is intentional for this demo-board use case (read-only public data), but if future features need per-user access control, RLS policies must be added to the migration before enabling the anon key path.

3. **Seed data is fixed.** The ~388 kudos are static fixtures. If the schema evolves, `supabase/seed.sql` must be updated in sync with the migration.

4. **Port collisions.** The 553xx port range was chosen to avoid conflicts with common local services. If a developer runs another Supabase project locally, there will be port conflicts. Check `supabase/config.toml` to adjust.

## Lessons Learned

1. **Introduce the data layer in one coherent PR.** Schema + seed + server client + API routes + data lib all shipped together. That makes bisecting straightforward — if the board is broken, the entire Supabase stack is suspect as a unit.

2. **`server-only` is not optional for service_role clients.** The key bypasses RLS and must never reach the browser bundle. The `server-only` package enforces this at build time rather than relying on discipline.

3. **Keep queries flat.** A thin query layer (typed functions returning typed rows) is easier to test and replace than an ORM. The mapper pattern (`types → mappers → queries`) gives a clear seam for future data-source swaps.

## Next Steps

- Add Docker + `supabase start` setup instructions to `README.md` (new developer onboarding gap)
- If user-scoped data is needed in future features, add RLS policies before enabling the anon key path in API routes
- Consider a `.nvmrc` at repo root — the Supabase CLI also requires Node ≥ 18 and will silently misbehave on Node 12

---

**Files created:**
- `supabase/config.toml`, `supabase/migrations/20260628113200_liveboard_schema.sql`, `supabase/seed.sql`
- `app/lib/supabase/server-client.ts`
- `app/lib/liveboard/{types,mappers,kudos-queries,user-queries,use-liveboard-data}.ts`
- `app/api/liveboard/{filters,highlights,kudos,leaderboards,spotlight,stats}/route.ts`
- `app/liveboard/` (page + components)
- `app/components/liveboard/` (banner, carousel, word-cloud, feed, sidebar)
- `app/lib/__tests__/liveboard-mappers.test.ts`
- `.env.example` (3 new Supabase vars)
- `messages/{vi,en}.json` (new `liveboard` namespace)
