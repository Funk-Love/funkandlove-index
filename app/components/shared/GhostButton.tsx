"use client";

import type { ComponentProps } from "react";
import CTAButton from "./CTAButton";

type Props = Omit<ComponentProps<typeof CTAButton>, "variant">;

/**
 * 玻璃拟态次级按钮 —— `<CTAButton variant="ghost" />` 的语义化包装。
 */
export default function GhostButton(props: Props) {
  return <CTAButton {...props} variant="ghost" />;
}
