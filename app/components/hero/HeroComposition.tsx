import type { ReactNode } from "react";

interface HeroCompositionProps {
  /** 主视觉层：桌面按需 3D，移动端与减少动效使用同源静帧。 */
  visual: ReactNode;
  /** 内容层:标题、slogan、CTA */
  children: ReactNode;
  className?: string;
}

/**
 * Hero 三层里的"主视觉 + 内容"构图容器(D9)。
 *
 * - 主视觉与内容是兄弟节点;3D canvas 的裁剪 / 透视 / transform 只会作用于 .hero-visual,
 *   不会加在 TextMorph 的共同祖先上。
 * - 桌面偏心构图:左文右物，文字略宽；小屏纵向堆叠，主视觉在上。
 * - .hero-visual 预先定宽高比,加载完成后不推动文字。
 * - 图片和 canvas 为装饰；只有唱片上的重播按钮接收事件与键盘焦点。
 *
 * 工程师控制这里的尺寸与布局约束;3D 设计师接手 .hero-visual 内部。
 * 页面业务代码不依赖相机、mesh、灯光或 shader。
 */
export default function HeroComposition({ visual, children, className = "" }: HeroCompositionProps) {
  return (
    <div
      className={`hero-composition grid grid-cols-[1.1fr_1fr] items-center gap-8 ${className}`}
    >
      <div
        className="hero-visual order-2 flex justify-center lg:justify-end pointer-events-none select-none"
      >
        <div className="relative w-[min(42vw,60vh,36rem)] aspect-square shrink-0">
          {visual}
        </div>
      </div>
      <div className="hero-content order-1 min-w-0">{children}</div>
    </div>
  );
}
