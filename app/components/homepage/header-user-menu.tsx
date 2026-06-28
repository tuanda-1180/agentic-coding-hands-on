"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useDropdown } from "@/app/components/ui/use-dropdown";
import { signOutAction } from "@/app/lib/auth/actions";

// The design's gold "lit" glow — same accent the header nav links use.
const GOLD_GLOW = "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287";

/**
 * A single account-menu row: bold label on the left, trailing icon on the right.
 * On hover/focus the row lights up exactly like the MoMorph "Dropdown-profile"
 * design: gold-tinted background, the label gains a gold glow, and the icon
 * brightens with a matching gold drop-shadow. `glow` adds a soft halo for the
 * primary (Profile) row. Renders as <Link> when `href` is given, else a <button>.
 */
function MenuItem({
  label,
  iconSrc,
  iconSize = 24,
  href,
  type = "button",
  glow = false,
  color = "#FFFFFF",
  onClick,
}: {
  label: string;
  iconSrc?: string;
  iconSize?: number;
  href?: string;
  type?: "button" | "submit";
  glow?: boolean;
  color?: string;
  onClick?: () => void;
}) {
  const [active, setActive] = useState(false);

  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "4px",
    width: "119px",
    height: "56px",
    padding: "16px",
    boxSizing: "border-box",
    borderRadius: "4px",
    // Lit state = design's gold accent tint; primary row also gets a soft halo.
    background: active ? "rgba(255,234,158,0.10)" : "transparent",
    boxShadow: glow && active ? "0 0 8px rgba(255,234,158,0.30)" : "none",
    color,
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "left",
    fontFamily: "var(--font-montserrat)",
    fontWeight: 700,
    fontSize: "16px",
    letterSpacing: "0.15px",
    // Brighten the label with the gold glow on hover/focus.
    textShadow: active ? GOLD_GLOW : "none",
    transition: "background 120ms ease, box-shadow 120ms ease, text-shadow 120ms ease",
  };

  const handlers = {
    role: "menuitem" as const,
    onMouseEnter: () => setActive(true),
    onMouseLeave: () => setActive(false),
    onFocus: () => setActive(true),
    onBlur: () => setActive(false),
    style,
  };

  const content = (
    <>
      <span>{label}</span>
      {iconSrc && (
        <Image
          src={iconSrc}
          alt=""
          aria-hidden={true}
          width={iconSize}
          height={iconSize}
          style={{
            // Icon brightens to match the label glow on hover/focus.
            filter: active
              ? "brightness(1.25) drop-shadow(0 0 6px #FAE287)"
              : "none",
            transition: "filter 120ms ease",
          }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} {...handlers}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} {...handlers}>
      {content}
    </button>
  );
}

/** User icon button + account dropdown (guest / user / admin). */
export function HeaderUserMenu() {
  const { data: session, status } = useSession();
  const tAuth = useTranslations("auth");
  const { isOpen, triggerRef, menuRef, triggerProps, menuProps, close } =
    useDropdown();

  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        id="account-menu-trigger"
        aria-label={tAuth("userMenu")}
        style={{
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          border: "1px solid #998C5F",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
        {...triggerProps}
      >
        <Image
          src="/saa/icon-user.svg"
          alt=""
          aria-hidden={true}
          width={24}
          height={24}
        />
      </button>
      {isOpen && (
        <div
          ref={menuRef as React.RefObject<HTMLDivElement>}
          aria-labelledby="account-menu-trigger"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            display: "flex",
            flexDirection: "column",
            padding: "6px",
            backgroundColor: "#00070C",
            border: "1px solid #998C5F",
            borderRadius: "8px",
            zIndex: 100,
          }}
          {...menuProps}
        >
          {!isAuthenticated ? (
            <MenuItem label={tAuth("signIn")} href="/login" onClick={close} />
          ) : (
            <>
              <MenuItem
                label={tAuth("profile")}
                href="/profile"
                onClick={close}
                glow
                iconSrc="/saa/icon-user.svg"
                iconSize={24}
              />
              {isAdmin && (
                <MenuItem
                  label={tAuth("adminDashboard")}
                  href="/admin"
                  onClick={close}
                  color="#FFEA9E"
                />
              )}
              <form action={signOutAction}>
                <MenuItem
                  label={tAuth("signOut")}
                  type="submit"
                  iconSrc="/saa/chevron-right.svg"
                  iconSize={20}
                />
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
