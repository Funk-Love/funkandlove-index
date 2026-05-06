"use client";

import { useSyncExternalStore } from "react";
import MobileView from "./components/mobile/MobileView";
import DesktopView from "./components/desktop/DesktopView";

// useSyncExternalStore 订阅源：监听 window resize，返回是否为移动端
const subscribeResize = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};
const getIsMobile = () => window.innerWidth < 768;
// 服务器端 / 静态导出时统一按桌面端快照，避免 hydration mismatch；
// 客户端首次 render 也用此快照，下一帧切到真实值，由 React 自动协调。
const getServerSnapshot = () => false;

/**
 * 入口：仅做断点分发。
 * 移动端 → MobileView，桌面端 → DesktopView。
 */
export default function Home() {
  const isMobile = useSyncExternalStore(
    subscribeResize,
    getIsMobile,
    getServerSnapshot
  );

  return isMobile ? <MobileView /> : <DesktopView />;
}
