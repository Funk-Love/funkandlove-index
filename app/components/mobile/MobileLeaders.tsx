"use client";

import { useState } from "react";
import { LEADERS } from "@/lib/data/leaders";
import type { Leader } from "@/lib/types";
import LeaderCard from "../shared/LeaderCard";
import LeaderDetail from "../shared/LeaderDetail";
import DetailSheet from "../shared/DetailSheet";

const CARD_WIDTH = 240;
const CARD_HEIGHT = 360;

export default function MobileLeaders() {
  const [selected, setSelected] = useState<Leader | null>(null);

  return (
    <>
      <section className="relative bg-neutral-950 py-16">
        <div className="px-6 mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">历年队长</h2>
          <p className="text-sm text-white/60">
            从 17 届至今，一代代队长带领我们走过每一个精彩瞬间
          </p>
        </div>

        {/* 横向 scroll-snap-x，原生滚动 */}
        <div
          className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {LEADERS.map((leader, i) => (
            <div
              key={leader.id}
              className="snap-start shrink-0"
              style={{ width: CARD_WIDTH }}
            >
              <LeaderCard
                leader={leader}
                width={CARD_WIDTH}
                height={leader.role === "founder" ? CARD_HEIGHT * 1.05 : CARD_HEIGHT}
                priority={i < 2}
                onClick={() => setSelected(leader)}
              />
            </div>
          ))}
          {/* 右侧留白让最后一张能 snap 到 start */}
          <div className="shrink-0 w-2" aria-hidden="true" />
        </div>

        <p className="text-xs text-white/40 px-6 mt-2">← 左右滑动查看更多</p>
      </section>

      <DetailSheet
        open={selected !== null}
        onClose={() => setSelected(null)}
      >
        {selected && <LeaderDetail leader={selected} />}
      </DetailSheet>
    </>
  );
}
