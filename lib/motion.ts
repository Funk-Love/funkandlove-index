/**
 * 动效词汇表(方案 §5.3):少量品牌动作,不全站套弹性。
 *
 * - LOCK:强调元素(章节标题、CTA、Hero 装置)过冲后"锁住",呼应 Locking 的动作语言。
 * - REVEAL:正文 / 卡片的滚动揭示,克制。
 * - UI:导航反馈等直接交互,用 CSS transition 150–250ms,不走 GSAP。
 *
 * 这些只用于局部 tween,不修改 gsap.defaults(),避免波及冻结的 TextMorph 动画。
 */
export const EASE = {
  /** 过冲后锁定 */
  lock: "back.out(1.6)",
  /** 克制的揭示 */
  reveal: "power2.out",
  /** 横向 / 位移类 */
  move: "power3.out",
} as const;

export const DURATION = {
  lock: 0.55,
  reveal: 0.6,
  fast: 0.25,
} as const;

/** 揭示 stagger 间隔(秒) */
export const STAGGER = 0.08;
