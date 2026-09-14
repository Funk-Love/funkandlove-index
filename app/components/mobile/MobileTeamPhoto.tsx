"use client";

import { useState } from "react";
import { oss } from "@/lib/cdn";
import { useReveal } from "../../hooks/useReveal";
import VideoPlayer from "../VideoPlayer";
import SectionHeader from "../ui/SectionHeader";

const PHOTO_URL = oss("/images/team-bg.jpg")!;
const LQIP_URL = "/images/team-bg-lqip.webp";

/**
 * 我们的团队(舞台深棕):合照有明确展示位(D4,全站固定底图已作废)。
 * 上:合照,4:3,纸面相框 + 芥末硬阴影,像贴在海报上的相片;LQIP 模糊兜底。
 * 下:队宣视频,细纸线圆角框 + mono 图注。
 */
export default function MobileTeamPhoto() {
  const ref = useReveal<HTMLElement>();
  const [loaded, setLoaded] = useState(false);

  return (
    <section
      id="team"
      ref={ref}
      className="relative bg-stage text-paper px-6 py-16 scroll-mt-4 focus:outline-none"
    >
      <div className="max-w-md mx-auto">
        <SectionHeader
          index={2}
          eyebrow="team"
          title="我们的团队"
          theme="dark"
          className="mb-8"
        />

        {/* 合照:纸面相框 */}
        <figure data-reveal="lock" className="mb-3">
          <div className="bg-paper p-2 border-2 border-ink rounded-2xl shadow-action">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-stage-2">
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${LQIP_URL})`,
                  filter: "blur(20px)",
                  transform: "scale(1.1)",
                }}
              />
              <img
                src={PHOTO_URL}
                alt="Funk & Love 团队合照"
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`relative h-full w-full object-cover object-center transition-opacity duration-500 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
          <figcaption className="mt-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-paper/50">
            <span className="h-px flex-1 bg-paper/20" aria-hidden />
            <span>Family photo</span>
          </figcaption>
        </figure>

        {/* 队宣视频 */}
        <figure data-reveal className="mt-10">
          <div className="relative w-full aspect-video overflow-hidden rounded-2xl border-2 border-paper/20 bg-stage-2">
            <VideoPlayer
              src="/video/promo/master.m3u8"
              poster="/video/promo/poster.webp"
              className="w-full h-full"
            />
          </div>
          <figcaption className="mt-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-paper/50">
            <span>2026 队宣 · Funk <span className="font-sans">&amp;</span> Love</span>
            <span className="h-px flex-1 bg-paper/20" aria-hidden />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
