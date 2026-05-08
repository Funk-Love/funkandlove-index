"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import RecruitDialog from "./shared/RecruitDialog";

// Toast 组件
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000); // 2秒后自动关闭
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在挂载时启动定时器，不依赖 onClose

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-black/90 backdrop-blur-md text-white rounded-xl shadow-2xl border border-white/10"
    >
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
}

/**
 * Navigation Component
 * 
 * 固定顶部导航栏，支持：
 * - 滚动时添加毛玻璃背景效果
 * - 桌面端：水平导航链接
 * - 移动端：汉堡菜单 + 全屏侧边栏
 * - 平滑滚动到对应区域
 * - 响应式设计，移动端触摸区域 ≥ 44x44px
 */
export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recruitOpen, setRecruitOpen] = useState(false);

  // 显示 toast 提示
  const showToast = (message: string) => {
    setToastMessage(message);
  };

  // 监听滚动，添加毛玻璃背景效果
  useEffect(() => {
    let rafId: number | null = null;

    const updateScrolled = () => {
      const nextIsScrolled = window.scrollY > 20;
      if (isScrolledRef.current === nextIsScrolled) return;

      isScrolledRef.current = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
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

  // 平滑滚动到指定区域
  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
    
    // 关闭移动端菜单
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Toast 提示 */}
      <AnimatePresence>
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}
      </AnimatePresence>

      {/* 固定导航栏 */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo / 品牌名称 */}
            <motion.button
              onClick={() => scrollToSection("#hero")}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Logo 图标 - 根据滚动和 hover 状态切换 */}
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                {/* 未滚动 - 默认白色 */}
                <img
                  src="/icon.png"
                  alt="Funk & Love Logo"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                    isScrolled ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                  }`}
                />
                {/* 未滚动 - hover 浅紫色 */}
                <img
                  src="/icon-lightpurple.png"
                  alt="Funk & Love Logo"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                    isScrolled ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                {/* 滚动后 - 默认黑色 */}
                <img
                  src="/icon-black.png"
                  alt="Funk & Love Logo"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                    isScrolled ? "opacity-100 group-hover:opacity-0" : "opacity-0"
                  }`}
                />
                {/* 滚动后 - hover 深紫色 */}
                <img
                  src="/icon-darkpurple.png"
                  alt="Funk & Love Logo"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                    isScrolled ? "opacity-0 group-hover:opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              
              {/* 文字 */}
              <span className={`text-xl md:text-2xl font-bold transition-colors ${
                isScrolled
                  ? "text-gray-900 group-hover:text-purple-600"
                  : "text-white group-hover:text-purple-300"
              }`}>
                Funk & Love
              </span>
            </motion.button>

            {/* 桌面端导航链接 */}
            <div className="hidden md:flex items-center space-x-6">
              {/* 第一组：首页、队伍、历史 */}
              {NAV_LINKS.filter(link => ['home', 'team', 'history'].includes(link.id)).map((link) => (
                <div key={link.id} className="relative">
                  <motion.button
                    onClick={() => link.href && scrollToSection(link.href)}
                    className={`text-base font-medium transition-colors relative group ${
                      isScrolled
                        ? "text-gray-700 hover:text-purple-600"
                        : "text-white/90 hover:text-white"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    {link.label}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                      isScrolled ? "bg-purple-600" : "bg-white"
                    }`} />
                  </motion.button>
                </div>
              ))}

              {/* 分隔线 */}
              <div className={`w-[1.5px] h-4 rounded-full ${isScrolled ? "bg-gradient-to-b from-purple-400/60 to-pink-400/60" : "bg-gradient-to-b from-white/50 to-white/20"}`} />

              {/* 第二组：计划、活动、云存储 */}
              {NAV_LINKS.filter(link => ['plan', 'activities', 'merch', 'products'].includes(link.id)).map((link) => (
                <div 
                  key={link.id} 
                  className="relative"
                  onMouseEnter={() => link.subLinks && setActiveDropdown(link.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.subLinks ? (
                    // 带下拉菜单的按钮
                    <motion.button
                      className={`text-base font-medium transition-colors relative group flex items-center gap-1 ${
                        isScrolled
                          ? "text-gray-700 hover:text-purple-600"
                          : "text-white/90 hover:text-white"
                      }`}
                      whileHover={{ y: -2 }}
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                      {/* 悬停下划线效果 */}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                        isScrolled ? "bg-purple-600" : "bg-white"
                      }`} />
                    </motion.button>
                  ) : link.url ? (
                    // 外部链接
                    <motion.a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block text-base font-medium transition-colors relative group ${
                        isScrolled
                          ? "text-gray-700 hover:text-purple-600"
                          : "text-white/90 hover:text-white"
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      {link.label}
                      {/* 悬停下划线效果 */}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                        isScrolled ? "bg-purple-600" : "bg-white"
                      }`} />
                    </motion.a>
                  ) : (
                    // 普通链接按钮
                    <motion.button
                      onClick={() => {
                        if (link.id === 'plan') {
                          showToast('Funk&Love训练计划功能还在制作中，预计在下个大版本加入');
                        } else if (link.href) {
                          scrollToSection(link.href);
                        }
                      }}
                      className={`text-base font-medium transition-colors relative group ${
                        isScrolled
                          ? "text-gray-700 hover:text-purple-600"
                          : "text-white/90 hover:text-white"
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      {link.label}
                      {/* 悬停下划线效果 */}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                        isScrolled ? "bg-purple-600" : "bg-white"
                      }`} />
                    </motion.button>
                  )}

                  {/* 下拉菜单 */}
                  <AnimatePresence>
                    {link.subLinks && activeDropdown === link.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ 
                          duration: 0.2,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        className={`absolute top-full left-0 mt-3 w-64 rounded-xl shadow-2xl overflow-hidden z-50 ${
                          isScrolled 
                            ? "bg-white/98 backdrop-blur-lg border border-gray-100" 
                            : "bg-gray-900/98 backdrop-blur-lg border border-gray-700/50"
                        }`}
                      >
                        {/* 装饰性渐变顶部 */}
                        <div className={`h-1 ${
                          isScrolled 
                            ? "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" 
                            : "bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
                        }`} />
                        
                        <div className="py-2">
                          {link.subLinks.map((subLink, index) => (
                            <motion.a
                              key={subLink.id}
                              href={subLink.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`group flex items-center px-5 py-3.5 font-medium transition-all duration-200 ${
                                isScrolled
                                  ? "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600"
                                  : "text-gray-100 hover:bg-gradient-to-r hover:from-purple-900/50 hover:to-pink-900/50 hover:text-white"
                              }`}
                              whileHover={{ x: 6 }}
                            >
                              {/* 装饰性图标 */}
                              {subLink.icon && (
                                <subLink.icon className={`mr-3 w-5 h-5 transition-transform group-hover:scale-110 ${
                                  isScrolled ? "text-purple-500" : "text-purple-400"
                                }`} />
                              )}
                              
                              <span className="flex-1">{subLink.label}</span>
                              
                              {/* 箭头指示器 */}
                              <svg 
                                className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                                  isScrolled ? "text-purple-400" : "text-purple-300"
                                }`}
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* 加入我们 - 与其他 nav 按钮同款样式 */}
              <motion.button
                onClick={() => setRecruitOpen(true)}
                className={`text-base font-medium transition-colors relative group ${
                  isScrolled
                    ? "text-gray-700 hover:text-purple-600"
                    : "text-white/90 hover:text-white"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                加入我们
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled ? "bg-purple-600" : "bg-white"
                }`} />
              </motion.button>
            </div>

            {/* 移动端汉堡菜单按钮 */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-purple-600"
                  : "text-white hover:text-purple-300"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* 移动端全屏侧边栏 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* 侧边栏菜单 */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200 
              }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white z-50 md:hidden shadow-2xl"
            >
              {/* 侧边栏头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">菜单</h2>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* 侧边栏导航链接 */}
              <nav className="p-6">
                <ul className="space-y-2">
                  {/* 第一组：首页、队伍、历史 */}
                  {NAV_LINKS.filter(link => ['home', 'team', 'history'].includes(link.id)).map((link, index) => (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.3 
                      }}
                    >
                      <motion.button
                        onClick={() => link.href && scrollToSection(link.href)}
                        className="w-full text-left px-4 py-3 text-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ minHeight: "44px", minWidth: "44px" }}
                      >
                        {link.label}
                      </motion.button>
                    </motion.li>
                  ))}

                  {/* 分隔线 */}
                  <li className="py-2">
                    <div className="h-px bg-gray-200 mx-4" />
                  </li>

                  {/* 第二组：计划、活动、云存储 */}
                  {NAV_LINKS.filter(link => ['plan', 'activities', 'merch', 'products'].includes(link.id)).map((link, index) => (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.3 
                      }}
                    >
                      {link.subLinks ? (
                        // 带子菜单的项
                        <div>
                          <motion.button
                            onClick={() => setActiveDropdown(activeDropdown === link.id ? null : link.id)}
                            className="w-full text-left px-4 py-3 text-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-between"
                            whileHover={{ x: 8 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ minHeight: "44px", minWidth: "44px" }}
                          >
                            {link.label}
                            <ChevronDown 
                              className={`w-5 h-5 transition-transform ${
                                activeDropdown === link.id ? "rotate-180" : ""
                              }`} 
                            />
                          </motion.button>
                          <AnimatePresence>
                            {activeDropdown === link.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 pt-2 space-y-1">
                                  {link.subLinks.map((subLink) => (
                                    <motion.a
                                      key={subLink.id}
                                      href={subLink.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 px-4 py-2 text-base text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                      whileHover={{ x: 4 }}
                                      style={{ minHeight: "44px" }}
                                    >
                                      {subLink.icon && <subLink.icon className="w-4 h-4 text-purple-500" />}
                                      {subLink.label}
                                    </motion.a>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : link.url ? (
                        // 外部链接项
                        <motion.a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          whileHover={{ x: 8 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ minHeight: "44px", minWidth: "44px" }}
                        >
                          {link.label}
                        </motion.a>
                      ) : (
                        // 普通链接项
                        <motion.button
                          onClick={() => {
                            if (link.id === 'plan') {
                              showToast('Funk&Love训练计划功能还在制作中，预计在下个大版本加入');
                              setIsMobileMenuOpen(false);
                            } else if (link.href) {
                              scrollToSection(link.href);
                            }
                          }}
                          className="w-full text-left px-4 py-3 text-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          whileHover={{ x: 8 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ minHeight: "44px", minWidth: "44px" }}
                        >
                          {link.label}
                        </motion.button>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <RecruitDialog open={recruitOpen} onClose={() => setRecruitOpen(false)} />
    </>
  );
}
