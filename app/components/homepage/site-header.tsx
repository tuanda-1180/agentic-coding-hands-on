"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { HeaderNavLink } from "./header-nav-link";
import { HeaderLangMenu } from "./header-lang-menu";
import { HeaderNotifBell } from "./header-notif-bell";
import { HeaderUserMenu } from "./header-user-menu";

export default function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        height: "80px",
        padding: "12px 144px",
        backgroundColor: "rgba(16,20,23,0.8)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left: logo + nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "64px" }}>
        <Link href="/" aria-label="SAA Home">
          <Image
            src="/saa/logo-header.png"
            alt="SAA Logo"
            width={52}
            height={48}
            priority
          />
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Active state on homepage; awards/kudos emphasize on hover */}
          <HeaderNavLink href="#about" label={t("aboutSaa")} active />
          <HeaderNavLink href="/awards" label={t("awardsInfo")} />
          <HeaderNavLink href="/kudos" label={t("sunKudos")} />
        </nav>
      </div>

      {/* Right: notifications / language / user (design order: bell → VN → user) */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <HeaderNotifBell />
        <HeaderLangMenu />
        <HeaderUserMenu />
      </div>
    </header>
  );
}
