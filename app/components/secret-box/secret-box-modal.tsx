"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useDialog } from "@/app/components/ui/use-dialog";
import { FALLBACK_BADGE_ASSET } from "@/app/lib/secret-box/badges";
import * as s from "./secret-box-modal.styles";

/** The badge revealed after opening a box this session. */
export interface RevealedPrize {
  id: string;
  name: string;
  asset: string;
}

export interface SecretBoxModalProps {
  open: boolean;
  /** Number of secret boxes not yet opened (e.g. 5). */
  unopenedCount: number;
  /** Last badge won this session; null → unopened/explore state. */
  prize?: RevealedPrize | null;
  onClose: () => void;
  /** Called when the user clicks the gift-box button. */
  onOpenBox: () => void;
  /** True while the open API call is in flight. */
  opening?: boolean;
}

function CloseIcon({ size = 19 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 19 19"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="2" y1="2" x2="17" y2="17" />
      <line x1="17" y1="2" x2="2" y2="17" />
    </svg>
  );
}

/** Revealed badge image — swaps to a fallback if the asset fails to load (TC: invalid/corrupt badge). */
function BadgeImage({ asset, name }: { asset: string; name: string }) {
  const [src, setSrc] = useState(asset);
  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes="min(557px, 100vw)"
      style={{ objectFit: "contain", borderRadius: "8px" }}
      onError={() => setSrc(FALLBACK_BADGE_ASSET)}
      priority
    />
  );
}

export default function SecretBoxModal({
  open,
  unopenedCount,
  prize = null,
  onClose,
  onOpenBox,
  opening = false,
}: SecretBoxModalProps) {
  const t = useTranslations("secretBox");
  const { dialogRef, backdropProps } = useDialog(open, onClose);

  if (!open) return null;

  const isDisabled = unopenedCount === 0 || opening;
  const opened = prize !== null;

  const boxBtnStyle: CSSProperties = {
    ...s.boxBtnBase,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.5 : 1,
  };

  // Zero-pad to 2 digits to match design ("05"); clamp negatives defensively.
  const countDisplay = String(Math.max(0, unopenedCount)).padStart(2, "0");

  return (
    <div role="presentation" style={s.backdrop} {...backdropProps}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("dialogAriaLabel")}
        style={s.panel}
      >
        {/* ── Header: title + close ────────────────────────────────────── */}
        <div style={s.headerRow}>
          <h2 style={s.titleStyle}>{opened ? t("successTitle") : t("title")}</h2>
          <button type="button" style={s.closeBtnStyle} onClick={onClose} aria-label={t("close")}>
            <CloseIcon size={19} />
          </button>
        </div>

        <div style={s.separatorStyle} aria-hidden="true" />

        {/* ── Instruction (hidden when 0 boxes) ────────────────────────── */}
        {unopenedCount > 0 && (
          <p style={s.instructionStyle}>{opened ? t("instructionContinue") : t("instruction")}</p>
        )}

        {/* ── Gift box / revealed badge — clickable to open the next box ── */}
        <button
          type="button"
          style={boxBtnStyle}
          onClick={isDisabled ? undefined : onOpenBox}
          disabled={isDisabled}
          aria-busy={opening}
          aria-label={t("openBoxAriaLabel")}
        >
          {opened ? (
            <BadgeImage asset={prize.asset} name={prize.name} />
          ) : (
            <Image
              src="/saa/secret-box-closed.png"
              alt={t("boxImageAlt")}
              fill
              sizes="min(557px, 100vw)"
              style={{ objectFit: "cover", borderRadius: "8px" }}
              priority
            />
          )}
        </button>

        {/* ── Revealed badge name ──────────────────────────────────────── */}
        {opened && <p style={s.badgeNameStyle}>{prize.name}</p>}

        <div style={s.bottomSeparatorStyle} aria-hidden="true" />

        {/* ── Counter row ──────────────────────────────────────────────── */}
        <div style={s.counterRow}>
          <span style={s.counterLabelStyle}>{t("unopenedLabel")}</span>
          <span style={s.counterNumberStyle}>{countDisplay}</span>
        </div>
      </div>
    </div>
  );
}
