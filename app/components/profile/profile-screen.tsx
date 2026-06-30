"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import StatsPanel from "@/app/components/liveboard/stats-panel";
import { useSecretBox } from "@/app/components/secret-box/secret-box-provider";
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
} from "./profile-screen.styles";

export interface ProfileScreenProps {
  /**
   * When set, renders another user's public profile ("Profile người khác"):
   * data is read from the public endpoints and personal-only parts (secret box,
   * icon collection) are hidden. Omit for the signed-in user's own profile.
   */
  userId?: string;
}

// Connected root for the profile page. All data comes from the Supabase-backed
// API via useProfileData(); the received/sent filter drives the feed direction.
export default function ProfileScreen({ userId }: ProfileScreenProps = {}) {
  const t = useTranslations("profile");
  const publicView = !!userId;
  const data = useProfileData(userId ? { userId } : undefined);
  const secretBox = useSecretBox();

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

  // Open the Secret Box modal (global provider); the modal loads the live
  // unopened count and drives the server-side open flow.
  const handleOpenGift = () => secretBox?.open();

  const fullScreenMessage = (msg: string) => (
    <div style={{ ...pageStyle, ...emptyStateStyle, paddingTop: "120px" }}>{msg}</div>
  );

  // Distinguish: still loading · fetch failed · resolved but no user.
  // Own profile with no user = not signed in; public profile = user not found.
  if (data.error) return fullScreenMessage(publicView ? t("loadErrorOther") : t("loadError"));
  if (!data.profile) return fullScreenMessage(t("loading"));
  if (!sunner) return fullScreenMessage(publicView ? t("notFound") : t("notLoggedIn"));

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
          <ProfileHeader
            user={user}
            iconCollection={iconCollection}
            showCollection={!publicView}
          />
        </div>
      </div>

      {/* Body */}
      <main>
        <div style={bodyStyle}>
          {/* mms_B — Stats card */}
          <StatsPanel stats={stats} onOpenGift={handleOpenGift} publicView={publicView} />

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
    </div>
  );
}
