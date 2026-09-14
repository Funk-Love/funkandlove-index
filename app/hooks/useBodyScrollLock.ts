'use client';

import { useLayoutEffect } from 'react';

/**
 * 锁定/解锁 body 滚动（用于模态框）
 * 锁住根滚动容器，保留 scrollY 与 sticky / ScrollTrigger 的坐标系。
 */
export function useBodyScrollLock(isLocked: boolean) {
  useLayoutEffect(() => {
    if (!isLocked) return;

    const root = document.documentElement;
    const body = document.body;
    const rootOverflow = root.style.overflow;
    const bodyOverflow = body.style.overflow;
    root.style.overflow = 'hidden';
    // clip 不创建新的滚动容器，避免 sticky 改为相对 body 定位。
    body.style.overflow = 'clip';

    return () => {
      root.style.overflow = rootOverflow;
      body.style.overflow = bodyOverflow;
    };
  }, [isLocked]);
}
