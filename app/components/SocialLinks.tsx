"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";
import { fadeInUp } from "@/lib/animations";

/**
 * 社交媒体平台品牌色配置
 */
const PLATFORM_COLORS: Record<string, string> = {
  "抖音": "#fe2c55",
  "微信视频号": "#07c160",
  "B站": "#00a1d6",
  "Instagram": "#e4405f",
};

/**
 * SocialLinks 组件
 * 展示社交媒体链接，支持悬停效果和筹备中状态
 */
export default function SocialLinks() {
  const handleSocialClick = (
    e: React.MouseEvent,
    url?: string,
    isComingSoon?: boolean
  ) => {
    if (isComingSoon || !url) {
      e.preventDefault();
      return;
    }
    // 可用链接在新标签页打开
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="social"
      className="relative min-h-screen flex items-center py-12 px-4 bg-linear-to-b from-neutral-900 to-black"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            关注我们
          </h2>
          <p className="text-neutral-400 text-lg">
            在社交媒体上了解更多精彩内容
          </p>
        </motion.div>

        {/* 社交媒体图标 */}
        <motion.div
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
        >
          {SITE_CONFIG.socialLinks.map((link) => {
            const Icon = link.icon;
            const brandColor = PLATFORM_COLORS[link.platform] || "#8b5cf6";
            const isDisabled = link.isComingSoon || !link.url;

            return (
              <motion.div
                key={link.platform}
                variants={fadeInUp}
                className="relative group"
              >
                <motion.button
                  onClick={(e) =>
                    handleSocialClick(e, link.url, link.isComingSoon)
                  }
                  disabled={isDisabled}
                  whileHover={!isDisabled ? { scale: 1.1 } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  className={`
                    relative flex flex-col items-center justify-center
                    w-20 h-20 md:w-24 md:h-24
                    rounded-2xl
                    transition-all duration-300
                    ${
                      isDisabled
                        ? "bg-neutral-800 cursor-not-allowed"
                        : "bg-neutral-800/50 hover:bg-neutral-700/50 cursor-pointer"
                    }
                    backdrop-blur-sm
                    border border-neutral-700
                    ${!isDisabled && "hover:border-neutral-500"}
                    ${!isDisabled && "hover:shadow-xl"}
                    touch-manipulation
                    min-w-[44px] min-h-[44px]
                  `}
                  style={
                    !isDisabled
                      ? ({ "--brand-color": brandColor } as React.CSSProperties)
                      : undefined
                  }
                >
                  {/* 图标 */}
                  <Icon
                    className={`
                      w-8 h-8 md:w-10 md:h-10
                      transition-colors duration-300
                      ${
                        isDisabled
                          ? "text-neutral-600"
                          : "text-neutral-300 group-hover:text-(--brand-color)"
                      }
                    `}
                    strokeWidth={1.5}
                  />

                  {/* 平台名称 */}
                  <span
                    className={`
                      mt-2 text-xs md:text-sm font-medium
                      transition-colors duration-300
                      ${
                        isDisabled
                          ? "text-neutral-600"
                          : "text-neutral-400 group-hover:text-neutral-200"
                      }
                    `}
                  >
                    {link.platform}
                  </span>

                  {/* 筹备中标签 */}
                  {link.isComingSoon && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-neutral-700 text-neutral-400 rounded-full border border-neutral-600">
                      筹备中
                    </span>
                  )}

                  {/* 悬停时的光晕效果 */}
                  {!isDisabled && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${brandColor}20 0%, transparent 70%)`,
                      }}
                    />
                  )}
                </motion.button>

                {/* 悬停提示 - 仅在桌面端显示 */}
                {!isDisabled && (
                  <div className="hidden md:block absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="text-xs text-neutral-500 whitespace-nowrap">
                      点击访问
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* 底部说明文字 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center text-neutral-500 text-sm mt-16 space-y-2"
        >
          <p>© 2025 Funk & Love. All Rights Reserved.</p>
          <p>建设者：Hofmann</p>
          <p>
            <a
              href="https://beian.miit.gov.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-400 transition-colors"
            >
              浙ICP备2025210475号
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
