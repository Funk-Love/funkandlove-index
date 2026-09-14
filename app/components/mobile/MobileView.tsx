"use client";

import { useState } from "react";
import MobileNav from "./MobileNav";
import MobileHero from "./MobileHero";
import MobileTeamInfo from "./MobileTeamInfo";
import MobileTeamPhoto from "./MobileTeamPhoto";
import MobileFeatures from "./MobileFeatures";
import MobileLeaders from "./MobileLeaders";
import MobileMembers from "./MobileMembers";
import MobileSocial from "./MobileSocial";
import RecruitDialog from "../shared/RecruitDialog";

/**
 * 移动端总装：7 段内容 + RecruitDialog，顺序按 §3.1 IA。
 * 各段 id 与桌面端同名（hero / team-info / team / features / leaders / members / social），
 * NAV_LINKS 的锚点两端通用。
 *
 * 纸面 / 舞台节奏(D4):hero=stage → team-info=paper → team=stage → features=舞台照
 * → leaders=stage → members=paper → social=stage。每段自设底色,这里只给页面根纸面。
 * - 右上角品牌 icon 小按钮打开抽屉，播放器在抽屉内(MobileNav)
 * - 招新弹窗在最外层挂载,Hero / Nav / Social 共用同一 open state
 */
export default function MobileView() {
  const [recruitOpen, setRecruitOpen] = useState(false);
  const openRecruit = () => setRecruitOpen(true);

  return (
    <div className="relative bg-paper text-ink min-h-screen">
      <MobileNav onJoinClick={openRecruit} />

      <MobileHero onJoinClick={openRecruit} />
      <MobileTeamInfo />
      <MobileTeamPhoto />
      <MobileFeatures />
      <MobileLeaders />
      <MobileMembers onJoinClick={openRecruit} />
      <MobileSocial onJoinClick={openRecruit} />

      <RecruitDialog open={recruitOpen} onClose={() => setRecruitOpen(false)} />
    </div>
  );
}
