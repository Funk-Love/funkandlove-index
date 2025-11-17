'use client';

import Image from 'next/image';
import { useState } from 'react';

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
  priority?: boolean;
  rounded?: boolean;
}

export default function ImagePlaceholder({
  src,
  alt,
  width,
  height,
  className = '',
  imageClassName = '',
  placeholderText = '404 - 图片待补充',
  suggestedSize,
  fill = false,
  priority = false,
  rounded = true,
}: ImagePlaceholderProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 如果没有 src 或图片加载失败，显示占位符
  if (imageError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-200 ${rounded ? 'rounded-lg' : ''} ${className}`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <div className="text-center p-8">
          <p className="text-neutral-500 text-lg font-medium">{placeholderText}</p>
          {suggestedSize && (
            <p className="text-neutral-400 text-sm mt-2">建议尺寸：{suggestedSize}</p>
          )}
          {!suggestedSize && width && height && (
            <p className="text-neutral-400 text-sm mt-2">
              建议尺寸：{width}x{height}px
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={!fill && width && height ? { width, height } : undefined}>
      {/* 骨架屏加载状态 */}
      {isLoading && (
        <div
          className={`absolute inset-0 bg-neutral-200 ${rounded ? 'rounded-lg' : ''} animate-pulse`}
          style={{ zIndex: 1 }}
        />
      )}
      
      {/* 图片 */}
      <Image
        src={src}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        priority={priority}
        className={`${rounded ? 'rounded-lg' : ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${imageClassName}`}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
