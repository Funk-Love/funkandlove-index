"use client";

import { ExternalLink } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";

const PLATFORM_COLORS: Record<string, string> = {
  抖音: "#fe2c55",
  微信视频号: "#07c160",
  B站: "#00a1d6",
  Instagram: "#e4405f",
};

const ACTIVITIES = NAV_LINKS.find((l) => l.id === "activities")?.subLinks ?? [];
const MERCH = NAV_LINKS.find((l) => l.id === "merch")?.subLinks ?? [];
const PRODUCTS = NAV_LINKS.find((l) => l.id === "products")?.subLinks ?? [];

const GROUPS = [
  { title: "活动", links: ACTIVITIES },
  { title: "周边", links: MERCH },
  { title: "产品", links: PRODUCTS },
];

export default function MobileSocial() {
  return (
    <section className="relative bg-gradient-to-b from-neutral-950 to-black px-6 py-16">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">关注我们</h2>
        <p className="text-sm text-white/60 mb-8">
          在社交媒体上了解更多精彩内容
        </p>

        {/* 社交矩阵 */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {SITE_CONFIG.socialLinks.map((link) => {
            const Icon = link.icon;
            const disabled = link.isComingSoon || !link.url;
            const color = PLATFORM_COLORS[link.platform] ?? "#8b5cf6";
            const inner = (
              <div
                className={`relative flex flex-col items-center justify-center aspect-square rounded-2xl border transition-colors ${
                  disabled
                    ? "bg-neutral-900 border-white/5"
                    : "bg-white/5 border-white/10 active:bg-white/10"
                }`}
              >
                <Icon
                  className={`w-7 h-7 ${
                    disabled ? "text-white/30" : "text-white"
                  }`}
                  strokeWidth={1.5}
                  style={disabled ? undefined : { color }}
                />
                <span
                  className={`mt-1 text-[10px] ${
                    disabled ? "text-white/30" : "text-white/70"
                  }`}
                >
                  {link.platform}
                </span>
                {link.isComingSoon && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[9px] rounded-full bg-neutral-800 text-white/50 border border-white/10">
                    筹备
                  </span>
                )}
              </div>
            );
            return disabled ? (
              <div key={link.platform}>{inner}</div>
            ) : (
              <a
                key={link.platform}
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

        {/* 外链分组 */}
        <div className="space-y-6">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                {g.title}
              </h3>
              <div className="space-y-2">
                {g.links.map((sub) => {
                  const Icon = sub.icon;
                  return (
                    <a
                      key={sub.id}
                      href={sub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm active:bg-white/10 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 opacity-80" />}
                        {sub.label}
                      </span>
                      <ExternalLink className="w-4 h-4 opacity-60" />
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 版权 / 备案 */}
        <div className="mt-10 text-center text-xs text-white/40 space-y-1">
          <p>© 2025 Funk &amp; Love. All rights reserved.</p>
          <p>建设者：Hofmann</p>
          <p>
            <a
              href="https://beian.miit.gov.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              浙ICP备2025210475号
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
