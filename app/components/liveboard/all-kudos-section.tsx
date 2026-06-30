"use client";

import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { KudosPost, Stats, LeaderboardEntry } from "@/app/lib/liveboard/types";
import { useSecretBox } from "@/app/components/secret-box/secret-box-provider";
import AllKudosFeed from "./all-kudos-feed";
import LiveboardSidebar from "./liveboard-sidebar";
import { GOLD } from "./theme";

export interface AllKudosSectionProps {
  posts: KudosPost[];
  stats: Stats | null;
  leaderboardGifts: LeaderboardEntry[];
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  onToggleLike?: (id: string) => void;
  onHashtagClick?: (tag: string) => void;
  onEdit?: (kudos: KudosPost) => void;
}

const sectionWrapperStyle: CSSProperties = { backgroundColor: "#00101A", padding: "48px 0" };
const sectionHeaderStyle: CSSProperties = { width: "100%", margin: "0 0 32px 0", padding: "0 144px", boxSizing: "border-box" };
const eyebrowStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "24px", color: "#FFFFFF", margin: "0 0 12px 0",
};
const separatorStyle: CSSProperties = { height: "1px", background: "#2E3940", margin: "0 0 12px 0" };
const sectionTitleStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "57px", color: GOLD, margin: 0,
};
const bodyStyle: CSSProperties = {
  width: "100%", display: "flex", flexDirection: "row", gap: "40px", alignItems: "flex-start", padding: "0 144px", boxSizing: "border-box",
};

const ZERO_STATS: Stats = {
  kudosReceived: 0, kudosSent: 0, heartsReceived: 0, secretBoxOpened: 0, secretBoxUnopened: 0,
};

export default function AllKudosSection({
  posts,
  stats,
  leaderboardGifts,
  hasMore,
  loadingMore,
  onLoadMore,
  onToggleLike,
  onHashtagClick,
  onEdit,
}: AllKudosSectionProps) {
  const t = useTranslations("liveboard");
  const secretBox = useSecretBox();

  return (
    <section style={sectionWrapperStyle} aria-label="All Kudos">
      <div style={sectionHeaderStyle}>
        <p style={eyebrowStyle}>{t("sectionLabel")}</p>
        <div style={separatorStyle} />
        <p style={sectionTitleStyle}>{t("allKudosTitle")}</p>
      </div>

      <div style={bodyStyle}>
        <AllKudosFeed
          items={posts}
          onCopyLink={() => {}}
          emptyMessage={t("emptyFeed")}
          loadingLabel={t("loading")}
          onToggleLike={onToggleLike}
          onHashtagClick={onHashtagClick}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={onLoadMore}
          onEdit={onEdit}
        />
        <LiveboardSidebar
          stats={stats ?? ZERO_STATS}
          leaderboardGifts={leaderboardGifts}
          onOpenGift={() => secretBox?.open()}
        />
      </div>
    </section>
  );
}
