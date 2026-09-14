"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Clock } from "lucide-react";
import { GENERATIONS } from "@/lib/data/members";
import { useReveal } from "../../hooks/useReveal";
import NextMember from "../shared/NextMember";
import MemberAvatar from "../shared/MemberAvatar";
import SectionHeader from "../ui/SectionHeader";

/**
 * 历年成员(纸面):按届折叠的编辑部列表,年份倒序,默认展开最新一届。
 * 行头:display 年份 + 芥末届数徽章 + 收集状态 + chevron;
 * 行体:3 列 MemberAvatar 网格。展开 / 收起走 framer 高度动画(D5 允许的进出场类),
 * 动画完成后刷新 ScrollTrigger,让下方段落的揭示触发点跟上新高度。
 */
export default function MobileMembers({ onJoinClick }: { onJoinClick: () => void }) {
  const ref = useReveal<HTMLElement>();
  // 倒序:最新一届在最前
  const ordered = [...GENERATIONS].reverse();
  const [expanded, setExpanded] = useState<string>(ordered[0].term);

  return (
    <section
      id="members"
      ref={ref}
      className="relative bg-paper text-ink px-6 py-16 scroll-mt-4 focus:outline-none"
    >
      <div className="max-w-md mx-auto">
        <SectionHeader
          index={5}
          eyebrow="members"
          title="队里的人"
          theme="light"
          className="mb-8"
        />

        <NextMember onJoinClick={onJoinClick} />

        <ul data-reveal className="border-t-2 border-ink">
          {ordered.map((gen) => {
            const isOpen = expanded === gen.term;
            const isCollecting = !!gen.isCollecting;
            const panelId = `members-panel-${gen.year}`;
            return (
              <li key={gen.term} className="border-b border-ink/15">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? "" : gen.term)}
                  disabled={isCollecting}
                  aria-expanded={isCollecting ? undefined : isOpen}
                  aria-controls={isCollecting ? undefined : panelId}
                  className={`w-full flex items-center justify-between gap-3 min-h-16 py-3 text-left transition-colors ${
                    isCollecting ? "cursor-default" : "active:bg-pop-500/25"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`font-display text-3xl leading-none tabular-nums ${
                        isCollecting ? "text-ink-faint" : "text-ink"
                      }`}
                    >
                      {gen.year}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        isCollecting ? "bg-paper-3 text-ink-muted" : "bg-pop-500 text-ink"
                      }`}
                    >
                      {gen.term}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-muted text-base">
                    {isCollecting ? (
                      <>
                        <Clock className="w-4 h-4" strokeWidth={2} />
                        <span>收集中</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          strokeWidth={2.25}
                        />
                      </>
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && !isCollecting && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      onAnimationComplete={() => ScrollTrigger.refresh()}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-3 gap-3 pt-1 pb-5">
                        {gen.members.map((m) => (
                          <div key={m.name} className="flex flex-col items-center">
                            <div className="w-full aspect-3/4 rounded-xl overflow-hidden bg-paper-3 border border-ink/15">
                              <MemberAvatar member={m} className="w-full h-full" />
                            </div>
                            <p className="text-sm font-bold text-ink mt-1.5 truncate w-full text-center">
                              {m.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
