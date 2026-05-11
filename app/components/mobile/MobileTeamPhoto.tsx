"use client";

import VideoPlayer from "../VideoPlayer";

export default function MobileTeamPhoto() {
  return (
    <section className="relative bg-neutral-950 px-6 pb-16">
      <div className="max-w-md mx-auto">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
          <VideoPlayer
            src="/video/promo/master.m3u8"
            poster="/video/promo/poster.webp"
            className="w-full h-full"
          />
        </div>
        <p className="text-sm text-white/60 mt-3 text-center">
          2026 队宣 · Funk &amp; Love
        </p>
      </div>
    </section>
  );
}
