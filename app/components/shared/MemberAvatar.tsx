"use client";

import type { Member } from "@/lib/types";

interface Props {
  member: Member;
  /** 兼容旧调用 — 现已改用全分辨率图，本字段无效 */
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

export default function MemberAvatar({
  member,
  className = "",
  lazy = true,
  size,
}: Props) {
  const sizeCls = size ? SIZE[size] : "";

  return (
    <img
      src={member.image}
      alt={member.name}
      className={`object-cover ${sizeCls} ${className}`}
      loading={lazy ? "lazy" : "eager"}
    />
  );
}
