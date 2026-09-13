"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { NAV_HEIGHT } from "@/lib/constants";
import { LEADERS } from "@/lib/data/leaders";
import type { Leader } from "@/lib/types";
import LeaderCard from "./shared/LeaderCard";
import SectionHeader from "./ui/SectionHeader";
import LeaderDetail from "./shared/LeaderDetail";
import DetailSheet from "./shared/DetailSheet";
import { getModalBorderStyle } from "./shared/leaderStyles";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * 历年队长 Section - 纵向滚动驱动横向滚动（sticky 横滚）。
 * 横移由 ScrollTrigger scrub tween 直接驱动,避免每帧 setState 重渲染。
 */
export default function Leaders() {
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const horizontalTweenRef = useRef<gsap.core.Tween | null>(null);
  // 弹窗(body 被锁成 fixed)期间冻结横移,避免 scrollY 归零导致跳回开头
  const modalOpenRef = useRef(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [windowHeight, setWindowHeight] = useState(800);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 响应式卡片宽度（viewport-relative，保证浏览器缩放下物理像素恒定）
  // 基准：1920px 视口下 320px 卡片 ≈ 16.7% 视口宽度
  const CARD_WIDTH =
    windowWidth < 640
      ? Math.round(Math.max(220, Math.min(280, windowWidth * 0.42)))
      : windowWidth < 1024
      ? Math.round(Math.max(240, Math.min(310, windowWidth * 0.22)))
      : Math.round(Math.max(280, Math.min(360, windowWidth * 0.167)));
  const CARD_GAP = Math.max(12, Math.round(windowWidth * 0.015));
  const TOTAL_WIDTH = LEADERS.length * (CARD_WIDTH + CARD_GAP);
  const SCROLL_DISTANCE = Math.max(0, TOTAL_WIDTH - windowWidth + 64);
  // 横移完成后再留一段"停留缓冲"仍 sticky 住,让完成点远离 sticky 释放点。
  const DWELL = Math.round(windowHeight * 0.35);
  // 确保容器高度足够滚动完整个内容 + 缓冲，最小为 1.5 倍视口高度
  const containerHeight = Math.max(windowHeight * 1.5, windowHeight + SCROLL_DISTANCE + DWELL);

  // IntersectionObserver 检测可见性（仅驱动标题入场）
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ScrollTrigger：纵向滚动驱动卡片行横移 + 进度条。
  // 横移必须是一个 top-level scroll-linked tween，并使用 ease:"none"，
  // 让滚动进度和横向位置保持 1:1，避免 quickTo 滞后追赶造成尾段闪动。
  useGSAP(
    () => {
      const container = containerRef.current;
      const cards = scrollContainerRef.current;
      const bar = progressBarRef.current;
      if (!container || !cards || !bar) return;

      // 横移距离实时按卡片行实际宽度算(卡片宽度随视口变)
      const distance = () => Math.max(0, cards.scrollWidth - window.innerWidth + 64);

      const tween = gsap.to(cards, {
        x: () => -distance(),
        ease: "none",
        overwrite: "auto",
        scrollTrigger: {
          trigger: container,
          start: `top ${NAV_HEIGHT}px`,
          // 横移在 distance 内走完;之后 DWELL 段仍 sticky 停留,给尾部阅读留缓冲。
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (modalOpenRef.current) return; // 弹窗期冻结进度条,防跳回开头
            bar.style.width = `${self.progress * 100}%`;
          },
        },
      });
      horizontalTweenRef.current = tween;

      return () => {
        horizontalTweenRef.current = null;
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { dependencies: [windowWidth, windowHeight], scope: containerRef, revertOnUpdate: true }
  );

  // 打开详情：先置冻结标志(早于 body 被锁成 fixed),暂停横滚同步。
  const openLeader = (leader: Leader) => {
    modalOpenRef.current = true;
    horizontalTweenRef.current?.pause();
    setSelectedLeader(leader);
  };
  const closeLeader = () => {
    setSelectedLeader(null);
    // 等 body 解锁、scrollY 恢复后再解冻 + 重算
    requestAnimationFrame(() => {
      modalOpenRef.current = false;
      ScrollTrigger.refresh();
      horizontalTweenRef.current?.resume();
    });
  };

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
              <SectionHeader
                index={4}
                eyebrow="captains"
                title="历年队长"
                subtitle="从17届至今,一代代队长带领我们走过每一个精彩瞬间"
                theme="dark"
              />
            </div>

            <div
              ref={scrollContainerRef}
              className="flex will-change-transform"
              style={{ gap: `${CARD_GAP}px` }}
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
                    onClick={() => openLeader(leader)}
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
                  ref={progressBarRef}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DetailSheet
        open={selectedLeader !== null}
        onClose={closeLeader}
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
