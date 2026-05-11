"use client";

import { Crown } from "lucide-react";
import type { Leader } from "@/lib/types";
import { asset } from "@/lib/cdn";
import {
  getCardBorderStyle,
  getRoleBadgeStyle,
  getTitleColor,
} from "./leaderStyles";

interface Props {
  leader: Leader;
  /** 卡片宽度（px） — 父级根据视口/布局决定 */
  width: number;
  /** 卡片高度（px） */
  height: number;
  /** 是否首屏图（决定 loading=eager） */
  priority?: boolean;
  onClick?: () => void;
}

/**
 * 队长卡片基础视觉。
 * 与原 Leaders.tsx 卡片 DOM/类名保持一致，让桌面端横滚和移动端 scroll-snap 共用。
 * 建队人（founder）：amber 金边 + 外发光 + Crown 徽章 + 更大字号。
 */
export default function LeaderCard({
  leader,
  width,
  height,
  priority,
  onClick,
}: Props) {
  const isFounder = leader.role === "founder";
  const imageSrc = asset(leader.image);

  return (
    <div
      className={`shrink-0 cursor-pointer group transition-transform duration-300 hover:-translate-y-2 ${
        isFounder ? "relative" : ""
      }`}
      style={{ width }}
      onClick={onClick}
    >
      {isFounder && (
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
      )}

      <div
        className={`relative overflow-hidden rounded-2xl bg-neutral-800 border transition-all duration-300 group-hover:shadow-2xl ${getCardBorderStyle(
          leader.role
        )} ${isFounder ? "border-2" : ""}`}
        style={{ height: `${height}px` }}
      >
        <div className="absolute inset-0">
          <img
            src={imageSrc}
            alt={leader.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{
              minWidth: "100%",
              minHeight: "100%",
              objectPosition: `${leader.cardX || "50%"} center`,
            }}
            loading={priority ? "eager" : "lazy"}
          />
        </div>
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isFounder
              ? "from-black via-black/50 to-amber-900/20"
              : "from-black via-black/40 to-transparent"
          }`}
        />

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <span
            className={`px-3 py-1.5 text-sm font-medium rounded-full ${getRoleBadgeStyle(
              leader.role
            )}`}
          >
            {leader.term}
          </span>
          {isFounder && (
            <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-black rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" strokeWidth={2.5} /> 建队
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h3
            className="font-bold text-white mb-1"
            style={{
              fontSize: isFounder
                ? "clamp(1.5rem, 3.4vh, 2rem)"
                : "clamp(1.25rem, 2.8vh, 1.6rem)",
            }}
          >
            {leader.name}
          </h3>
          <p
            className={getTitleColor(leader.role)}
            style={{ fontSize: "clamp(0.875rem, 1.7vh, 1.05rem)" }}
          >
            {leader.title}
          </p>
        </div>
      </div>
    </div>
  );
}
