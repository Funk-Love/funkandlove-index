"use client";

import { useCallback, useEffect, useState } from "react";
import Navigation from "../Navigation";
import Hero from "../Hero";
import TeamInfo from "../TeamInfo";
import Team from "../Team";
import TeamFeatures from "../TeamFeatures";
import Leaders from "../Leaders";
import Members from "../Members";
import SocialLinks from "../SocialLinks";
import SectionIndicator from "../SectionIndicator";
import RecruitDialog from "../shared/RecruitDialog";
import { useSnapScroll } from "../../hooks/useSnapScroll";
import { useSectionTracker } from "../../hooks/useSectionTracker";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/**
 * 桌面 7 段的 id 与顺序。useSnapScroll / SectionIndicator 以此为硬契约:
 * hero 必须是第 0 个;锚点切换到 leaders 顶部后放开原生滚动驱动横移。
 * 这些 id 由本文件唯一持有,子组件内部不再重复声明。
 *
 * 底色节奏(D4):stage → paper → 合照 → 舞台照 → stage → paper → stage。
 */
const SECTION_IDS = [
  "hero",
  "team-info",
  "team",
  "features",
  "leaders",
  "members",
  "social",
];

/**
 * 桌面端总装:7 段单页 + section 指示器。
 * 普通模式:前四段及 leaders 入口做锚点切换，leaders 内部自由横滚。
 * reduced-motion:关闭吸附与劫持,走原生滚动;锚点即时跳转;位置追踪改用 useSectionTracker(D6)。
 */
export default function DesktopView() {
  const reducedMotion = usePrefersReducedMotion();
  const [recruitOpen, setRecruitOpen] = useState(false);
  const openRecruit = useCallback(() => setRecruitOpen(true), []);
  const [contentFits, setContentFits] = useState(false);

  useEffect(() => {
    const sections = SECTION_IDS.slice(0, 4).map((id) => document.getElementById(id));
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setContentFits(window.innerWidth >= 1024 && window.innerHeight >= 720 &&
          sections.every((el) => el && el.getBoundingClientRect().height <= window.innerHeight + 2));
      });
    };
    const observer = new ResizeObserver(measure);
    sections.forEach((el) => { if (el) observer.observe(el); });
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("resize", measure); };
  }, []);
  const snapEnabled = !reducedMotion && contentFits;

  const snap = useSnapScroll({
    sectionIds: SECTION_IDS,
    duration: 800,
    threshold: 30,
    enabled: snapEnabled,
    // 2 → 3 → 4 统一整屏切换；只在 leaders 内部交给横滚。
    snapEndIndex: SECTION_IDS.indexOf("leaders"),
  });

  const trackedIndex = useSectionTracker(SECTION_IDS, !snapEnabled);
  const currentIndex = snapEnabled ? snap.currentIndex : trackedIndex;

  const jumpToSection = useCallback((index: number) => {
    const el = document.getElementById(SECTION_IDS[index]);
    if (!el) return;
    el.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
  }, [reducedMotion]);

  const navigate = snapEnabled ? snap.scrollToSection : jumpToSection;

  return (
    <div className="relative bg-paper text-ink" data-snap-enabled={snapEnabled}>
      <Navigation onJoinClick={openRecruit} onNavigate={(href) => {
        const index = SECTION_IDS.indexOf(href.replace("#", ""));
        if (index >= 0) navigate(index);
      }} />

      <SectionIndicator sectionIds={SECTION_IDS} currentIndex={currentIndex} onNavigate={navigate} />

      <main className="relative">
        <section id="hero" className="snap-section">
          <Hero onJoinClick={openRecruit} />
        </section>

        <section id="team-info" className="snap-section bg-paper">
          <TeamInfo />
        </section>

        <section id="team" className="snap-section bg-stage">
          <Team />
        </section>

        <section id="features" className="snap-section bg-stage">
          <TeamFeatures />
        </section>

        <div id="leaders" className="bg-stage">
          <Leaders />
        </div>

        <div id="members" className="bg-paper">
          <Members onJoinClick={openRecruit} />
        </div>

        <section id="social" className="snap-section bg-stage">
          <SocialLinks onJoinClick={openRecruit} />
        </section>
      </main>

      <RecruitDialog open={recruitOpen} onClose={() => setRecruitOpen(false)} />
    </div>
  );
}
