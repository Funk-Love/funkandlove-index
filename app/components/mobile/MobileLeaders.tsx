"use client";

import { useEffect, useState } from "react";
import { LEADERS } from "@/lib/data/leaders";
import type { Leader } from "@/lib/types";
import { useReveal } from "../../hooks/useReveal";
import LeaderCard from "../shared/LeaderCard";
import LeaderDetail from "../shared/LeaderDetail";
import DetailSheet from "../shared/DetailSheet";
import SectionHeader from "../ui/SectionHeader";

/** 卡片按视口宽度定尺寸:宽 ≈ 68vw,高 ≈ 92vw;SSR 先按 390 视口出 */
function cardSizeFor(viewportWidth: number) {
  const width = Math.round(Math.max(220, Math.min(viewportWidth * 0.68, 320)));
  const height = Math.round(Math.max(300, Math.min(viewportWidth * 0.92, 440)));
  return { width, height };
}

/**
 * 历年队长(舞台深棕):原生横向 scroll-snap 卡片行 + 底部详情 sheet。
 * 卡片复用 LeaderCard(纸面相框),创始人略高。滚动条隐藏,右下 mono 提示可横滑。
 */
export default function MobileLeaders() {
  const ref = useReveal<HTMLElement>();
  const [selected, setSelected] = useState<Leader | null>(null);
  const [viewportWidth, setViewportWidth] = useState(390);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { width, height } = cardSizeFor(viewportWidth);

  return (
    <>
      <section
        id="leaders"
        ref={ref}
        className="relative bg-stage text-paper py-16 scroll-mt-4 focus:outline-none overflow-hidden"
      >
        <div className="px-6 mb-8">
          <SectionHeader
            index={4}
            eyebrow="captains"
            title="历年队长"
            theme="dark"
          />
          <p className="mt-4 text-sm text-paper/70">17—26 届</p>
        </div>

        {/* 横向 scroll-snap-x,原生滚动;首尾用 padding 留白让首末张都能 snap 到位 */}
        <div
          data-reveal
          className="flex items-end gap-4 overflow-x-auto px-6 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {LEADERS.map((leader) => (
            <div key={leader.id} className="snap-start shrink-0 scroll-ml-6" style={{ width }}>
              <LeaderCard
                leader={leader}
                width={width}
                height={leader.role === "founder" ? Math.round(height * 1.06) : height}
                priority={false}
                onClick={() => setSelected(leader)}
              />
            </div>
          ))}
          <div className="shrink-0 w-2" aria-hidden="true" />
        </div>

        <div data-reveal className="px-6 mt-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-paper/20" aria-hidden />
          <span className="font-mono text-xs tracking-[0.12em] uppercase text-paper/50">
            scroll →
          </span>
        </div>
      </section>

      <DetailSheet
        open={selected !== null}
        onClose={() => setSelected(null)}
        variant="sheet"
        ariaLabel={selected ? `${selected.name} 详情` : undefined}
      >
        {selected && <LeaderDetail leader={selected} />}
      </DetailSheet>
    </>
  );
}
