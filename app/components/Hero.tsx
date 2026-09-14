"use client";

import HeroBackdrop from "./hero/HeroBackdrop";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import TextMorphAnimation, { type TextMorphHandle } from "./TextMorphAnimation";
import HeroExperience from "./hero/HeroExperience";

interface Props {
  onJoinClick?: () => void;
}

/**
 * 桌面 Hero:深棕舞台(D4)。
 * 三层:舞台底色 / 黑胶主视觉 / 标题与内容。
 * TextMorph 保留原有 Flip 换位；首轮自动播放，之后仅由唱片点击触发重播。
 */
export default function Hero({ onJoinClick }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const titleRef = useRef<TextMorphHandle>(null);

  const scrollToNext = () => {
    const next = document.getElementById("team-info");
    next?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
  };

  return (
    <section className="hero-stage relative min-h-screen flex items-center bg-stage">
      <HeroBackdrop />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 hero-inner">
        <HeroExperience onReplay={() => titleRef.current?.replay() ?? false}>
          <div
            className="mb-5 flex items-center gap-3"
          >
            <span className="rule-accent rounded-full" aria-hidden />
            <span className="font-mono text-xs tracking-[0.12em] uppercase text-paper/60">
              {SITE_CONFIG.organization} · Locking
            </span>
          </div>

          {/* 标题:文字变换动画 Locking → Funk&Love(冻结组件) */}
          <div
            className="mb-5 text-center lg:text-left"
          >
            <TextMorphAnimation
              ref={titleRef}
              className="font-morph font-bold text-paper text-[clamp(3rem,9.8vh,6.4rem)]"
              startDelay={200}
            />
          </div>

          <p
            className="font-display text-pop-500 text-[clamp(1.35rem,3.6vh,2.5rem)] leading-tight mb-5 text-center lg:text-left"
          >
            {SITE_CONFIG.slogan}
          </p>

          <p
            className="text-paper/80 max-w-xl text-[clamp(1rem,2.1vh,1.25rem)] leading-relaxed mb-9 mx-auto lg:mx-0 text-center lg:text-left"
          >
            {SITE_CONFIG.philosophy}。{SITE_CONFIG.description}，用充满律动的锁舞诠释放克精神。
          </p>

          <div
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
          >
            <button
              type="button"
              onClick={onJoinClick}
              className="inline-flex items-center px-6 py-3 rounded-full bg-action text-on-action font-bold border border-action shadow-action transition-[transform,translate,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-action-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              加入我们
            </button>
            <button
              type="button"
              onClick={scrollToNext}
              className="inline-flex items-center px-6 py-3 rounded-full text-paper font-bold border-2 border-paper/40 transition-colors duration-200 hover:border-paper hover:bg-paper/10"
            >
              认识我们
            </button>
          </div>
        </HeroExperience>
      </div>

      {/* 向下滚动指示器 */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-pointer text-paper/60 hover:text-pop-500 transition-colors duration-300 rounded-full p-2"
        aria-label="滚动到下一部分"
      >
        <ChevronDown size={40} strokeWidth={1.75} />
      </button>
    </section>
  );
}
