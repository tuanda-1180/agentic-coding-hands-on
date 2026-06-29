"use client";

import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { KudosPost } from "@/app/lib/liveboard/types";
import SunnerBlock from "./sunner-block";
import HeartButton from "./heart-button";
import { GOLD, DARK, MUTED, RED } from "./theme";

export interface HighlightKudosCardProps {
  kudos: KudosPost;
  isCenter: boolean;
  onCopyLink: (id: string) => void;
  onViewDetail: (id: string) => void;
  onHashtagClick: (tag: string) => void;
  onToggleLike?: (id: string) => void;
}
const sep: CSSProperties = { height: "1px", background: GOLD, width: "100%" };

// Card actions (design button 186:1433): borderless, text then trailing icon.
const actionBtn = (width: number): CSSProperties => ({
  width: `${width}px`, height: "56px", padding: "16px", borderRadius: "4px",
  border: "none", background: "transparent",
  fontSize: "14px", fontWeight: 700, color: DARK, cursor: "pointer",
  fontFamily: "var(--font-montserrat)",
  display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "4px",
});

export default function HighlightKudosCard({ kudos, isCenter, onCopyLink, onViewDetail, onHashtagClick, onToggleLike }: HighlightKudosCardProps) {
  const t = useTranslations("liveboard");
  const d = new Date(kudos.postedAt);
  const postedAt = `${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${d.toLocaleDateString("vi-VN")}`;

  return (
    <div style={{ width: "528px", minWidth: "528px", height: "525px", boxSizing: "border-box", overflow: "hidden",
      border: `4px solid ${GOLD}`, borderRadius: "16px",
      background: "#FFF8E1", padding: "24px 24px 16px 24px", display: "flex", flexDirection: "column", gap: "12px",
      fontFamily: "var(--font-montserrat)", transition: "opacity 0.3s, transform 0.3s",
      opacity: isCenter ? 1 : 0.5, transform: isCenter ? "scale(1)" : "scale(0.9)" }}>

      {/* Sender / send-icon / Receiver */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", width: "100%" }}>
        <SunnerBlock sunner={kudos.sender} />
        {/* Send icon (design MM_MEDIA_Send), dark for contrast on the cream card */}
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "16px" }}>
          <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
        <SunnerBlock sunner={kudos.receiver} />
      </div>

      <div style={sep} />

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "16px", color: MUTED, letterSpacing: "0.5px" }}>{postedAt}</span>
        <span style={{ fontSize: "16px", fontWeight: 700, color: DARK, textAlign: "center" }}>{kudos.hashtag}</span>
        <div style={{ border: `1px solid ${GOLD}`, borderRadius: "12px", background: "rgba(255,234,158,0.4)", padding: "16px 24px" }}>
          <p style={{ fontSize: "20px", fontWeight: 700, color: DARK, margin: 0,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {kudos.content}
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {kudos.tags.map((tag) => (
            <button key={tag} onClick={() => onHashtagClick(tag)} style={{ background: "none", border: "none",
              cursor: "pointer", padding: 0, fontSize: "16px", fontWeight: 700, color: RED,
              letterSpacing: "0.5px", fontFamily: "var(--font-montserrat)" }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Separator + action bar pinned to the bottom of the fixed-height card */}
      <div style={{ ...sep, marginTop: "auto" }} />

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
        {/* Hearts section: count then heart icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <HeartButton count={kudos.heartCount} liked={kudos.liked} onToggle={() => onToggleLike?.(kudos.id)} iconSize={32} fontSize={24} restColor={DARK} />
        </div>
        {/* Buttons section — both use the same bordered variant (design 186:1433) */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => onCopyLink(kudos.id)} style={actionBtn(144)}>
            {t("copyLink")}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>
          <button onClick={() => onViewDetail(kudos.id)} style={actionBtn(163)}>
            {t("viewDetail")}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
