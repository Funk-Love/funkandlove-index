'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Camera, 
  Sparkles, 
  Heart, 
  Crown, 
  UserCircle, 
  Share2,
  LucideIcon
} from 'lucide-react';

interface SectionConfig {
  id: string;
  label: string;
  icon: LucideIcon;
}

const SECTION_CONFIG: SectionConfig[] = [
  { id: 'team-info', label: '关于我们', icon: Users },
  { id: 'team', label: '团队合照', icon: Camera },
  { id: 'features', label: '团队特色', icon: Sparkles },
  { id: 'team-spirit', label: '团队精神', icon: Heart },
  { id: 'leaders', label: '历年队长', icon: Crown },
  { id: 'members', label: '历年成员', icon: UserCircle },
  { id: 'social', label: '关注我们', icon: Share2 },
];

interface SectionIndicatorProps {
  sectionIds: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function SectionIndicator({
  sectionIds,
  currentIndex,
  onNavigate,
}: SectionIndicatorProps) {
  // 过滤掉 hero，只显示其他 section
  const filteredSectionIds = sectionIds.filter(id => id !== 'hero');
  // 调整 index（因为原始 index 包含 hero）
  const adjustedIndex = currentIndex > 0 ? currentIndex - 1 : -1;
  // hero 时隐藏
  const isVisible = currentIndex > 0;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="section-indicator"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed right-3 lg:right-5 top-1/2 -translate-y-1/2 z-40"
        >
      {/* 背景容器 */}
      <div className="relative flex flex-col items-center py-2 px-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
        {/* 活动指示器背景 - 跟随当前section滑动 */}
        <motion.div
          className="absolute w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-br from-purple-500/80 to-pink-500/80 blur-sm"
          style={{ left: '50%', x: '-50%', y: '-50%' }}
          initial={false}
          animate={{
            top: adjustedIndex * 44 + 8 + 22, // 8 = py-2, 22 = 按钮高度一半
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
          }}
        />
        
        {/* 活动指示器前景 */}
        <motion.div
          className="absolute w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
          style={{ left: '50%', x: '-50%', y: '-50%' }}
          initial={false}
          animate={{
            top: adjustedIndex * 44 + 8 + 22,
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
          }}
        />

        {/* 导航按钮 */}
        {filteredSectionIds.map((id, index) => {
          const config = SECTION_CONFIG.find(s => s.id === id);
          if (!config) return null;
          
          const Icon = config.icon;
          const isActive = adjustedIndex === index;

          return (
            <motion.button
              key={id}
              onClick={() => onNavigate(index + 1)} // +1 因为原始 sectionIds 包含 hero
              className="group relative flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-full z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`跳转��� ${config.label}`}
            >
              {/* 悬停时显示的标签 */}
              <motion.span 
                className="absolute right-full mr-3 px-3 py-1.5 text-sm font-medium text-white bg-black/80 backdrop-blur-sm rounded-lg whitespace-nowrap pointer-events-none border border-white/10"
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                whileHover={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {config.label}
                {/* 小箭头 */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-black/80 rotate-45 border-r border-t border-white/10" />
              </motion.span>
              
              {/* 图标 */}
              <motion.div
                animate={{
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                }}
                transition={{ duration: 0.3 }}
              >
                <Icon 
                  size={18} 
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className="lg:w-5 lg:h-5"
                />
              </motion.div>
            </motion.button>
          );
        })}
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
