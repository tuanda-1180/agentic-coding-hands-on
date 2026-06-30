"use client";

// "Thêm đường dẫn" (Add link) dialog — replaces the browser prompt for the Tiptap
// editor link button. Design: MoMorph screen OyDLDuSGEa (Addlink Box).
import { useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { useDialog } from "@/app/components/ui/use-dialog";
import { GOLD, DARK, BORDER } from "@/app/components/liveboard/theme";
import { isValidLinkText, isValidLinkUrl, LINK_TEXT_MAX, LINK_URL_MAX } from "@/app/lib/kudos/validation";

// Rendered only while open (parent guards with `{open && <KudoLinkDialog/>}`),
// so each open mounts a fresh instance with empty fields — no reset effect needed.
export interface KudoLinkDialogProps {
  onClose: () => void;
  onSave: (text: string, url: string) => void;
}

const backdrop: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0, 16, 26, 0.72)",
  padding: "24px 16px",
};

const panel: CSSProperties = {
  width: "752px",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "32px",
  borderRadius: "24px",
  background: "rgba(255, 248, 225, 1)",
  fontFamily: "var(--font-montserrat)",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: DARK,
  width: "96px",
  flexShrink: 0,
};

const inputStyle: CSSProperties = {
  flex: 1,
  height: "56px",
  padding: "16px 24px",
  borderRadius: "8px",
  border: `1px solid ${BORDER}`,
  background: "#FFF",
  fontFamily: "var(--font-montserrat)",
  fontSize: "16px",
  color: DARK,
  outline: "none",
  boxSizing: "border-box",
};

const errStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "13px",
  color: "#D4271D",
  marginLeft: "112px",
  marginTop: "-16px",
};

export default function KudoLinkDialog({ onClose, onSave }: KudoLinkDialogProps) {
  const t = useTranslations("writeKudos");
  const { dialogRef, backdropProps } = useDialog(true, onClose);
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<{ text?: string; url?: string }>({});

  const handleSave = () => {
    const next: { text?: string; url?: string } = {};
    if (!isValidLinkText(text)) next.text = t("errLinkText");
    if (!isValidLinkUrl(url)) next.url = t("errLinkUrl");
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave(text.trim(), url.trim());
    onClose();
  };

  return (
    <div role="presentation" style={backdrop} {...backdropProps}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={t("linkTitle")} style={panel}>
        <h2 style={{ fontSize: "32px", fontWeight: 700, color: DARK, margin: 0 }}>{t("linkTitle")}</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <label style={labelStyle} htmlFor="kudo-link-text">{t("linkTextLabel")}</label>
          <input
            id="kudo-link-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={LINK_TEXT_MAX}
            style={{ ...inputStyle, borderColor: errors.text ? "#D4271D" : BORDER }}
          />
        </div>
        {errors.text && <span style={errStyle}>{errors.text}</span>}

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <label style={labelStyle} htmlFor="kudo-link-url">URL</label>
          <input
            id="kudo-link-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            maxLength={LINK_URL_MAX}
            placeholder="https://"
            style={{ ...inputStyle, borderColor: errors.url ? "#D4271D" : BORDER }}
          />
        </div>
        {errors.url && <span style={errStyle}>{errors.url}</span>}

        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "8px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "16px 40px", height: "60px", border: `1px solid ${BORDER}`, borderRadius: "4px", background: "rgba(255,234,158,0.10)", fontSize: "16px", fontWeight: 700, color: DARK, cursor: "pointer", fontFamily: "var(--font-montserrat)" }}
          >
            {t("linkCancel")}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke={DARK} strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "60px", borderRadius: "8px", border: "none", background: GOLD, fontSize: "22px", fontWeight: 700, color: DARK, cursor: "pointer", fontFamily: "var(--font-montserrat)" }}
          >
            {t("linkSave")}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
