"use client";

import { useCallback, useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export interface UseDialogReturn {
  /** Ref to attach to the dialog container element. */
  dialogRef: React.RefObject<HTMLDivElement | null>;
  /** Props to spread on the backdrop element (click closes the dialog). */
  backdropProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
  };
}

/**
 * Modal dialog/drawer a11y hook (distinct from `useDropdown`, which is menu
 * semantics). The PARENT owns the open state; this hook wires the behaviour for
 * a panel that uses `role="dialog"` + `aria-modal`.
 *
 * Behaviour while open:
 *  - Escape                 → onClose
 *  - Click on the backdrop  → onClose
 *  - Focus moves into the dialog; Tab is trapped inside (cycles)
 *  - Body scroll is locked
 *  - On close, focus returns to whatever was focused before opening
 *
 * Usage:
 *   const { dialogRef, backdropProps } = useDialog(open, onClose);
 *   {open && (
 *     <div {...backdropProps}>
 *       <div ref={dialogRef} role="dialog" aria-modal="true">…</div>
 *     </div>
 *   )}
 */
export function useDialog(open: boolean, onClose: () => void): UseDialogReturn {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Save the trigger, move focus in on open, restore it on close.
  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialogRef.current)?.focus();
    // Only restore focus to the saved element if it is still in the DOM — the
    // trigger may have been unmounted (e.g. the FAB menu collapsed on open).
    return () => {
      const target = previouslyFocused.current;
      if (target?.isConnected) target.focus();
    };
  }, [open]);

  // Lock body scroll while the dialog is open.
  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape to close + focus trap on Tab.
  useEffect(() => {
    if (!open || typeof document === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Close only when the press/click lands on the backdrop itself, not inside the
  // dialog. onMouseDown gives desktop the immediate close-on-press feel; onClick
  // is the cross-platform-safe fallback for touch devices (iOS/Android), where
  // mousedown on a fixed overlay is unreliable. The target check keeps both from
  // firing onClose for an in-dialog interaction.
  const onBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return {
    dialogRef,
    backdropProps: { onMouseDown: onBackdrop, onClick: onBackdrop },
  };
}
