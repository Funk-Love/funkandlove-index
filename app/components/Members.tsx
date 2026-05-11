"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { X, Users, Clock, ChevronDown } from "lucide-react";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { GENERATIONS } from "@/lib/data/members";
import { asset } from "@/lib/cdn";
import SectionHeader from "./ui/SectionHeader";
import type { Generation as GenerationData } from "@/lib/types";
import MemberAvatar from "./shared/MemberAvatar";

/**
 * 成员详情弹窗
 */
function MembersModal({
  generation,
  onClose,
}: {
  generation: GenerationData | null;
  onClose: () => void;
}) {
  if (!generation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, pointerEvents: "none" as const }}
      animate={{ opacity: 1, pointerEvents: "auto" as const }}
      exit={{ opacity: 0, pointerEvents: "none" as const }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
      data-modal-open="true"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="relative max-w-4xl w-full max-h-[85vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部渐变装饰 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 头部 */}
        <div className="p-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">{generation.term}成员</h3>
              <p className="text-gray-400 mt-1">{generation.year}年入队 · {generation.members.length}位成员</p>
            </div>
          </div>
        </div>

        {/* 成员网格 */}
        <div className="p-8 overflow-y-auto max-h-[calc(85vh-140px)]">
          {generation.isCollecting ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-xl text-gray-400">正在收集历史资料中...</p>
              <p className="text-gray-500 mt-2">如果你有这一届的照片，欢迎联系我们</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {generation.members.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative"
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-800 border border-white/5 group-hover:border-purple-500/50 transition-all duration-300">
                    <img
                      src={asset(member.image)}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {/* 名字 */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-medium text-center">{member.name}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}


/**
 * 时间线节点组件 - 优化版：移除无限循环动画，使用 CSS 过渡
 */
function TimelineNode({
  generation,
  index,
  isLast,
  onClick,
  isVisible,
}: {
  generation: GenerationData;
  index: number;
  isLast: boolean;
  onClick: () => void;
  isVisible: boolean;
}) {
  const isCollecting = generation.isCollecting;
  const memberCount = generation.members.length;

  return (
    <div
      className={`relative flex items-start gap-6 group transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* 时间线 */}
      <div className="flex flex-col items-center">
        {/* 节点圆点 - 移除无限脉冲动画 */}
        <div
          className={`relative z-10 w-5 h-5 rounded-full border-2 transition-all duration-300 hover:scale-125 ${isCollecting
              ? "border-gray-500 bg-neutral-800"
              : "border-purple-500 bg-purple-500/20 group-hover:bg-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/50"
            }`}
        />
        {/* 连接线 */}
        {!isLast && (
          <div className={`w-0.5 h-[clamp(5rem,14vh,10rem)] ${isCollecting ? "bg-gray-700" : "bg-gradient-to-b from-purple-500/50 to-transparent"}`} />
        )}
      </div>

      {/* 内容卡片 - 使用 CSS hover 代替 motion */}
      <div
        onClick={onClick}
        className={`flex-1 cursor-pointer rounded-2xl p-6 transition-all duration-300 border hover:translate-x-2 ${isCollecting
            ? "bg-neutral-800/30 border-gray-700/50 hover:border-gray-600"
            : "bg-neutral-800/50 border-white/5 hover:border-purple-500/50 hover:bg-neutral-800/80 hover:shadow-xl hover:shadow-purple-500/10"
          }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className={`font-bold text-[clamp(1.25rem,2.8vh,1.75rem)] ${isCollecting ? "text-gray-500" : "text-white"}`}>
              {generation.term}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full ${isCollecting
                ? "bg-gray-700/50 text-gray-500"
                : "bg-purple-500/20 text-purple-300"
              }`}>
              {generation.year}
            </span>
          </div>
          {!isCollecting && (
            <div className="flex items-center gap-2 text-gray-400 group-hover:text-purple-300 transition-colors">
              <Users className="w-4 h-4" />
              <span className="text-sm">{memberCount}人</span>
            </div>
          )}
        </div>

        {isCollecting ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">历史资料收集中...</span>
          </div>
        ) : (
          <>
            {/* 成员头像预览 - 使用压缩缩略图 */}
            <div className="flex items-center -space-x-3">
              {generation.members.slice(0, 6).map((member, idx) => (
                <div
                  key={member.name}
                  className={`relative w-10 h-10 rounded-full overflow-hidden border-2 border-neutral-900 bg-neutral-700 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                  style={{ zIndex: 10 - idx, transitionDelay: `${(index * 80) + (idx * 50)}ms` }}
                >
                  <MemberAvatar
                    member={member}
                    className="w-full h-full"
                  />
                </div>
              ))}
              {memberCount > 6 && (
                <div className="relative w-10 h-10 rounded-full bg-neutral-700 border-2 border-neutral-900 flex items-center justify-center">
                  <span className="text-xs text-gray-400">+{memberCount - 6}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-3 group-hover:text-gray-400 transition-colors">
              点击查看全部成员 →
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * 历年成员 Section - 优化版：使用 IntersectionObserver 代替 useScroll
 */
export default function Members() {
  const [selectedGeneration, setSelectedGeneration] = useState<GenerationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 弹窗打开时锁定 body 滚动
  useBodyScrollLock(selectedGeneration !== null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 使用 IntersectionObserver 代替 useScroll，大幅减少计算
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={containerRef}
        className="relative min-h-screen bg-neutral-900 pt-[12vh] pb-24 md:pt-[10vh] overflow-hidden"
      >
        {/* 背景装饰 - 减小尺寸和模糊程度 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-2xl" />
        </div>

        <div className={`relative z-10 max-w-4xl mx-auto px-8 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* 标题 - 使用 CSS 动画代替 motion */}
          <div
            className={`text-center mb-[clamp(2rem,6vh,4rem)] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <SectionHeader
              index={5}
              eyebrow="members"
              title="历年成员"
              subtitle="每一届都是独特的记忆,每一位都是珍贵的伙伴"
              theme="dark"
              align="center"
            />
            {/* 移除无限循环动画，改用 CSS animation */}
            <div className="mt-[clamp(1rem,3vh,2rem)] animate-bounce">
              <ChevronDown className="w-8 h-8 text-gray-500 mx-auto" />
            </div>
          </div>

          {/* 时间线 */}
          <div className="space-y-2">
            {GENERATIONS.map((generation, index) => (
              <TimelineNode
                key={generation.term}
                generation={generation}
                index={index}
                isLast={index === GENERATIONS.length - 1}
                onClick={() => !generation.isCollecting && setSelectedGeneration(generation)}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 成员详情弹窗 */}
      <AnimatePresence>
        {selectedGeneration && (
          <MembersModal
            generation={selectedGeneration}
            onClose={() => setSelectedGeneration(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
