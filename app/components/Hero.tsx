'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { fadeInUp, floatUp } from '@/lib/animations';
import { useMousePosition, getMousePercentage } from '@/lib/gradients';
import ImagePlaceholder from './ui/ImagePlaceholder';
import { useEffect, useState, useRef } from 'react';

export default function Hero() {
  const mousePosition = useMousePosition();
  const [isMobile, setIsMobile] = useState(true); // 默认为移动端，避免水合不匹配
  const [isMounted, setIsMounted] = useState(false); // 追踪是否已挂载
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 检测是否为移动设备
  useEffect(() => {
    setIsMounted(true); // 标记为已挂载
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 视差滚动效果
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // 背景图片滚动速度（慢）
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  // 内容滚动速度（正常）
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  
  // 渐变层滚动速度（介于两者之间）
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
      {/* 背景图片层 - 慢速滚动 */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <ImagePlaceholder
          src={SITE_CONFIG.images.hero}
          alt="Funk & Love Hero Background"
          fill
          priority
          className="w-full h-full"
          suggestedSize="1920x1080px (16:9)"
        />
        {/* 深色遮罩层 - 确保文字可读性 */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

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
        {/* 标题 - 从下方滑入 + 淡入 */}
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6"
          style={{
            textShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(236, 72, 153, 0.6)',
          }}
        >
          {SITE_CONFIG.name}
        </motion.h1>

        {/* Slogan - 延迟淡入 */}
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3, duration: 0.6 }}
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
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto"
          style={{
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          {SITE_CONFIG.description}
        </motion.p>
        
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mt-4"
          style={{
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          {SITE_CONFIG.philosophy}
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
