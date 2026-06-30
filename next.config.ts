import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Origins the app legitimately talks to, folded into the CSP so it stays strict
// without breaking real traffic. Supabase host is read from env so it follows
// the deployment.
const supabaseOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
      : "";
  } catch {
    return "";
  }
})();

// Remote image hosts the app renders: live-board mock avatars/attachments plus
// Google OAuth profile pictures (lh3..lh6.googleusercontent.com) for the
// signed-in user's avatar.
const imageHosts =
  "https://i.pravatar.cc https://picsum.photos https://fastly.picsum.photos https://*.googleusercontent.com";

// React/Next dev mode requires eval() (Fast Refresh, source maps, callstacks).
// Only relax script-src in development; production CSP stays eval-free.
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js injects inline bootstrap/runtime scripts (no nonce wired up here).
  scriptSrc,
  // Inline styles are used throughout the components.
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${imageHosts} ${supabaseOrigin}`.trim(),
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin} https://accounts.google.com`.trim(),
  // Google OAuth sign-in popup/iframe.
  "frame-src https://accounts.google.com",
  "form-action 'self' https://accounts.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // isomorphic-dompurify pulls in jsdom, whose transitive deps mix CJS/ESM and
  // break when Next bundles them into the serverless function. Keep it external
  // so Node resolves it natively (also needs Node 22 — see package.json engines —
  // where require() of an ES module is supported).
  serverExternalPackages: ["isomorphic-dompurify"],
  images: {
    // Live board mock avatars/attachments are served from these hosts.
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
