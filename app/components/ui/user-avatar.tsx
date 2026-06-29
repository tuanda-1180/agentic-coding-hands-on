"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GOLD } from "@/app/components/liveboard/theme";
import UserAvatarCard, { type UserAvatarInfo } from "./user-avatar-card";

export type { UserAvatarInfo };

// Shared circular user avatar with the "Hover Avatar info user" effect: the
// border lights from white to gold (#FFEA9E) on hover (MoMorph Bf5XiTE7AO). When
// `info` is provided, hovering also opens an info card (design "Infor - HoverAvatar"):
// name · unit · hero badge · kudos counts · "Gửi KUDO" CTA. The card stays open
// while the cursor is over the avatar OR the card (so its button is clickable).

const NORMAL_BORDER = "#FFFFFF";
const HOVER_BORDER = GOLD; // #FFEA9E

// Gray-circle placeholder when a user has no avatar URL (avoids a broken <img>).
const AVATAR_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23323231'/%3E%3C/svg%3E";

// Grace delay so the cursor can travel from the avatar into the card.
const CLOSE_DELAY_MS = 160;

export interface UserAvatarProps {
  src: string;
  alt: string;
  /** Diameter in px (default 64, matching the design). */
  size?: number;
  /** Border thickness in px (default 1.869, the design value at 64px). */
  borderWidth?: number;
  priority?: boolean;
  /** When provided, hovering opens the info card. */
  info?: UserAvatarInfo;
}

export default function UserAvatar({
  src,
  alt,
  size = 64,
  borderWidth = 1.869,
  priority,
  info,
}: UserAvatarProps) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending close timer on unmount (avoids setState-after-unmount).
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Close the card on scroll so it never detaches from the (now-moved) avatar.
  useEffect(() => {
    if (!open) return;
    const close = () => {
      setOpen(false);
      setRect(null);
    };
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [open]);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setRect(null);
    }, CLOSE_DELAY_MS);
  };

  const openCard = (e: React.MouseEvent<HTMLElement>) => {
    cancelClose();
    setOpen(true);
    if (info) setRect(e.currentTarget.getBoundingClientRect());
  };

  return (
    <span
      style={{ display: "inline-flex", flexShrink: 0 }}
      onMouseEnter={openCard}
      onMouseLeave={scheduleClose}
    >
      <Image
        src={src || AVATAR_FALLBACK}
        alt={alt}
        width={size}
        height={size}
        unoptimized
        priority={priority}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          border: `${borderWidth}px solid ${open ? HOVER_BORDER : NORMAL_BORDER}`,
          objectFit: "cover",
          transition: "border-color 150ms ease",
        }}
      />

      {info && open && rect && (
        <UserAvatarCard
          info={info}
          rect={rect}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        />
      )}
    </span>
  );
}
