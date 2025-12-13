'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { fadeInUp, floatUp } from '@/lib/animations';
import { useMousePosition } from '@/lib/gradients';
import { useState, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import TextMorphAnimation from './TextMorphAnimation';

export default function Hero() {
  const mousePosition = useMousePosition();
  const [isMobile, setIsMobile] = useState(true); // 默认为移动端，避免水合不匹配
  const [isMounted, setIsMounted] = useState(false); // 追踪是否已挂载
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 检测是否为移动设备
  useLayoutEffect(() => {
    setIsMounted(true); // 标记为已挂载
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 视差滚动效果（仅用于内容和渐变层）
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // 内容滚动速度
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  
  // 渐变层滚动速度
  const gradientY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  
  // 计算从容器中心到鼠标的角度和距离（仅在客户端挂载后计算）
  const { gradientAngle, distanceOpacity } = isMounted && typeof window !== 'undefined' 
    ? (() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = mousePosition.x - centerX;
        const deltaY = mousePosition.y - centerY;
        
        // 计算角度（弧度转角度）
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // 计算距离（归一化到 0-1）
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        
        // 距离越近透明度越低（越看不见），距离越远透明度越高（越明显）
        const opacity = normalizedDistance;
        
        return { 
          gradientAngle: angle + 90, 
          distanceOpacity: opacity 
        };
      })()
    : { gradientAngle: 135, distanceOpacity: 1 }; // SSR 默认值
  
  // 平滑滚动到下一个区域
  const scrollToNext = () => {
    const nextSection = document.getElementById('team-info');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 背景由 TeamPhotoBackground 提供，这里只加额外遮罩 */}
      <div className="absolute inset-0 z-0 bg-black/30" />

      {/* 渐变叠加层 - 中速滚动，鼠标跟随线性渐变，距离控制透明度 */}
      <motion.div 
        className="absolute inset-0 z-10 transition-all duration-300 ease-out"
        style={{ y: gradientY }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: isMobile || !isMounted
              ? // 移动端或 SSR：简化的静态渐变
                'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 50%, rgba(245, 158, 11, 0.4) 100%)'
              : // 桌面端：从中心指向鼠标的线性渐变
                `linear-gradient(${gradientAngle}deg, 
                  rgba(139, 92, 246, 0.5) 0%, 
                  rgba(236, 72, 153, 0.4) 40%, 
                  rgba(245, 158, 11, 0.3) 70%, 
                  rgba(59, 130, 246, 0.2) 100%)`,
            opacity: (isMobile || !isMounted) ? 1 : distanceOpacity,
          }}
        />
      </motion.div>

      {/* 内容层 - 正常速度滚动 */}
      <motion.div 
        className="relative z-20 container mx-auto px-4 text-center"
        style={{ y: contentY }}
      >
        {/* Logo - 从下方滑入 + 淡入 */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-8 flex justify-center"
        >
          <Image
            src="https://funkandlove-main.s3.bitiful.net/public/icon.png"
            alt="Funk & Love Logo"
            width={192}
            height={192}
            priority
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 80px rgba(236, 72, 153, 0.6))',
            }}
          />
        </motion.div>

        {/* 标题 - 文字变换动画：LOCKING → LK → KL → kL → k&L → Funk&Love */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <TextMorphAnimation
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white"
            startDelay={200}
          />
        </motion.div>

        {/* Slogan - 延迟淡入 */}
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-2xl md:text-4xl lg:text-5xl font-light italic text-white mb-8"
          style={{
            textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
          }}
        >
          {SITE_CONFIG.slogan}
        </motion.p>

        {/* 描述 - 再延迟淡入 */}
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto"
          style={{
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          {SITE_CONFIG.description}
        </motion.p>
      </motion.div>

      {/* 向下滚动指示器 - 动画箭头 */}
      <motion.button
        variants={floatUp}
        initial="initial"
        animate="animate"
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer 
                   text-white/80 hover:text-white transition-colors duration-300
                   focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-2"
        aria-label="滚动到下一部分"
      >
        <ChevronDown size={48} strokeWidth={1.5} />
      </motion.button>
    </section>
  );
}
