'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { fadeInUp, floatUp } from '@/lib/animations';
import { useRef, useEffect, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { oss } from '@/lib/cdn';
import TextMorphAnimation from './TextMorphAnimation';

const subscribeViewport = (callback: () => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

const getIsMobileSnapshot = () => window.innerWidth < 768;
const getServerIsMobileSnapshot = () => true;

export default function Hero() {
  const isMobile = useSyncExternalStore(
    subscribeViewport,
    getIsMobileSnapshot,
    getServerIsMobileSnapshot
  );
  const gradientLayerRef = useRef<HTMLDivElement>(null);

  // 等首屏资源就位再淡入彩色蒙版,避免 mousemove 前的默认透明度
  // (满 opacity)与未加载完的背景图叠加产生闪烁。
  const [overlayReady, setOverlayReady] = useState(false);
  useEffect(() => {
    let rafId: number | null = null;
    const markReady = () => setOverlayReady(true);

    if (document.readyState === 'complete') {
      rafId = requestAnimationFrame(markReady);
      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }

    window.addEventListener('load', markReady);
    return () => window.removeEventListener('load', markReady);
  }, []);

  // 鼠标驱动的渐变角度/透明度：rAF 节流，直接写 CSS 变量，不触发 React 重渲染
  useEffect(() => {
    if (isMobile) return;
    const el = gradientLayerRef.current;
    if (!el) return;

    let rafId: number | null = null;
    let latestX = window.innerWidth / 2;
    let latestY = window.innerHeight / 2;
    let winW = window.innerWidth;
    let winH = window.innerHeight;

    const updateDims = () => {
      winW = window.innerWidth;
      winH = window.innerHeight;
    };

    const apply = () => {
      rafId = null;
      const cx = winW / 2;
      const cy = winH / 2;
      const dx = latestX - cx;
      const dy = latestY - cy;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.sqrt(cx * cx + cy * cy);
      const opacity = maxDist === 0 ? 1 : Math.min(dist / maxDist, 1);
      el.style.setProperty('--grad-angle', `${angle}deg`);
      el.style.setProperty('--grad-opacity', `${opacity}`);
    };

    const onMove = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(apply);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', updateDims);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', updateDims);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // 平滑滚动到下一个区域
  const scrollToNext = () => {
    const nextSection = document.getElementById('team-info');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 背景由 TeamPhotoBackground 提供，这里只加额外遮罩 */}
      <div className="absolute inset-0 z-0 bg-black/30" />

      {/* 渐变叠加层 - 中速滚动，鼠标跟随线性渐变，距离控制透明度 */}
      {/* 外层 wrapper 处理"首屏资源就位再淡入"的时序;内层 div 由鼠标驱动 opacity。两者相乘生效。 */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          opacity: overlayReady ? 1 : 0,
          transition: 'opacity 600ms ease-out',
        }}
      >
        <div
          ref={gradientLayerRef}
          className="absolute inset-0"
          style={{
            background: isMobile
              ? // 移动端或 SSR：简化的静态渐变
              'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 50%, rgba(245, 158, 11, 0.4) 100%)'
              : // 桌面端：角度/透明度由 useEffect 写入 CSS 变量驱动，避免每次 mousemove 触发 React 重渲染
              'linear-gradient(var(--grad-angle, 135deg), rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.4) 40%, rgba(245, 158, 11, 0.3) 70%, rgba(59, 130, 246, 0.2) 100%)',
            opacity: isMobile ? 1 : 'var(--grad-opacity, 1)',
          } as CSSProperties}
        />
      </motion.div>

      {/* 内容层 - 正常速度滚动 */}
      <motion.div
        className="relative z-20 container mx-auto px-4 text-center"
      >
        {/* Logo - 从下方滑入 + 淡入 */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-8 flex justify-center"
        >
          <Image
            src={oss('/icon.png')!}
            alt="Funk & Love Logo"
            width={192}
            height={192}
            priority
            className="object-contain"
            style={{
              width: 'clamp(7rem, 18vh, 12rem)',
              height: 'clamp(7rem, 18vh, 12rem)',
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
            className="font-bold text-white text-[clamp(3rem,12vh,8rem)]"
            startDelay={200}
          />
        </motion.div>

        {/* Slogan - 延迟淡入 */}
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-light italic text-white mb-8 text-[clamp(1.25rem,4vh,3rem)]"
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
          className="text-white/90 max-w-3xl mx-auto text-[clamp(1rem,2.2vh,1.5rem)]"
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
