"use client";

import { memo, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LEADERS } from "@/lib/data/leaders";
import type { Leader } from "@/lib/types";
import LeaderCard from "./shared/LeaderCard";
import SectionHeader from "./ui/SectionHeader";
import LeaderDetail from "./shared/LeaderDetail";
import DetailSheet from "./shared/DetailSheet";
import { getModalBorderStyle } from "./shared/leaderStyles";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * 历年队长 Section - 纵向滚动驱动横向滚动（sticky 横滚）。
 * 横移由 ScrollTrigger scrub tween 直接驱动,避免每帧 setState 重渲染。
 *
 * reduced-motion:不做 sticky 横滚(只关 ScrollTrigger 会让 overflow-hidden 裁掉后面的人),
 * 改为渲染正常文档流中的换行卡片网格,所有人物可达。卡片尺寸与详情弹窗两种模式共用。
 */
function Leaders() {
  const reducedMotion = usePrefersReducedMotion();
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [windowHeight, setWindowHeight] = useState(800);

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
  const TOTAL_WIDTH = LEADERS.length * CARD_WIDTH + 20 + (LEADERS.length - 1) * CARD_GAP;
  const horizontalInset = windowWidth * (windowWidth >= 1024 ? 0.06 : windowWidth >= 640 ? 0.04 : 0.02);
  const SCROLL_DISTANCE = Math.max(0, TOTAL_WIDTH - (windowWidth - 2 * horizontalInset));
  // 横移完成后再留一段"停留缓冲"仍 sticky 住,让完成点远离 sticky 释放点。
  const DWELL = Math.round(windowHeight * 0.35);
  // 确保容器高度足够滚动完整个内容 + 缓冲，最小为 1.5 倍视口高度
  const containerHeight = Math.max(windowHeight * 1.5, windowHeight + SCROLL_DISTANCE + DWELL);

  // 容器高度在挂载后由 JS 决定,后面所有 ScrollTrigger(含各段的 useReveal)的起点都会因此偏移,
  // 高度定下来后统一 refresh 一次,避免文末元素的揭示永远不触发。
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [containerHeight]);

  // ScrollTrigger：纵向滚动驱动卡片行横移 + 进度条。
  // 横移必须是一个 top-level scroll-linked tween，并使用 ease:"none"，
  // 让滚动进度和横向位置保持 1:1，避免 quickTo 滞后追赶造成尾段闪动。
  useGSAP(
    () => {
      if (reducedMotion) return;
      const container = containerRef.current;
      const cards = scrollContainerRef.current;
      const bar = progressBarRef.current;
      if (!container || !cards || !bar) return;

      // 横移距离实时按卡片行实际宽度算(卡片宽度随视口变)
      // Measure the actual content viewport; a fixed 64px allowance clips the
      // last portrait when the section's responsive padding is wider than that.
      const distance = () => Math.max(0, cards.scrollWidth - cards.clientWidth);

      const tween = gsap.fromTo(cards, { x: 0 }, {
        x: () => -distance(),
        ease: "none",
        overwrite: "auto",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          // 横移在 distance 内走完;之后 DWELL 段仍 sticky 停留,给尾部阅读留缓冲。
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            bar.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { dependencies: [windowWidth, windowHeight, reducedMotion], scope: containerRef, revertOnUpdate: true }
  );

  // 根滚动容器锁定期间坐标保持不变，scrub 无需暂停或重算。
  const openLeader = (leader: Leader) => setSelectedLeader(leader);
  const closeLeader = () => setSelectedLeader(null);

  // 卡片尺寸(两种模式共用):最大占视口高度 55%,最小 300px;创始人略大
  const cardSize = (leader: Leader) => {
    const isFounder = leader.role === "founder";
    const baseHeight = Math.max(300, Math.min(windowHeight * 0.55, isFounder ? 500 : 460));
    const visibleHeight = Math.max(220, windowHeight - Math.max(100, windowHeight * 0.1) - 230);
    return {
      width: isFounder ? CARD_WIDTH + 20 : CARD_WIDTH,
      height: Math.min(isFounder ? baseHeight * 1.08 : baseHeight, visibleHeight),
    };
  };

  const detailSheet = (
    <DetailSheet
      open={selectedLeader !== null}
      onClose={closeLeader}
      ariaLabel={selectedLeader ? `${selectedLeader.name} 详情` : "队长详情"}
      variant="modal"
      panelClassName={`relative max-w-2xl w-full bg-paper text-ink rounded-3xl overflow-hidden shadow-paper border-2 ${
        selectedLeader ? getModalBorderStyle(selectedLeader.role) : "border-ink"
      }`}
    >
      {selectedLeader && <LeaderDetail leader={selectedLeader} />}
    </DetailSheet>
  );

  if (reducedMotion) {
    return (
      <>
        <div ref={containerRef} className="relative bg-stage paper-grain-dark px-[2vw] sm:px-[4vw] lg:px-[6vw] pt-[12vh] md:pt-[10vh] pb-16">
          <div className="mb-6 sm:mb-8">
            <SectionHeader
              index={4}
              eyebrow="captains"
              title="历年队长"
              theme="dark"
            />
            <p className="mt-4 text-sm text-paper/70">17—26 届</p>
          </div>
          <div className="flex flex-wrap" style={{ gap: `${CARD_GAP}px` }}>
            {LEADERS.map((leader) => {
              const { width, height } = cardSize(leader);
              return (
                <LeaderCard
                  key={leader.id}
                  leader={leader}
                  width={width}
                  height={height}
                  priority={false}
                  onClick={() => openLeader(leader)}
                />
              );
            })}
          </div>
        </div>
        {detailSheet}
      </>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="leaders-stage relative bg-stage"
        style={{ height: `${containerHeight}px` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="relative z-10 h-full flex flex-col justify-start px-[2vw] sm:px-[4vw] lg:px-[6vw] pt-[max(100px,10vh)]">
            <div className="leaders-heading mb-7 flex items-end justify-between gap-8 border-b border-paper/15 pb-5">
              <SectionHeader index={4} eyebrow="captains" title="历年队长" theme="dark" />
              <p className="leaders-intro-copy text-sm leading-relaxed text-paper/70">17—26 届</p>
            </div>

            <div
              ref={scrollContainerRef}
              className="leaders-track flex will-change-transform"
              style={{ gap: `${CARD_GAP}px` }}
            >
              {LEADERS.map((leader) => {
                const { width, height } = cardSize(leader);
                return (
                  <LeaderCard
                    key={leader.id}
                    leader={leader}
                    width={width}
                    height={height}
                    priority={false}
                    onClick={() => openLeader(leader)}
                  />
                );
              })}
            </div>

            {/* 进度条 */}
            <div className="mt-6 sm:mt-8 max-w-md">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-mono text-xs tracking-[0.12em] uppercase text-paper/50">scroll</span>
                <span className="text-xs text-paper/50">→</span>
              </div>
              <div className="h-1.5 bg-paper/15 rounded-full overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full bg-pop-500 rounded-full origin-left"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {detailSheet}
    </>
  );
}

// 导航高亮随滚动改变时，不重新协调整排照片。
export default memo(Leaders);
