'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseSnapScrollOptions {
  sectionIds: string[];
  duration?: number;
  threshold?: number;
  enabled?: boolean;
}

export function useSnapScroll({
  sectionIds,
  duration = 800,
  threshold = 30,
  enabled = true,
}: UseSnapScrollOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

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
    
    let targetY: number;
    if (scrollToEnd) {
      const sectionBottom = element.offsetTop + element.scrollHeight;
      targetY = sectionBottom - window.innerHeight;
    } else {
      targetY = element.offsetTop;
    }
    
    smoothScrollTo(targetY, () => {
      setCurrentIndex(index);
      setTimeout(() => {
        isScrolling.current = false;
      }, 100);
    });
  }, [sectionIds, smoothScrollTo]);

  // 根据滚动位置判断当前 section（用于向下滚动）
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
      
      // 视口大部分在这个 section 内
      if (scrollY >= sectionTop - 100 && viewportBottom <= sectionBottom + 100) {
        return i;
      }
    }
    return getCurrentSectionIndex();
  }, [sectionIds, getCurrentSectionIndex]);

  const scrollableSections = ['leaders', 'members'];

  // 检查是否在可滚动 section 中间
  const isInScrollableSectionMiddle = useCallback((delta: number): boolean => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    for (const sectionId of scrollableSections) {
      const element = document.getElementById(sectionId);
      if (!element) continue;
      
      const sectionTop = element.offsetTop;
      const sectionHeight = element.scrollHeight;
      const sectionBottom = sectionTop + sectionHeight;
      
      const isInSection = scrollY >= sectionTop && scrollY <= sectionBottom - viewportHeight;
      if (!isInSection) continue;
      
      const nearTop = scrollY < sectionTop + 50;
      const nearBottom = scrollY > sectionBottom - viewportHeight - 50;
      
      if (nearTop && delta < 0) return false;
      if (nearBottom && delta > 0) return false;
      
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
    
    // 在可滚动区域中间，让自然滚动继续
    if (isInScrollableSectionMiddle(delta)) return;

    const now = Date.now();
    if (now - lastScrollTime.current < 100) {
      e.preventDefault();
      return;
    }

    if (Math.abs(delta) < threshold) return;

    const isScrollingUp = delta < 0;
    
    // 关键：向上滚动时用精确判断，向下滚动时用原来的判断
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
    const shouldScrollToEnd = isScrollingUp && scrollableSections.includes(targetSectionId);
    
    scrollToSection(targetIndex, shouldScrollToEnd);
  }, [enabled, threshold, sectionIds, getCurrentSectionIndex, getContainingSectionIndex, scrollToSection, isInScrollableSectionMiddle]);

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

  const handleScroll = useCallback(() => {
    if (isScrolling.current) return;
    setCurrentIndex(getCurrentSectionIndex());
  }, [getCurrentSectionIndex]);

  useEffect(() => {
    if (!enabled) return;
    const initTimer = requestAnimationFrame(() => {
      setCurrentIndex(getCurrentSectionIndex());
    });
    return () => cancelAnimationFrame(initTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, handleWheel, handleKeyDown, handleScroll]);

  return { currentIndex, scrollToSection, sectionIds };
}
