"use client";

import { Crown } from "lucide-react";
import type { Leader } from "@/lib/types";
import { asset } from "@/lib/cdn";
import { getRoleBadgeStyle } from "./leaderStyles";

interface Props {
  leader: Leader;
}

/**
 * 队长详情内容(不含 modal/sheet 外壳),纸面配色。
 * 用于 <DetailSheet> 的 children。
 */
export default function LeaderDetail({ leader }: Props) {
  const isFounder = leader.role === "founder";
  const imageSrc = asset(leader.image);

  return (
    <>
      {isFounder && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-role-founder via-role-founder-2 to-role-founder z-10" />
      )}

      <div className="relative h-72 sm:h-80 overflow-hidden bg-stage-2">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundPosition: `center ${leader.modalY || "50%"}`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-transparent" />
      </div>

      <div className="p-6 sm:p-8 -mt-16 relative">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`inline-block px-4 py-1.5 text-sm font-bold rounded-full ${getRoleBadgeStyle(
              leader.role
            )}`}
          >
            {leader.term} · {leader.title}
          </span>
          {isFounder && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-paper text-ink rounded-full border border-ink">
              <Crown className="w-3 h-3" strokeWidth={2.5} /> 建队
            </span>
          )}
        </div>
        <h3 className="font-display text-4xl text-ink mb-4">{leader.name}</h3>
        {leader.bio && <p className="text-lg text-ink-2 leading-relaxed">{leader.bio}</p>}
      </div>
    </>
  );
}
