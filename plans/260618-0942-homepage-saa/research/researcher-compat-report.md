# Compatibility Report: next-intl + Auth.js v5 on Next.js 16.2.9

Date: 2026-06-18
Researcher: Technical Analyst
Stack: Next.js 16.2.9, React 19.2.4, Tailwind v4, TypeScript, App Router

---

## CRITICAL BREAKING CHANGE: middleware.ts → proxy.ts

**Next.js 16 renamed `middleware.ts` to `proxy.ts` and the export from `middleware` to `proxy`.**  
This is the single biggest gotcha for both libraries. Any tutorial or doc written for Next.js 14/15 uses `middleware.ts` — do not follow those directly.

Source: Verified in `node_modules/next/dist/docs/01-app/02-guides/authentication.md` (official bundled docs for this exact Next.js version) and `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`.

---

## 1. next-intl

### Recommended version

**`next-intl@4.13.0`** (latest stable as of 2026-06-18, confirmed via `npm show next-intl version`).

next-intl v4 explicitly supports Next.js 16 and the `proxy.ts` convention. v3.x predates this rename and will cause "Unable to find next-intl locale" errors on Next.js 16.

Source: buildwithmatija.com blog post "Fix Unable to find next-intl locale After Upgrading to Next.js 16"; next-intl.dev middleware docs note "`proxy.ts` was called `middleware.ts` up until Next.js 16."

### Minimal setup — file list

```
i18n/routing.ts        # defineRouting — locales, defaultLocale, localePrefix
i18n/request.ts        # getRequestConfig — locale resolution for Server Components
proxy.ts               # createMiddleware(routing) export
app/[locale]/          # all page/layout files nested here
```

### i18n/routing.ts

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'as-needed', // vi → /, en → /en
});
```

`localePrefix: 'as-needed'` means the default locale (`vi`) gets **no URL prefix** — `/ ` not `/vi/`.  
`localePrefix: 'never'` removes the prefix for ALL locales (SEO trade-off: no alternate links).  
Source: next-intl.dev/docs/routing/configuration — confirmed via WebFetch.

### i18n/request.ts

```ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  return { locale };
});
```

### proxy.ts (standalone, without auth composition)

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
```

**Note:** export name must be `proxy` (default export), NOT `middleware`. The `config.matcher` must also exclude `_next/*` and static files.

### next-intl/next.config.ts integration

```ts
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
export default withNextIntl({ /* next config */ });
```

### Known Next.js 16 incompatibilities

- **v3.x**: proxy/middleware rename causes "locale not found" — do not use.
- **v4.x**: No known blocking issues with Next.js 16.2.9.
- `setRequestLocale` (formerly `unstable_setRequestLocale`) is required in layouts/pages for static rendering with `generateStaticParams`.

---

## 2. Auth.js v5 (next-auth@5)

### Recommended version

**`next-auth@5.0.0-beta.31`** — confirmed via `npm show next-auth dist-tags`.  
There is no `latest` stable v5; the package is still beta. The `latest` tag on npm points to **v4.24.14** (v4 = older, Pages Router era). You must install explicitly:

```bash
npm install next-auth@beta
```

v5 beta.31 is stable enough for production per multiple practitioners (dev.to, logrocket.com 2026 reviews).  
Source: npm dist-tags, authjs.dev/getting-started/migrating-to-v5, logrocket.com/best-auth-library-nextjs-2026.

### Minimal setup — file list

```
auth.ts                                    # NextAuth config, exports handlers/signIn/signOut/auth
proxy.ts                                   # export { auth as proxy } or composed version
app/api/auth/[...nextauth]/route.ts        # route handler
types/next-auth.d.ts                       # TypeScript augmentation for role claim
```

### auth.ts — Credentials + JWT + role claim

```ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // verify credentials against your DB
        const user = await verifyUser(credentials.email, credentials.password);
        if (!user) return null;
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role; // persisted on sign-in
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as string;
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
```

### app/api/auth/[...nextauth]/route.ts

```ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

### TypeScript augmentation — types/next-auth.d.ts

```ts
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: { role?: string } & DefaultSession['user'];
  }
  interface User {
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}
```

Source: authjs.dev/guides/extending-the-session — confirmed via WebFetch.

### Simple proxy.ts (auth-only, no i18n)

```ts
export { auth as proxy } from '@/auth';
```

### Edge runtime caveat

If using Prisma/bcrypt in `authorize`, those are NOT edge-compatible. Keep `auth.ts` on Node.js runtime (default). If you need edge proxy, split into `auth.config.ts` (edge-safe, no DB adapter) and import only the config in proxy.ts. This is documented in authjs.dev migration guide.

### Next.js 16 gotchas

- Export must be named `proxy`, not `middleware`.
- `getServerSession` (v4 pattern) is gone — use `const session = await auth()` anywhere server-side.
- Route handler path remains `app/api/auth/[...nextauth]/route.ts` (unchanged).

---

## 3. Coexistence: Composing both middlewares in proxy.ts

Both libraries need to run in `proxy.ts`. The pattern recommended by next-intl maintainer and practitioners:

**next-intl runs first** (locale routing before auth checks).

### proxy.ts — composed pattern

```ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Auth.js proxy wrapper — adds session to request
const authProxy = auth as any;

