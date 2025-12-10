'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, ExternalLink, ChevronDown } from 'lucide-react';
import { SITE_CONFIG, NAV_LINKS } from '@/lib/constants';
import { fadeInUp } from '@/lib/animations';

/**
 * MobileView Component
 * 
 * 移动端专用视图：
 * - 全屏Hero背景
 * - 简化的导航链接
 * - PC端浏览提示
 */
export default function MobileView() {
  const [expandedActivities, setExpandedActivities] = useState(false);
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* 背景图片层 - 固定全屏 */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SITE_CONFIG.images.hero}
          alt="Funk & Love"
          className="w-full h-full object-cover object-center"
        />
        {/* 深色遮罩层 */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* 渐变叠加层 */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 50%, rgba(245, 158, 11, 0.4) 100%)',
        }}
      />

      {/* 内容层 */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Hero 内容区域 - 居中 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Logo */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://funkandlove-main.s3.bitiful.net/public/icon.png"
              alt="Funk & Love Logo"
              className="w-24 h-24 object-contain"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 60px rgba(236, 72, 153, 0.6))',
              }}
            />
          </motion.div>

          {/* 标题 */}
          <motion.h1
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl font-bold text-white mb-4 text-center"
            style={{
              textShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(236, 72, 153, 0.6)',
            }}
          >
            {SITE_CONFIG.name}
          </motion.h1>

          {/* Slogan */}
          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl font-light italic text-white mb-3 text-center"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
            }}
          >
            {SITE_CONFIG.slogan}
          </motion.p>

          {/* 描述 */}
          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base text-white/90 text-center mb-8"
            style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            {SITE_CONFIG.description}
          </motion.p>

          {/* PC端浏览提示 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 max-w-sm"
          >
            <div className="flex items-start gap-3 mb-3">
              <Monitor className="w-6 h-6 text-purple-300 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  完整首页请前往PC端浏览
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  手机端由于精力和技术原因并没有着重设计，建议使用电脑访问以获得最佳体验。
                </p>
              </div>
            </div>
          </motion.div>

          {/* 快速访问表单 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 1.0, duration: 0.6 }}
            className="w-full max-w-sm"
          >
            <h3 className="text-white/90 text-sm font-medium mb-3 text-center">
              快速访问
            </h3>
            <div className="space-y-2">
              {NAV_LINKS.filter(link => link.url || link.subLinks).map((link) => (
                <div key={link.id}>
                  {link.url ? (
                    // 直接外部链接
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-5 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 active:bg-white/25 transition-all duration-300"
                    >
                      <span className="font-medium">{link.label}</span>
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                  ) : link.subLinks ? (
                    // 带子菜单的活动链接
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedActivities(!expandedActivities)}
                        className="flex items-center justify-between w-full px-5 py-3.5 text-white hover:bg-white/10 active:bg-white/15 transition-all duration-300"
                      >
                        <span className="font-medium">{link.label}</span>
                        <ChevronDown 
                          className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                            expandedActivities ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      <AnimatePresence>
                        {expandedActivities && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden border-t border-white/10"
                          >
                            <div className="p-2 space-y-1.5">
                              {link.subLinks.map((subLink, index) => (
                                <motion.a
                                  key={subLink.id}
                                  href={subLink.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center justify-between w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 active:bg-white/15 rounded-lg text-white/90 transition-all duration-200"
                                >
                                  <span className="flex items-center gap-2 text-sm">
                                    <span>{subLink.icon || "📌"}</span>
                                    {subLink.label}
                                  </span>
                                  <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                </motion.a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 底部版权信息和备案号 */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 1.2, duration: 0.6 }}
          className="relative z-20 py-6 text-center space-y-2"
        >
          <p className="text-white/60 text-xs">
            © 2025 Funk & Love. All rights reserved.
          </p>
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 text-xs hover:text-white/70 transition-colors inline-block"
          >
            浙ICP备2025210475号
          </a>
        </motion.div>
      </div>
    </div>
  );
}
