"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDropdown } from "@/app/components/ui/use-dropdown";

interface FabAction {
  labelKey: "writeKudos" | "saaRules";
  href: string;
  icon: string;
  iconAlt: string;
}

const FAB_ACTIONS: FabAction[] = [
  {
    labelKey: "writeKudos",
    href: "/kudos",
    icon: "/saa/fab-pen.svg",
    iconAlt: "Pen icon",
  },
  {
    labelKey: "saaRules",
    href: "/awards",
    icon: "/saa/fab-kudos.svg",
    iconAlt: "SAA icon",
  },
];

export default function Fab() {
  const router = useRouter();
  const t = useTranslations("fab");
  const { isOpen, triggerRef, menuRef, triggerProps, menuProps } =
    useDropdown();

  const handleAction = (href: string) => {
    router.push(href);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "40px",
        right: "19px",
        zIndex: 100,
      }}
    >
      {/* Quick-action menu */}
      {isOpen && (
        <div
          ref={menuRef as React.RefObject<HTMLDivElement>}
          aria-label="Quick actions"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            right: 0,
            minWidth: "180px",
            backgroundColor: "rgba(16,20,23,0.95)",
            border: "1px solid #998C5F",
            borderRadius: "12px",
            padding: "8px 0",
            boxShadow: "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287",
          }}
          {...menuProps}
        >
          {FAB_ACTIONS.map((action) => (
            <button
              key={action.href}
              role="menuitem"
              tabIndex={0}
              onClick={() => handleAction(action.href)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleAction(action.href);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "12px 16px",
                color: "#FFFFFF",
                fontFamily: "var(--font-montserrat)",
                fontSize: "14px",
                cursor: "pointer",
                background: "none",
                border: "none",
                textAlign: "left",
              }}
            >
              <Image
                src={action.icon}
                alt={action.iconAlt}
                width={20}
                height={20}
              />
              {t(action.labelKey)}
            </button>
          ))}
        </div>
      )}

      {/* Pill trigger button */}
      <button
        ref={triggerRef}
        aria-label={t("openActions")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          width: "106px",
          height: "64px",
          padding: "16px",
          borderRadius: "100px",
          border: "none",
          backgroundColor: "#FFEA9E",
          boxShadow: "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287",
          cursor: "pointer",
        }}
        {...triggerProps}
      >
        <Image
          src="/saa/fab-pen.svg"
          alt=""
          aria-hidden={true}
          width={24}
          height={24}
        />
        <span
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "24px",
            color: "#00101A",
            lineHeight: 1,
          }}
        >
          /
        </span>
        <Image
          src="/saa/fab-kudos.svg"
          alt=""
          aria-hidden={true}
          width={24}
          height={24}
        />
      </button>
    </div>
  );
}
