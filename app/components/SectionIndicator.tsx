"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UsersRound, Images, AudioLines, Flag, ContactRound, Radio, LucideIcon } from "lucide-react";

interface SectionConfig {
  id: string;
  label: string;
  icon: LucideIcon;
}

const SECTION_CONFIG: SectionConfig[] = [
  { id: "team-info", label: "关于我们", icon: UsersRound },
  { id: "team", label: "团队合照", icon: Images },
  { id: "features", label: "团队特色", icon: AudioLines },
  { id: "leaders", label: "历年队长", icon: Flag },
  { id: "members", label: "历年成员", icon: ContactRound },
  { id: "social", label: "关注我们", icon: Radio },
];

interface SectionIndicatorProps {
  sectionIds: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

/**
 * 右侧纵向 section 指示器:纸面药丸 + 2px 墨线 + 小硬阴影,浮在深浅两种底上都能读。
 * 滑块(焦橙圆)由 framer spring 跟随当前 section;按钮 hover / tooltip 用 CSS。
 */
export default function SectionIndicator({
  sectionIds,
  currentIndex,
  onNavigate,
}: SectionIndicatorProps) {
  // 过滤掉 hero,只显示其他 section
  const filteredSectionIds = sectionIds.filter((id) => id !== "hero");
  // 调整 index(因为原始 index 包含 hero)
  const adjustedIndex = currentIndex > 0 ? currentIndex - 1 : -1;
  // hero 时隐藏
  const isVisible = currentIndex > 0;

  // 滑块位置 = base + index * step,其中 base / step 由实际按钮几何测得
  // (offsetTop 相对 relative 容器),不硬编码 44px 步长,lg 以下 40px 按钮也能对准。
  // 默认值取 lg 断点的解析解(py-2 8px + 半高 22px,步长 44px),首帧与实测一致;
  // index 变化时 top 在渲染期同步得出,与旧公式的即时定位语义一致。
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [geometry, setGeometry] = useState({ base: 8 + 22, step: 44 });

  useLayoutEffect(() => {
    if (!isVisible) return;

    const measure = () => {
      const buttons = buttonRefs.current.filter((b): b is HTMLButtonElement => !!b);
      const first = buttons[0];
      if (!first) return;
      const base = first.offsetTop + first.offsetHeight / 2;
      const step = buttons[1] ? buttons[1].offsetTop - first.offsetTop : first.offsetHeight;
      setGeometry((prev) => (prev.base === base && prev.step === step ? prev : { base, step }));
    };

    measure();

    // 断点切换(w-10 ↔ w-11)时按钮尺寸变化,需重新测量
    const container = buttonRefs.current.find(Boolean)?.parentElement;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [isVisible, filteredSectionIds.length]);

  const sliderTop = geometry.base + adjustedIndex * geometry.step;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="section-indicator"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="hidden min-[1408px]:block fixed right-5 top-1/2 -translate-y-1/2 z-40"
        >
          {/* 纸面药丸 */}
          <div className="relative flex flex-col items-center py-2 px-1.5 rounded-full bg-paper/95 border border-ink/15 shadow-paper-sm">
            {/* 活动滑块:焦橙圆,spring 跟随当前 section */}
            <motion.div
              aria-hidden
              className="absolute w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-action"
              style={{ left: "50%", x: "-50%", y: "-50%" }}
              initial={false}
              animate={{ top: sliderTop }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />

            {/* 导航按钮 */}
            {filteredSectionIds.map((id, index) => {
              const config = SECTION_CONFIG.find((s) => s.id === id);
              if (!config) return null;

              const Icon = config.icon;
              const isActive = adjustedIndex === index;

              return (
                <button
                  key={id}
                  type="button"
                  ref={(el) => {
                    buttonRefs.current[index] = el;
                  }}
                  onClick={() => onNavigate(index + 1)} // +1 因为原始 sectionIds 包含 hero
                  className="group relative flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-full z-10 transition-transform duration-150 hover:scale-110 active:scale-95"
                  aria-label={`跳转到 ${config.label}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {/* 悬停标签:墨底纸字 */}
                  <span
                    role="tooltip"
                    className="absolute right-full mr-3 px-3 py-1.5 text-sm font-bold text-paper bg-ink rounded-lg whitespace-nowrap pointer-events-none opacity-0 translate-x-1.5 transition-[opacity,translate] duration-150 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
                  >
                    {config.label}
                    {/* 小箭头 */}
                    <span
                      aria-hidden
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-ink rotate-45"
                    />
                  </span>

                  {/* 图标 */}
                  <span
                    className={`transition-colors duration-200 ${
                      isActive ? "text-paper" : "text-ink/45 group-hover:text-ink"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.75} className="lg:w-5 lg:h-5" aria-hidden />
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
