"use client";

import { useSyncExternalStore } from "react";
import { MotionConfig } from "framer-motion";
import MobileView from "./components/mobile/MobileView";
import DesktopView from "./components/desktop/DesktopView";
import MusicProvider from "./components/music/MusicProvider";
import BrandMark from "./components/shared/BrandMark";

// Only subscribe to breakpoint changes, not every intermediate resize event.
const subscribeResize = (callback: () => void) => {
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getIsMobile = () => window.matchMedia("(max-width: 767px)").matches;
// Static HTML cannot know the viewport. CSS shields mobile from the desktop
// snapshot until hydration selects its view; desktop keeps its prerendered content.
const getServerSnapshot = (): boolean | null => null;

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

  // MotionConfig reducedMotion="user":系统开启"减少动效"时,framer 自动跳过 transform 类动画(保留 opacity),
  // 一处覆盖全部 framer variants,组件不必各自判断。
  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <div className="responsive-view" data-viewport={isMobile === null ? "pending" : isMobile ? "mobile" : "desktop"}>
          {isMobile === null && <div className="mobile-bootstrap" role="status" aria-label="正在准备页面" aria-busy="true">
            <BrandMark className="w-9 h-9" />
            <span className="font-display text-xl">Funk <span className="font-sans font-semibold">&amp;</span> Love</span>
          </div>}
          {isMobile ? <MobileView /> : <div className="desktop-layout"><DesktopView /></div>}
        </div>
      </MusicProvider>
    </MotionConfig>
  );
}
