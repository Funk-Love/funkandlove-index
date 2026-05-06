'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { NAV_HEIGHT } from '@/lib/constants';

interface UseSnapScrollOptions {
  sectionIds: string[];
  duration?: number;
  threshold?: number;
  enabled?: boolean;
}

// 可以自由滚动的 section（不是 snap 到顶部）
const SCROLLABLE_SECTIONS = ['leaders', 'members'] as const;

export function useSnapScroll({
  sectionIds,
  duration = 800,
  threshold = 30,
  enabled = true,
}: UseSnapScrollOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);
  const safetyTimerRef = useRef<number | null>(null);

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const releaseLock = useCallback(() => {
    isScrolling.current = false;
    if (safetyTimerRef.current !== null) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  const smoothScrollTo = useCallback((targetY: number, onComplete?: () => void) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };
    requestAnimationFrame(animate);
  }, [duration]);

  const scrollToSection = useCallback((index: number, scrollToEnd: boolean = false) => {
    if (index < 0 || index >= sectionIds.length) return;

    const element = document.getElementById(sectionIds[index]);
    if (!element) return;

    isScrolling.current = true;
    setCurrentIndex(index);

    // 安全兜底：即便 RAF 中断（切标签页 / 长任务 / iOS 进后台）也能在合理时间后释放锁，
    // 避免 isScrolling 永久为 true 导致后续 wheel 全被 preventDefault 而"卡死"。
    if (safetyTimerRef.current !== null) clearTimeout(safetyTimerRef.current);
    safetyTimerRef.current = window.setTimeout(releaseLock, duration + 400);

    let targetY: number;
    if (scrollToEnd) {
      const sectionBottom = element.offsetTop + element.scrollHeight;
      targetY = sectionBottom - window.innerHeight;
    } else {
      targetY = element.offsetTop;
    }

    smoothScrollTo(targetY, releaseLock);
  }, [sectionIds, smoothScrollTo, duration, releaseLock]);

  // 根据滚动位置判断当前 section（用于向下滚动）
  const getCurrentSectionIndex = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const element = document.getElementById(sectionIds[i]);
      if (element && scrollY >= element.offsetTop - viewportHeight / 3 - NAV_HEIGHT) {
        return i;
      }
    }
    return 0;
  }, [sectionIds]);

  // 判断当前在哪个 section 内部（精确判断，用于向上滚动）
  const getContainingSectionIndex = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const viewportBottom = scrollY + viewportHeight;

    for (let i = 0; i < sectionIds.length; i++) {
      const element = document.getElementById(sectionIds[i]);
      if (!element) continue;

      const sectionTop = element.offsetTop;
      const sectionBottom = sectionTop + element.scrollHeight;

      if (scrollY >= sectionTop - NAV_HEIGHT - 100 && viewportBottom <= sectionBottom + 100) {
        return i;
      }
    }
    return getCurrentSectionIndex();
  }, [sectionIds, getCurrentSectionIndex]);

  // 检查是否在可滚动 section 中间
  // 修复点：统一基准为 sectionTop / effectiveBottom，并限制 tolerance 上限避免与中间区重叠
  const isInScrollableSectionMiddle = useCallback((delta: number): boolean => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    for (const sectionId of SCROLLABLE_SECTIONS) {
      const element = document.getElementById(sectionId);
      if (!element) continue;

      const sectionTop = element.offsetTop;
      const sectionHeight = element.scrollHeight;
      const effectiveTop = sectionTop - NAV_HEIGHT;
      const effectiveBottom = sectionTop + sectionHeight - viewportHeight;

      // 容差上限 60px，且不超过可滚区间一半，避免在窄区间里 nearTop / nearBottom 重叠
      const range = Math.max(0, effectiveBottom - effectiveTop);
      const tolerance = Math.min(viewportHeight * 0.05, 60, range / 2);

      const distFromTop = scrollY - effectiveTop;
      const distFromBottom = effectiveBottom - scrollY;

      // 不在 section 范围内
      if (distFromTop < 0 || distFromBottom < 0) continue;

      // 在顶部边界向上滚 / 底部边界向下滚 → 让 snap 接管
      if (distFromTop < tolerance && delta < 0) return false;
      if (distFromBottom < tolerance && delta > 0) return false;

      // 中间区域：允许浏览器自由滚动
      return true;
    }
    return false;
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enabled) return;

    // 弹窗打开时不处理
    if (document.querySelector('[data-modal-open="true"]')) return;

    if (isScrolling.current) {
      e.preventDefault();
      return;
    }

    const delta = e.deltaY;

    // 在可滚动区域中间，让自然滚动继续（不 preventDefault，触摸板连续流不会被吞）
    if (isInScrollableSectionMiddle(delta)) return;

    const now = Date.now();
    if (now - lastScrollTime.current < 100) {
      // 节流期内：不 preventDefault，只是忽略本次 snap 触发，
      // 让浏览器自然处理触摸板连续 wheel，避免感受为"页面冻结"
      return;
    }

    if (Math.abs(delta) < threshold) return;

    const isScrollingUp = delta < 0;

    const actualIndex = isScrollingUp
      ? getContainingSectionIndex()
      : getCurrentSectionIndex();

    let targetIndex: number;
    if (delta > 0) {
      targetIndex = Math.min(actualIndex + 1, sectionIds.length - 1);
    } else {
      targetIndex = Math.max(actualIndex - 1, 0);
    }

    if (targetIndex === actualIndex) return;

    e.preventDefault();
    lastScrollTime.current = now;

    // 向上滚动到可滚动 section 时，滚动到其底部
    const targetSectionId = sectionIds[targetIndex];
    const shouldScrollToEnd = isScrollingUp && (SCROLLABLE_SECTIONS as readonly string[]).includes(targetSectionId);

    scrollToSection(targetIndex, shouldScrollToEnd);
  }, [enabled, isInScrollableSectionMiddle, threshold, getContainingSectionIndex, getCurrentSectionIndex, sectionIds, scrollToSection]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled || isScrolling.current) return;
    const actualIndex = getCurrentSectionIndex();

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      scrollToSection(Math.min(actualIndex + 1, sectionIds.length - 1));
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      scrollToSection(Math.max(actualIndex - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToSection(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToSection(sectionIds.length - 1);
    }
  }, [enabled, sectionIds.length, getCurrentSectionIndex, scrollToSection]);

  // 标签页切回前台时主动释放锁，避免 RAF 暂停导致永久卡死
  useEffect(() => {
    if (!enabled) return;
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isScrolling.current) {
        releaseLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [enabled, releaseLock]);

  useEffect(() => {
    if (!enabled) return;
    const initRaf = requestAnimationFrame(() => {
      setCurrentIndex(getCurrentSectionIndex());
    });
    return () => cancelAnimationFrame(initRaf);
  }, [enabled, getCurrentSectionIndex]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleWheel, handleKeyDown]);

  // 卸载时清理兜底定时器
  useEffect(() => {
    return () => {
      if (safetyTimerRef.current !== null) clearTimeout(safetyTimerRef.current);
    };
  }, []);

  return { currentIndex, scrollToSection, sectionIds };
}
