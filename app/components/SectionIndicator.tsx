'use client';

import { motion } from 'framer-motion';

interface SectionIndicatorProps {
  sectionIds: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

/**
 * 右侧 Section 导航指示器
 * 显示当前位置，支持点击跳转
 */
export default function SectionIndicator({
  sectionIds,
  currentIndex,
  onNavigate,
}: SectionIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 lg:gap-3"
    >
      {sectionIds.map((id, index) => (
        <button
          key={id}
          onClick={() => onNavigate(index)}
          className="group relative flex items-center justify-end p-1"
          aria-label={`跳转到 ${getSectionLabel(id)}`}
        >
          {/* 悬停时显示的标签 */}
          <span className="absolute right-6 lg:right-8 px-2 lg:px-3 py-1 text-xs lg:text-sm text-white bg-black/70 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {getSectionLabel(id)}
          </span>
          
          {/* 指示点 */}
          <motion.div
            className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full border-2 transition-all duration-300 ${
              currentIndex === index
                ? 'bg-purple-500 border-purple-500 scale-125'
                : 'bg-transparent border-white/50 hover:border-white hover:scale-110'
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          />
        </button>
      ))}
    </motion.div>
  );
}

/**
 * 获取 section 的显示标签
 */
function getSectionLabel(id: string): string {
  const labels: Record<string, string> = {
    'hero': '首页',
    'team-info': '关于我们',
    'team': '团队',
    'features': '团队特色',
    'team-spirit': '团队精神',
    'leaders': '历年队长',
    'members': '历年成员',
    'social': '关注我们',
  };
  return labels[id] || id;
}
