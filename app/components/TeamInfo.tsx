'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import SectionHeader from './ui/SectionHeader';
import { slideInLeft, slideInRight } from '@/lib/animations';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * 关于我们:左视频 + 右编辑式数据列(7:5 分栏)。
 * 去掉了原本的彩色图标卡片,改成 mono eyebrow + 编号数据条,更杂志风。
 */
export default function TeamInfo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const facts = [
    { label: '所属组织', value: SITE_CONFIG.organization },
    { label: '舞种', value: SITE_CONFIG.danceStyle },
    { label: '规模', value: `${SITE_CONFIG.memberCount} 成员` },
    { label: '理念', value: SITE_CONFIG.philosophy },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center py-16 lg:py-20 px-4 overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-b from-neutral-50 to-white -z-10" />

      <div className="max-w-7xl mx-auto w-full">
        {/* 标题:mono eyebrow + 大标题 + 细分隔 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6 }}
          className="mb-10 lg:mb-14"
        >
          <SectionHeader index={1} eyebrow="about" title="关于我们" theme="light" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* 左:视频 7/12 */}
          <motion.div
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            variants={slideInLeft}
            className="lg:col-span-7"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-neutral-200/70 shadow-2xl shadow-purple-500/10">
              <VideoPlayer
                src="/video/promo/master.m3u8"
                poster="/video/promo/poster.webp"
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* 右:slogan + 描述 + 数据列 5/12 */}
          <motion.div
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            variants={slideInRight}
            className="lg:col-span-5"
          >
            {/* Slogan,渐变文字,作主视觉 */}
            <p
              className="font-light italic leading-[1.15] text-[clamp(1.5rem,3.4vh,2.25rem)] mb-6"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #8b5cf6 0%, #ec4899 55%, #f59e0b 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {SITE_CONFIG.slogan}
            </p>

            <p className="text-neutral-600 leading-relaxed text-[clamp(0.95rem,1.95vh,1.0625rem)] mb-8">
              {SITE_CONFIG.teamDescription}
            </p>

            {/* 数据条 — 无卡片,只用上下边线分隔 */}
            <ul className="border-t border-neutral-300/70">
              {facts.map((f, i) => (
                <motion.li
                  key={f.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-baseline gap-4 py-3.5 border-b border-neutral-200"
                >
                  <span className="font-mono text-[11px] text-neutral-400 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-neutral-500 min-w-14">
                    {f.label}
                  </span>
                  <span className="text-neutral-900 font-medium ml-auto text-right text-[15px]">
                    {f.value}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
