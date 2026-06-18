"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useDropdown } from "@/app/components/ui/use-dropdown";
import { signOutAction } from "@/app/lib/auth/actions";

/** User icon button + account dropdown (guest / user / admin). */
export function HeaderUserMenu() {
  const { data: session, status } = useSession();
  const tAuth = useTranslations("auth");
  const { isOpen, triggerRef, menuRef, triggerProps, menuProps, close } =
    useDropdown();

  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";

  const menuItemStyle = {
    display: "block" as const,
    padding: "8px 16px",
    fontSize: "14px",
    fontFamily: "var(--font-montserrat)",
    textDecoration: "none" as const,
    cursor: "pointer",
    color: "#FFFFFF",
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={triggerRef}
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
          aria-label={tAuth("userMenu")}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            minWidth: "180px",
            backgroundColor: "rgba(16,20,23,0.98)",
            border: "1px solid #2E3940",
            borderRadius: "4px",
            padding: "8px 0",
            zIndex: 100,
          }}
          {...menuProps}
        >
          {!isAuthenticated ? (
            <a href="/login" role="menuitem" onClick={close} style={menuItemStyle}>
              {tAuth("signIn")}
            </a>
          ) : (
            <>
              <a href="/profile" role="menuitem" onClick={close} style={menuItemStyle}>
                {tAuth("profile")}
              </a>
              {isAdmin && (
                <a
                  href="/admin"
                  role="menuitem"
                  onClick={close}
                  style={{ ...menuItemStyle, color: "#FFEA9E" }}
                >
                  {tAuth("adminDashboard")}
                </a>
              )}
              <hr style={{ border: "none", borderTop: "1px solid #2E3940", margin: "4px 0" }} />
              <form action={signOutAction}>
                <button
                  type="submit"
                  role="menuitem"
                  style={{
                    ...menuItemStyle,
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                  }}
                >
                  {tAuth("signOut")}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
