"use client";

import Image from "next/image";
import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { KudosPost } from "@/app/lib/liveboard/types";
import SunnerBlock from "./sunner-block";
import HeartButton from "./heart-button";
import { GOLD, DARK, MUTED, RED } from "./theme";

export interface KudosPostCardProps {
  kudos: KudosPost;
  onCopyLink: (id: string) => void;
  onHashtagClick?: (tag: string) => void;
  onToggleLike?: (id: string) => void;
}

const sep: CSSProperties = { height: "1px", background: GOLD, width: "100%" };
const imgCss: CSSProperties = { borderRadius: "18px", border: "1px solid #998C5F", objectFit: "cover" };

// Single active toast, auto-dismisses after 3s
let _tt: ReturnType<typeof setTimeout> | null = null;
function showToast(msg: string) {
  const prev = document.getElementById("kudos-toast");
  if (prev) { prev.remove(); if (_tt) clearTimeout(_tt); }
  const el = Object.assign(document.createElement("div"), { id: "kudos-toast", textContent: msg });
  Object.assign(el.style, { position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)", background: DARK, color: GOLD, border: `1px solid ${GOLD}`, borderRadius: "8px", padding: "12px 24px", fontFamily: "var(--font-montserrat)", fontWeight: "700", fontSize: "15px", zIndex: "9999", pointerEvents: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" });
  document.body.appendChild(el);
  _tt = setTimeout(() => el.remove(), 3000);
}

export default function KudosPostCard({ kudos, onCopyLink, onHashtagClick, onToggleLike }: KudosPostCardProps) {
  const t = useTranslations("liveboard");
  const postedDate = new Date(kudos.postedAt);
  const postedAt = `${postedDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${postedDate.toLocaleDateString("vi-VN")}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.href}#${kudos.id}`).catch(() => {});
    showToast(t("linkCopied"));
    onCopyLink(kudos.id);
  };

  return (
    <div id={kudos.id} style={{ background: "rgba(255,248,225,1)", borderRadius: "24px", padding: "40px 40px 16px 40px", display: "flex", flexDirection: "column", gap: "16px", fontFamily: "var(--font-montserrat)" }}>

      {/* 1. Info row: sender / send-icon / receiver */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", width: "100%" }}>
        <SunnerBlock sunner={kudos.sender} />
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "16px" }} aria-hidden="true">
          <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
        <SunnerBlock sunner={kudos.receiver} />
      </div>

      <div style={sep} />

      {/* 3. Time */}
      <span style={{ fontSize: "16px", color: MUTED, letterSpacing: "0.5px" }}>{postedAt}</span>

      {/* 4. Hashtag row + pencil */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "16px", fontWeight: 700, color: DARK }}>{kudos.hashtag}</span>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke={DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 5. Content box */}
      <div style={{ border: `1px solid ${GOLD}`, borderRadius: "12px", background: "rgba(255,234,158,0.4)", padding: "16px 24px" }}>
        <p style={{ fontSize: "20px", fontWeight: 700, color: DARK, margin: 0, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {kudos.content}
        </p>
      </div>

      {/* 6. Image gallery */}
      {kudos.images.slice(0, 5).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {kudos.images.slice(0, 5).map((src, i) => (
            <Image key={i} src={src} alt="" width={88} height={88} unoptimized style={imgCss} />
          ))}
        </div>
      )}

      {/* 7. Tag pills */}
      {kudos.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {kudos.tags.map((tag) => (
            <button key={tag} type="button" onClick={() => onHashtagClick?.(tag)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "16px", fontWeight: 700, color: RED, letterSpacing: "0.5px", fontFamily: "var(--font-montserrat)" }}>
              {tag}
            </button>
          ))}
        </div>
      )}

      <div style={sep} />

      {/* 9. Action bar: hearts (left) + Copy link button (right, 144×56) */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
        <HeartButton count={kudos.heartCount} liked={kudos.liked} onToggle={() => onToggleLike?.(kudos.id)} iconSize={18} fontSize={16} fontWeight={600} restColor={MUTED} iconFirst />
        <button type="button" onClick={handleCopyLink} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "4px", width: "144px", height: "56px", padding: "16px", borderRadius: "4px", border: "none", background: "transparent", fontSize: "14px", fontWeight: 700, color: DARK, cursor: "pointer", fontFamily: "var(--font-montserrat)" }}>
          {t("copyLink")}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
      </div>
    </div>
  );
}
