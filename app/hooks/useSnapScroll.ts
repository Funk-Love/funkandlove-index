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
  const scrollDirection = useRef(0);
  const wheelIntent = useRef({ delta: 0, time: 0 });
  const returningFromFree = useRef(false);
  // 当前正在播放的吸附动画（ScrollToPlugin tween），用于打断与卸载清理。
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);

  const snapLast = snapEndIndex ?? sectionIds.length - 1;

  const releaseLock = useCallback(() => {
    isScrolling.current = false;
    lastScrollTime.current = Date.now();
  }, []);

  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= sectionIds.length) return;

    const element = document.getElementById(sectionIds[index]);
    if (!element) return;

    // 打断上一段吸附（kill 不触发 onComplete，避免误解锁）
    scrollTweenRef.current?.kill();

    isScrolling.current = true;
    setCurrentIndex(index);
    const targetY = element.getBoundingClientRect().top + window.scrollY;
    scrollDirection.current = Math.sign(targetY - window.scrollY);
    wheelIntent.current.delta = 0;
    returningFromFree.current = false;

    scrollTweenRef.current = gsap.to(window, {
      // 半途转向按剩余距离缩短动画，避免只剩几十像素仍拖满一整屏的时间。
      duration: Math.max(0.2, duration / 1000 * Math.min(1, Math.abs(targetY - window.scrollY) / window.innerHeight)),
      // power2.inOut ≈ 原 easeInOutCubic（三次缓动）
      ease: 'power2.inOut',
      scrollTo: { y: targetY, autoKill: true, onAutoKill: releaseLock },
      onComplete: releaseLock,
      onUpdate: () => {
        if (document.querySelector('[data-modal-open="true"]')) {
          scrollTweenRef.current?.kill();
          releaseLock();
        }
      },
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

  // 导航高亮允许提前切换，但滚动目标必须按真实位置选，不能把人反向拉回。
  // null 表示横滚及后续自由区，-1 表示页首，没有上一个目标。
  const getSnapTarget = useCallback((direction: number): number | null => {
    const y = window.scrollY;
    const tops = sectionIds.slice(0, snapLast + 1).map((id) => {
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + y : Infinity;
    });
    if (y > tops[snapLast] + 5) return null;
    if (direction > 0) {
      const next = tops.findIndex((top) => top > y + 5);
      return next < 0 ? null : next;
    }
    for (let i = tops.length - 1; i >= 0; i--) {
      if (tops[i] < y - 5) return i;
    }
    return -1;
  }, [sectionIds, snapLast]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enabled || e.ctrlKey) return;

    // 弹窗打开时不处理
    if (document.querySelector('[data-modal-open="true"]')) return;

    const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
    if (!delta || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const direction = Math.sign(delta);
    const targetIndex = getSnapTarget(direction);
    const reversing = isScrolling.current && direction !== scrollDirection.current;

    if (!isScrolling.current && targetIndex === null) {
      wheelIntent.current.delta = 0;
      returningFromFree.current = direction < 0;
      return;
    }
    // 自由区里反向打断导航跳转后，当前这次滚动直接交还浏览器。
    if (reversing && targetIndex === null) {
      scrollTweenRef.current?.kill();
      releaseLock();
      returningFromFree.current = direction < 0;
      return;
    }
    e.preventDefault();
    if (isScrolling.current && !reversing) return;
    if (targetIndex === null || targetIndex < 0) return;

    const now = Date.now();
    const intent = wheelIntent.current;
    if (now - intent.time > 160 || Math.sign(intent.delta) !== direction) intent.delta = 0;
    intent.delta += delta;
    intent.time = now;
    // 触控板的小增量累计判断，不能每个都吃掉；转向达到阈值就直接回程。
    if (Math.abs(intent.delta) < threshold) return;
    // 收尾只过滤同向惯性；刚落到下一屏就反向，也应立即响应。
    if (!reversing && direction === scrollDirection.current && now - lastScrollTime.current < 100) return;
    scrollToSection(targetIndex);
  }, [enabled, threshold, getSnapTarget, scrollToSection, releaseLock]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.defaultPrevented || document.querySelector('[data-modal-open="true"]') ||
        (e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable="true"], [role="menu"]'))) return;
    if (!enabled || isScrolling.current) return;
    const downwards = e.key === 'ArrowDown' || e.key === 'PageDown';
    const upwards = e.key === 'ArrowUp' || e.key === 'PageUp';
    const target = getSnapTarget(upwards ? -1 : 1);
    if (target === null) return;
    if (downwards || upwards) {
      e.preventDefault();
      if (target >= 0) scrollToSection(target);
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToSection(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToSection(sectionIds.length - 1);
    }
  }, [enabled, sectionIds, getSnapTarget, scrollToSection]);

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

  // 追踪实际位置，并在自由滚动真正返回吸附区的这一帧完成交接。
  // 不用 wheel.deltaY 预测落点：浏览器缩放、滚轮单位与惯性都可能改变实际距离。
  useEffect(() => {
    if (!enabled) return;
    let rafId: number | null = null;
    const onScroll = () => {
      if (isScrolling.current) return;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (isScrolling.current) return;
        if (returningFromFree.current && !document.querySelector('[data-modal-open="true"]')) {
          const target = getSnapTarget(-1);
          if (target !== null) {
            returningFromFree.current = false;
            if (target >= 0) {
              scrollToSection(target);
              return;
            }
          }
        }
        setCurrentIndex(getCurrentSectionIndex());
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [enabled, getCurrentSectionIndex, getSnapTarget, scrollToSection]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleWheel, handleKeyDown]);

  // 运行中被禁用(如用户切换 prefers-reduced-motion):立刻打断在播的吸附并释放锁,
  // 否则重新启用后 isScrolling 会一直为 true,wheel 被永久拦截。
  useEffect(() => {
    if (enabled) return;
    returningFromFree.current = false;
    scrollTweenRef.current?.kill();
    releaseLock();
  }, [enabled, releaseLock]);

  // 卸载时杀掉在播的吸附动画
  useEffect(() => {
    return () => {
      scrollTweenRef.current?.kill();
    };
  }, []);

  return { currentIndex, scrollToSection, sectionIds };
}
