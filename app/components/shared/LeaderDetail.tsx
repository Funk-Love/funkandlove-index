"use client";

import { Crown } from "lucide-react";
import type { Leader } from "@/lib/types";
import { asset } from "@/lib/cdn";
import { getRoleBadgeStyle } from "./leaderStyles";

interface Props {
  leader: Leader;
}

/**
 * 队长详情内容（不含 modal/sheet 外壳）。
 * 用于 <DetailSheet> 的 children。
 */
export default function LeaderDetail({ leader }: Props) {
  const isFounder = leader.role === "founder";
  const imageSrc = asset(leader.image);

  return (
    <>
      {isFounder && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
      )}

      <div className="relative h-80 overflow-hidden bg-neutral-800">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundPosition: `center ${leader.modalY || "50%"}`,
          }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isFounder
              ? "from-neutral-900 via-neutral-900/50 to-amber-900/20"
              : "from-neutral-900 via-neutral-900/50 to-transparent"
          }`}
        />
      </div>

      <div className="p-8 -mt-20 relative">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`inline-block px-4 py-1.5 text-sm font-medium rounded-full ${getRoleBadgeStyle(
              leader.role
            )}`}
          >
            {leader.term} · {leader.title}
          </span>
          {isFounder && (
            <span className="inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-black rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" strokeWidth={2.5} /> 建队
            </span>
          )}
        </div>
        <h3 className="text-4xl font-bold text-white mb-4">{leader.name}</h3>
        <p className="text-lg text-gray-300 leading-relaxed">{leader.bio}</p>
      </div>
    </>
  );
}
