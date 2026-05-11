"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { oss } from "@/lib/cdn";

const HERO_LQIP = "/images/team-bg-lqip.webp";
import { fadeInUp } from "@/lib/animations";

export default function MobileHero() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const scrollToNext = () => {
    document
      .getElementById("mobile-team-info")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="mobile-hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-16"
    >
      {/* 背景图 + LQIP 兜底 */}
      <div className="absolute inset-0 z-0">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${HERO_LQIP})`,
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        />
        <img
          src={oss(SITE_CONFIG.images.hero)}
          alt=""
          aria-hidden="true"
          onLoad={() => setBgLoaded(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
            bgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* 渐变蒙层（静态，不跟手） */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.4) 50%, rgba(245,158,11,0.4) 100%)",
        }}
      />

      <div className="relative z-20 flex flex-col items-center text-center max-w-md w-full">
        <motion.img
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          src={oss("/icon.png")}
          alt="Funk & Love Logo"
          className="w-28 h-28 object-contain mb-6"
          style={{
            filter:
              "drop-shadow(0 0 30px rgba(139,92,246,0.8)) drop-shadow(0 0 60px rgba(236,72,153,0.6))",
          }}
        />

        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl font-bold mb-4"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "0 0 30px rgba(139,92,246,0.6)",
          }}
        >
          {SITE_CONFIG.name}
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg italic font-light text-white mb-3"
          style={{ textShadow: "0 0 20px rgba(255,255,255,0.5)" }}
        >
          {SITE_CONFIG.slogan}
        </motion.p>

        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-base text-white/90 leading-relaxed"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
        >
          {SITE_CONFIG.description}
        </motion.p>
      </div>

      {/* 向下箭头 */}
      <button
        onClick={scrollToNext}
        aria-label="向下滚动"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/70 active:text-white p-2"
      >
        <ChevronDown className="w-8 h-8 animate-bounce" strokeWidth={1.5} />
      </button>
    </section>
  );
}
