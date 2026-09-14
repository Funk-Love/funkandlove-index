"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Shared keyboard behavior for the menu and detail sheets. Scroll locking stays with the existing hook. */
export function useModalFocus(open: boolean, root: RefObject<HTMLElement | null>, onClose: () => void) {
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const panel = root.current;
    if (!open || !panel) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const background: { element: HTMLElement; inert: boolean }[] = [];
    let branch: HTMLElement = panel;
    while (branch.parentElement && branch !== document.body) {
      for (const sibling of Array.from(branch.parentElement.children)) {
        if (sibling instanceof HTMLElement && sibling !== branch && !['SCRIPT', 'STYLE'].includes(sibling.tagName)) {
          background.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
    }
    const candidates = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      .filter((el) => el.getClientRects().length > 0 && !el.closest('[inert]'));
    const focusFirst = () => (candidates()[0] ?? panel).focus({ preventScroll: true });
    focusFirst();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      }
      if (event.key !== "Tab") return;
      const items = candidates();
      const first = items[0] ?? panel;
      const last = items.at(-1) ?? panel;
      if (!panel.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (!event.shiftKey && (document.activeElement === last || !items.length)) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !panel.contains(event.target)) focusFirst();
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("focusin", onFocus);
      background.forEach(({ element, inert }) => { element.inert = inert; });
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, root]);
}
