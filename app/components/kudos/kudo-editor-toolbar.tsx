"use client";

import React, { CSSProperties, useCallback, useState } from "react";
import { Editor } from "@tiptap/react";
import KudoLinkDialog from "./kudo-link-dialog";

// ── Design tokens (from theme.ts + Figma) ────────────────────────────────────
const BORDER = "#998C5F";
const RED = "#D4271D";

// ── SVG icons (inline — media assets are null in Figma cloud) ────────────────

const IconBold = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4h8a4 4 0 0 1 0 8H6V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M6 12h9a4 4 0 0 1 0 8H6v-8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

const IconItalic = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="20" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="13" y1="4" x2="9" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconStrikethrough = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 7c0-1.657 1.79-3 4-3s4 1.343 4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 17c0 1.657 1.79 3 4 3s4-1.343 4-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconOrderedList = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <text x="3" y="8" fill="currentColor" fontSize="7" fontFamily="Montserrat, sans-serif" fontWeight="700">1</text>
    <text x="3" y="14" fill="currentColor" fontSize="7" fontFamily="Montserrat, sans-serif" fontWeight="700">2</text>
    <text x="3" y="20" fill="currentColor" fontSize="7" fontFamily="Montserrat, sans-serif" fontWeight="700">3</text>
  </svg>
);

const IconLink = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconQuote = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface KudoEditorToolbarProps {
  editor: Editor | null;
}

// ── Button styles ─────────────────────────────────────────────────────────────

const btnBase: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 56,
  height: 40,
  padding: "10px 16px",
  border: `1px solid ${BORDER}`,
  background: "transparent",
  cursor: "pointer",
  color: "#00101A",
  flexShrink: 0,
  transition: "background 150ms ease, color 150ms ease",
};

const btnFirst: CSSProperties = {
  ...btnBase,
  borderRadius: "8px 0 0 0",
};

// ── Toolbar component ─────────────────────────────────────────────────────────

export function KudoEditorToolbar({ editor }: KudoEditorToolbarProps) {
  const [linkOpen, setLinkOpen] = useState(false);

  const handleLink = useCallback(() => {
    if (!editor) return;
    setLinkOpen(true);
  }, [editor]);

  // Insert the typed text linked to the URL at the cursor (Add link dialog).
  const handleSaveLink = useCallback(
    (text: string, url: string) => {
      editor
        ?.chain()
        .focus()
        .insertContent({ type: "text", text, marks: [{ type: "link", attrs: { href: url } }] })
        .run();
    },
    [editor]
  );

  if (!editor) return null;

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs);

  const activeStyle = (active: boolean): CSSProperties =>
    active ? { background: "rgba(153,140,95,0.15)", color: "#00101A" } : {};

  return (
    <>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 40,
      }}
      role="toolbar"
      aria-label="Text formatting"
    >
      {/* Bold */}
      <button
        type="button"
        aria-label="Bold"
        aria-pressed={isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        style={{ ...btnFirst, ...activeStyle(isActive("bold")) }}
        onMouseEnter={(e) => {
          if (!isActive("bold")) (e.currentTarget as HTMLButtonElement).style.background = "rgba(153,140,95,0.08)";
        }}
        onMouseLeave={(e) => {
          if (!isActive("bold")) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <IconBold />
      </button>

      {/* Italic */}
      <button
        type="button"
        aria-label="Italic"
        aria-pressed={isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        style={{ ...btnBase, ...activeStyle(isActive("italic")) }}
        onMouseEnter={(e) => {
          if (!isActive("italic")) (e.currentTarget as HTMLButtonElement).style.background = "rgba(153,140,95,0.08)";
        }}
        onMouseLeave={(e) => {
          if (!isActive("italic")) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <IconItalic />
      </button>

      {/* Strikethrough */}
      <button
        type="button"
        aria-label="Strikethrough"
        aria-pressed={isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        style={{ ...btnBase, ...activeStyle(isActive("strike")) }}
        onMouseEnter={(e) => {
          if (!isActive("strike")) (e.currentTarget as HTMLButtonElement).style.background = "rgba(153,140,95,0.08)";
        }}
        onMouseLeave={(e) => {
          if (!isActive("strike")) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <IconStrikethrough />
      </button>

      {/* Ordered list */}
      <button
        type="button"
        aria-label="Ordered list"
        aria-pressed={isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        style={{ ...btnBase, ...activeStyle(isActive("orderedList")) }}
        onMouseEnter={(e) => {
          if (!isActive("orderedList")) (e.currentTarget as HTMLButtonElement).style.background = "rgba(153,140,95,0.08)";
        }}
        onMouseLeave={(e) => {
          if (!isActive("orderedList")) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <IconOrderedList />
      </button>

      {/* Link */}
      <button
        type="button"
        aria-label="Insert link"
        aria-pressed={isActive("link")}
        onClick={handleLink}
        style={{ ...btnBase, ...activeStyle(isActive("link")) }}
        onMouseEnter={(e) => {
          if (!isActive("link")) (e.currentTarget as HTMLButtonElement).style.background = "rgba(153,140,95,0.08)";
        }}
        onMouseLeave={(e) => {
          if (!isActive("link")) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <IconLink />
      </button>

      {/* Quote/Blockquote */}
      <button
        type="button"
        aria-label="Blockquote"
        aria-pressed={isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        style={{ ...btnBase, ...activeStyle(isActive("blockquote")) }}
        onMouseEnter={(e) => {
          if (!isActive("blockquote")) (e.currentTarget as HTMLButtonElement).style.background = "rgba(153,140,95,0.08)";
        }}
        onMouseLeave={(e) => {
          if (!isActive("blockquote")) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <IconQuote />
      </button>

      {/* Tiêu chuẩn cộng đồng — right side, fills remaining width */}
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-end",
          height: 40,
          padding: "10px 16px",
          border: `1px solid ${BORDER}`,
          borderLeft: "none",
          borderRadius: "0 8px 0 0",
          background: "transparent",
        }}
      >
        <a
          href="#community-standards"
          onClick={(e) => e.preventDefault()}
          style={{
            fontSize: 16,
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: RED,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none";
          }}
        >
          Tiêu chuẩn cộng đồng
        </a>
      </div>
    </div>

    {linkOpen && <KudoLinkDialog onClose={() => setLinkOpen(false)} onSave={handleSaveLink} />}
    </>
  );
}
