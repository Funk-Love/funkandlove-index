'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { floatUp } from '@/lib/animations';
import { useMousePosition } from '@/lib/gradients';
import { useEffect, useState, useRef } from 'react';

/**
 * 开屏动画阶段
 */
type IntroPhase = 'locking' | 'fadeOut' | 'move' | 'reveal' | 'done';

/**
 * 开屏加载动画组件
 */
function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<IntroPhase>('locking');
  
  // L 和 K 的最终位置（相对于视口中心的偏移）
  const [targetPositions, setTargetPositions] = useState({ 
    l: { x: 0, y: 0 }, 
    k: { x: 0, y: 0 } 
  });
  
  // 计算 L 和 K 在 "Funk & Love" 中的目标位置
  useEffect(() => {
    const calculatePositions = () => {
      // 获取视口尺寸
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // 估算最终标题的字体大小和位置
      // 标题在视口中心，字体大小根据屏幕宽度变化
      const fontSize = vw < 768 ? vw * 0.12 : vw < 1024 ? vw * 0.1 : vw * 0.08;
      
      // "Funk & Love" 中 L 在第 8 个字符位置（从 0 开始，包括空格和 &）
      // F-u-n-k- -&- -L-o-v-e
      // 0 1 2 3 4 5 6 7 8 9 10
      // L 在位置 7，K 在位置 3
      
      // 估算每个字符的宽度（等宽字体约为 fontSize * 0.6）
      const charWidth = fontSize * 0.55;
      const totalWidth = charWidth * 11; // "Funk & Love" 11个字符
      
      // 标题起始 X 位置（居中）
      const startX = (vw - totalWidth) / 2;
      
      // L 的位置 (第 7 个字符，0-indexed)
      const lX = startX + charWidth * 7 + charWidth / 2 - vw / 2;
      
      // K 的位置 (第 3 个字符)
      const kX = startX + charWidth * 3 + charWidth / 2 - vw / 2;
      
      // Y 位置：标题大约在视口中心偏上
      const titleY = vh * 0.35 - vh / 2;
      
      setTargetPositions({
        l: { x: lX, y: titleY },
        k: { x: kX, y: titleY }
      });
    };
    
    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    return () => window.removeEventListener('resize', calculatePositions);
  }, []);
  
  // 动画时序控制
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // 阶段 1: 显示 LOCKING (1s)
    timers.push(setTimeout(() => setPhase('fadeOut'), 1000));
    
    // 阶段 2: O C I N G 淡出 (0.5s)
    timers.push(setTimeout(() => setPhase('move'), 1500));
    
    // 阶段 3: L K 移动到位 (0.8s)
    timers.push(setTimeout(() => setPhase('reveal'), 2300));
    
    // 阶段 4: 完成，通知父组件
    timers.push(setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2800));
    
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);
  
  // LOCKING 字母配置
  const letters = ['L', 'O', 'C', 'K', 'I', 'N', 'G'];
  const keepLetters = ['L', 'K']; // 保留的字母
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: phase === 'reveal' || phase === 'done' ? 0 : 1,
        pointerEvents: phase === 'done' ? 'none' : 'auto'
      }}
      transition={{ duration: 0.5 }}
    >
      {/* LOCKING 字母 */}
      <div className="relative flex items-center justify-center">
        {letters.map((letter, index) => {
          const isKeep = keepLetters.includes(letter);
          const isL = letter === 'L';
          const isK = letter === 'K';
          
          // 计算初始位置（居中排列）
          const initialX = (index - 3) * (typeof window !== 'undefined' 
            ? Math.min(window.innerWidth * 0.12, 120) 
            : 100);
          
          // 目标位置
          let targetX = initialX;
          let targetY = 0;
          
          if (phase === 'move' || phase === 'reveal' || phase === 'done') {
            if (isL) {
              targetX = targetPositions.l.x;
              targetY = targetPositions.l.y;
            } else if (isK) {
              targetX = targetPositions.k.x;
              targetY = targetPositions.k.y;
            }
          }
          
          // 是否应该淡出
          const shouldFadeOut = !isKeep && (phase === 'fadeOut' || phase === 'move' || phase === 'reveal' || phase === 'done');
          
          // 缩放：从大变小
          const scale = (phase === 'move' || phase === 'reveal' || phase === 'done') && isKeep ? 0.6 : 1;
          
          return (
            <motion.span
              key={`${letter}-${index}`}
              className="absolute text-white font-bold"
              style={{
                fontSize: 'clamp(60px, 15vw, 150px)',
                textShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(236, 72, 153, 0.6)',
              }}
              initial={{ 
                x: initialX, 
                y: 0, 
                opacity: 0,
                scale: 1.2
              }}
              animate={{ 
                x: targetX,
                y: targetY,
                opacity: shouldFadeOut ? 0 : 1,
                scale: scale,
              }}
              transition={{ 
                duration: phase === 'locking' ? 0.6 : 0.8,
                delay: phase === 'locking' ? index * 0.08 : 0,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {letter}
            </motion.span>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const mousePosition = useMousePosition();
  const [isMobile, setIsMobile] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 标记客户端挂载
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 检测是否为移动设备
  useEffect(() => {
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
  
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const gradientY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  
  // 计算渐变角度和透明度
  const { gradientAngle, distanceOpacity } = isMounted && typeof window !== 'undefined' 
    ? (() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = mousePosition.x - centerX;
        const deltaY = mousePosition.y - centerY;
        
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        
        return { 
          gradientAngle: angle + 90, 
          distanceOpacity: normalizedDistance 
        };
      })()
    : { gradientAngle: 135, distanceOpacity: 1 };
  
  const scrollToNext = () => {
    const nextSection = document.getElementById('team-info');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleIntroComplete = () => {
    setIntroComplete(true);
    // 延迟移除 intro 组件
    setTimeout(() => setShowIntro(false), 500);
  };

  return (
    <>
      {/* 开屏动画 */}
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>
      
      <section
        ref={containerRef}
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* 背景遮罩 */}
        <div className="absolute inset-0 z-0 bg-black/30" />

        {/* 渐变叠加层 */}
        <motion.div 
          className="absolute inset-0 z-10 transition-all duration-300 ease-out"
          style={{ y: gradientY }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: isMobile || !isMounted
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 50%, rgba(245, 158, 11, 0.4) 100%)'
                : `linear-gradient(${gradientAngle}deg, 
                    rgba(139, 92, 246, 0.5) 0%, 
                    rgba(236, 72, 153, 0.4) 40%, 
                    rgba(245, 158, 11, 0.3) 70%, 
                    rgba(59, 130, 246, 0.2) 100%)`,
              opacity: (isMobile || !isMounted) ? 1 : distanceOpacity,
            }}
          />
        </motion.div>

        {/* 内容层 - 等待开屏动画完成后淡入 */}
        <motion.div 
          className="relative z-20 container mx-auto px-4 text-center"
          style={{ y: contentY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: introComplete ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 flex justify-center"
          >
            <img
              src="https://funkandlove-main.s3.bitiful.net/public/icon.png"
              alt="Funk & Love Logo"
              className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 80px rgba(236, 72, 153, 0.6))',
              }}
            />
          </motion.div>

          {/* 标题 - Funk & Love */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6"
            style={{
              textShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(236, 72, 153, 0.6)',
            }}
          >
            {SITE_CONFIG.name}
          </motion.h1>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-2xl md:text-4xl lg:text-5xl font-light italic text-white mb-8"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
            }}
          >
            {SITE_CONFIG.slogan}
          </motion.p>

          {/* 描述 */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto"
            style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            {SITE_CONFIG.description}
          </motion.p>
        </motion.div>

        {/* 向下滚动指示器 */}
        <motion.button
          variants={floatUp}
          initial="initial"
          animate={introComplete ? "animate" : "initial"}
          onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer 
                     text-white/80 hover:text-white transition-colors duration-300
                     focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-2"
          aria-label="滚动到下一部分"
        >
          <ChevronDown size={48} strokeWidth={1.5} />
        </motion.button>
      </section>
    </>
  );
}
