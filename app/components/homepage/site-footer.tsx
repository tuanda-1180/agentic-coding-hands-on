"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FooterNavLink } from "./footer-nav-link";

export default function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const navLinks = [
    { label: tNav("aboutSaa"), href: "#about" },
    { label: tNav("awardsInfo"), href: "/awards" },
    { label: tNav("sunKudos"), href: "/kudos" },
    { label: tNav("generalCriteria"), href: "/awards#criteria" },
  ];

  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "rgba(16,20,23,0.95)",
        borderTop: "1px solid #2E3940",
      }}
    >
      <div
        style={{
          maxWidth: "1224px",
          margin: "0 auto",
          padding: "40px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        {/* Left cluster: logo + nav, grouped with 80px gap (design Frame 488) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "80px",
            flexWrap: "wrap",
          }}
        >
          {/* Logo → home + scroll top */}
          <Link
            href="/"
            aria-label={t("homeAriaLabel")}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Image
              src="/saa/logo-footer.png"
              alt="Sun* Annual Awards"
              width={80}
              height={48}
              style={{ objectFit: "contain" }}
            />
          </Link>

          {/* Nav links — gap 48px (design Frame 476) */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "48px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
            aria-label="Footer navigation"
          >
            {navLinks.map(({ label, href }) => (
              <FooterNavLink key={href} href={href} label={label} />
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <p
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 400,
            fontSize: "14px",
            color: "#FFFFFF",
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