export default async function proxy(request: NextRequest) {
  const publicPaths = ['/', '/login', '/register', '/api/auth'];
  const { pathname } = request.nextUrl;

  // Run intl first on all non-API paths
  const isApiAuthRoute = pathname.startsWith('/api/auth');
  if (!isApiAuthRoute) {
    const intlResponse = intlMiddleware(request);
    // If intl redirects (locale negotiation), honor it
    if (intlResponse && intlResponse.status !== 200) return intlResponse;
  }

  // Then run auth check on protected paths
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (!isPublic) {
    return authProxy(request, {} as any);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!_next|_vercel|.*\\..*).*)',
};
```

**Simpler alternative** — use next-intl's `withAuth` integration helper if available in v4, or use a chain utility:

```ts
// chain.ts utility
import { NextMiddleware, NextResponse } from 'next/server';

export function chain(middlewares: NextMiddleware[]) {
  return middlewares.reduce((acc, mw) => async (req, event) => {
    const res = await acc(req, event);
    if (res && res.status !== 200) return res;
    return mw(req, event);
  });
}

// proxy.ts
import { chain } from './chain';
export default chain([intlMiddleware, authProxy]);
```

Sources: github.com/amannn/next-intl/discussions/341; dev.to/0xtanzim article (Feb 2025); github.com/nextauthjs/next-auth/discussions/10885.

**Confirmed pattern**: i18n first, auth second. Auth.js Discussion #10885 and next-intl Discussion #341 both converge on this ordering. No known conflicts specific to Next.js 16.2.9 beyond the `proxy.ts` rename.

---

## Summary Table

| Library | Install | Next 16 status | Key file |
|---------|---------|---------------|----------|
| next-intl | `next-intl@4.13.0` | Supported (v4+) | `proxy.ts` with `createMiddleware` |
| next-auth | `next-auth@beta` (5.0.0-beta.31) | Supported | `proxy.ts` exports `auth as proxy` |

---

## Adoption Risk

| | next-intl v4 | next-auth v5 beta |
|--|--|--|
| Maturity | Stable, active, 7k+ GitHub stars | Beta — API could shift before stable |
| Breaking-change risk | Low (v4 is current major) | Medium — "beta" label; callbacks API settled but minor changes possible |
| Abandonment risk | Very low | Very low (Auth.js is the de-facto standard) |
| Community | Strong, maintainer responsive | Large, widely adopted despite beta label |

**next-auth v5 beta risk is acceptable.** It has been in beta since 2023, beta.31 is mature, and the migration to stable v5 is expected to be minor. Multiple production apps run it. The biggest real risk is the Credentials provider — it is intentionally de-emphasized by Auth.js team (no CSRF protection by default, must implement manually). For a fresh project, assess whether a custom JWT + cookies solution (as shown in the Next.js 16 auth guide) gives more control with less dependency risk.

---

## Blockers / Breaking Changes

1. **`proxy.ts` rename is mandatory** — `middleware.ts` is silently ignored in Next.js 16. This is the most common error source.
2. **next-intl v3 is incompatible** with Next.js 16 — must use v4.
3. **next-auth `latest` tag = v4** — installing without `@beta` gets the wrong major version.
4. **Credentials provider + edge runtime** — incompatible; keep auth on Node.js runtime.
5. **`localePrefix: 'as-needed'` with static export** — not supported in `output: 'export'` mode (N/A here, but worth noting if static export is ever considered).

---

## Unresolved Questions

- Does next-intl v4 `createMiddleware` return a proper `NextResponse` that Auth.js can inspect headers from, or is post-processing needed? (Low priority — composition via chain utility avoids this.)
- Auth.js v5 stable release timeline is unknown — monitor for beta.32+ changelog before going to production.
- The `localePrefix: 'as-needed'` behavior with `generateStaticParams` + ISR needs verification for specific page types in this project.

---

## Sources

- Next.js 16.2.9 bundled docs: `node_modules/next/dist/docs/01-app/02-guides/authentication.md`, `internationalization.md` (authoritative for this exact version)
- [next-intl routing middleware](https://next-intl.dev/docs/routing/middleware)
- [next-intl routing setup](https://next-intl.dev/docs/routing/setup)
- [next-intl routing configuration](https://next-intl.dev/docs/routing/configuration)
- [Auth.js v5 migration guide](https://authjs.dev/getting-started/migrating-to-v5)
- [Auth.js installation (Next.js)](https://authjs.dev/getting-started/installation?framework=next.js)
- [Auth.js extending the session](https://authjs.dev/guides/extending-the-session)
- [next-intl + Auth.js middleware discussion](https://github.com/amannn/next-intl/discussions/341)
- [next-auth middleware composition discussion](https://github.com/nextauthjs/next-auth/discussions/10885)
- [Dev.to — combining NextAuth + next-intl middleware](https://dev.to/0xtanzim/implementing-multiple-middleware-in-nextjs-combining-nextauth-and-internationalization-d9)
- npm registry: `next-intl@4.13.0`, `next-auth@5.0.0-beta.31`
