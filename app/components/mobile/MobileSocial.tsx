"use client";

import { ArrowUpRight } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import { getIcon } from "@/lib/icons";
import { platformColor } from "@/lib/brand";
import { useReveal } from "../../hooks/useReveal";
import SectionHeader from "../ui/SectionHeader";

interface Props {
  onJoinClick?: () => void;
}

const ACTIVITIES = NAV_LINKS.find((l) => l.id === "activities")?.subLinks ?? [];
const MERCH = NAV_LINKS.find((l) => l.id === "merch")?.subLinks ?? [];
const PRODUCTS = NAV_LINKS.find((l) => l.id === "products")?.subLinks ?? [];

const GROUPS = [
  { title: "活动", eyebrow: "events", links: ACTIVITIES },
  { title: "周边", eyebrow: "merch", links: MERCH },
  { title: "产品", eyebrow: "products", links: PRODUCTS },
];

/**
 * 关注我们(舞台深棕,页尾):社媒 2×2 卡 → 活动 / 周边 / 产品外链列表 → 加入我们 CTA → 页脚。
 * 社媒图标用平台品牌色(lib/brand),筹备中的卡整体压暗并挂芥末"筹备中"小签。
 */
export default function MobileSocial({ onJoinClick }: Props) {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="social"
      ref={ref}
      className="relative bg-stage text-paper paper-grain-dark px-6 pt-16 pb-10 scroll-mt-4 focus:outline-none"
    >
      <div className="max-w-md mx-auto">
        <SectionHeader
          index={6}
          eyebrow="follow"
          title="关注我们"
          subtitle="在社交媒体上了解更多精彩内容"
          theme="dark"
          className="mb-8"
        />

        {/* 社交矩阵 */}
        <div className="grid grid-cols-2 gap-3 mb-12">
          {SITE_CONFIG.socialLinks.map((link) => {
            const Icon = getIcon(link.icon);
            const disabled = link.isComingSoon || !link.url;
            const color = platformColor(link.platform);
            const inner = (
              <div
                className={`relative flex items-center gap-3 min-h-20 px-4 py-4 rounded-2xl border transition-colors ${
                  disabled
                    ? "bg-stage-2/60 border-paper/10"
                    : "bg-stage-2 border-paper/15 active:border-paper/40"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-7 h-7 shrink-0 ${disabled ? "text-paper/30" : ""}`}
                    strokeWidth={1.75}
                    style={disabled ? undefined : { color }}
                  />
                )}
                <span
                  className={`text-base font-bold leading-tight ${
                    disabled ? "text-paper/40" : "text-paper"
                  }`}
                >
                  {link.platform}
                </span>
                {link.isComingSoon && (
                  <span className="absolute -top-2 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full bg-pop-500 text-ink">
                    筹备中
                  </span>
                )}
                {!disabled && (
                  <ArrowUpRight className="w-4 h-4 ml-auto text-paper/50 shrink-0" />
                )}
              </div>
            );
            return disabled ? (
              <div key={link.platform} data-reveal aria-disabled="true">
                {inner}
              </div>
            ) : (
              <a
                key={link.platform}
                data-reveal
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
              >
                {inner}
              </a>
            );
          })}
        </div>

        {/* 外链分组:紧凑编辑部列表 */}
        <div className="space-y-8">
          {GROUPS.map((g) => (
            <div key={g.title} data-reveal>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-display text-xl text-paper">{g.title}</h3>
                <span className="font-mono text-xs tracking-[0.12em] uppercase text-paper/50">
                  {g.eyebrow}
                </span>
                <span className="h-px flex-1 bg-paper/20" aria-hidden />
              </div>
              <ul className="divide-y divide-paper/15">
                {g.links.map((sub) => {
                  const Icon = getIcon(sub.icon);
                  return (
                    <li key={sub.id}>
                      <a
                        href={sub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 min-h-12 py-3 text-paper text-base font-medium transition-colors active:text-pop-500"
                      >
                        {Icon && <Icon className="w-5 h-5 text-accent-400 shrink-0" strokeWidth={2} />}
                        <span className="flex-1">{sub.label}</span>
                        <ArrowUpRight className="w-4 h-4 text-paper/50 shrink-0" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* 加入我们 CTA */}
        <div data-reveal="lock" className="mt-12 rounded-2xl bg-stage-2 border border-paper/15 p-5">
          <p className="font-display text-pop-500 text-2xl leading-tight mb-1">Lock with us.</p>
          <p className="text-base text-paper/80 leading-relaxed mb-5">
            不限基础,不限舞龄。欢迎每一位想跳 Locking 的你。
          </p>
          <button
            type="button"
            onClick={onJoinClick}
            className="w-full inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-full bg-action text-on-action text-lg font-bold border border-action shadow-action transition-[transform,translate,box-shadow] duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            加入我们
          </button>
        </div>

        {/* 版权 / 备案 */}
        <footer className="mt-12 pt-6 border-t border-paper/15 text-center text-sm text-paper/50 space-y-1.5">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Funk <span className="font-sans">&amp;</span> Love · All rights reserved
          </p>
          <p>建设者:Hofmann</p>
          <p>
            <a
              href="https://beian.miit.gov.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-11 text-paper/50 underline-offset-4 active:text-paper active:underline transition-colors"
            >
              浙ICP备2025210475号
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}
