"use client";

import { motion } from "framer-motion";
import {
  Music,
  Heart,
  Users,
  Sparkles,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { FEATURES } from "@/lib/data/team";

const ICON_MAP: Record<string, LucideIcon> = {
  Music,
  Heart,
  Users,
  Sparkles,
  Scale,
};

// 三色循环：violet / pink / amber
const ACCENTS = [
  { bg: "bg-violet-500/15", text: "text-violet-300", ring: "ring-violet-500/30" },
  { bg: "bg-pink-500/15", text: "text-pink-300", ring: "ring-pink-500/30" },
  { bg: "bg-amber-500/15", text: "text-amber-300", ring: "ring-amber-500/30" },
];

export default function MobileFeatures() {
  return (
    <section className="relative bg-neutral-950 px-6 py-16">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">团队特色</h2>
        <p className="text-sm text-white/60 mb-8">我们的四大核心优势</p>

        <div className="space-y-4">
          {FEATURES.map((f, i) => {
            const Icon = ICON_MAP[f.icon];
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`flex items-start gap-4 rounded-2xl bg-white/5 border border-white/10 p-5 ring-1 ${accent.ring}`}
              >
                <div
                  className={`shrink-0 w-12 h-12 rounded-xl ${accent.bg} flex items-center justify-center`}
                >
                  {Icon && (
                    <Icon
                      className={`w-6 h-6 ${accent.text}`}
                      strokeWidth={1.75}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {f.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
