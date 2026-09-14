"use client";

import { useEffect, useState } from "react";
import { NAV_HEIGHT } from "@/lib/constants";

/**
 * 被动追踪"当前 section 索引",不做任何滚动控制。
 *
 * 用于 reduced-motion 下替代 useSnapScroll 的追踪(useSnapScroll 在 enabled=false 时会连同追踪一起停掉),
 * 让 SectionIndicator / 导航高亮在原生滚动时仍能跟随。
 * 判定公式与 useSnapScroll.getCurrentSectionIndex 保持一致:offsetTop - vh/3 - NAV_HEIGHT。
 */
export function useSectionTracker(sectionIds: string[], active: boolean): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    let rafId: number | null = null;

    const compute = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && scrollY >= el.offsetTop - vh / 3 - NAV_HEIGHT) return i;
      }
      return 0;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setIndex(compute());
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [sectionIds, active]);

  return index;
}
