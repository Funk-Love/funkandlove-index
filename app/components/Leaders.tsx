"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { NAV_HEIGHT } from "@/lib/constants";
import { LEADERS } from "@/lib/data/leaders";
import type { Leader } from "@/lib/types";
import LeaderCard from "./shared/LeaderCard";
import LeaderDetail from "./shared/LeaderDetail";
import DetailSheet from "./shared/DetailSheet";
import { getModalBorderStyle } from "./shared/leaderStyles";

/**
 * 历年队长 Section - 使用原生滚动事件 + RAF 节流，sticky 横滚 scrolljacking。
 */
export default function Leaders() {
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [windowHeight, setWindowHeight] = useState(800);
  const [translateX, setTranslateX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 响应式卡片宽度
  const CARD_WIDTH = windowWidth < 640 ? 260 : windowWidth < 1024 ? 280 : 320;
  const CARD_GAP = windowWidth < 640 ? 16 : 28;
  const TOTAL_WIDTH = LEADERS.length * (CARD_WIDTH + CARD_GAP);
  const SCROLL_DISTANCE = Math.max(0, TOTAL_WIDTH - windowWidth + 64);
  // 确保容器高度足够滚动完整个内容，最小为 1.5 倍视口高度
  const containerHeight = Math.max(windowHeight * 1.5, windowHeight + SCROLL_DISTANCE);

  // 使用 RAF 节流的滚动处理
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) {
        rafRef.current = 0;
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      // 考虑 navbar 高度，从 navbar 下方开始计算
      const scrollStart = -rect.top + NAV_HEIGHT;
      const scrollEnd = containerHeight - window.innerHeight;
      const scrollProgress =
        scrollEnd > 0 ? Math.max(0, Math.min(1, scrollStart / scrollEnd)) : 0;

      setTranslateX(-scrollProgress * SCROLL_DISTANCE);
      setProgress(scrollProgress * 100);
      rafRef.current = 0;
    });
  }, [containerHeight, SCROLL_DISTANCE]);

  // IntersectionObserver 检测可见性
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 只在可见且无模态框时监听滚动
  // 模态框打开会让 body 变 fixed，scrollY 行为变化会导致 translateX 跳变 → 视觉上闪烁
  useEffect(() => {
    if (!isVisible || selectedLeader !== null) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 初始计算

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [isVisible, handleScroll, selectedLeader]);

  return (
    <>
      <div
        ref={containerRef}
        className="relative bg-neutral-900"
        style={{ height: `${containerHeight}px` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-start px-[2vw] sm:px-[4vw] lg:px-[6vw] pt-[12vh] md:pt-[10vh]">
            <div
              className={`mb-6 sm:mb-8 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-2 sm:mb-4">
                历年队长
              </h2>
              <p className="text-base sm:text-xl text-gray-400">
                从17届至今，一代代队长带领我们走过每一个精彩瞬间
              </p>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex will-change-transform"
              style={{
                transform: `translateX(${translateX}px)`,
                gap: `${CARD_GAP}px`,
              }}
            >
              {LEADERS.map((leader, index) => {
                const isFounder = leader.role === "founder";
                // 卡片最大占视口高度的 55%，最小 300px
                const baseHeight = Math.max(
                  300,
                  Math.min(windowHeight * 0.55, isFounder ? 500 : 460)
                );
                const cardHeight = isFounder ? baseHeight * 1.08 : baseHeight;
                const cardWidth = isFounder ? CARD_WIDTH + 20 : CARD_WIDTH;

                return (
                  <LeaderCard
                    key={leader.id}
                    leader={leader}
                    width={cardWidth}
                    height={cardHeight}
                    priority={index < 5}
                    onClick={() => setSelectedLeader(leader)}
                  />
                );
              })}
            </div>

            {/* 进度条 */}
            <div className="mt-6 sm:mt-8 max-w-md">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-xs sm:text-sm text-gray-500">滚动浏览</span>
                <span className="text-xs sm:text-sm text-gray-500">→</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DetailSheet
        open={selectedLeader !== null}
        onClose={() => setSelectedLeader(null)}
        variant="modal"
        panelClassName={`relative max-w-2xl w-full bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border ${
          selectedLeader ? getModalBorderStyle(selectedLeader.role) : "border-white/10"
        }`}
      >
        {selectedLeader && <LeaderDetail leader={selectedLeader} />}
      </DetailSheet>
    </>
  );
}
