"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * TeamSpirit 团队精神组件
 * 
 * 功能特性：
 * - 全宽背景区域，居中大字号文字
 * - 滚动驱动渐变背景，颜色随滚动位置平滑过渡
 * - 文字逐字淡入动画效果
 * - 文字动态发光效果
 * - 突出显示 Slogan 和理念
 */
export default function TeamSpirit() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 滚动驱动渐变背景
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // 背景色根据滚动位置在多个颜色间平滑过渡
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "#8b5cf6", // 紫色
      "#ec4899", // 粉色
      "#f59e0b", // 橙色
      "#3b82f6", // 蓝色
      "#10b981"  // 绿色
    ]
  );
  
  // 将 Slogan 拆分为单个字符用于逐字动画
  const sloganChars = SITE_CONFIG.slogan.split("");
  const philosophyChars = SITE_CONFIG.philosophy.split("");
  
  return (
    <motion.section
      ref={containerRef}
      id="team-spirit"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4"
      style={{
        backgroundColor
      }}
    >

      
      {/* 内容容器 */}
      <div className="relative z-20 max-w-5xl mx-auto text-center">
        {/* Slogan - 逐字淡入动画 */}
        <motion.h2
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.03
              }
            }
          }}
        >
          {sloganChars.map((char, index) => (
            <motion.span
              key={`slogan-${index}`}
              className="inline-block"
              style={{
                textShadow: `
                  0 0 20px rgba(255, 255, 255, 0.8),
                  0 0 40px rgba(255, 255, 255, 0.5),
                  0 0 60px rgba(255, 255, 255, 0.3)
                `,
                color: "#ffffff"
              }}
              variants={{
                hidden: { 
                  opacity: 0, 
                  y: 20,
                  filter: "blur(10px)"
                },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.5,
                    ease: "easeOut"
                  }
                }
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>
        
        {/* 分隔线 */}
        <motion.div
          className="w-32 h-1 mx-auto mb-8 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)"
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        
        {/* 团队理念 - 逐字淡入动画 */}
        <motion.p
          className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.6
              }
            }
          }}
        >
          {philosophyChars.map((char, index) => (
            <motion.span
              key={`philosophy-${index}`}
              className="inline-block"
              style={{
                textShadow: `
                  0 0 15px rgba(255, 255, 255, 0.6),
                  0 0 30px rgba(255, 255, 255, 0.4)
                `,
                color: "#ffffff"
              }}
              variants={{
                hidden: { 
                  opacity: 0, 
                  y: 15,
                  filter: "blur(8px)"
                },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.4,
                    ease: "easeOut"
                  }
                }
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.p>
        
        {/* 装饰性元素 - 脉动光圈 */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
            filter: "blur(30px)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.section>
  );
}
