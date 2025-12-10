'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseSnapScrollOptions {
  /** section 的 ID 列表 */
  sectionIds: string[];
  /** 动画持续时间 (ms) */
  duration?: number;
  /** 滚轮触发阈值 */
  threshold?: number;
  /** 是否启用 */
  enabled?: boolean;
}

/**
 * 滚轮锚点导航 Hook
 * 每次滚轮触发直接缓动到下一个/上一个 section
 */
export function useSnapScroll({
  sectionIds,
  duration = 800,
  threshold = 30,
  enabled = true,
}: UseSnapScrollOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);

  // 缓动函数 - easeInOutCubic
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // 平滑滚动到指定位置
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

  // 滚动到指定 section
  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= sectionIds.length) return;
    
    const sectionId = sectionIds[index];
    const element = document.getElementById(sectionId);
    
    if (!element) return;

    isScrolling.current = true;
    const targetY = element.offsetTop;
    
    smoothScrollTo(targetY, () => {
      setCurrentIndex(index);
      // 延迟解锁，防止惯性滚动触发
      setTimeout(() => {
        isScrolling.current = false;
      }, 100);
    });
  }, [sectionIds, smoothScrollTo]);

  // 根据当前滚动位置确定当前 section
  const getCurrentSectionIndex = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const element = document.getElementById(sectionIds[i]);
      if (element && scrollY >= element.offsetTop - viewportHeight / 3) {
        return i;
      }
    }
    return 0;
  }, [sectionIds]);

  // 检查是否在 History section 的滚动驱动区域内（中间部分）
  const isInHistoryMiddle = useCallback((delta: number): boolean => {
    const historyElement = document.getElementById('history');
    if (!historyElement) return false;
    
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    // 获取 history 容器的位置和高度
    const historyTop = historyElement.offsetTop;
    const historyHeight = historyElement.scrollHeight;
    const historyBottom = historyTop + historyHeight;
    
    // 检查是否在 history section 内部（不是边缘）
    const isInHistory = scrollY >= historyTop && scrollY < historyBottom - viewportHeight;
    
    if (!isInHistory) return false;
    
    // 在 history 内部时：
    // - 如果在顶部附近且向上滚，允许跳转
    // - 如果在底部附近且向下滚，允许跳转
    // - 否则不拦截，让自然滚动继续
    const nearTop = scrollY < historyTop + 50;
    const nearBottom = scrollY > historyBottom - viewportHeight - 50;
    
    if (nearTop && delta < 0) return false; // 在顶部向上滚，允许跳转
    if (nearBottom && delta > 0) return false; // 在底部向下滚，允许跳转
    
    return true; // 在中间，不拦截
  }, []);

  // 处理滚轮事件
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enabled) return;
    
    // 如果正在滚动动画中，阻止默认行为
    if (isScrolling.current) {
      e.preventDefault();
      return;
    }

    const delta = e.deltaY;
    
    // 检查是否在 History section 的中间部分（横向滚动区域）
    if (isInHistoryMiddle(delta)) {
      // 在 History 中间，不拦截，让自然滚动驱动横向滚动
      return;
    }

    // 防抖：限制触发频率
    const now = Date.now();
    if (now - lastScrollTime.current < 100) {
      e.preventDefault();
      return;
    }

    // 检查滚轮方向和阈值
    if (Math.abs(delta) < threshold) return;

    // 获取当前实际位置的 section
    const actualIndex = getCurrentSectionIndex();
    
    // 计算目标 section
    let targetIndex: number;
    if (delta > 0) {
      // 向下滚动
      targetIndex = Math.min(actualIndex + 1, sectionIds.length - 1);
    } else {
      // 向上滚动
      targetIndex = Math.max(actualIndex - 1, 0);
    }

    // 如果目标和当前相同，不处理
    if (targetIndex === actualIndex) return;

    e.preventDefault();
    lastScrollTime.current = now;
    scrollToSection(targetIndex);
  }, [enabled, threshold, sectionIds.length, getCurrentSectionIndex, scrollToSection, isInHistoryMiddle]);

  // 处理键盘事件
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

  // 监听滚动位置变化，更新当前 index
  const handleScroll = useCallback(() => {
    if (isScrolling.current) return;
    const index = getCurrentSectionIndex();
    setCurrentIndex(index);
  }, [getCurrentSectionIndex]);

  // 初始化当前 section（仅在挂载时执行一次）
  useEffect(() => {
    if (!enabled) return;
    
    // 使用 requestAnimationFrame 延迟初始化，避免同步 setState
    const initTimer = requestAnimationFrame(() => {
      setCurrentIndex(getCurrentSectionIndex());
    });

    return () => cancelAnimationFrame(initTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // 使用 passive: false 以便能够 preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, handleWheel, handleKeyDown, handleScroll]);

  return {
    currentIndex,
    scrollToSection,
    sectionIds,
  };
}
