"use client";

import Image from "next/image";
import { useState } from "react";

export interface CollectibleIconProps {
  /** Image path under public/ (e.g. "/saa/icon-revival.png") */
  src: string;
  /** Icon label displayed below the circle, e.g. "REVIVAL" */
  label: string;
  /** CSS gradient approximating the design icon, used for the fallback circle. */
  gradient: string;
}

export default function RulesCollectibleIcon({
  src,
  label,
  gradient,
}: CollectibleIconProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        width: "80px",
      }}
    >
      {/* Circular icon — 64×64px (real artwork ships with its own white ring) */}
      <div
        style={{
          position: "relative",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          overflow: "hidden",
          background: imgError ? gradient : "transparent",
          border: imgError ? "1px solid rgba(255,234,158,0.25)" : "none",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}
      >
        {!imgError ? (
          <Image
            src={src}
            alt={label}
            fill
            sizes="64px"
            style={{ objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        ) : (
          /* Gradient fallback that approximates the design icon, with the label
             set inside the circle as the artwork does. */
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 10px",
              color: "#FFFFFF",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "10px",
              lineHeight: "12px",
              letterSpacing: "0.5px",
              textAlign: "center",
              textTransform: "uppercase",
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
            }}
          >
            {label}
          </span>
        )}
      </div>

      {/* Label */}
      <span
        style={{
          color: "#FFFFFF",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "11px",
          lineHeight: "16px",
          letterSpacing: "0.5px",
          textAlign: "center",
          textTransform: "uppercase" as const,
          wordBreak: "break-word" as const,
        }}
      >
        {label}
      </span>
    </div>
  );
}
