"use client";

import { SITE_CONFIG } from "@/lib/constants";

export default function MobileTeamPhoto() {
  return (
    <section className="relative bg-neutral-950 px-6 pb-16">
      <div className="max-w-md mx-auto">
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
          <img
            src={SITE_CONFIG.images.teamPhoto}
            alt="Funk & Love 团队合照"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-white/60 mt-3 text-center">
          一群因 Locking 相聚的伙伴
        </p>
      </div>
    </section>
  );
}
