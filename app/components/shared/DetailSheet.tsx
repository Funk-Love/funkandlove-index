"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useModalFocus } from "../../hooks/useModalFocus";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useMediaQuery } from "../../hooks/useMediaQuery";

type Variant = "modal" | "sheet" | "auto";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: Variant;
  /** 应用到 panel 容器(覆盖 max-width / 边框) */
  panelClassName?: string;
  /** 关闭按钮额外类名(位置/颜色微调) */
  closeButtonClassName?: string;
  ariaLabel?: string;
  /** 是否渲染默认右上角关闭按钮(默认 true) */
  showCloseButton?: boolean;
}

/** 默认纸面面板:2px 墨线 + 硬阴影 */
export const DEFAULT_PANEL =
  "relative max-w-2xl w-full bg-paper text-ink rounded-3xl overflow-hidden border-2 border-ink shadow-paper";

const DEFAULT_CLOSE =
  "absolute top-4 right-4 z-20 p-2 rounded-full bg-ink text-paper hover:bg-accent-500 transition-colors";

/**
 * 详情容器 - 桌面 modal / 移动 bottom sheet 双形态。
 * - 深棕半透明蒙层,纸面面板
 * - ESC 关闭、点击蒙层关闭、body 滚动锁定
 * - data-modal-open="true" 用于 useSnapScroll 暂停劫持
 * - 进出场走 framer AnimatePresence(D5)
 */
export default function DetailSheet({
  open,
  onClose,
  children,
  variant = "auto",
  panelClassName,
  closeButtonClassName,
  ariaLabel,
  showCloseButton = true,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const resolved: "modal" | "sheet" = variant === "auto" ? (isDesktop ? "modal" : "sheet") : variant;

  useBodyScrollLock(open);
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalFocus(open, dialogRef, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          initial={{ opacity: 0, pointerEvents: "none" as const }}
          animate={{ opacity: 1, pointerEvents: "auto" as const }}
          exit={{ opacity: 0, pointerEvents: "none" as const }}
          transition={{ duration: 0.15 }}
          className={`fixed inset-0 z-50 flex bg-stage/75 ${
            resolved === "modal" ? "items-center justify-center p-4" : "items-end"
          }`}
          onClick={onClose}
          data-modal-open="true"
          aria-label={ariaLabel ?? "详情"}
          role="dialog"
          aria-modal="true"
        >
          {resolved === "modal" ? (
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`max-h-[calc(100dvh-2rem)] overflow-y-auto ${panelClassName ?? DEFAULT_PANEL}`}
              style={{ maxHeight: "calc(100dvh - 2rem)", overflowY: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={closeButtonClassName ?? DEFAULT_CLOSE}
                  aria-label="关闭"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              )}
              {children}
            </motion.div>
          ) : (
            <motion.div
              style={{ maxHeight: "90dvh", overflowY: "auto" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={
                panelClassName ??
                "relative w-full max-h-[90vh] overflow-y-auto bg-paper text-ink rounded-t-3xl border-t-2 border-ink"
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex justify-center pt-3 pb-1 bg-paper">
                <div className="w-10 h-1 rounded-full bg-ink/25" />
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={
                    closeButtonClassName ??
                    "absolute top-3 right-3 z-20 p-2 rounded-full bg-ink text-paper hover:bg-accent-500 transition-colors"
                  }
                  aria-label="关闭"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              )}
              {children}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
