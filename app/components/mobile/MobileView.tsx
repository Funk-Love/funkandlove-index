"use client";

import { useState } from "react";
import MobileNav from "./MobileNav";
import MobileHero from "./MobileHero";
import MobileTeamInfo from "./MobileTeamInfo";
import MobileTeamPhoto from "./MobileTeamPhoto";
import MobileFeatures from "./MobileFeatures";
import MobileTeamSpirit from "./MobileTeamSpirit";
import MobileLeaders from "./MobileLeaders";
import MobileMembers from "./MobileMembers";
import MobileSocial from "./MobileSocial";
import RecruitDialog from "../shared/RecruitDialog";

/**
 * 移动端总装：9 段顺序按 §3.1 IA。
 * - 浮动汉堡导航（MobileNav）
 * - 招新弹窗在最外层挂载，Hero / Nav 共用同一 open state
 */
export default function MobileView() {
  const [recruitOpen, setRecruitOpen] = useState(false);
  const openRecruit = () => setRecruitOpen(true);

  return (
    <div className="relative bg-neutral-950 min-h-screen">
      <MobileNav onJoinClick={openRecruit} />

      <MobileHero />
      <MobileTeamInfo />
      <MobileTeamPhoto />
      <MobileFeatures />
      <MobileTeamSpirit />
      <MobileLeaders />
      <MobileMembers />
      <MobileSocial />

      <RecruitDialog open={recruitOpen} onClose={() => setRecruitOpen(false)} />
    </div>
  );
}
