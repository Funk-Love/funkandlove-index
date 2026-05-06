"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useMediaQuery } from "../../hooks/useMediaQuery";

type Variant = "modal" | "sheet" | "auto";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: Variant;
  /** 应用到 panel 容器（覆盖 max-width / 边框） */
  panelClassName?: string;
  /** 关闭按钮额外类名（位置/颜色微调） */
  closeButtonClassName?: string;
  ariaLabel?: string;
  /** 是否渲染默认右上角关闭按钮（默认 true） */
  showCloseButton?: boolean;
}

const DEFAULT_PANEL =
  "relative max-w-2xl w-full bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10";

const DEFAULT_CLOSE =
  "absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors";

/**
 * 详情容器 - 桌面 modal / 移动 bottom sheet 双形态。
 * - 视觉与原 LeaderModal 对齐（bg-black/80 蒙层、bg-black/50 关闭按钮）
 * - ESC 关闭、点击蒙层关闭、body 滚动锁定
 * - data-modal-open="true" 用于 useSnapScroll 暂停劫持
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
  const resolved: "modal" | "sheet" =
    variant === "auto" ? (isDesktop ? "modal" : "sheet") : variant;

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, pointerEvents: "none" as const }}
          animate={{ opacity: 1, pointerEvents: "auto" as const }}
          exit={{ opacity: 0, pointerEvents: "none" as const }}
          transition={{ duration: 0.15 }}
          className={`fixed inset-0 z-50 flex bg-black/80 ${
            resolved === "modal" ? "items-center justify-center p-4" : "items-end"
          }`}
          onClick={onClose}
          data-modal-open="true"
          aria-label={ariaLabel}
          role="dialog"
          aria-modal="true"
        >
          {resolved === "modal" ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={panelClassName ?? DEFAULT_PANEL}
              onClick={(e) => e.stopPropagation()}
            >
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={closeButtonClassName ?? DEFAULT_CLOSE}
                  aria-label="关闭"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
              {children}
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={
                panelClassName ??
                "relative w-full max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-t-3xl border-t border-white/10"
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex justify-center pt-3 pb-1 bg-neutral-900">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={
                    closeButtonClassName ??
                    "absolute top-3 right-3 z-20 p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                  }
                  aria-label="关闭"
                >
                  <X className="w-5 h-5" />
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
