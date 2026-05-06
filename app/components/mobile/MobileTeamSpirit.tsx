"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * 移动端团队精神 — 静态终态文字，不做逐字 / 滚动驱动颜色动画。
 */
export default function MobileTeamSpirit() {
  return (
    <section
      className="relative px-6 py-20 text-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)",
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-black text-white mb-6"
        style={{
          textShadow:
            "0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.3)",
        }}
      >
        {SITE_CONFIG.slogan}
      </motion.h2>

      <div className="w-20 h-0.5 mx-auto bg-white/70 rounded-full mb-6" />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-2xl font-light text-white tracking-wide"
        style={{ textShadow: "0 0 15px rgba(255,255,255,0.4)" }}
      >
        {SITE_CONFIG.philosophy}
      </motion.p>
    </section>
  );
}
