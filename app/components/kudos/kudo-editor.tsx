"use client";

import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import { KudoEditorToolbar } from "./kudo-editor-toolbar";

// ── Design tokens ─────────────────────────────────────────────────────────────
const BORDER = "#998C5F";
const BORDER_ERROR = "#D4271D";
const TEXT_SECONDARY = "#999";
const TEXT_PRIMARY = "#00101A";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MentionItem {
  id: string;
  label: string;
}

export interface KudoEditorProps {
  value: string; // HTML
  onChange: (html: string) => void;
  mentionItems?: MentionItem[];
  error?: string;
}

// ── Mention suggestion popup ─────────────────────────────────────────────────

interface MentionPopupProps {
  items: MentionItem[];
  selectedIndex: number;
  onSelect: (item: MentionItem) => void;
  position: { top: number; left: number } | null;
}

function MentionPopup({ items, selectedIndex, onSelect, position }: MentionPopupProps) {
  if (!position || items.length === 0) return null;

  const popupStyle: CSSProperties = {
    position: "fixed",
    top: position.top,
    left: position.left,
    zIndex: 9999,
    background: "#ffffff",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    minWidth: 180,
    maxHeight: 200,
    overflowY: "auto",
    padding: "4px 0",
    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
  };

  return (
    <div style={popupStyle} role="listbox" aria-label="Mention suggestions">
      {items.map((item, index) => (
        <div
          key={item.id}
          role="option"
          aria-selected={index === selectedIndex}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(item);
          }}
          style={{
            padding: "8px 16px",
            fontSize: 14,
            cursor: "pointer",
            background: index === selectedIndex ? "rgba(153,140,95,0.12)" : "transparent",
            color: TEXT_PRIMARY,
            fontWeight: index === selectedIndex ? 600 : 400,
            transition: "background 100ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "rgba(153,140,95,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.background =
              index === selectedIndex ? "rgba(153,140,95,0.12)" : "transparent";
          }}
        >
          @{item.label}
        </div>
      ))}
    </div>
  );
}

// ── Main editor component ─────────────────────────────────────────────────────

