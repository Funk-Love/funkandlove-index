'use client';

import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import TeamInfo from "./components/TeamInfo";
import TeamFeatures from "./components/TeamFeatures";
import TeamSpirit from "./components/TeamSpirit";
import History from "./components/History";
import SocialLinks from "./components/SocialLinks";
import MobileView from "./components/MobileView";
import SectionIndicator from "./components/SectionIndicator";
import { useSnapScroll } from "./hooks/useSnapScroll";

// 定义所有 section 的 ID
const SECTION_IDS = [
  'hero',
  'team-info',
  'features',
  'team-spirit',
  'history',
  'social',
];

export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 滚轮锚点导航 - 仅桌面端启用
  const { currentIndex, scrollToSection } = useSnapScroll({
    sectionIds: SECTION_IDS,
    duration: 800,
    threshold: 30,
    enabled: !isMobile,
  });

  // 避免水合不匹配，在客户端挂载前显示加载状态
  if (isMobile === null) {
    return null;
  }

  // 移动端显示简化版本
  if (isMobile) {
    return <MobileView />;
  }

  // 桌面端显示完整版本
  return (
    <div className="relative bg-neutral-900">
      {/* Fixed navigation */}
      <Navigation />
      
      {/* Section 导航指示器 */}
      <SectionIndicator
        sectionIds={SECTION_IDS}
        currentIndex={currentIndex}
        onNavigate={scrollToSection}
      />
      
      {/* Main content sections */}
      <main className="relative">
        {/* Hero Section - 全屏 */}
        <section id="hero" className="snap-section">
          <Hero />
        </section>
        
        {/* Team Info Section - 全屏 */}
        <section id="team-info" className="snap-section bg-white">
          <TeamInfo />
        </section>
        
        {/* Team Features Section - 全屏 */}
        <section id="features" className="snap-section bg-neutral-900">
          <TeamFeatures />
        </section>
        
        {/* Team Spirit Section - 全屏 */}
        <section id="team-spirit" className="snap-section">
          <TeamSpirit />
        </section>
        
        {/* History Section - 滚动驱动横向滚动 */}
        <div id="history">
          <History />
        </div>
        
        {/* Social Links Footer - 全屏 */}
        <section id="social" className="snap-section bg-neutral-900">
          <SocialLinks />
        </section>
      </main>
    </div>
  );
}
