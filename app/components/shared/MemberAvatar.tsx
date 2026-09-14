"use client";

import type { Member } from "@/lib/types";
import { asset } from "@/lib/cdn";

interface Props {
  member: Member;
  /** 时间线圆头像用 128px；成员网格用最长边 800px 预览，原图另行保留。 */
  thumbnail?: boolean;
  className?: string;
  lazy?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

/**
 * 成员头像:纯 <img>,object-cover;加载前露出纸面第三层级底色。
 * 相框(圆形 / 3:4 纸框)由调用方包裹,桌面 Members 与移动 MobileMembers 共用。
 */
export default function MemberAvatar({
  member,
  thumbnail = false,
  className = "",
  lazy = true,
  size,
}: Props) {
  const sizeCls = size ? SIZE[size] : "";
  const imageSrc = asset(member.image.replace('/members/', '/member-previews/').replace(/\.[^/.]+$/, thumbnail ? '.thumb.webp' : '.webp'));

  return (
    <img
      src={imageSrc}
      alt={member.name}
      className={`object-cover bg-paper-3 ${sizeCls} ${className}`}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
    />
  );
}
