"use client";

import type { MouseEvent, ReactNode } from "react";

type Variant = "primary" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props {
  href?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit";
}

const SIZE: Record<Size, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-2.5",
};

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50",
  ghost:
    "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
};

/**
 * 转化型 CTA 按钮 — 默认绿色（"加入我们 / 报名 / 周边"），ghost 变体用于次级 CTA。
 */
export default function CTAButton({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  external,
  className = "",
  ariaLabel,
  type = "button",
}: Props) {
  const cls =
    `inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 cursor-pointer ` +
    `${SIZE[size]} ${VARIANT[variant]} ${className}`;

  if (href) {
    const externalAttrs = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <a href={href} className={cls} aria-label={ariaLabel} {...externalAttrs}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
