'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Music, Heart, Users, Flame, Scale, LucideIcon } from 'lucide-react';
import Card from './ui/Card';
import SectionHeader from './ui/SectionHeader';
import ImagePlaceholder from './ui/ImagePlaceholder';
import { SITE_CONFIG } from '@/lib/constants';
import { staggerContainer, cardItem } from '@/lib/animations';
import { getMouseInfluence, interpolateColor } from '@/lib/gradients';

gsap.registerPlugin(useGSAP);

// Icon mapping - 将字符串映射到实际的 Lucide 图标组件
const iconMap: Record<string, LucideIcon> = {
  Music,
  Heart,
  Users,
  Flame,
  Scale,
};

// 按鼠标与卡片中心的距离插值图标颜色（沿用原配色分层）。
const iconColorFor = (influence: number) => {
  if (influence > 0.7) return interpolateColor('#8b5cf6', '#ec4899', (influence - 0.7) / 0.3);
  if (influence > 0.4) return interpolateColor('#3b82f6', '#8b5cf6', (influence - 0.4) / 0.3);
  return interpolateColor('#10b981', '#3b82f6', influence / 0.4);
};

export default function TeamFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // 图标颜色跟随鼠标：直接用 gsap.quickSetter 写 DOM，不再经过 React 状态，
  // 彻底消除原来每次 mousemove 重渲染整个 section 的开销。
  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.feature-card'));
      const icons = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.feature-icon'));
      const setColor = icons.map((el) => gsap.quickSetter(el, 'color'));

      // 初始颜色（influence=0）
      setColor.forEach((set) => set(iconColorFor(0)));

      let mx = -9999;
      let my = -9999;
      let rafId: number | null = null;

      const paint = () => {
        rafId = null;
        // 先批量读取卡片中心（视口坐标，随滚动实时取，避免缓存失效），再批量写色，避免布局抖动。
        const centers = cards.map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        });
        centers.forEach((c, i) => {
          const influence = getMouseInfluence(mx, my, c.x, c.y, 400);
          setColor[i]?.(iconColorFor(influence));
        });
      };

      const onMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        if (rafId === null) rafId = requestAnimationFrame(paint);
      };

      window.addEventListener('mousemove', onMove, { passive: true });
      return () => {
        window.removeEventListener('mousemove', onMove);
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      id="features"
      className="relative pt-[12vh] pb-8 md:pt-[10vh] px-4 overflow-hidden min-h-screen flex items-center"
    >
      {/* 背景图片 - 全屏 */}
      <div className="absolute inset-0 z-0">
        <ImagePlaceholder
          src={SITE_CONFIG.images.featuresBackground}
          alt="团队特色背景"
          fill
          className="w-full h-full"
          imageClassName="object-cover"
          placeholderText="特色背景图待补充"
          suggestedSize="1920x1080px"
          rounded={false}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* 左侧内容区域 - 占据 1/3 宽度 */}
        <div className="w-full lg:w-2/5">
          {/* 标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="mb-[clamp(1.5rem,5vh,3rem)]"
          >
            <SectionHeader
              index={3}
              eyebrow="features"
              title="团队特色"
              subtitle="我们的四大核心优势"
              theme="dark"
            />
          </motion.div>

          {/* 特色卡片 - 垂直排列 */}
          <motion.div
            ref={containerRef}
            variants={staggerContainer}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            className="space-y-[clamp(0.75rem,2vh,1.5rem)]"
          >
            {SITE_CONFIG.features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon];

              return (
                <motion.div key={index} variants={cardItem}>
                  <Card className="p-6 feature-card" hoverScale={true} hoverShadow={true}>
                    <div className="flex items-start gap-4">
                      {/* 图标 - 颜色由 gsap.quickSetter 直接驱动 */}
                      <div className="feature-icon shrink-0">
                        {IconComponent && <IconComponent size={40} strokeWidth={1.5} />}
                      </div>

                      {/* 文字内容 */}
                      <div className="flex-1">
                        {/* 标题 */}
                        <h3 className="font-bold text-white mb-2 text-[clamp(1rem,2.1vh,1.25rem)]">
                          {feature.title}
                        </h3>

                        {/* 描述 */}
                        <p className="text-neutral-200 leading-relaxed text-[clamp(0.8rem,1.6vh,1rem)]">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
