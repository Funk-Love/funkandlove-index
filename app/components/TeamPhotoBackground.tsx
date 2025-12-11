"use client";

const IMAGE_URL = "https://funkandlove-main.s3.bitiful.net/index/team-bg.jpg";

/**
 * 固定的团队照片背景层
 * 一直显示在最底层，各 section 用自己的背景遮挡
 */
export default function TeamPhotoBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <img
        src={IMAGE_URL}
        alt="Funk & Love 团队合照"
        className="w-full h-full object-cover object-center"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
