"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * 监听用户系统的"减少动效"偏好。
 * SSR 默认返回 false（不限制动画），客户端挂载后切到真实值。
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(QUERY);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => (typeof window !== "undefined" ? window.matchMedia(QUERY).matches : false),
    () => false
  );
}
