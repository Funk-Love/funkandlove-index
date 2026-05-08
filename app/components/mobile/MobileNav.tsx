"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ExternalLink, ChevronDown } from "lucide-react";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { NAV_LINKS } from "@/lib/constants";

interface Props {
  onJoinClick: () => void;
}

/**
 * 移动端导航：右上角浮动汉堡 + 全屏抽屉。
 * 抽屉含锚点跳转、活动/周边/产品外链组、加入我们 CTA。
 */
export default function MobileNav({ onJoinClick }: Props) {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useBodyScrollLock(open);

  const close = () => {
    setOpen(false);
    setExpandedId(null);
  };

  const handleAnchor = (href: string) => {
    close();
    // 等抽屉关闭再滚，避免 body lock 抑制 smooth scroll
    setTimeout(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  return (
    <>
      {/* 浮动汉堡 */}
      <button
        onClick={() => setOpen(true)}
        aria-label="打开菜单"
        className="fixed top-4 right-4 z-40 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80"
            onClick={close}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-neutral-950 border-l border-white/10 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <img
                    src="/icon.png"
                    alt="Funk & Love"
                    className="w-7 h-7 object-contain"
                  />
                  <span className="text-white font-bold text-lg">Funk &amp; Love</span>
                </div>
                <button
                  onClick={close}
                  aria-label="关闭菜单"
                  className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-4 space-y-2">
                {NAV_LINKS.map((link) => {
                  if (link.href) {
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleAnchor(link.href!)}
                        className="w-full text-left px-4 py-3.5 rounded-xl text-white text-base font-medium bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors"
                      >
                        {link.label}
                      </button>
                    );
                  }
                  if (link.url) {
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-white text-base font-medium bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors"
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="w-4 h-4 opacity-60" />
                      </a>
                    );
                  }
                  if (link.subLinks) {
                    const isExpanded = expandedId === link.id;
                    return (
                      <div key={link.id} className="rounded-xl bg-white/5 overflow-hidden">
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : link.id)
                          }
                          className="flex items-center justify-between w-full px-4 py-3.5 text-white text-base font-medium hover:bg-white/5 active:bg-white/10 transition-colors"
                        >
                          <span>{link.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-t border-white/10"
                            >
                              <div className="p-2 space-y-1">
                                {link.subLinks.map((sub) => {
                                  const Icon = sub.icon;
                                  return (
                                    <a
                                      key={sub.id}
                                      href={sub.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-white/90 text-sm bg-white/0 hover:bg-white/10 active:bg-white/15 transition-colors"
                                    >
                                      <span className="flex items-center gap-2">
                                        {Icon && <Icon className="w-4 h-4" />}
                                        {sub.label}
                                      </span>
                                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                                    </a>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }
                  return null;
                })}
              </nav>

              <div className="px-4 pb-6">
                <button
                  onClick={() => {
                    close();
                    onJoinClick();
                  }}
                  className="w-full text-left px-4 py-3.5 text-white text-base font-medium hover:text-white/80 active:text-white/60 transition-colors"
                >
                  加入我们
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
