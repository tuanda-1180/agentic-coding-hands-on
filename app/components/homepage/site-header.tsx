"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { HeaderNavLink } from "./header-nav-link";
import { HeaderLangMenu } from "./header-lang-menu";
import { HeaderNotifBell } from "./header-notif-bell";
import { HeaderUserMenu } from "./header-user-menu";

export default function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  // Route-aware active state: "About SAA" highlights on the homepage,
  // "Awards Information" on /awards, "Sun* Kudos" on /kudos.
  const onAwards = pathname.startsWith("/awards");
  const onKudos = pathname.startsWith("/kudos");
  const onHome = !onAwards && !onKudos;

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
          {/* Active state follows the current route; others emphasize on hover.
              "About" → home root (clean URL, no hash); on the homepage it
              smooth-scrolls to the hero (id="about") instead of navigating. */}
          <HeaderNavLink
            href="/"
            label={t("aboutSaa")}
            active={onHome}
            onClick={(e) => {
              if (onHome) {
                e.preventDefault();
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          />
          <HeaderNavLink href="/awards" label={t("awardsInfo")} active={onAwards} />
          <HeaderNavLink href="/kudos" label={t("sunKudos")} active={onKudos} />
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
