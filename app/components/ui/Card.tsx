"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** 悬停上浮 + 硬阴影。默认 true */
  hover?: boolean;
  /** 纸面层级:paper(默认)/ paper-2(略深)/ stage(深棕反色) */
  tone?: "paper" | "paper-2" | "stage";
  style?: React.CSSProperties;
}

const TONE: Record<NonNullable<CardProps["tone"]>, string> = {
  paper: "bg-paper text-ink border-ink/15",
  "paper-2": "bg-paper-2 text-ink border-ink/15",
  stage: "bg-stage-2 text-paper border-paper/15",
};

/**
 * 纸面卡片原语:细墨线边框 + 圆角;悬停时上浮并出现硬阴影(海报套印感)。
 * 悬停用 CSS transition(D5:普通 hover 不走动画库)。
 */
export default function Card({
  children,
  className = "",
  hover = true,
  tone = "paper",
  style,
}: CardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-[transform,translate,box-shadow,border-color] duration-200 ${TONE[tone]} ${
        hover ? "hover:-translate-y-1 hover:shadow-paper-sm hover:border-ink" : ""
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
