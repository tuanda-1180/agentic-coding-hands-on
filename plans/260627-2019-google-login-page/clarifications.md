# Clarifications

## Session 2026-06-27
- Q: Auth mechanism — design wants Google OAuth but code uses NextAuth Credentials → A: Add Google OAuth provider to existing NextAuth v5; all Google accounts allowed
- Q: Post-login redirect target (/todo does not exist) → A: Redirect to homepage / (/todo out of scope)
- Q: How to handle existing /login page and chrome → A: Replace existing credentials page; keep /login a bare route; build login-specific minimal header (logo + language selector) + footer (copyright)
- Q: Source of the hero wave artwork → A: Export real asset from Figma/MoMorph at implementation time into public/
