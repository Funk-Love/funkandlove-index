'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Music, Heart, Users, Sparkles, Scale, LucideIcon } from 'lucide-react';
import Card from './ui/Card';
import ImagePlaceholder from './ui/ImagePlaceholder';
import { SITE_CONFIG } from '@/lib/constants';
import { staggerContainer, cardItem } from '@/lib/animations';
import { useMousePosition, getMouseInfluence, interpolateColor } from '@/lib/gradients';

// Icon mapping - 将字符串映射到实际的 Lucide 图标组件
const iconMap: Record<string, LucideIcon> = {
  Music,
  Heart,
  Users,
  Sparkles,
  Scale,
};

interface CardPosition {
  x: number;
  y: number;
}

export default function TeamFeatures() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  // 追踪鼠标位置
  const mousePosition = useMousePosition();
  
  // 存储每个卡片的位置
  const [cardPositions, setCardPositions] = useState<CardPosition[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 计算并存储卡片位置
  useEffect(() => {
    const updatePositions = () => {
      const positions = cardRefs.current.map((ref) => {
        if (!ref) return { x: 0, y: 0 };
        const rect = ref.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      });
      setCardPositions(positions);
    };

    // 初始计算
    updatePositions();

    // 窗口大小改变时重新计算
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  // 计算每个卡片的动态样式
  const getCardStyle = (index: number) => {
    if (cardPositions.length === 0) return {};
    
    const cardPos = cardPositions[index];
    const influence = getMouseInfluence(
      mousePosition.x,
      mousePosition.y,
      cardPos.x,
      cardPos.y,
      400 // 最大影响距离
    );

    // 根据鼠标距离插值背景色
    // 距离近时使用主色调，距离远时使用半透明白色
    const backgroundColor = interpolateColor(
      '#8b5cf6', // 紫色
      '#ffffff',
      1 - influence * 0.3 // 最多影响 30%
    );

    return {
      backgroundColor: `${backgroundColor}${Math.round(10 + influence * 20).toString(16)}`, // 添加透明度
    };
  };

  // 计算图标颜色
  const getIconColor = (index: number) => {
    if (cardPositions.length === 0) return '#8b5cf6';
    
    const cardPos = cardPositions[index];
    const influence = getMouseInfluence(
      mousePosition.x,
      mousePosition.y,
      cardPos.x,
      cardPos.y,
      400
    );

    // 根据鼠标距离在多个颜色间插值
    if (influence > 0.7) {
      return interpolateColor('#8b5cf6', '#ec4899', (influence - 0.7) / 0.3);
    } else if (influence > 0.4) {
      return interpolateColor('#3b82f6', '#8b5cf6', (influence - 0.4) / 0.3);
    } else {
      return interpolateColor('#10b981', '#3b82f6', influence / 0.4);
    }
  };

  return (
    <section
      id="features"
      className="relative py-8 px-4 overflow-hidden min-h-screen flex items-center"
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
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              团队特色
            </h2>
            <p className="text-lg text-neutral-300">
              我们的四大核心优势
            </p>
          </motion.div>

          {/* 特色卡片 - 垂直排列 */}
          <motion.div
            ref={containerRef}
            variants={staggerContainer}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            className="space-y-6"
          >
            {SITE_CONFIG.features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon];
              
              return (
                <motion.div
                  key={index}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  variants={cardItem}
                >
                  <Card
                    className="p-6"
                    style={getCardStyle(index)}
                    hoverScale={true}
                    hoverShadow={true}
                  >
                    <div className="flex items-start gap-4">
                      {/* 图标 */}
                      <motion.div
                        className="flex-shrink-0"
                        animate={{
                          color: getIconColor(index),
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        {IconComponent && (
                          <IconComponent
                            size={40}
                            strokeWidth={1.5}
                          />
                        )}
                      </motion.div>

                      {/* 文字内容 */}
                      <div className="flex-1">
                        {/* 标题 */}
                        <h3 className="text-lg font-bold text-white mb-2">
                          {feature.title}
                        </h3>

                        {/* 描述 */}
                        <p className="text-neutral-200 text-sm leading-relaxed">
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
