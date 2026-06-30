"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import type { KudosPost } from "@/app/lib/liveboard/types";
import KudosPostCard from "./kudos-post-card";

export interface AllKudosFeedProps {
  items: KudosPost[];
  onCopyLink: (id: string) => void;
  emptyMessage?: string;
  onToggleLike?: (id: string) => void;
  onHashtagClick?: (tag: string) => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  loadingLabel?: string;
  /** Opens the edit modal for a kudo (only shown on the current user's own kudos). */
  onEdit?: (kudos: KudosPost) => void;
}

const feedStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  width: "680px",
  minWidth: "0",
  flexShrink: 0,
};

const emptyStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 24px",
  fontFamily: "var(--font-montserrat)",
  fontSize: "18px",
  color: "rgba(255,255,255,0.5)",
  textAlign: "center",
};

export default function AllKudosFeed({
  items,
  onCopyLink,
  emptyMessage,
  onToggleLike,
  onHashtagClick,
  hasMore,
  loadingMore,
  onLoadMore,
  loadingLabel,
  onEdit,
}: AllKudosFeedProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll: load the next page when the sentinel enters the viewport.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || !onLoadMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // loadingMore intentionally omitted — the loadMore() guard handles re-entry;
    // including it would needlessly re-attach the observer each fetch.
  }, [hasMore, onLoadMore]);

  if (items.length === 0) {
    return (
      <div style={feedStyle}>
        <div style={emptyStyle}>{emptyMessage ?? "Hiện tại chưa có Kudos nào."}</div>
      </div>
    );
  }

  return (
    <div style={feedStyle}>
      {items.map((kudos) => (
        <KudosPostCard
          key={kudos.id}
          kudos={kudos}
          onCopyLink={onCopyLink}
          onHashtagClick={onHashtagClick}
          onToggleLike={onToggleLike}
          editable={kudos.isMine}
          onEdit={onEdit}
        />
      ))}
      {hasMore && (
        <div ref={sentinelRef} style={{ ...emptyStyle, padding: "24px" }}>
          {loadingMore ? loadingLabel ?? "..." : ""}
        </div>
      )}
    </div>
  );
}
