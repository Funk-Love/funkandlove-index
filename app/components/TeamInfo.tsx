'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Building2, Music2, Users2, MapPin } from 'lucide-react';
import ImagePlaceholder from './ui/ImagePlaceholder';
import { slideInLeft, slideInRight } from '@/lib/animations';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * 团队信息组件
 * 展示团队基本信息，包含团队照片和详细信息
 * 实现响应式两栏布局（桌面）和单栏布局（移动）
 */
export default function TeamInfo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // 团队信息项配置
  const infoItems = [
    {
      icon: Building2,
      label: '所属组织',
      value: SITE_CONFIG.organization,
      color: 'text-purple-500'
    },
    {
      icon: Music2,
      label: '舞种类型',
      value: SITE_CONFIG.danceStyle,
      color: 'text-orange-500'
    },
    {
      icon: Users2,
      label: '团队规模',
      value: `${SITE_CONFIG.memberCount} 成员`,
      color: 'text-blue-500'
    },
    {
      icon: MapPin,
      label: '团队理念',
      value: SITE_CONFIG.philosophy,
      color: 'text-pink-500'
    }
  ];

  return (
    <section
      id="team-info"
      ref={ref}
      className="relative py-20 md:py-32 px-4 overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-linear-to-b from-neutral-50 to-white -z-10" />
      
      <div className="max-w-7xl mx-auto">
        {/* 区域标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            关于我们
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
        </motion.div>

        {/* 两栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* 左侧：团队照片 */}
          <motion.div
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            variants={slideInLeft}
            className="relative"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
              <ImagePlaceholder
                src={SITE_CONFIG.images.teamPhoto}
                alt="Funk & Love 团队合照"
                fill
                className="w-full h-full"
                imageClassName="object-cover"
                suggestedSize="1200x800px"
                placeholderText="团队合照待补充"
              />
              
              {/* 装饰元素 */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-linear-to-br from-orange-500/20 to-blue-500/20 rounded-full blur-2xl -z-10" />
            </div>
          </motion.div>

          {/* 右侧：团队信息 */}
          <motion.div
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            variants={slideInRight}
            className="space-y-8"
          >
            {/* 团队名称和 Slogan */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                {SITE_CONFIG.name}
              </h3>
              <p className="text-xl md:text-2xl font-light italic text-purple-600 mb-6">
                {SITE_CONFIG.slogan}
              </p>
              <p className="text-neutral-600 leading-relaxed text-base md:text-lg">
                {SITE_CONFIG.teamDescription}
              </p>
            </div>

            {/* 信息卡片网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="group relative bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100"
                >
                  {/* 图标 */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-br ${
                    item.color === 'text-purple-500' ? 'from-purple-100 to-purple-50' :
                    item.color === 'text-orange-500' ? 'from-orange-100 to-orange-50' :
                    item.color === 'text-blue-500' ? 'from-blue-100 to-blue-50' :
                    'from-pink-100 to-pink-50'
                  } mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  
                  {/* 标签和值 */}
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">{item.label}</p>
                    <p className="text-base font-semibold text-neutral-900">{item.value}</p>
                  </div>

                  {/* 悬停效果 */}
                  <div className="absolute inset-0 rounded-xl bg-linear-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
