"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface LoginButtonProps {
  /** Button type — "submit" lets it drive a parent <form action>. */
  type?: "button" | "submit";
  /** When true, button is disabled and shows a spinner. */
  isLoading?: boolean;
  /** Optional error message rendered below the button. */
  errorMessage?: string;
}

/**
 * Yellow "LOGIN With Google" button.
 * Figma: Button-IC About — 305x60px, bg #FFEA9E, radius 8px, px-24 py-16.
 * Text: "LOGIN With Google", Montserrat Bold 22px, color #00101A.
 * Google "G" icon 24x24 on the right.
 *
 * Props interface (wired by orchestrator in Phase 03-04):
 *   onLogin?     — click handler (Google OAuth trigger)
 *   isLoading?   — disables button + shows spinner
 *   errorMessage? — renders an error message below the button
 *
 * Responsive: button width is 100% up to 305px on mobile.
 */
export function LoginButton({
  type = "button",
  isLoading = false,
  errorMessage,
}: LoginButtonProps) {
  const t = useTranslations("login");
  const label = t("loginWithGoogle");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <button
        type={type}
        disabled={isLoading}
        className="login-google-btn"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "8px",
          height: "60px",
          padding: "16px 24px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: isLoading ? "#d4c47a" : "#FFEA9E",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
          fontWeight: 700,
          fontSize: "22px",
          lineHeight: "28px",
          color: "#00101A",
          letterSpacing: "0px",
          whiteSpace: "nowrap",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          opacity: isLoading ? 0.8 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 8px 24px rgba(255, 234, 158, 0.35)";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          (e.currentTarget as HTMLButtonElement).style.transform =
            "translateY(0)";
        }}
        aria-label={label}
        aria-busy={isLoading}
      >
        {/* Left: text (+ optional spinner) */}
        <span
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {isLoading && (
            <span
              role="status"
              aria-label="Loading"
              style={{
                display: "inline-block",
                width: "18px",
                height: "18px",
                border: "2px solid #00101A",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "login-spin 0.7s linear infinite",
                flexShrink: 0,
              }}
            />
          )}
          {label}
        </span>

        {/* Right: Google icon */}
        <Image
          src="/saa/google-icon.svg"
          alt="Google"
          width={24}
          height={24}
          aria-hidden
        />
      </button>

      {errorMessage && (
        <p
          role="alert"
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#FF6B6B",
            fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
          }}
        >
          {errorMessage}
        </p>
      )}

      <style>{`
        @keyframes login-spin {
          to { transform: rotate(360deg); }
        }
        .login-google-btn {
          width: 100%;
          max-width: 305px;
        }
        @media (min-width: 768px) {
          .login-google-btn {
            width: 305px;
          }
        }
      `}</style>
    </div>
  );
}
