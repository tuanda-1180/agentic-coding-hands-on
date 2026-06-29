"use client";

import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import LiveboardBanner from "./liveboard-banner";
import HighlightKudosSection from "./highlight-kudos-section";
import SpotlightBoard from "./spotlight-board";
import AllKudosSection from "./all-kudos-section";
import { useLiveboardData } from "@/app/lib/liveboard/use-liveboard-data";

// Root composition for the Sun* Kudos - Live Board screen.
// All data comes from the Supabase-backed API via useLiveboardData().

const screenStyle: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#00101A",
  display: "flex",
  flexDirection: "column",
};

export default function LiveboardScreen() {
  const t = useTranslations("liveboard");
  const data = useLiveboardData();

  return (
    <div style={screenStyle}>
      <LiveboardBanner />

      <HighlightKudosSection
        items={data.highlights}
        hashtags={data.filters.hashtags}
        departments={data.filters.departments}
        selectedHashtag={data.hashtag}
        selectedDepartment={data.department}
        onSelectHashtag={data.setHashtag}
        onSelectDepartment={data.setDepartment}
        onToggleLike={data.toggleLike}
      />

      <SpotlightBoard
        nodes={data.spotlight?.nodes ?? []}
        totalKudos={data.spotlight?.total ?? 0}
      />

      <AllKudosSection
        posts={data.feed}
        stats={data.stats}
        leaderboardGifts={data.gifts}
        hasMore={data.hasMore}
        loadingMore={data.loadingMore}
        onLoadMore={data.loadMore}
        onToggleLike={data.toggleLike}
        onHashtagClick={data.setHashtag}
      />

      <footer
        style={{
          textAlign: "center",
          padding: "40px 144px",
          fontFamily: "var(--font-montserrat)",
          fontSize: "14px",
          color: "rgba(255,255,255,0.5)",
          borderTop: "1px solid #2E3940",
        }}
      >
        {t("copyright")}
      </footer>
    </div>
  );
}
