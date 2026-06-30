# Deployment

This app is a **server-rendered Next.js 16 application** (SSR, API routes, NextAuth,
Supabase). It needs a Node.js host — it **cannot** run on GitHub Pages or any static-only
host, and it cannot be statically exported (`output: 'export'`) because of the API routes,
auth, and dynamic rendering.

Recommended host: **Vercel** (built by the Next.js team, zero-config for App Router).

> If GitHub Pages was enabled on this repo, disable it: **GitHub → repo Settings → Pages →
> Build and deployment → Source = "None"**. The Jekyll "pages build and deployment" action
> fails on this repo (it tries to render the Markdown in `plans/`) and never hosts the app.

## Deploy to Vercel

1. **Import the repo** — https://vercel.com/new → pick `tuanda-1180/agentic-coding-hands-on`.
   Vercel auto-detects Next.js; keep the default Build Command (`next build`) and Output.
2. **Set environment variables** (Project → Settings → Environment Variables) — see the table
   below. Add them for **Production** (and Preview if you want PR previews).
3. **Deploy.** Every push to `main` ships to Production; every PR gets a Preview URL.

### Environment variables

| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | Production origin, e.g. `https://<app>.vercel.app` (no trailing slash). Drives `metadataBase`, canonical/OG URLs, `robots.txt`, `sitemap.xml`. |
| `NEXT_PUBLIC_LAUNCH_DATE` | Public | Countdown target (ISO 8601 with TZ). |
| `AUTH_SECRET` | Secret | `openssl rand -base64 32`. |
| `AUTH_GOOGLE_ID` | Secret | Google OAuth client ID. |
| `AUTH_GOOGLE_SECRET` | Secret | Google OAuth client secret. |
| `AUTH_TRUST_HOST` | Secret | Set `true` so NextAuth v5 trusts the deployment host. |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase API URL (a hosted project, not `127.0.0.1`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Server-only — bypasses RLS. Never expose to the client. |

### Google OAuth redirect URI

In Google Cloud Console → Credentials, add the production callback to the OAuth client's
**Authorized redirect URIs**:

```
https://<your-domain>/api/auth/callback/google
```

(Add the Preview domain too if you use Vercel preview deployments.)

### Supabase

Local dev uses `supabase start` (`127.0.0.1:553xx`). Production must point at a **hosted**
Supabase project — apply the migrations in `supabase/migrations/` to it and copy its URL/keys
into the Vercel env vars above.

### Notes

- **Node**: `package.json` `engines` requires Node ≥ 20.9 (Next.js 16). Vercel uses a
  compatible Node 20/22 runtime by default.
- **Security headers / CSP**: defined in `next.config.ts`. The CSP allows Supabase + Google;
  if you add other external hosts (images, APIs), extend the relevant CSP directive.
- **No `vercel.json` needed** — the framework preset handles build, routing, and the API
  routes automatically.

## Alternative Node hosts

Railway, Render, Fly.io, or any Docker host also work (they run `next build` + `next start`).
The same environment variables apply. Use the standard Next.js standalone/Node setup.
