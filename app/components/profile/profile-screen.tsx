"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import StatsPanel from "@/app/components/liveboard/stats-panel";
import KudosPostCard from "@/app/components/liveboard/kudos-post-card";
import { useProfileData } from "@/app/lib/liveboard/use-profile-data";
import ProfileHeader, { type ProfileUser } from "./profile-header";
import AwardsFeedHeader from "./awards-feed-header";
import {
  pageStyle,
  heroZoneStyle,
  keyvisualStyle,
  keyvisualOverlayStyle,
  profileHeaderOverlapStyle,
  bodyStyle,
  feedSectionStyle,
  feedStyle,
  emptyStateStyle,
  loadMoreStyle,
  toastStyle,
} from "./profile-screen.styles";

// Connected root for "Profile bản thân". All data comes from the Supabase-backed
// API via useProfileData(); the received/sent filter drives the feed direction.
export default function ProfileScreen() {
  const t = useTranslations("profile");
  const data = useProfileData();
  const [toast, setToast] = useState<string | null>(null);

  const sunner = data.profile?.user ?? null;
  const stats = data.profile?.stats ?? {
    kudosReceived: 0,
    kudosSent: 0,
    heartsReceived: 0,
    secretBoxOpened: 0,
    secretBoxUnopened: 0,
  };
  const iconCollection = data.profile?.iconCollection ?? { unlocked: 0, total: 6 };
  const counts = { received: stats.kudosReceived, sent: stats.kudosSent };

  // "Mở Secret Box" is a placeholder per spec — show a transient "coming soon" toast.
  const handleOpenGift = () => {
    setToast(t("comingSoon"));
    window.setTimeout(() => setToast(null), 3000);
  };

  const fullScreenMessage = (msg: string) => (
    <div style={{ ...pageStyle, ...emptyStateStyle, paddingTop: "120px" }}>{msg}</div>
  );

  // Distinguish: still loading · fetch failed · resolved but no current user.
  if (data.error) return fullScreenMessage(t("loadError"));
  if (!data.profile) return fullScreenMessage(t("loading"));
  if (!sunner) return fullScreenMessage(t("notLoggedIn"));

  const user: ProfileUser = {
    name: sunner.name,
    department: sunner.team,
    badgeLabel: sunner.badge?.label ?? "",
    avatarUrl: sunner.avatarUrl, // UserAvatar handles the empty-src fallback
  };

  return (
    <div style={pageStyle}>
      {/* Hero zone: keyvisual + overlapping profile header */}
      <div style={heroZoneStyle}>
        <div style={keyvisualStyle} className="profile-keyvisual">
          <Image
            src="/saa/banner-bg.png"
            alt=""
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
          <div style={keyvisualOverlayStyle} aria-hidden="true" />
        </div>
        <div style={profileHeaderOverlapStyle} className="profile-hero-overlap">
          <ProfileHeader user={user} iconCollection={iconCollection} />
        </div>
      </div>

      {/* Body */}
      <main>
        <div style={bodyStyle}>
          {/* mms_B — Stats card */}
          <StatsPanel stats={stats} onOpenGift={handleOpenGift} />

          {/* mms_C header + mms_D feed */}
          <div style={feedSectionStyle}>
            <AwardsFeedHeader
              filter={data.filter}
              counts={counts}
              onFilterChange={data.setFilter}
            />

            {data.loading ? (
              <div style={emptyStateStyle}>{t("loading")}</div>
            ) : data.feed.length === 0 ? (
              <div style={emptyStateStyle}>{t("emptyFeed")}</div>
            ) : (
              <div style={feedStyle}>
                {data.feed.map((kudos) => (
                  <KudosPostCard
                    key={kudos.id}
                    kudos={kudos}
                    onCopyLink={() => {}}
                    onToggleLike={data.toggleLike}
                  />
                ))}
                {data.hasMore && (
                  <button
                    type="button"
                    style={loadMoreStyle}
                    onClick={data.loadMore}
                    disabled={data.loadingMore}
                  >
                    {data.loadingMore ? t("loading") : t("loadMore")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {toast && <div style={toastStyle} role="status">{toast}</div>}
    </div>
  );
}
