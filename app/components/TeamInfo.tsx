"use client";

import VideoPlayer from "./VideoPlayer";
import SectionHeader from "./ui/SectionHeader";
import { SITE_CONFIG } from "@/lib/constants";
import { useReveal } from "../hooks/useReveal";

/**
 * 关于我们(section 01,纸面):左宣传片海报框 7/12 + 右编辑式数据列 5/12。
 * 本段唯一的强调元素是视频的 2px 墨线相框 + 硬阴影;数据列只用细线分隔。
 * 揭示走 useReveal(GSAP ScrollTrigger),不再用 framer。
 */
export default function TeamInfo() {
  const revealRef = useReveal<HTMLDivElement>();

  const facts = [
    { label: "所属组织", value: SITE_CONFIG.organization },
    { label: "舞种", value: SITE_CONFIG.danceStyle },
    { label: "理念", value: SITE_CONFIG.philosophy },
  ];

  return (
    <div ref={revealRef} className="relative w-full px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-[clamp(1.5rem,4vh,3rem)]">
          <SectionHeader index={1} eyebrow="about" title="关于我们" theme="light" />
        </div>

        <div className="grid grid-cols-1 gap-y-8 lg:grid-editorial lg:gap-y-0 items-center">
          {/* 左:宣传片,海报相框 */}
          <div data-reveal="lock" className="lg:col-span-7">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-stage shadow-paper">
              <VideoPlayer
                src="/video/promo/master.m3u8"
                poster="/video/promo/poster.webp"
                className="w-full h-full"
              />
            </div>
            <p className="mt-3 font-mono text-xs tracking-[0.12em] uppercase text-ink-muted">
              Promo · Funk <span className="font-sans">&amp;</span> Love
            </p>
          </div>

          {/* 右:slogan + 描述 + 数据列 */}
          <div className="lg:col-span-5 lg:pl-[clamp(0.5rem,2vw,2rem)]">
            <p
              data-reveal="lock"
              className="font-display text-accent-500 leading-[1.1] text-[clamp(1.5rem,3.4vh,2.25rem)] mb-[clamp(0.75rem,2vh,1.25rem)]"
            >
              {SITE_CONFIG.slogan}
            </p>

            <p
              data-reveal
              className="text-ink-2 leading-relaxed text-[clamp(0.95rem,1.95vh,1.0625rem)] mb-[clamp(1rem,3vh,1.75rem)]"
            >
              {SITE_CONFIG.teamDescription}
            </p>

            {/* 大数字:成员规模 */}
            <div data-reveal className="flex items-end gap-4 pb-[clamp(0.75rem,2vh,1.25rem)]">
              <span className="font-display text-ink leading-none text-[clamp(3rem,8vh,5rem)]">
                {SITE_CONFIG.memberCount}
              </span>
              <div className="pb-2">
                <p className="font-mono text-xs tracking-[0.12em] uppercase text-ink-muted">
                  members
                </p>
                <p className="text-ink font-bold">成员规模</p>
              </div>
            </div>

            {/* 数据条:只用上下细线分隔 */}
            <ul className="border-t border-ink/15">
              {facts.map((f, i) => (
                <li
                  key={f.label}
                  data-reveal
                  className="flex items-baseline gap-4 py-[clamp(0.6rem,1.6vh,0.9rem)] border-b border-ink/15"
                >
                  <span className="font-mono text-[11px] text-ink-faint tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-ink-muted min-w-16">{f.label}</span>
                  <span className="text-ink font-bold ml-auto text-right text-[15px]">
                    {f.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
