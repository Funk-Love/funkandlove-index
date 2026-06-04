"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";

const FACTS = [
  { label: "所属组织", value: SITE_CONFIG.organization },
  { label: "舞种", value: SITE_CONFIG.danceStyle },
  { label: "规模", value: `${SITE_CONFIG.memberCount} 成员` },
  { label: "理念", value: SITE_CONFIG.philosophy },
];

export default function MobileTeamInfo() {
  return (
    <section
      id="mobile-team-info"
      className="relative bg-neutral-950 px-6 py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <h2 className="text-3xl font-bold text-white mb-3">关于我们</h2>
        <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 mb-6" />

        {/* Slogan */}
        <p
          className="font-light italic leading-[1.15] text-2xl mb-5"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #a78bfa 0%, #f472b6 55%, #fbbf24 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {SITE_CONFIG.slogan}
        </p>

        <p className="text-base leading-relaxed text-white/75 mb-8">
          {SITE_CONFIG.teamDescription}
        </p>

        {/* 编号事实列 — 与桌面端同款,深色版 */}
        <ul className="border-t border-white/15">
          {FACTS.map((f, i) => (
            <motion.li
              key={f.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              className="flex items-baseline gap-3 py-3.5 border-b border-white/10"
            >
              <span className="font-mono text-[11px] text-white/35 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm text-white/55 min-w-14">{f.label}</span>
              <span className="text-white font-medium ml-auto text-right text-[15px]">
                {f.value}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
