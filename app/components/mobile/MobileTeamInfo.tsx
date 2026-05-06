"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";
import { GENERATIONS } from "@/lib/data/members";

const STATS = [
  { value: SITE_CONFIG.memberCount, label: "队员" },
  { value: `${GENERATIONS.length}`, label: "届" },
  { value: "1", label: "团队精神" },
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

        <p className="text-base leading-relaxed text-white/80 mb-10">
          {SITE_CONFIG.teamDescription}
        </p>

        <div className="grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center"
            >
              <div className="text-2xl font-bold bg-gradient-to-br from-violet-400 to-pink-400 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-xs text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
