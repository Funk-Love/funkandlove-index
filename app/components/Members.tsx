"use client";

import { useState } from "react";
import { Users, Clock, ArrowRight } from "lucide-react";
import { GENERATIONS } from "@/lib/data/members";
import type { Generation as GenerationData } from "@/lib/types";
import { useReveal } from "../hooks/useReveal";
import SectionHeader from "./ui/SectionHeader";
import DetailSheet, { DEFAULT_PANEL } from "./shared/DetailSheet";
import NextMember from "./shared/NextMember";
import MemberAvatar from "./shared/MemberAvatar";

/**
 * 成员详情弹窗内容:纸面面板(DetailSheet 默认),顶部 accent→pop 色条,成员 3:4 纸框网格。
 */
function MembersModalBody({ generation }: { generation: GenerationData }) {
  return (
    <div className="flex flex-col max-h-[85vh]">
      <div className="h-1.5 shrink-0 bg-linear-to-r from-accent-500 via-pop-500 to-accent-500" />

      {/* 头部 */}
      <div className="shrink-0 px-8 pt-7 pb-5 border-b border-ink/15">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-pop-500/30 border border-ink/10">
            <Users className="w-7 h-7 text-accent-600" strokeWidth={2} />
          </div>
          <div>
            <p className="font-mono text-xs tracking-[0.12em] uppercase text-ink-muted">
              class of {generation.year}
            </p>
            <h3 className="font-display text-ink leading-tight text-[clamp(1.5rem,3.2vh,2rem)]">
              {generation.term}成员
            </h3>
            <p className="text-ink-muted text-sm mt-0.5">
              {generation.year}年入队 · {generation.members.length}位成员
            </p>
          </div>
        </div>
      </div>

      {/* 成员网格 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-7">
        {generation.isCollecting ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="w-14 h-14 text-ink-faint mb-4" strokeWidth={1.5} />
            <p className="text-xl font-bold text-ink-2">正在收集历史资料中...</p>
            <p className="text-ink-muted mt-2">如果你有这一届的照片，欢迎联系我们</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {generation.members.map((member) => (
              <figure key={member.name} className="group">
                <div className="aspect-3/4 rounded-xl overflow-hidden bg-paper-2 border border-ink/15 transition-[border-color,box-shadow] duration-200 group-hover:border-ink group-hover:shadow-paper-sm">
                  <MemberAvatar
                    member={member}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-2 text-center text-ink font-bold text-sm">
                  {member.name}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 时间线节点:左侧年份(display 字体)+ 芥末黄节点 + 右侧届次卡。
 * 可点击的届次是 <button>;资料收集中的届次是静态 div(虚线框)。
 */
function TimelineNode({
  generation,
  onClick,
}: {
  generation: GenerationData;
  onClick: () => void;
}) {
  const isCollecting = generation.isCollecting;
  const memberCount = generation.members.length;

  return (
    <div data-reveal className="relative grid grid-cols-[4.5rem_1.5rem_1fr] sm:grid-cols-[6rem_1.5rem_1fr] items-start gap-x-3 sm:gap-x-4">
      {/* 年份 */}
      <span
        className={`font-display leading-none pt-3 text-right tabular-nums text-[clamp(1.25rem,2.6vh,1.75rem)] ${
          isCollecting ? "text-ink-faint" : "text-ink"
        }`}
      >
        {generation.year}
      </span>

      {/* 节点 */}
      <span className="flex justify-center pt-4">
        <span
          className={`block w-4 h-4 rounded-full border-2 ${
            isCollecting ? "bg-paper border-ink/30" : "bg-pop-500 border-ink"
          }`}
        />
      </span>

      {/* 卡片 */}
      {isCollecting ? (
        <div className="rounded-2xl border border-dashed border-ink/25 px-5 py-4 flex items-center justify-between gap-4">
          <span className="font-display text-ink-faint text-[clamp(1.1rem,2.3vh,1.4rem)]">
            {generation.term}
          </span>
          <span className="flex items-center gap-2 text-ink-muted text-sm">
            <Clock className="w-4 h-4" strokeWidth={2} />
            历史资料收集中
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-label={`查看${generation.term}全部成员`}
          className="group w-full text-left rounded-2xl border border-ink/15 bg-paper-2 px-5 py-4 transition-[translate,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-paper-sm"
        >
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="font-display text-ink leading-none text-[clamp(1.25rem,2.8vh,1.75rem)]">
              {generation.term}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* 头像预览 */}
            <div className="flex items-center -space-x-2.5">
              {generation.members.slice(0, 6).map((member, idx) => (
                <span
                  key={member.name}
                  className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-paper bg-paper-3"
                  style={{ zIndex: 10 - idx }}
                >
                  <MemberAvatar member={member} thumbnail className="w-full h-full" />
                </span>
              ))}
              {memberCount > 6 && (
                <span className="relative w-10 h-10 rounded-full bg-ink text-paper border-2 border-paper flex items-center justify-center text-xs font-bold">
                  +{memberCount - 6}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-ink-muted transition-colors duration-200 group-hover:text-accent-600">
              全部成员
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={2.5}
              />
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

/**
 * 历年成员(section 05,纸面,自由滚动):左 4/12 粘性标题 + 互动名牌,右 8/12 海报式纵向时间轴。
 * 弹窗走 DetailSheet(ESC / 蒙层关闭、body 锁滚、data-modal-open 暂停吸附)。
 */
export default function Members({ onJoinClick }: { onJoinClick: () => void }) {
  const [selectedGeneration, setSelectedGeneration] = useState<GenerationData | null>(null);
  const revealRef = useReveal<HTMLDivElement>();


  return (
    <>
      <div
        ref={revealRef}
        className="relative w-full px-6 sm:px-8 lg:px-12 pt-[clamp(6.5rem,12vh,8rem)] pb-[clamp(4rem,10vh,6rem)]"
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 gap-y-10 lg:grid-editorial lg:gap-y-0">
          {/* 左:标题 + 下一位成员的名牌(桌面粘性) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <SectionHeader
              index={5}
              eyebrow="members"
              title="队里的人"
              theme="light"
            />

            <NextMember onJoinClick={onJoinClick} />

            <p data-reveal className="mt-[clamp(1.5rem,4vh,2.5rem)] text-sm text-ink-muted">
              点击任一届次查看全部成员
            </p>
          </div>

          {/* 右:时间轴 */}
          <div className="lg:col-span-8 relative">
            {/* 纵向墨线:对齐节点列 */}
            <div
              aria-hidden
              className="absolute top-4 bottom-4 w-0.5 bg-ink/20 left-[5.9375rem] sm:left-[7.6875rem]"
            />
            <div className="space-y-[clamp(1rem,2.5vh,1.75rem)]">
              {GENERATIONS.map((generation) => (
                <TimelineNode
                  key={generation.term}
                  generation={generation}
                  onClick={() => !generation.isCollecting && setSelectedGeneration(generation)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 成员详情弹窗 */}
      <DetailSheet
        open={selectedGeneration !== null}
        onClose={() => setSelectedGeneration(null)}
        variant="modal"
        panelClassName={`${DEFAULT_PANEL} lg:max-w-4xl`}
        ariaLabel={selectedGeneration ? `${selectedGeneration.term}成员` : "成员详情"}
      >
        {selectedGeneration && <MembersModalBody generation={selectedGeneration} />}
      </DetailSheet>
    </>
  );
}
