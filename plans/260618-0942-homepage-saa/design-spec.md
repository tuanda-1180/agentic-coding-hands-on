# Homepage SAA — Design Spec (authoritative, extracted from MoMorph)

Frame 1512 wide. Content column max-width **1224px**, centered (side margin 144px). Page bg `#00101A`.
Fonts: **Montserrat** (already loaded as `--font-montserrat`). Gold accent `#FFEA9E`; border-gold `#998C5F`; dark text `#00101A`.
Assets in `public/saa/` (listed per section). Build presentational components with mock data; do NOT invent data.

## Layering (top→bottom of hero area)
1. `keyvisual-bg.png` (1512×1392) — full-bleed hero background, cover.
2. Dark overlay (the `Cover` rect) for text contrast over the left side — use a left-dark gradient similar to `linear-gradient(...)` so left text is readable (approximate; bg art is on the right).
3. Header (sticky) + hero content on top.

## Header (sticky, top) — `app/components/homepage/site-header.tsx`
- Bar: full width, height 80, padding `12px 144px`, bg `rgba(16,20,23,0.8)` (semi-transparent dark), `display:flex; justify-content:space-between; align-items:center`. Sticky/fixed top, z above hero.
- Left group (gap 64): **logo** `public/saa/logo-header.png` (52×48) + nav (gap 24):
  - Nav text: **Montserrat 700, 14px, line-height 20, letter-spacing 0.1, padding 16** (node A1.2/A1.3).
  - "About SAA 2025" — SELECTED: text gold `#FFEA9E` + gold glow `text-shadow:0 4px 4px rgba(0,0,0,.25), 0 0 6px #FAE287` + `border-bottom:1px solid #FFEA9E`.
  - "Awards Information" / "Sun* Kudos" — default: white text. Hover mimics the active look (gold text + gold underline + glow).
  - Links use i18n keys (nav.*). About→`#about`/scroll-top; Awards→`/awards`; Kudos→`/kudos`.
- Right group (gap 16), order **bell → language → user**: **Notification** button (40×40, icon `icon-notification.svg` 24, radius 4) with red dot badge `#D4271D` 8×8 top-right when unread — **always shown** (guests get an empty panel). **Language** pill (108×56, padding 16, radius 4): `flag-vn.svg` + "VN" (Montserrat) + `chevron-down.svg`. **User** button (40×40, border `1px #998C5F`, radius 4, `icon-user.svg` 24).
- All three right controls are dropdown triggers (menus wired in later phases — render the buttons + a11y-ready menu shell).

## Hero — `app/components/homepage/hero-section.tsx`
Column, gap 40, starts ~144px from left, vertically in the keyvisual. The **keyvisual is full-bleed from the very top (y=0), behind the translucent sticky header** (hero `margin-top:-80px`); hero content `padding-top:184px` so ROOT FURTHER sits at its design Y (frame node 2167:9032).
- **ROOT FURTHER logo**: image `public/saa/root-further-logo.png` (451×200).
- **Countdown block** (gap 16): subtitle "Coming soon" (Montserrat 700, 24px, white) + countdown row.
  - Countdown row (gap 40): 3 units (DAYS/HOURS/MINUTES). Each unit = column gap 14: a digit-pair row (gap 14, two LED digit boxes) + label (Montserrat 700, 24px, white).
  - **Reuse the existing LED digit look** (glass box, gold border `#FFEA9E`, white→transparent gradient, backdrop-blur) from `app/components/countdown/led-digit.tsx`, scaled to the hero size (digit-pair row is 116px wide incl 14 gap → each box ≈ 51×82). Mock value "20 20 20". (Phase 04 wires live values + hides "Coming soon" at zero — leave a clear seam: render via a prop-driven sub-component.)
- **Event info** (col gap 8): **one row** (gap 60) of two label+value pairs (each pair = row, align center, gap 8): "Thời gian:" (white 16px, ls .15) + "26/12/2025" (gold `#FFEA9E` 24px); "Địa điểm:" (white 16px) + "Âu Cơ Art Center" (gold 24px). Then "Tường thuật…Livestream" (white 16px, ls .5). All Montserrat 700.
- **CTA** (row, gap 40) — use the reusable **`.cta-button`** classes in `globals.css` (`--primary` gold / `--secondary` outline). Padding `16px 24px`, radius 8, Montserrat 700 22px. Arrow (`.cta-button__icon`) recolors via `currentColor` (dark on gold, white on outline). Hover: lift + gold glow; the outline button fills gold (spec B3.2). "ABOUT AWARDS"→`/awards` (primary), "ABOUT KUDOS"→`/kudos` (secondary).

