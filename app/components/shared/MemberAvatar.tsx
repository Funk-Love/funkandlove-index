"use client";

import type { Member } from "@/lib/types";
import { getThumbnailUrl } from "@/lib/data/members";

interface Props {
  member: Member;
  /** 是否使用压缩缩略图 URL（默认 true，全图详情用 false） */
  thumbnail?: boolean;
  /** 直接控制尺寸 / 形状的额外类名 */
  className?: string;
  /** 是否懒加载（默认 true） */
  lazy?: boolean;
  /** 显示尺寸（仅控制 wrapper，便于统一） */
  size?: "sm" | "md" | "lg";
}

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

/**
 * 成员头像 — 圆形或方形，自动选择缩略图，懒加载。
 * 用于 Members 时间线预览、移动端 accordion 网格。
 */
export default function MemberAvatar({
  member,
  thumbnail = true,
  className = "",
  lazy = true,
  size,
}: Props) {
  const sizeCls = size ? SIZE[size] : "";
  const src = thumbnail ? getThumbnailUrl(member.image) : member.image;

  return (
    <img
      src={src}
      alt={member.name}
      className={`object-cover ${sizeCls} ${className}`}
      loading={lazy ? "lazy" : "eager"}
    />
  );
}
