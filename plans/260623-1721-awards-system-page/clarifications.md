# Clarifications — Award System Page (Hệ thống giải)

## Session 2026-06-23
- Q: Route for the full page — /he-thong-giai (test cases) or /awards (existing code)? → A: Keep /awards; treat /he-thong-giai as a label, not a literal path. Homepage card links and awardHref already target /awards#slug.
- Q: Require login per TC ID-0/ID-1, or keep public like the homepage? → A: Public, no auth gating. Skip auth-redirect test cases as not-applicable for marketing content.
- Q: Award card 336×336 image — reuse existing composite or require dedicated assets? → A: Reuse existing award-bg.png + name-*.png composite from /public/saa. Dedicated 336×336 renders are a drop-in later.
- Q: Left nav active state — scroll-spy or click-only? → A: Scroll-spy + click. Active updates on scroll (IntersectionObserver) and on click (smooth-scroll to section).
