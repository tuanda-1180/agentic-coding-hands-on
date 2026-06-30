"use client";

import { useRef, type CSSProperties } from "react";
import { DARK, BORDER, MUTED, RED } from "@/app/components/liveboard/theme";
import { MAX_IMAGES, ACCEPTED_IMAGE_TYPES as ACCEPTED_TYPES } from "@/app/lib/kudos/validation";

export interface ImageItem {
  id: string;
  src: string;
}

export interface KudoImageUploadProps {
  value: ImageItem[];
  onRemove: (id: string) => void;
  onAddFiles: (files: File[]) => void;
  error?: string;
}

const LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "22px",
  color: DARK,
  flexShrink: 0,
  whiteSpace: "nowrap",
  width: "104px",
};

const THUMBNAIL_WRAP_STYLE: CSSProperties = {
  position: "relative",
  width: "64px",
  height: "64px",
  borderRadius: "18px",
  overflow: "visible",
  border: `1px solid ${BORDER}`,
  background: "#FFF",
  flexShrink: 0,
};

const REMOVE_BTN_STYLE: CSSProperties = {
  position: "absolute",
  top: "-8px",
  right: "-8px",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  background: "#D4271D",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  zIndex: 2,
};

const ADD_BTN_STYLE: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "4px 8px",
  background: "#FFF",
  border: `1px solid ${BORDER}`,
  borderRadius: "8px",
  cursor: "pointer",
  height: "48px",
  boxSizing: "border-box",
};

// Plus icon (24×24)
function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke={MUTED} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// X icon (tiny) for remove
function XTinyIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M8 2L2 8M2 2l6 6" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function KudoImageUpload({
  value,
  onRemove,
  onAddFiles,
  error,
}: KudoImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const atMax = value.length >= MAX_IMAGES;

  function handleAddClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => ACCEPTED_TYPES.includes(f.type));
    const remaining = MAX_IMAGES - value.length;
    if (valid.length > 0 && remaining > 0) {
      onAddFiles(valid.slice(0, remaining));
    }
    // reset input so same file can be re-selected
    e.target.value = "";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "16px",
        width: "100%",
        fontFamily: "var(--font-montserrat)",
      }}
    >
      {/* Label */}
      <div style={LABEL_STYLE}>Image</div>

      {/* Thumbnails + add button */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          minHeight: "64px",
        }}
      >
        {/* Existing thumbnails */}
        {value.map((img) => (
          <div key={img.id} style={THUMBNAIL_WRAP_STYLE}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt=""
              style={{
                width: "64px",
                height: "64px",
                objectFit: "cover",
                borderRadius: "4px",
                border: "1px solid #FFEA9E",
                display: "block",
              }}
            />
            <button
              type="button"
              onClick={() => onRemove(img.id)}
              aria-label="Xóa ảnh"
              style={REMOVE_BTN_STYLE}
            >
              <XTinyIcon />
            </button>
          </div>
        ))}

        {/* Add button — hidden at max */}
        {!atMax && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={handleAddClick}
                aria-label="Thêm ảnh"
                style={ADD_BTN_STYLE}
              >
                <PlusIcon />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "11px",
                      fontWeight: 700,
                      lineHeight: "16px",
                      letterSpacing: "0.5px",
                      color: MUTED,
                    }}
                  >
                    Image
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "11px",
                      fontWeight: 700,
                      lineHeight: "16px",
                      letterSpacing: "0.5px",
                      color: MUTED,
                    }}
                  >
                    Tối đa {MAX_IMAGES}
                  </span>
                </div>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_TYPES.join(",")}
              style={{ display: "none" }}
              onChange={handleFileChange}
              aria-hidden="true"
              tabIndex={-1}
            />
          </>
        )}
      </div>

      {error && (
        <span
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "13px",
            color: RED,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
