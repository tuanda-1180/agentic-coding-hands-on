"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseDropdownOptions {
  /** Called when the menu opens. Optional hook for analytics, etc. */
  onOpen?: () => void;
  /** Called when the menu closes. Optional hook for analytics, etc. */
  onClose?: () => void;
}

export interface UseDropdownReturn {
  /** Whether the menu is currently open */
  isOpen: boolean;
  /** Ref to attach to the trigger button */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  /** Ref to attach to the menu container */
  menuRef: React.RefObject<HTMLElement | null>;
  /** Toggle open state — call from trigger onClick */
  toggle: () => void;
  /** Explicitly close the menu */
  close: () => void;
  /** Props to spread onto the trigger element */
  triggerProps: {
    "aria-haspopup": "menu";
    "aria-expanded": boolean;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  };
  /** Props to spread onto the menu container */
  menuProps: {
    role: "menu";
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  };
}

/**
 * Reusable dropdown/menu a11y hook.
 *
 * Behaviour:
 *  - Enter/Space on trigger  → open menu, focus first focusable item
 *  - Escape inside menu       → close menu, return focus to trigger
 *  - Click outside            → close menu
 *  - Trigger click            → toggle
 *
 * Usage:
 *   const { isOpen, triggerRef, menuRef, triggerProps, menuProps } = useDropdown();
 *
 *   <button ref={triggerRef} {...triggerProps}>Menu</button>
 *   {isOpen && (
 *     <div ref={menuRef as React.RefObject<HTMLDivElement>} {...menuProps}>
 *       <button role="menuitem">Action</button>
 *     </div>
 *   )}
 *
 * Phase 07 can reuse this hook for header account/language/notification menus.
 */
export function useDropdown(options?: UseDropdownOptions): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    options?.onOpen?.();
  }, [options]);

  const close = useCallback(() => {
    setIsOpen(false);
    options?.onClose?.();
  }, [options]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) options?.onOpen?.();
      else options?.onClose?.();
      return next;
    });
  }, [options]);

  // Focus the first focusable item inside the menu after it opens.
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelector<HTMLElement>(
      '[role="menuitem"], button, a, [tabindex="0"]'
    );
    focusable?.focus();
  }, [isOpen]);

  // Click-outside handler: close when click lands outside both trigger and menu.
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen, close]);

  // Trigger keydown: Enter/Space open (browser fires click for Space on buttons,
  // but we handle Enter explicitly for non-button triggers).
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isOpen) open();
      }
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    },
    [isOpen, open, close]
  );

  // Menu keydown: Escape closes and returns focus to trigger.
  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        triggerRef.current?.focus();
      }
    },
    [close]
  );

  return {
    isOpen,
    triggerRef,
    menuRef,
    toggle,
    close,
    triggerProps: {
      "aria-haspopup": "menu",
      "aria-expanded": isOpen,
      onClick: toggle,
      onKeyDown: handleTriggerKeyDown,
    },
    menuProps: {
      role: "menu",
      onKeyDown: handleMenuKeyDown,
    },
  };
}