## Root Further content — `app/components/homepage/root-further-content.tsx`
Below hero (frame node 3204:10152, col gap 32, centered). Lettering **stacked vertically, centered**: `root-text.png` (189×67) on top, `further-text.png` (290×67) below, same center, no gap. Then the B4 copy via i18n keys `rootFurther.*`: **intro1/2/3** (3 paragraphs) → **quote + quoteAttrib** → **outro1/2** (2 paragraphs). Body = Montserrat **700, 24px, line-height 32, text-align justify, white**; quote = Montserrat **700, 20px, centered, white** (NOT gold/italic). Use the EXACT design text (nodes 3204:10156 / 10161 / 10162) — do not paraphrase.

## Awards section — `app/components/homepage/awards-section.tsx` + `award-card.tsx`
- Header (C1, gap 16): caption "Sun* annual awards 2025" (white Montserrat 700 24px); divider 1px `#2E3940`; title "Hệ thống giải thưởng" (gold `#FFEA9E`, Montserrat 700, **57px**, line-height 64, letter-spacing -0.25).
- Grid: **3 columns desktop, 2 tablet, 1 mobile**, card width 336. 6 cards.
- **award-card** (width 336, column gap 24, height ~504):
  - Picture (336×336): background image `award-bg.png` (the glowing gold ring graphic), border `0.955px #FFEA9E`, radius 24, box-shadow `0 4px 4px rgba(0,0,0,.25), 0 0 6px #FAE287`, `mix-blend-mode: screen`. Centered award-name image overlay (per card).
  - Frame (gap 4): title (Montserrat 400, 24px, gold `#FFEA9E`); description (Montserrat 400, 16px, white, line-height 24, letter-spacing .5, max 2 lines + ellipsis); "Chi tiết" link (Montserrat 500, 16px, white) + `arrow-up.svg`.
  - 6 cards data `{ title, description, image(name png), slug }`:
    1. Top Talent — `name-top-talent.png` — "Vinh danh top cá nhân xuất sắc trên mọi phương diện" — slug `top-talent`
    2. Top Project — `name-top-project.png` — slug `top-project`
    3. Top Project Leader — `name-top-project-leader.png` — "Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá" — slug `top-project-leader`
    4. Best Manager — `name-best-manager.png` — slug `best-manager`
    5. Signature 2025 - Creator — `name-signature-creator.png` — slug `signature-2025-creator`
    6. MVP (Most Valuable Person) — `name-mvp.png` — slug `mvp`
  - Each card (image/title/Chi tiết) links to `/awards#<slug>` (hash nav wired in phase 06). Hover: lift + glow.
  - Shared award ring graphic: `award-bg.png`. Name images per card above.

## Sun* Kudos — `app/components/homepage/kudos-section.tsx`
- Block 1120×500 (within 1224 column), radius 16, dark `#0F0F0F`, background image `kudos-bg.png` (cover; art on right). 
- Left content (column gap 32, width ~457, left padding ~64): label "Phong trào ghi nhận" (small, gold/white) + title "Sun* Kudos" (large white) + description (the kudos promo paragraph, white) + "Chi tiết" button (gold bg `#FFEA9E`, dark text, padding ~16/24, radius 8, + arrow) → `/kudos`.
- Right: `kudos-logo.svg` (the large "KUDOS" lockup, 364×72) positioned over the art.

## Footer — `app/components/homepage/site-footer.tsx`
- Logo `logo-footer.png` (left) + nav links center ("About SAA 2025", "Awards Information", "Sun* Kudos", "Tiêu chuẩn chung") + copyright right "Bản quyền thuộc về Sun* © 2025". Dark bar. Logo → home + scroll top. Use i18n keys.

## Floating Action Button — `app/components/homepage/fab.tsx`
- Fixed bottom-right (≈ right 19px, vertically centered-lower). Pill 106×64, padding 16, radius 100, bg `#FFEA9E`, box-shadow `0 4px 4px rgba(0,0,0,.25), 0 0 6px #FAE287`.
- Contents (gap 8, row): `fab-pen.svg` (24) + "/" (Montserrat 700, 24px, `#00101A`) + `fab-kudos.svg` (24).
- Click → quick-action menu (wired phase 06). Render button + a11y menu shell.

## Assembly — `app/components/homepage/homepage-screen.tsx`
Compose: SiteHeader (sticky) + Hero (over keyvisual-bg) + RootFurtherContent + AwardsSection + KudosSection + Footer + FAB. Full dark page. Do NOT mount at `/` yet (integration phase 07 swaps the home route). Provide a clean default export consumed later.
