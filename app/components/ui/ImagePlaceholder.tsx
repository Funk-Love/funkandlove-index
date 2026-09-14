"use client";

import Image from "next/image";
import { useState } from "react";
import { oss } from "@/lib/cdn";

interface ImagePlaceholderProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  placeholderText?: string;
  suggestedSize?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  rounded?: boolean;
}

/**
 * 带占位 / 骨架的图片:纸面第三层级(paper-3)做底,缺图时显示墨色提示文字。
 */
export default function ImagePlaceholder({
  src,
  alt,
  width,
  height,
  className = "",
  imageClassName = "",
  placeholderText = "404 - 图片待补充",
  suggestedSize,
  fill = false,
  sizes,
  priority = false,
  rounded = true,
}: ImagePlaceholderProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const radius = rounded ? "rounded-xl" : "";

  // 没有 src 或加载失败:显示占位符
  if (imageError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-paper-3 border border-dashed border-ink/25 ${radius} ${className}`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <div className="text-center p-8">
          <p className="font-mono text-xs tracking-[0.12em] uppercase text-ink-muted mb-2">
            placeholder
          </p>
          <p className="text-ink font-bold text-lg">{placeholderText}</p>
          {suggestedSize && (
            <p className="text-ink-muted text-sm mt-2">建议尺寸：{suggestedSize}</p>
          )}
          {!suggestedSize && width && height && (
            <p className="text-ink-muted text-sm mt-2">
              建议尺寸：{width}x{height}px
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={!fill && width && height ? { width, height } : undefined}
    >
      {/* 骨架:纸面第三层级呼吸 */}
      {isLoading && (
        <div className={`absolute inset-0 bg-paper-3 ${radius} animate-pulse`} style={{ zIndex: 1 }} />
      )}

      <Image
        src={oss(src)!}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={`${radius} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300 ${imageClassName}`}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
