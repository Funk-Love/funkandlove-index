"use client";

import Navigation from "../Navigation";
import Hero from "../Hero";
import TeamInfo from "../TeamInfo";
import Team from "../Team";
import TeamFeatures from "../TeamFeatures";
import TeamSpirit from "../TeamSpirit";
import Leaders from "../Leaders";
import Members from "../Members";
import SocialLinks from "../SocialLinks";
import SectionIndicator from "../SectionIndicator";
import TeamPhotoBackground from "../TeamPhotoBackground";
import { useSnapScroll } from "../../hooks/useSnapScroll";

const SECTION_IDS = [
  "hero",
  "team-info",
  "team",
  "features",
  "team-spirit",
  "leaders",
  "members",
  "social",
];

/**
 * 桌面端总装：8 段 scrolljacking 单页 + 共享背景层 + section 指示器。
 * 由 page.tsx 在非移动端断点下渲染。
 */
export default function DesktopView() {
  const { currentIndex, scrollToSection } = useSnapScroll({
    sectionIds: SECTION_IDS,
    duration: 800,
    threshold: 30,
    enabled: true,
  });

  return (
    <div className="relative bg-neutral-900">
      {/* 共享的团队照片背景层 */}
      <TeamPhotoBackground />

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
        <section id="hero" className="snap-section">
          <Hero />
        </section>

        <section id="team-info" className="snap-section bg-white">
          <TeamInfo />
        </section>

        <section id="team" className="snap-section">
          <Team />
        </section>

        <section id="features" className="snap-section bg-neutral-900">
          <TeamFeatures />
        </section>

        <section id="team-spirit" className="snap-section">
          <TeamSpirit />
        </section>

        <div id="leaders">
          <Leaders />
        </div>

        <div id="members">
          <Members />
        </div>

        <section id="social" className="snap-section bg-neutral-900">
          <SocialLinks />
        </section>
      </main>
    </div>
  );
}
