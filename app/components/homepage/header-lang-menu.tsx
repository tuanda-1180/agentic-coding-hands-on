"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useDropdown } from "@/app/components/ui/use-dropdown";
import { setLocale } from "@/app/components/i18n/locale-switch";
import type { Locale } from "@/i18n/routing";

/** Per-locale presentation: flag asset, 2-letter code, full name (for a11y). */
const LANG_OPTIONS: Record<Locale, { flag: string; code: string; name: string }> = {
  vi: { flag: "/saa/flag-vn.svg", code: "VN", name: "Tiếng Việt" },
  en: { flag: "/saa/flag-uk.svg", code: "EN", name: "English" },
};

const LOCALES = Object.keys(LANG_OPTIONS) as Locale[];

/** A single language option box in the open dropdown (110×56, flag + code). */
function LangMenuItem({
  locale,
  selected,
  onSelect,
}: {
  locale: Locale;
  selected: boolean;
  onSelect: (loc: Locale) => void;
}) {
  const [hover, setHover] = useState(false);
  const { flag, code, name } = LANG_OPTIONS[locale];

  // Selected → dark grey; option → black; hover lightens either.
  const baseBg = selected ? "#3A3A3A" : "#141414";
  const background = hover ? (selected ? "#474747" : "#262626") : baseBg;

  return (
    <button
      role="menuitem"
      aria-label={name}
      aria-current={selected ? "true" : undefined}
      onClick={() => onSelect(locale)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "110px",
        height: "56px",
        padding: "0 16px",
        background,
        color: "#FFFFFF",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-montserrat)",
        fontWeight: 700,
        fontSize: "16px",
        textAlign: "left",
      }}
    >
      <Image src={flag} alt="" aria-hidden={true} width={20} height={15} />
      <span>{code}</span>
    </button>
  );
}

/** Language switcher pill + dropdown for the site header. */
export function HeaderLangMenu() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { isOpen, triggerRef, menuRef, triggerProps, menuProps, close } =
    useDropdown();

  const showFlag = locale === "vi";

  async function handleLocaleSwitch(next: Locale) {
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
            height={15}
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
            width: "110px",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #2E3940",
            zIndex: 100,
          }}
          {...menuProps}
        >
          {LOCALES.map((loc) => (
            <LangMenuItem
              key={loc}
              locale={loc}
              selected={loc === locale}
              onSelect={handleLocaleSwitch}
            />
          ))}
        </div>
      )}
    </div>
  );
}
