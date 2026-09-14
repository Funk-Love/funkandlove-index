"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, NAV_HEIGHT } from "@/lib/constants";
import { getIcon } from "@/lib/icons";
import RecruitDialog from "./shared/RecruitDialog";
import NavPlayer from "./music/NavPlayer";

// Toast 组件
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      role="status"
      aria-live="polite"
      className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-ink text-paper rounded-full border-2 border-pop-500 shadow-action"
    >
      <p className="text-sm font-bold">{message}</p>
    </motion.div>
  );
}

const linkBase =
  "relative group text-[15px] font-bold tracking-wide transition-colors duration-200 py-1";
const underline =
  "absolute -bottom-0.5 left-0 h-0.5 w-0 bg-accent-500 transition-[width] duration-200 group-hover:w-full";

interface Props {
  onJoinClick?: () => void;
  onNavigate?: (href: string) => void;
}

/**
 * 桌面固定顶部导航(仅桌面,由 DesktopView 在 ≥768px 挂载;移动端走 MobileNav)。
 * - 未滚动:透明,压在深棕 Hero 上,纸色文字
 * - 滚动后:纸面底 + 2px 墨线,墨色文字
 * - 下拉菜单:奶油纸面、细分隔、轻阴影，与触发器连续的命中区
 * - "coming-soon" 类型链接点击只弹 Toast
 */
export default function Navigation({ onJoinClick, onNavigate }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recruitOpen, setRecruitOpen] = useState(false);

  const openRecruit = () => { setActiveDropdown(null); (onJoinClick ?? (() => setRecruitOpen(true)))(); };

  useEffect(() => {
    if (!activeDropdown) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setActiveDropdown(null);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [activeDropdown]);

  useEffect(() => {
    let rafId: number | null = null;
    const updateScrolled = () => {
      const next = window.scrollY > 20;
      if (isScrolledRef.current === next) return;
      isScrolledRef.current = next;
      setIsScrolled(next);
    };
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateScrolled();
      });
    };
    updateScrolled();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToSection = (href: string) => {
    setActiveDropdown(null);
    if (onNavigate) { onNavigate(href); return; }
    const element = document.getElementById(href.replace("#", ""));
    element?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  };

  const ink = isScrolled ? "text-ink hover:text-accent-600" : "text-paper/90 hover:text-paper";

  return (
    <>
      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      </AnimatePresence>

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 border-b ${
          isScrolled ? "bg-paper/95 backdrop-blur-md border-ink/20" : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between" style={{ height: NAV_HEIGHT }}>
            {/* 品牌 */}
            <NavPlayer onHome={() => scrollToSection("#hero")}
              brandClassName={isScrolled ? "text-ink hover:text-accent-600" : "text-paper hover:text-pop-500"} />

            {/* 链接 */}
            <div className="desktop-nav-links flex items-center gap-6">
              {NAV_LINKS.filter((l) => ["home", "team", "history"].includes(l.id)).map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => link.href && scrollToSection(link.href)}
                  className={`${linkBase} ${ink}`}
                >
                  {link.label}
                  <span className={underline} />
                </button>
              ))}

              <span
                aria-hidden
                className={`w-0.5 h-4 rounded-full ${isScrolled ? "bg-ink/30" : "bg-paper/30"}`}
              />

              {NAV_LINKS.filter((l) => ["plan", "activities", "merch", "products"].includes(l.id)).map(
                (link) => (
                  <div
                    key={link.id}
                    className="relative"
                    onMouseEnter={() => link.subLinks && setActiveDropdown(link.id)}
                    onMouseLeave={(event) => {
                      if (!event.currentTarget.querySelector('[role="menu"]')?.contains(document.activeElement)) setActiveDropdown(null);
                    }}
                    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveDropdown(null); }}
                    onKeyDown={(event) => {
                      const trigger = event.currentTarget.querySelector<HTMLButtonElement>('button');
                      if (event.key === "Escape") { event.preventDefault(); setActiveDropdown(null); trigger?.focus(); return; }
                      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) || !link.subLinks) return;
                      event.preventDefault();
                      setActiveDropdown(link.id);
                      const host = event.currentTarget;
                      requestAnimationFrame(() => {
                        const items = Array.from(host.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]'));
                        const current = items.indexOf(document.activeElement as HTMLAnchorElement);
                        const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : event.key === "ArrowUp" ? (current <= 0 ? items.length - 1 : current - 1) : (current + 1) % items.length;
                        items[next]?.focus();
                      });
                    }}
                  >
                    {link.subLinks ? (
                      <button
                        type="button"
                        className={`${linkBase} ${ink} flex items-center gap-1`}
                        aria-haspopup="menu"
                        aria-expanded={activeDropdown === link.id}
                        aria-controls={`nav-menu-${link.id}`}
                        onClick={() => setActiveDropdown(link.id)}
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === link.id ? "rotate-180" : ""
                          }`}
                        />
                        <span className={underline} />
                      </button>
                    ) : link.url ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${linkBase} ${ink} inline-block`}
                      >
                        {link.label}
                        <span className={underline} />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (link.kind === "coming-soon") {
                            setToastMessage(link.message ?? "功能筹备中，敬请期待");
                            return;
                          }
                          if (link.href) scrollToSection(link.href);
                        }}
                        className={`${linkBase} ${ink}`}
                      >
                        {link.label}
                        <span className={underline} />
                      </button>
                    )}

                    <AnimatePresence>
                      {link.subLinks && activeDropdown === link.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="nav-dropdown absolute top-full right-0 pt-5 w-80 z-50"
                        >

                          <div id={`nav-menu-${link.id}`} role="menu" aria-label={link.label} className="nav-dropdown-paper bg-paper text-ink rounded-sm px-3 py-2 divide-y divide-ink/10">
                            {link.subLinks.map((subLink) => {
                              const Icon = getIcon(subLink.icon);
                              return (
                                <a
                                  key={subLink.id}
                                  href={subLink.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  role="menuitem"
                                  className="group/item flex min-h-16 items-center gap-4 px-3 py-4 text-[15px] font-medium text-ink hover:bg-paper-2 focus-visible:bg-paper-2 transition-colors duration-150"
                                >
                                  {Icon && (
                                    <Icon className="w-5 h-5 text-ink-muted group-hover/item:text-action" strokeWidth={1.5} />
                                  )}
                                  <span className="flex-1">{subLink.label}</span>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted transition-[translate,color] duration-150 group-hover/item:text-action group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                                </a>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              )}

              {/* 加入我们 CTA */}
              <button
                type="button"
                onClick={openRecruit}
                className={`ml-1 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-[transform,translate,box-shadow,background-color,color,border-color] duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  isScrolled
                    ? "bg-action border-action text-on-action shadow-paper-sm hover:bg-action-hover"
                    : "bg-pop-500 border-pop-500 text-ink hover:bg-pop-400"
                }`}
              >
                加入我们
              </button>
            </div>
          </div>
        </div>
      </nav>

      {!onJoinClick && <RecruitDialog open={recruitOpen} onClose={() => setRecruitOpen(false)} />}
    </>
  );
}
