"use client";

import Image from "next/image";
import { HeaderLangMenu } from "@/app/components/homepage/header-lang-menu";

/**
 * Login-page-specific header: Sun* SAA logo (left) + language selector (right).
 * Matches Figma mms_A_Header: 1440x80px, bg rgba(11,15,18,0.8), px-144.
 * Responsive: padding collapses on mobile/tablet.
 */
export function LoginHeader() {
  return (
    <>
      <style>{`
        .login-header {
          padding: 12px 24px;
        }
        @media (min-width: 768px) {
          .login-header {
            padding: 12px 48px;
          }
        }
        @media (min-width: 1280px) {
          .login-header {
            padding: 12px 144px;
          }
        }
      `}</style>
      <header
        className="login-header"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          width: "100%",
          height: "80px",
          backgroundColor: "rgba(11, 15, 18, 0.8)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: SAA logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/saa/logo-header.png"
            alt="Sun* Annual Awards 2025"
            width={52}
            height={48}
            priority
          />
        </div>

        {/* Right: language selector — reuse HeaderLangMenu (VN default) */}
        <HeaderLangMenu />
      </header>
    </>
  );
}
