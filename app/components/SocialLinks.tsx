"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { platformColor } from "@/lib/brand";
import { getIcon } from "@/lib/icons";
import { useReveal } from "../hooks/useReveal";
import SectionHeader from "./ui/SectionHeader";
import RecruitDialog from "./shared/RecruitDialog";

interface Props {
  /** 打开"加入我们"弹窗。未传时组件内部自带 RecruitDialog */
  onJoinClick?: () => void;
}

/**
 * 关注我们(section 06,深棕舞台)+ 页脚。
 * 左 5/12:标题 + 招新 CTA;右 7/12:社媒卡 2×2(stage-2 底、纸色细线,品牌色只给图标与 hover 边框)。
 * 页脚含备案链接。
 */
export default function SocialLinks({ onJoinClick }: Props) {
  const revealRef = useReveal<HTMLDivElement>();
  const [recruitOpen, setRecruitOpen] = useState(false);
  const openRecruit = onJoinClick ?? (() => setRecruitOpen(true));

  const handleSocialClick = (url?: string, isComingSoon?: boolean) => {
    if (isComingSoon || !url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div ref={revealRef} className="relative w-full px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 gap-y-10 lg:grid-editorial lg:gap-y-0 items-center">
            {/* 左:标题 + CTA */}
            <div className="lg:col-span-5">
              <SectionHeader
                index={6}
                eyebrow="follow"
                title="关注我们"
                subtitle="在社交媒体上了解更多精彩内容"
                theme="dark"
              />

              <div
                data-reveal="lock"
                className="mt-[clamp(1.5rem,4vh,2.5rem)] rounded-2xl border-2 border-paper/20 p-6 max-w-md"
              >
                <p className="font-mono text-xs tracking-[0.12em] uppercase text-pop-500 mb-2">
                  recruiting
                </p>
                <p className="font-display text-paper leading-tight text-[clamp(1.25rem,2.8vh,1.75rem)] mb-2">
                  想成为我们的一员？
                </p>
                <p className="text-paper/70 text-sm leading-relaxed mb-5">
                  无论零基础还是老手,只要热爱 Locking,就一起 funk。
                </p>
                <button
                  type="button"
                  onClick={openRecruit}
                  className="inline-flex items-center min-h-11 px-6 py-3 rounded-full bg-action text-on-action font-bold border border-action shadow-action transition-[translate,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-action-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  加入我们
                </button>
              </div>
            </div>

            {/* 右:社媒卡 */}
            <div className="lg:col-span-7 lg:pl-[clamp(0.5rem,2vw,2rem)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SITE_CONFIG.socialLinks.map((link) => {
                  const Icon = getIcon(link.icon);
                  const brandColor = platformColor(link.platform);
                  const isDisabled = link.isComingSoon || !link.url;

                  return (
                    <button
                      key={link.platform}
                      type="button"
                      data-reveal
                      onClick={() => handleSocialClick(link.url, link.isComingSoon)}
                      disabled={isDisabled}
                      aria-label={isDisabled ? `${link.platform}(筹备中)` : `访问 ${link.platform}`}
                      style={{ "--brand": brandColor } as React.CSSProperties}
                      className={`group relative flex items-center gap-4 text-left rounded-2xl bg-stage-2 border border-paper/15 px-5 py-[clamp(1rem,2.4vh,1.5rem)] min-h-11 transition-[translate,border-color] duration-200 ${
                        isDisabled
                          ? "cursor-not-allowed"
                          : "cursor-pointer hover:-translate-y-0.5 hover:border-(--brand)"
                      }`}
                    >
                      <span
                        className={`shrink-0 flex items-center justify-center w-14 h-14 rounded-xl border border-paper/15 ${
                          isDisabled ? "text-paper/45" : "text-(--brand)"
                        }`}
                      >
                        {Icon && <Icon className="w-7 h-7" strokeWidth={1.75} />}
                      </span>

                      <span className="flex-1 min-w-0">
                        <span
                          className={`block font-bold text-[clamp(1rem,2.1vh,1.125rem)] ${
                            isDisabled ? "text-paper/70" : "text-paper"
                          }`}
                        >
                          {link.platform}
                        </span>
                        <span className="block text-sm text-paper/50 mt-0.5">
                          {isDisabled ? "内容筹备中,敬请期待" : "点击访问主页"}
                        </span>
                      </span>

                      {isDisabled ? (
                        <span className="shrink-0 px-2.5 py-1 rounded-full bg-pop-500 text-ink font-mono text-[10px] tracking-[0.2em] uppercase">
                          soon
                        </span>
                      ) : (
                        <ArrowUpRight
                          className="shrink-0 w-5 h-5 text-paper/50 transition-[translate,color] duration-200 group-hover:text-paper group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={2.25}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 页脚:不做揭示(页面最末元素的 ScrollTrigger 在小视口下易失准,页脚也不需要入场) */}
          <footer
            className="mt-[clamp(2.5rem,7vh,4.5rem)] pt-5 border-t border-paper/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-paper/50"
          >
            <p className="font-display tracking-wide">
              © {new Date().getFullYear()} Funk <span className="font-sans font-semibold">&amp;</span> Love. All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <p>建设者：Hofmann</p>
              <a
                href="https://beian.miit.gov.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-paper transition-colors duration-200"
              >
                浙ICP备2025210475号
              </a>
            </div>
          </footer>
        </div>
      </div>

      {!onJoinClick && <RecruitDialog open={recruitOpen} onClose={() => setRecruitOpen(false)} />}
    </>
  );
}
