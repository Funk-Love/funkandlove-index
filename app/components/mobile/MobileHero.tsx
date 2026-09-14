"use client";

import HeroBackdrop from "../hero/HeroBackdrop";
import { ChevronDown } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { useReveal } from "../../hooks/useReveal";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import HeroExperience from "../hero/HeroExperience";

interface Props {
  onJoinClick?: () => void;
}

/**
 * 移动 Hero:深棕舞台(D4),不再铺合照底图。
 * 纵向堆叠:左上 eyebrow → 黑胶主视觉(D9 插槽,约 60vw,靠右)→ 静态标题 → slogan → 一句话 → 两颗 CTA。
 * 标题是静态字(移动端不跑 TextMorph),只借它的字体 / 字重 / 颜色(font-morph 固定 Inter)。
 * 入场用 useReveal(首屏元素在挂载时即命中 ScrollTrigger,立刻依次揭示)。
 */
export default function MobileHero({ onJoinClick }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useReveal<HTMLElement>({ start: "top 100%" });

  const scrollToNext = () => {
    document
      .getElementById("team-info")
      ?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col overflow-hidden bg-stage text-paper scroll-mt-4 focus:outline-none"
    >
      <HeroBackdrop />
      <div className="mobile-hero-body relative z-10 flex-1 flex flex-col px-6 pt-8 pb-24">
        {/* eyebrow:左上,给汉堡让出右侧 */}
        <div data-reveal className="mobile-hero-eyebrow flex items-center gap-3 pr-14">
          <span className="rule-accent rounded-full shrink-0" aria-hidden />
          <span className="font-mono text-xs tracking-[0.08em] uppercase text-paper/60">
            {SITE_CONFIG.organization} · Locking
          </span>
        </div>

        <HeroExperience>
        {/* 标题:静态 Funk & Love,与 TextMorph 终态同一字体 / 颜色 */}
        <h1
          data-reveal="lock"
          className="font-morph font-bold text-paper leading-[0.95] tracking-tight text-[clamp(3rem,15vw,4.25rem)] mb-4"
        >
          Funk<span className="font-sans text-pop-400">&amp;</span>Love
        </h1>

        <p data-reveal className="font-display text-pop-500 text-[clamp(1.35rem,6vw,1.75rem)] leading-tight mb-4">
          {SITE_CONFIG.slogan}
        </p>

        <p data-reveal className="text-paper/80 text-base leading-relaxed mb-8 max-w-prose">
          {SITE_CONFIG.philosophy}。{SITE_CONFIG.description}，用充满律动的锁舞诠释放克精神。
        </p>

        <div data-reveal className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onJoinClick}
            className="inline-flex items-center min-h-11 px-6 py-3 rounded-full bg-action text-on-action font-bold border border-action shadow-action transition-[transform,translate,box-shadow,background-color] duration-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            加入我们
          </button>
          <button
            type="button"
            onClick={scrollToNext}
            className="inline-flex items-center min-h-11 px-6 py-3 rounded-full text-paper font-bold border-2 border-paper/40 transition-colors duration-200 active:border-paper active:bg-paper/10"
          >
            认识我们
          </button>
        </div>
        </HeroExperience>
      </div>

      {/* 向下滚动指示器 */}
      <button
        type="button"
        onClick={scrollToNext}
        aria-label="滚动到下一部分"
        className="mobile-hero-next absolute bottom-5 left-1/2 -translate-x-1/2 z-20 p-2 min-w-11 min-h-11 flex items-center justify-center text-paper/60 active:text-pop-500 transition-colors"
      >
        <ChevronDown className={`w-8 h-8 ${reducedMotion ? "" : "animate-bounce"}`} strokeWidth={1.75} />
      </button>
    </section>
  );
}