export function KudoEditor({
  value,
  onChange,
  mentionItems = [],
  error,
}: KudoEditorProps) {
  // State for suggestion popup
  const [popupState, setPopupState] = useState<{
    visible: boolean;
    items: MentionItem[];
    selectedIndex: number;
    position: { top: number; left: number } | null;
    // Callbacks stored via ref to avoid stale closure inside Tiptap plugin
  }>({
    visible: false,
    items: [],
    selectedIndex: 0,
    position: null,
  });

  // Ref to hold callbacks so Tiptap plugin can call them without stale closure
  const commandRef = useRef<((item: MentionItem) => void) | null>(null);
  const mentionItemsRef = useRef(mentionItems);
  useEffect(() => {
    mentionItemsRef.current = mentionItems;
  }, [mentionItems]);

  const handleMentionSelect = useCallback(
    (item: MentionItem) => {
      commandRef.current?.(item);
      setPopupState((s) => ({ ...s, visible: false }));
    },
    [],
  );

  // Tiptap's Mention.configure render/suggestion callbacks run inside ProseMirror
  // plugin context (not React render), so reading refs there is the intended
  // stale-closure escape — the react-hooks/refs heuristic can't tell them apart.
  /* eslint-disable react-hooks/refs */
  const editor = useEditor(
    {
      immediatelyRender: false, // required for SSR / Next.js App Router
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            style:
              "color: #998C5F; text-decoration: underline; cursor: pointer;",
            rel: "noopener noreferrer",
            target: "_blank",
          },
        }),
        Placeholder.configure({
          placeholder:
            "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!",
          emptyNodeClass: "kudo-editor-placeholder",
        }),
        Mention.configure({
          HTMLAttributes: {
            class: "kudo-mention",
            style:
              "color: #998C5F; font-weight: 700; background: rgba(153,140,95,0.1); border-radius: 4px; padding: 0 2px;",
          },
          suggestion: {
            char: "@",
            items: ({ query }: { query: string }) => {
              const q = query.toLowerCase();
              return mentionItemsRef.current
                .filter((item) => item.label.toLowerCase().includes(q))
                .slice(0, 8);
            },
            render: () => {
              return {
                onStart: (props: {
                  items: MentionItem[];
                  command: (attrs: { id: string; label: string }) => void;
                  clientRect?: (() => DOMRect | null) | null;
                }) => {
                  commandRef.current = (item: MentionItem) => {
                    props.command({ id: item.id, label: item.label });
                  };
                  const rect = props.clientRect?.();
                  setPopupState({
                    visible: true,
                    items: props.items,
                    selectedIndex: 0,
                    position: rect
                      ? { top: rect.bottom + 4, left: rect.left }
                      : null,
                  });
                },
                onUpdate: (props: {
                  items: MentionItem[];
                  command: (attrs: { id: string; label: string }) => void;
                  clientRect?: (() => DOMRect | null) | null;
                }) => {
                  commandRef.current = (item: MentionItem) => {
                    props.command({ id: item.id, label: item.label });
                  };
                  const rect = props.clientRect?.();
                  setPopupState((s) => ({
                    ...s,
                    items: props.items,
                    position: rect
                      ? { top: rect.bottom + 4, left: rect.left }
                      : s.position,
                  }));
                },
                onKeyDown: (props: { event: KeyboardEvent }) => {
                  const { event } = props;
                  if (event.key === "ArrowDown") {
                    setPopupState((s) => ({
                      ...s,
                      selectedIndex: Math.min(
                        s.selectedIndex + 1,
                        s.items.length - 1,
                      ),
                    }));
                    return true;
                  }
                  if (event.key === "ArrowUp") {
                    setPopupState((s) => ({
                      ...s,
                      selectedIndex: Math.max(s.selectedIndex - 1, 0),
                    }));
                    return true;
                  }
                  if (event.key === "Enter") {
                    setPopupState((s) => {
                      const item = s.items[s.selectedIndex];
                      if (item) handleMentionSelect(item);
                      return { ...s, visible: false };
                    });
                    return true;
                  }
                  if (event.key === "Escape") {
                    setPopupState((s) => ({ ...s, visible: false }));
                    return true;
                  }
                  return false;
                },
                onExit: () => {
                  setPopupState((s) => ({ ...s, visible: false }));
                },
              };
            },
          },
        }),
      ],
      content: value,
      onUpdate: ({ editor: e }) => {
        onChange(e.getHTML());
      },
    },
    [],
  );
  /* eslint-enable react-hooks/refs */

  // Sync external value changes (e.g., form reset)
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (currentHTML !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const borderColor = error ? BORDER_ERROR : BORDER;

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  };

  const editorWrapperStyle: CSSProperties = {
    // Use longhand sides only (no `border` shorthand) so toggling the error
    // color never mixes shorthand + non-shorthand on the same element.
    borderTop: "none",
    borderRight: `1px solid ${borderColor}`,
    borderBottom: `1px solid ${borderColor}`,
    borderLeft: `1px solid ${borderColor}`,
    borderRadius: "0 0 8px 8px",
    background: "#fff",
    minHeight: 100,
    padding: "12px 24px",
    cursor: "text",
    position: "relative",
  };

  return (
    <div style={containerStyle}>
      {/* Toolbar */}
      <KudoEditorToolbar editor={editor} />

      {/* Editor content area */}
      <div
        style={editorWrapperStyle}
        onClick={() => editor?.commands.focus()}
        role="textbox"
        aria-multiline={true}
        aria-label="Kudo message"
      >
        <EditorContent
          editor={editor}
          style={{
            minHeight: 160,
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 16,
            lineHeight: "24px",
            color: TEXT_PRIMARY,
            outline: "none",
          }}
        />
      </div>

      {/* Error message */}
      {error && (
        <p
          style={{
            marginTop: 4,
            fontSize: 13,
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            color: BORDER_ERROR,
            lineHeight: "20px",
          }}
        >
          {error}
        </p>
      )}

      {/* Helper text */}
      <p
        style={{
          marginTop: 8,
          fontSize: 14,
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontWeight: 700,
          lineHeight: "24px",
          letterSpacing: "0.5px",
          color: TEXT_PRIMARY,
          textAlign: "center",
        }}
      >
        Bạn có thể &ldquo;@ + tên&rdquo; để nhắc tới đồng nghiệp khác
      </p>

      {/* Mention suggestion popup (rendered via portal-like fixed positioning) */}
      {popupState.visible && (
        <MentionPopup
          items={popupState.items}
          selectedIndex={popupState.selectedIndex}
          onSelect={handleMentionSelect}
          position={popupState.position}
        />
      )}

      {/* Tiptap placeholder + mention styles injected as global scoped CSS */}
      <style>{`
        .kudo-editor-placeholder.is-empty::before {
          content: attr(data-placeholder);
          float: left;
          color: ${TEXT_SECONDARY};
          pointer-events: none;
          height: 0;
          font-family: var(--font-montserrat), Montserrat, sans-serif;
          font-size: 16px;
          line-height: 24px;
          font-weight: 700;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: ${TEXT_SECONDARY};
          pointer-events: none;
          height: 0;
          font-family: var(--font-montserrat), Montserrat, sans-serif;
          font-size: 16px;
          line-height: 24px;
          font-weight: 700;
        }
        .ProseMirror {
          min-height: 100px;
          outline: none;
          font-family: var(--font-montserrat), Montserrat, sans-serif;
          font-size: 16px;
          line-height: 24px;
          color: ${TEXT_PRIMARY};
        }
        .ProseMirror blockquote {
          border-left: 3px solid ${BORDER};
          padding-left: 12px;
          margin-left: 0;
          color: #666;
          font-style: italic;
        }
        .ProseMirror ol {
          padding-left: 24px;
        }
        .ProseMirror li {
          margin: 2px 0;
        }
        .kudo-mention {
          color: #998C5F;
          font-weight: 700;
          background: rgba(153,140,95,0.1);
          border-radius: 4px;
          padding: 0 2px;
        }
      `}</style>
    </div>
  );
}

export default KudoEditor;
