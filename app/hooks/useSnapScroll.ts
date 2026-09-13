'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { NAV_HEIGHT } from '@/lib/constants';

gsap.registerPlugin(ScrollToPlugin);

interface UseSnapScrollOptions {
  sectionIds: string[];
  duration?: number;
  threshold?: number;
  enabled?: boolean;
  /**
   * 参与 snap 的最后一个索引（含）。该索引之后的 section 完全自由滚动，wheel 不被拦截。
   * 默认整页都是 snap。
   */
  snapEndIndex?: number;
}

export function useSnapScroll({
  sectionIds,
  duration = 800,
  threshold = 30,
  enabled = true,
  snapEndIndex,
}: UseSnapScrollOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);
  // 当前正在播放的吸附动画（ScrollToPlugin tween），用于打断与卸载清理。
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);

  const snapLast = snapEndIndex ?? sectionIds.length - 1;

  const releaseLock = useCallback(() => {
    isScrolling.current = false;
  }, []);

  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= sectionIds.length) return;

    const element = document.getElementById(sectionIds[index]);
    if (!element) return;

    // 打断上一段吸附（kill 不触发 onComplete，避免误解锁）
    scrollTweenRef.current?.kill();

    isScrolling.current = true;
    setCurrentIndex(index);

    scrollTweenRef.current = gsap.to(window, {
      duration: duration / 1000,
      // power2.inOut ≈ 原 easeInOutCubic（三次缓动）
      ease: 'power2.inOut',
      scrollTo: { y: element.offsetTop, autoKill: false },
      onComplete: releaseLock,
    });
  }, [sectionIds, duration, releaseLock]);

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

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enabled) return;

    // 弹窗打开时不处理
    if (document.querySelector('[data-modal-open="true"]')) return;

    if (isScrolling.current) {
      e.preventDefault();
      return;
    }

    const delta = e.deltaY;
    const isScrollingUp = delta < 0;
    const actualIndex = isScrollingUp
      ? getContainingSectionIndex()
      : getCurrentSectionIndex();

    // 已离开 snap 区域：完全自由滚动，不拦截 wheel
    if (actualIndex > snapLast) return;

    const targetIndex = isScrollingUp ? actualIndex - 1 : actualIndex + 1;

    // 在 snap 区域顶部往上：阻止越界
    if (targetIndex < 0) {
      e.preventDefault();
      return;
    }

    // 跨越 snap 区域下边界（如 features → leaders）：让原生滚动接管，不 snap
    if (targetIndex > snapLast) return;

    // 向上 snap 守门：当前 section 必须已滚到顶（scrollY ≈ offsetTop）才允许 snap。
    // 这样从下方 free 区原生滚回 features 时，需要先把 features 完整滚到顶才会 snap 到 team，
    // 不会出现 features 没看完就被中途 snap 走。
    if (isScrollingUp) {
      const currentEl = document.getElementById(sectionIds[actualIndex]);
      if (!currentEl) return;
      if (window.scrollY > currentEl.offsetTop + 5) return;
    }

    // 仍在 snap 区域内：阻止原生滚动避免漂移，再判断是否触发 snap
    e.preventDefault();

    const now = Date.now();
    if (now - lastScrollTime.current < 100) return;
    if (Math.abs(delta) < threshold) return;
    if (targetIndex === actualIndex) return;

    lastScrollTime.current = now;
    scrollToSection(targetIndex);
  }, [enabled, threshold, snapLast, sectionIds, getContainingSectionIndex, getCurrentSectionIndex, scrollToSection]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled || isScrolling.current) return;
    const actualIndex = getCurrentSectionIndex();

    // 在自由滚动区时，不接管 PageUp/Down/箭头，由浏览器原生处理
    if (actualIndex > snapLast) return;

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
  }, [enabled, sectionIds.length, snapLast, getCurrentSectionIndex, scrollToSection]);

  // 标签页切回前台时主动释放锁（rAF/ticker 在后台暂停，吸附动画可能卡住）
  useEffect(() => {
    if (!enabled) return;
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isScrolling.current) {
        scrollTweenRef.current?.kill();
        releaseLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [enabled, releaseLock]);

  // 被动追踪 currentIndex（自由滚动区也能让左侧锚点高亮跟随）
  useEffect(() => {
    if (!enabled) return;
    let rafId: number | null = null;
    const onScroll = () => {
      if (isScrolling.current) return;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setCurrentIndex(getCurrentSectionIndex());
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
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

  // 卸载时杀掉在播的吸附动画
  useEffect(() => {
    return () => {
      scrollTweenRef.current?.kill();
    };
  }, []);

  return { currentIndex, scrollToSection, sectionIds };
}
