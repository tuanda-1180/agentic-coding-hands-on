import Image from "next/image";
import { type CSSProperties } from "react";
import type { Sunner } from "@/app/lib/liveboard/types";
import HeroBadge from "./hero-badge";
import { DARK, MUTED } from "./theme";

const avatarCss: CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  border: "1.869px solid white",
  objectFit: "cover",
  flexShrink: 0,
};

/**
 * Avatar + name + a row of [team · hero badge · dot]. The hero badge sits to the
 * right of the department (phòng ban). Shared by highlight and feed kudos cards.
 */
export default function SunnerBlock({ sunner }: { sunner: Sunner }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "13px", flex: 1, minWidth: 0 }}>
      <Image src={sunner.avatarUrl} alt={sunner.name} width={64} height={64} unoptimized style={avatarCss} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", width: "100%" }}>
        <span style={{ fontSize: "16px", fontWeight: 700, color: DARK, textAlign: "center", lineHeight: "24px", letterSpacing: "0.15px" }}>
          {sunner.name}
        </span>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: MUTED, letterSpacing: "0.1px", whiteSpace: "nowrap" }}>
            {sunner.team}
          </span>
          {sunner.badge && (
            <>
              {/* dot separator between team and badge */}
              <span aria-hidden="true" style={{ width: "4px", height: "4px", borderRadius: "50%", background: MUTED, opacity: 0.4, flexShrink: 0 }} />
              <HeroBadge label={sunner.badge.label} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
