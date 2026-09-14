"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, ChevronDown } from "lucide-react";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { NAV_LINKS } from "@/lib/constants";
import { getIcon } from "@/lib/icons";
import BrandMark from "../shared/BrandMark";
import { useModalFocus } from "../../hooks/useModalFocus";
import NavPlayer from "../music/NavPlayer";

interface Props {
  onJoinClick: () => void;
}

const TOAST_DURATION_MS = 2500;

/** 尊重系统「减少动态效果」设置 */
function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "instant"
    : "smooth";
}

/** 抽屉一级项:粗体墨字,细墨线分隔,44px 以上触控高度 */
const ITEM =
  "flex items-center justify-between w-full min-h-14 px-5 py-4 text-left text-ink text-lg font-bold transition-colors duration-150 active:bg-pop-500/35";

/**
 * 移动端导航:右上角品牌 icon 小按钮打开抽屉，播放器位于抽屉内。
 * 抽屉含锚点跳转、活动/周边/产品外链组、加入我们 CTA。
 * 「计划」等 coming-soon 项只弹底部 toast 提示,不跳转。
 * 抽屉 / toast 的进出场走 framer AnimatePresence(D5)。
 */
export default function MobileNav({ onJoinClick }: Props) {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  /** 待跳转的锚点;抽屉关闭、body 解锁后再滚动(用 ref 避免 effect 内 setState) */
  const pendingTarget = useRef<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useBodyScrollLock(open);

  const close = () => {
    setOpen(false);
    setExpandedId(null);
  };
  const dialogRef = useRef<HTMLElement>(null);
  useModalFocus(open, dialogRef, close);

  /**
   * 锚点跳转顺序:关抽屉 → useBodyScrollLock 的 cleanup 解除根滚动锁
   * → 本 effect 再 scrollIntoView → 焦点移到目标段。
   * React 在同一次 commit 里先跑所有 effect 的 cleanup 再跑 setup,
   * 所以这个以 open 为依赖的 effect 在 open 翻成 false 的那次 commit 里,
   * 必定排在 useBodyScrollLock 的 cleanup 之后执行。
   */
  const handleAnchor = (href: string) => {
    pendingTarget.current = href;
    close();
  };

  useEffect(() => {
    if (open) return;
    const href = pendingTarget.current;
    if (!href) return;
    pendingTarget.current = null;
    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;
    el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    el.tabIndex = -1;
    el.focus({ preventScroll: true });
  }, [open]);

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, TOAST_DURATION_MS);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleComingSoon = (message: string) => {
    close();
    showToast(message);
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="打开菜单" aria-expanded={open} aria-haspopup="dialog"
        className="fixed top-4 right-4 z-40 w-11 h-11 rounded-full bg-paper text-ink border-2 border-ink shadow-paper-sm flex items-center justify-center transition-[transform,translate,box-shadow] duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
        <BrandMark className="w-7 h-7" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-stage/75"
            onClick={close}
          >
            <motion.aside
              ref={dialogRef}
              tabIndex={-1}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label="导航菜单"
              className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-paper text-ink border-l-2 border-ink overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 海报色条 */}
              <div className="h-1.5 shrink-0 bg-linear-to-r from-accent-500 via-pop-500 to-accent-500" />

              <div className="flex items-center justify-between px-5 py-4 border-b-2 border-ink">
                <div className="flex items-center gap-2.5">
                  <BrandMark className="w-8 h-8" />
                  <span className="font-display text-xl tracking-wide text-ink">Funk <span className="font-sans font-semibold">&amp;</span> Love</span>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="关闭菜单"
                  className="w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center transition-colors active:bg-accent-500"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              <div className="px-5 py-4 border-b border-ink/15">
                <NavPlayer mobile menuOpen={open} />
              </div>

              <nav className="flex-1">
                <ul className="divide-y divide-ink/15">
                  {NAV_LINKS.map((link) => {
                    if (link.kind === "coming-soon") {
                      return (
                        <li key={link.id}>
                          <button
                            type="button"
                            onClick={() =>
                              handleComingSoon(link.message ?? "功能筹备中，敬请期待")
                            }
                            className={ITEM}
                          >
                            <span>{link.label}</span>
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full bg-pop-500 text-ink">
                              soon
                            </span>
                          </button>
                        </li>
                      );
                    }
                    if (link.href) {
                      return (
                        <li key={link.id}>
                          <button
                            type="button"
                            onClick={() => handleAnchor(link.href!)}
                            className={ITEM}
                          >
                            <span>{link.label}</span>
                          </button>
                        </li>
                      );
                    }
                    if (link.url) {
                      return (
                        <li key={link.id}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={ITEM}
                          >
                            <span>{link.label}</span>
                            <ArrowUpRight className="w-5 h-5 text-ink-muted" />
                          </a>
                        </li>
                      );
                    }
                    if (link.subLinks) {
                      const isExpanded = expandedId === link.id;
                      return (
                        <li key={link.id}>
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : link.id)}
                            aria-expanded={isExpanded}
                            className={ITEM}
                          >
                            <span>{link.label}</span>
                            <ChevronDown
                              className={`w-5 h-5 text-ink-muted transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                              strokeWidth={2.25}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <ul className="pb-2 bg-paper-2 border-t border-ink/15">
                                  {link.subLinks.map((sub) => {
                                    const Icon = getIcon(sub.icon);
                                    return (
                                      <li key={sub.id}>
                                        <a
                                          href={sub.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-3 min-h-12 pl-6 pr-5 py-3 text-ink text-base font-bold transition-colors active:bg-pop-500/35"
                                        >
                                          {Icon && (
                                            <Icon
                                              className="w-5 h-5 text-accent-600 shrink-0"
                                              strokeWidth={2.25}
                                            />
                                          )}
                                          <span className="flex-1">{sub.label}</span>
                                          <ArrowUpRight className="w-4 h-4 text-ink-muted" />
                                        </a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </nav>

              <div className="px-5 pt-5 pb-8 border-t-2 border-ink">
                <button
                  type="button"
                  onClick={() => {
                    close();
                    onJoinClick();
                  }}
                  className="w-full inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-full bg-action text-on-action text-lg font-bold border border-action shadow-action transition-[transform,translate,box-shadow] duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  加入我们
                </button>
                <p className="mt-4 font-mono text-[10px] tracking-[0.3em] uppercase text-ink-faint text-center">
                  ZJU DFM · Locking
                </p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* coming-soon 提示:底部居中胶囊,不拦截交互,自动消失 */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 12, x: "-50%" }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 left-1/2 z-60 max-w-[calc(100vw-2rem)] px-5 py-3 rounded-full bg-ink text-paper border-2 border-pop-500 shadow-action text-base font-bold text-center pointer-events-none"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
