'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(useGSAP, Flip);

interface Letter {
  id: string;
  text: string;
  className?: string;
}

// 字母片段（单一数据源）。L / k / & 在各阶段间持续存在并换位，
// 其余片段按阶段淡入淡出。
const LETTERS: Letter[] = [
  { id: 'fun', text: 'Fun' },
  { id: 'L', text: 'L' },
  { id: 'oc', text: 'oc' },
  { id: 'k', text: 'k' },
  { id: 'ing', text: 'ing' },
  { id: 'amp', text: '&', className: 'text-pink-400' },
  { id: 'ove', text: 'ove' },
];

// 显式阶段序列：每个阶段列出「可见片段」及其视觉顺序（下标即 flex order）。
// 相邻阶段之间各做一次独立 Flip，形成清晰节拍：
// Locking → 收成 Lk → 换位 kL → 插入 k&L → 展开 Funk&Love。
const STAGE_ORDER = ['locking', 'lk', 'kl', 'kandl', 'final'] as const;
type StageName = (typeof STAGE_ORDER)[number];

const STAGES: Record<StageName, string[]> = {
  locking: ['L', 'oc', 'k', 'ing'],
  lk: ['L', 'k'],
  kl: ['k', 'L'],
  kandl: ['k', 'amp', 'L'],
  final: ['fun', 'k', 'amp', 'L', 'ove'],
};

const FINAL_INDEX = STAGE_ORDER.indexOf('final');
const EASE = 'power3.inOut';

// 单步时长：换位（lk↔kl）稍长以突出戏剧性，其余略快。
const stepDuration = (a: StageName, b: StageName) =>
  (a === 'lk' && b === 'kl') || (a === 'kl' && b === 'lk') ? 0.55 : 0.42;

interface TextMorphAnimationProps {
  onComplete?: () => void;
  startDelay?: number;
  className?: string;
}

export default function TextMorphAnimation({
  onComplete,
  startDelay = 0,
  className = '',
}: TextMorphAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0); // 当前所处阶段下标
  const targetRef = useRef(0); // 目标阶段下标
  const busyRef = useRef(false); // 是否有 Flip 正在播放
  const reduceMotion = usePrefersReducedMotion();

  useGSAP(
    (_ctx, contextSafe) => {
      const root = containerRef.current;
      if (!root || !contextSafe) return;

      // 把某阶段立即摆到 DOM（display + flex order），不带动画。
      const applyStage = (idx: number) => {
        const order = STAGES[STAGE_ORDER[idx]];
        LETTERS.forEach((l) => {
          const el = root.querySelector<HTMLElement>(`[data-letter="${l.id}"]`);
          if (!el) return;
          const pos = order.indexOf(l.id);
          if (pos === -1) {
            el.style.display = 'none';
          } else {
            el.style.display = 'inline-block';
            el.style.order = String(pos);
          }
        });
      };

      // 单步 Flip：从当前 DOM 变形到相邻阶段 next，自动算 L/k 换位、
      // & 插入，以及增删片段的淡入淡出。contextSafe 保证卸载后自动 revert。
      const flipStep = contextSafe((next: number) => {
        const from = STAGE_ORDER[currentRef.current];
        const to = STAGE_ORDER[next];
        const dur = stepDuration(from, to);

        const spans = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll('[data-letter]')
        );
        const state = Flip.getState(spans, { props: 'opacity' });
        applyStage(next);

        Flip.from(state, {
          duration: dur,
          ease: EASE,
          // 持续存在的 L/k/& 留在文档流里用 transform 动画（避免 absolute 模式
          // 给不同字形算出亚像素垂直偏移）；只把离场元素设为 absolute，
          // 让它们能原地淡出而不瞬间塌缩。
          absolute: false,
          absoluteOnLeave: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { opacity: 0, scale: 0.5 },
              { opacity: 1, scale: 1, duration: dur * 0.8 }
            ),
          onLeave: (els) =>
            gsap.to(els, { opacity: 0, scale: 0.5, duration: dur * 0.6 }),
          onComplete: () => {
            currentRef.current = next;
            stepToward();
          },
        });
      });

      // 朝 target 逐级推进，一次只播一个阶段。中途改变 target 即可平滑反向，
      // 完全替代旧版的 isAnimating / pendingDirection 双重锁。
      function stepToward() {
        if (currentRef.current === targetRef.current) {
          busyRef.current = false;
          if (currentRef.current === FINAL_INDEX) onComplete?.();
          return;
        }
        busyRef.current = true;
        const dir = targetRef.current > currentRef.current ? 1 : -1;
        flipStep(currentRef.current + dir);
      }

      const goTo = (idx: number) => {
        targetRef.current = idx;
        if (!busyRef.current) stepToward();
      };

      // 减少动效：直接显示终态，无变形、无 hover。
      if (reduceMotion) {
        currentRef.current = FINAL_INDEX;
        targetRef.current = FINAL_INDEX;
        applyStage(FINAL_INDEX);
        gsap.set(root, { opacity: 1 });
        onComplete?.();
        return;
      }

      // 入场：摆成 Locking、整体淡入，稍后逐级变形到 Funk&Love。
      currentRef.current = 0;
      targetRef.current = 0;
      applyStage(0);
      const intro = gsap.timeline({ delay: startDelay / 1000 });
      intro
        .to(root, { opacity: 1, duration: 0.4 })
        .add(() => goTo(FINAL_INDEX), '+=0.1');

      // hover：进入逐级反向回 Locking，离开逐级正向到 Funk&Love。
      const onMouseEnter = () => goTo(0);
      const onMouseLeave = () => goTo(FINAL_INDEX);
      root.addEventListener('mouseenter', onMouseEnter);
      root.addEventListener('mouseleave', onMouseLeave);

      return () => {
        root.removeEventListener('mouseenter', onMouseEnter);
        root.removeEventListener('mouseleave', onMouseLeave);
      };
    },
    { scope: containerRef, dependencies: [reduceMotion] }
  );

  // 初始 display 直接按 locking 阶段渲染，避免首帧整词闪现。
  const initialOrder = STAGES.locking;
  const initialStyle = (id: string) => {
    const pos = initialOrder.indexOf(id);
    return pos === -1
      ? { display: 'none' }
      : { display: 'inline-block', order: pos };
  };

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      style={{
        // 固定高度，杜绝 Flip absolute 阶段容器塌缩导致的上下布局闪动。
        height: '1.2em',
        lineHeight: 1.2,
        opacity: 0,
        textShadow:
          '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(236, 72, 153, 0.6)',
      }}
      aria-label="Funk & Love"
    >
      {LETTERS.map((l) => (
        <span
          key={l.id}
          data-letter={l.id}
          aria-hidden="true"
          className={l.className}
          style={initialStyle(l.id)}
        >
          {l.text}
        </span>
      ))}
    </div>
  );
}
