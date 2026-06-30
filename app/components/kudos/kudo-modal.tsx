"use client";

import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { useDialog } from "@/app/components/ui/use-dialog";
import { GOLD, DARK, BORDER } from "@/app/components/liveboard/theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface KudoModalProps {
  mode: "create" | "edit";
  open: boolean;
  loading?: boolean;
  submitDisabled?: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  /** Field components are injected here in document order:
   *  Người nhận → Danh hiệu → Content editor → Hashtag → Image → Anonymous checkbox
   */
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Static styles (extracted to avoid re-creation per render)
// ---------------------------------------------------------------------------

const backdrop: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0, 16, 26, 0.72)",
  overflowY: "auto",
  padding: "16px",
};

const panel: CSSProperties = {
  // Figma: width 752px, padding 40px, gap 32px, borderRadius 24px
  width: "600px",
  maxWidth: "100%",
  // Fit any viewport: cap height, the form body scrolls internally, title +
  // footer stay pinned. Field dropdowns are portalled to <body> so the
  // internal scroll/clip never hides them.
  maxHeight: "calc(100vh - 32px)",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "24px",
  borderRadius: "16px",
  background: "rgba(255, 248, 225, 1)",
  fontFamily: "var(--font-montserrat)",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
};

// Title: Figma — fontSize 32, fontWeight 700, lineHeight 40, centered, color DARK
const titleStyle: CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: "32px",
  color: DARK,
  textAlign: "center",
  letterSpacing: "0px",
  margin: 0,
};

// Form body scrolls internally so the modal always fits the viewport; field
// dropdowns are portalled out so this scroll container never clips them.
const formBody: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "100%",
  flex: 1,
  minHeight: 0,
  // Vertical scroll only — never a horizontal scrollbar.
  overflowY: "auto",
  overflowX: "hidden",
  paddingRight: "4px",
  boxSizing: "border-box",
};

// Footer action bar — Figma: gap 24px, height 60px, row, children flex-start
const footer: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "16px",
  width: "100%",
  height: "48px",
  flexShrink: 0,
};

// Cancel button — Figma: padding 16px 40px, border 1px solid #998C5F,
//   bg rgba(255,234,158,0.10), borderRadius 4px, text 16px bold DARK
const cancelBtn: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "12px 24px",
  height: "48px",
  border: `1px solid ${BORDER}`,
  borderRadius: "4px",
  background: "rgba(255, 234, 158, 0.10)",
  fontSize: "15px",
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "0.15px",
  color: DARK,
  fontFamily: "var(--font-montserrat)",
  cursor: "pointer",
  flexShrink: 0,
  whiteSpace: "nowrap",
};

// Submit button — Figma: flex: 1, padding 16px, borderRadius 8px, bg GOLD,
//   fontSize 22px, fontWeight 700, lineHeight 28px, color DARK
const submitBtnBase: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  flex: 1,
  height: "48px",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: GOLD,
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "24px",
  color: DARK,
  fontFamily: "var(--font-montserrat)",
  cursor: "pointer",
  transition: "opacity 150ms ease",
};

// ---------------------------------------------------------------------------
// Icon sub-components (inline SVG so color is CSS-controllable)
// ---------------------------------------------------------------------------

/** X / close icon — used in the Cancel button */
function CloseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/** Send / paper-plane icon — used in the Submit button */
function SendIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function KudoModal({
  mode,
  open,
  loading = false,
  submitDisabled = false,
  onCancel,
  onSubmit,
  children,
}: KudoModalProps) {
  const t = useTranslations("writeKudos");
  const { dialogRef, backdropProps } = useDialog(open, onCancel);

  if (!open) return null;

  const isSubmitDisabled = submitDisabled || loading;

  const submitStyle: CSSProperties = {
    ...submitBtnBase,
    opacity: isSubmitDisabled ? 0.5 : 1,
    cursor: isSubmitDisabled ? "not-allowed" : "pointer",
  };

  return (
    // Backdrop — click outside closes; contains the centered panel
    <div
      role="presentation"
      style={backdrop}
      {...backdropProps}
    >
      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={
          mode === "edit"
            ? "Chỉnh sửa lời cám ơn và ghi nhận"
            : "Gửi lời cám ơn và ghi nhận"
        }
        style={panel}
      >
        {/* ── Title ──────────────────────────────────────────────────────── */}
        <h2 style={titleStyle}>{t("modalTitle")}</h2>

        {/* ── Form region ─────────────────────────────────────────────────
         *  Children are injected in this order by sibling agents:
         *    1. Người nhận (recipient selector)
         *    2. Danh hiệu (award/title selector + hint)
         *    3. Content editor (rich-text area)
         *    4. Hashtag input
         *    5. Image upload
         *    6. Anonymous checkbox
         *  All children are slotted directly into this flex-column container.
         * ──────────────────────────────────────────────────────────────── */}
        <div style={formBody}>
          {children}
        </div>

        {/* ── Footer action bar ───────────────────────────────────────────
         *  Cancel (left, fixed width) | Submit (right, flex-grow)
         * ──────────────────────────────────────────────────────────────── */}
        <div style={footer}>
          {/* Cancel — secondary, outlined */}
          <button
            type="button"
            style={cancelBtn}
            onClick={onCancel}
            aria-label={t("cancel")}
          >
            {t("cancel")}
            <CloseIcon size={24} />
          </button>

          {/* Submit — primary GOLD */}
          <button
            type="button"
            style={submitStyle}
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            aria-busy={loading}
            aria-label={loading ? t("submitting") : t("submit")}
          >
            {loading ? t("submitting") : t("submit")}
            {!loading && <SendIcon size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
}
