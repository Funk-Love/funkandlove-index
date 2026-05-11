"use client";

import { useState } from "react";
import Image from "next/image";
import { oss } from "@/lib/cdn";

const IMAGE_URL = oss("/images/team-bg.jpg")!;
const LQIP_URL = "/images/team-bg-lqip.webp";

/**
 * 固定的团队照片背景层
 * 一直显示在最底层,各 section 用自己的背景遮挡。
 * LQIP 兜底:主图加载前先吐一张极小模糊缩略图,避免首屏纯黑。
 */
export default function TeamPhotoBackground() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* LQIP 兜底层:始终在底,主图加载完仍保留(被覆盖) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${LQIP_URL})`,
          filter: "blur(20px)",
          transform: "scale(1.1)",
        }}
      />
      <Image
        src={IMAGE_URL}
        alt="Funk & Love 团队合照"
        fill
        priority
        sizes="100vw"
        onLoad={() => setLoaded(true)}
        className={`object-cover object-center transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
