"use client";

import { useTranslations } from "next-intl";
import AwardsHero from "@/app/components/awards/awards-hero";
import AwardsCategoryNav from "@/app/components/awards/awards-category-nav";
import AwardInfoSection from "@/app/components/awards/award-info-section";
import AwardsKudosBanner from "@/app/components/awards/awards-kudos-banner";
import { AWARDS, AWARD_SLUGS } from "@/app/lib/awards/award-data";
import { useScrollSpy } from "@/app/components/ui/use-scroll-spy";

// Matches the award sections' scroll-margin-top and the sticky nav top so
// deep-link / smooth-scroll targets land just below the sticky site header.
const HEADER_OFFSET = 100;

interface AwardItemContent {
  title: string;
  navLabel: string;
  description: string;
  quantityNumber: string;
  quantityUnit: string;
  prizes: { value: string; note?: string }[];
}

export default function AwardsPage() {
  const t = useTranslations("awardsPage");
  const { activeSlug, scrollTo } = useScrollSpy(AWARD_SLUGS, {
    offset: HEADER_OFFSET,
  });

  const navItems = AWARDS.map((award) => ({
    slug: award.slug,
    label: (t.raw(`items.${award.key}`) as AwardItemContent).navLabel,
  }));

  return (
    <div style={{ backgroundColor: "#00101A", minHeight: "100vh" }}>
      {/* Hero keyvisual */}
      <AwardsHero />

      {/* Main content (title now lives in the hero) */}
      <main className="awards-main">
        {/* Two-column layout: sticky nav + award sections */}
        <div className="awards-layout">
          {/* Left: sticky category nav */}
          <div
            className="awards-nav-sticky"
            style={{
              position: "sticky",
              top: "100px",
              alignSelf: "flex-start",
              flexShrink: 0,
            }}
          >
            <AwardsCategoryNav
              items={navItems}
              activeSlug={activeSlug}
              onSelect={scrollTo}
            />
          </div>

          {/* Right: stacked award info sections */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // Item spacing = 80px → divider → 80px = 161px between award
              // contents (design: card gap 80 + 1px divider + list gap 80).
              gap: 0,
              flex: 1,
              minWidth: 0,
            }}
          >
            {AWARDS.map((award, idx) => {
              const item = t.raw(`items.${award.key}`) as AwardItemContent;
              const prizeLines = item.prizes.map((prize) => ({
                label: t("prizeLabel"),
                value: prize.value,
                note: prize.note,
              }));
              return (
                <div key={award.slug}>
                  <AwardInfoSection
                    slug={award.slug}
                    nameImage={award.nameImage}
                    title={item.title}
                    description={item.description}
                    quantityHeading={t("quantityLabel")}
                    quantityNumber={item.quantityNumber}
                    quantityUnit={item.quantityUnit}
                    prizeLines={prizeLines}
                    orLabel={t("or")}
                    imageOnRight={award.imageOnRight}
                  />
                  {/* Horizontal divider between sections (not after last) */}
                  {idx < AWARDS.length - 1 && (
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1px solid #2E3940",
                        margin: "80px 0",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sun* Kudos promo banner */}
        <AwardsKudosBanner />
      </main>
    </div>
  );
}
