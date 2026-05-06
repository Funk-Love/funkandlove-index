"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, Users } from "lucide-react";
import { GENERATIONS } from "@/lib/data/members";
import MemberAvatar from "../shared/MemberAvatar";

/**
 * 移动端历年成员 — accordion 折叠，年份倒序，默认展开最新一届。
 */
export default function MobileMembers() {
  // 倒序：最新（25届）在最前
  const ordered = [...GENERATIONS].reverse();
  const [expanded, setExpanded] = useState<string>(ordered[0].term);

  return (
    <section className="relative bg-neutral-950 px-6 py-16">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">历年成员</h2>
        <p className="text-sm text-white/60 mb-8">
          每一届都是独特的记忆，每一位都是珍贵的伙伴
        </p>

        <div className="space-y-2">
          {ordered.map((gen) => {
            const isOpen = expanded === gen.term;
            const isCollecting = gen.isCollecting;
            return (
              <div
                key={gen.term}
                className={`rounded-2xl border overflow-hidden transition-colors ${
                  isCollecting
                    ? "bg-neutral-900/40 border-white/5"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <button
                  onClick={() => setExpanded(isOpen ? "" : gen.term)}
                  disabled={isCollecting}
                  className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left active:bg-white/5 disabled:cursor-default"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-lg font-bold ${
                        isCollecting ? "text-white/40" : "text-white"
                      }`}
                    >
                      {gen.term}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isCollecting
                          ? "bg-white/5 text-white/40"
                          : "bg-violet-500/20 text-violet-300"
                      }`}
                    >
                      {gen.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    {isCollecting ? (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>收集中</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        <span>{gen.members.length}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && !isCollecting && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-white/10"
                    >
                      <div className="grid grid-cols-3 gap-3 p-4">
                        {gen.members.map((m) => (
                          <div key={m.name} className="flex flex-col items-center">
                            <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-neutral-800 border border-white/5">
                              <MemberAvatar
                                member={m}
                                thumbnail={false}
                                className="w-full h-full"
                              />
                            </div>
                            <p className="text-xs text-white/80 mt-1.5 truncate w-full text-center">
                              {m.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
