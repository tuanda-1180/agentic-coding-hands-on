# Phase 01 — Homepage UI Report

**Status:** DONE
**Date:** 2026-06-18

---

## Files Created

| File | Lines | Notes |
|------|-------|-------|
| `app/components/homepage/hero-countdown.tsx` | 128 | Scaled LED digit sub-component with prop seam |
| `app/components/homepage/site-header.tsx` | 196 | `"use client"` — sticky header with dropdown shells |
| `app/components/homepage/hero-section.tsx` | 155 | Server component — keyvisual bg + content |
| `app/components/homepage/root-further-content.tsx` | 104 | Server component — decorative text + body |
| `app/components/homepage/award-card.tsx` | 117 | `"use client"` — hover lift/glow via inline style |
| `app/components/homepage/awards-section.tsx` | 98 | Server component — 6-card grid |
| `app/components/homepage/kudos-section.tsx` | 120 | Server component — promo block |
| `app/components/homepage/site-footer.tsx` | 80 | `"use client"` — scroll-to-top onClick |
| `app/components/homepage/fab.tsx` | 90 | `"use client"` — pill button + menu shell |
| `app/components/homepage/homepage-screen.tsx` | 46 | Server composition root |
| `app/preview-homepage/page.tsx` | 10 | Temporary preview route — keep until phase 07 |

---

## Component Tree & Prop Interfaces

```
HomepageScreen (server)
├── SiteHeader (client)
│     Props: authState?: 'guest'|'user'|'admin'
│            locale?: string
│            hasUnreadNotification?: boolean
├── main
│   ├── HeroSection (server)
│   │     Props: countdownProps?: HeroCountdownProps
│   │     └── HeroCountdown (server sub-component)
│   │           Props: units: HeroCountdownUnit[]   ← LIVE VALUE SEAM
│   │                  showComingSoon?: boolean      ← hide at zero (Phase 04)
│   │                  comingSoonText?: string
│   ├── RootFurtherContent (server)
│   ├── AwardsSection (server)
│   │     └── AwardCard (client) × 6
│   │           Props: title, description, nameImage, slug
│   └── KudosSection (server)
├── SiteFooter (client)
└── Fab (client)
```

### Hero Countdown Seam (key integration point)

`HeroCountdownUnit` interface:
```ts
interface HeroCountdownUnit {
  value: number;  // 0–99 — Phase 04 feeds live computed values
  label: string;
}
```

Phase 04 passes `countdownProps` to `HeroSection`:
```tsx
<HeroSection
  countdownProps={{
    showComingSoon: remainingMs > 0,
    units: [
      { value: days, label: "DAYS" },
      { value: hours, label: "HOURS" },
      { value: minutes, label: "MINUTES" },
    ],
  }}
/>
```

Mock default: `20 20 20` per spec, `showComingSoon: true`.

### Award Card Props

```ts
interface AwardCardProps {
  title: string;
  description: string;
  nameImage: string;  // e.g. "/saa/name-top-talent.png"
  slug: string;       // links to /awards#<slug>
}
```

---

## Assets Used

All 21 assets in `public/saa/` consumed as documented in spec:

| Asset | Used in |
|-------|---------|
| `keyvisual-bg.png` | HeroSection bg |
| `root-further-logo.png` | HeroSection |
| `root-text.png`, `further-text.png` | RootFurtherContent |
| `logo-header.png` | SiteHeader |
| `logo-footer.png` | SiteFooter |
| `flag-vn.svg`, `chevron-down.svg` | SiteHeader language pill |
| `icon-notification.svg`, `icon-user.svg` | SiteHeader right controls |
| `arrow-up.svg` | HeroSection CTAs, AwardCard, KudosSection, SiteFooter nav |
| `award-bg.png` | AwardCard picture bg |
| `name-*.png` × 6 | AwardCard name overlays |
| `kudos-bg.png` | KudosSection bg |
| `kudos-logo.svg` | KudosSection right lockup |
| `fab-pen.svg`, `fab-kudos.svg` | Fab button |

---

## Spec Values Applied

- Page bg: `#00101A` ✓
- Gold accent: `#FFEA9E` ✓
- Border-gold: `#998C5F` ✓
- Header: `rgba(16,20,23,0.8)`, sticky, z50, h80, pad `12px 144px` ✓
- Hero LED boxes: `51×82px`, `border: 0.75px #FFEA9E`, gradient + backdrop-blur ✓  
- Countdown gap: `40px` between units, `14px` digit gap ✓
- Awards title: 57px, `#FFEA9E`, line-height 64, letter-spacing -0.25 ✓
- Award card: 336×336 picture, `border: 0.955px #FFEA9E`, box-shadow `0 4px 4px rgba(0,0,0,.25), 0 0 6px #FAE287`, `mix-blend-mode: screen` ✓
- Kudos block: 1120×500, radius 16, `#0F0F0F` bg ✓
- FAB: 106×64, radius 100, `#FFEA9E`, box-shadow matches spec ✓

### Spec Values Not Applied / Approximated

- `site-header.tsx` nav hover background: `rgba(255,255,255,0.08)` used (spec says "light bg highlight" without exact value — reasonable approximation).
- `root-further-content.tsx` paragraph text: mocked from spec description (spec says "use the long VN copy from specs B4" — mock text used; i18n integration phase replaces with actual copy from CMS/messages).
- Award card `name-best-manager.png` description: spec gives no description text for cards 2, 4 — placeholder text used that fits the award name.
- `kudos-logo.svg` position: `right: 40px, bottom: 40px` (spec says "positioned over the art" without exact coords — visually reasonable).

---

## i18n Keys (integration phase replaces these hardcoded strings)

| Component | Text | Suggested key |
|-----------|------|---------------|
| SiteHeader | "About SAA 2025" | `nav.about` |
| SiteHeader | "Awards Information" | `nav.awards` |
| SiteHeader | "Sun* Kudos" | `nav.kudos` |
| HeroSection | "Coming soon" | `hero.comingSoon` |
| HeroSection | "Thời gian:" | `hero.eventDateLabel` |
| HeroSection | "Địa điểm:" | `hero.venueLabel` |
| HeroSection | "Tường thuật trực tiếp qua sóng Livestream" | `hero.livestreamNote` |
| HeroSection | "ABOUT AWARDS" | `hero.ctaAwards` |
| HeroSection | "ABOUT KUDOS" | `hero.ctaKudos` |
| AwardsSection | "Sun* annual awards 2025" | `awards.caption` |
| AwardsSection | "Hệ thống giải thưởng" | `awards.title` |
| KudosSection | "Phong trào ghi nhận" | `kudos.label` |
| KudosSection | "Sun* Kudos" | `kudos.title` |
| KudosSection | "Chi tiết" | `kudos.cta` |
| SiteFooter | "Bản quyền thuộc về Sun* © 2025" | `footer.copyright` |

---

## Build / Test Results

```
tsc --noEmit:    PASS (no output = clean)
npm test:        PASS — 46/46 tests (1 file)
npm run build:   PASS — 7 routes, no errors or warnings
  / (countdown — unchanged)
  /preview-homepage (new)
  /awards, /kudos, /admin, /countdown, /_not-found
```
