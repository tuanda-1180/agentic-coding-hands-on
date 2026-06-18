"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useDropdown } from "@/app/components/ui/use-dropdown";
import { setLocale } from "@/app/components/i18n/locale-switch";

/** Language switcher pill + dropdown for the site header. */
export function HeaderLangMenu() {
  const locale = useLocale();
  const router = useRouter();
  const { isOpen, triggerRef, menuRef, triggerProps, menuProps, close } =
    useDropdown();

  const showFlag = locale === "vi";

  async function handleLocaleSwitch(next: "vi" | "en") {
    await setLocale(next);
    close();
    router.refresh();
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        aria-label={`Current language: ${locale.toUpperCase()}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "108px",
          height: "56px",
          padding: "16px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "transparent",
          cursor: "pointer",
          color: "#FFFFFF",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "16px",
        }}
        {...triggerProps}
      >
        {showFlag && (
          <Image
            src="/saa/flag-vn.svg"
            alt="Vietnamese flag"
            width={20}
            height={20}
          />
        )}
        <span>{locale.toUpperCase()}</span>
        <Image
          src="/saa/chevron-down.svg"
          alt=""
          aria-hidden={true}
          width={16}
          height={16}
        />
      </button>
      {isOpen && (
        <div
          ref={menuRef as React.RefObject<HTMLDivElement>}
          aria-label="Language selector"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            minWidth: "140px",
            backgroundColor: "rgba(16,20,23,0.98)",
            border: "1px solid #2E3940",
            borderRadius: "4px",
            padding: "8px 0",
            zIndex: 100,
          }}
          {...menuProps}
        >
          {(["vi", "en"] as const).map((loc) => (
            <button
              key={loc}
              role="menuitem"
              onClick={() => handleLocaleSwitch(loc)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "8px 16px",
                color: loc === locale ? "#FFEA9E" : "#FFFFFF",
                fontSize: "14px",
                fontFamily: "var(--font-montserrat)",
                fontWeight: loc === locale ? 700 : 400,
                cursor: "pointer",
                background: "none",
                border: "none",
                textAlign: "left",
              }}
            >
              {loc === "vi" && (
                <Image
                  src="/saa/flag-vn.svg"
                  alt=""
                  aria-hidden
                  width={16}
                  height={16}
                />
              )}
              {loc === "vi" ? "Tiếng Việt" : "English"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
