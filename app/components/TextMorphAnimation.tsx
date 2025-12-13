'use client';

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

type AnimationPhase = 
  | 'locking'      // 显示 Locking
  | 'to-lk'        // 变成 Lk
  | 'swap-lk'      // Lk 交换位置变成 kL
  | 'insert-and'   // 插入 & -> k&L
  | 'expand'       // 展开成 Funk&Love
  | 'complete';    // 动画完成

interface TextMorphAnimationProps {
  onComplete?: () => void;
  startDelay?: number;
  className?: string;
}

export default function TextMorphAnimation({ 
  onComplete, 
  startDelay = 0,
  className = ''
}: TextMorphAnimationProps) {
  const [phase, setPhase] = useState<AnimationPhase>('locking');
  const [hasStarted, setHasStarted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // 动画锁
  const [pendingDirection, setPendingDirection] = useState<'forward' | 'reverse' | null>(null); // 待执行的方向
  const animationRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    animationRef.current.forEach(timer => clearTimeout(timer));
    animationRef.current = [];
  };

  const runForwardAnimation = (isInitial = false) => {
    clearTimers();
    setIsAnimating(true);
    setPendingDirection(null);
    
    const phases: { phase: AnimationPhase; delay: number }[] = [
      { phase: 'locking', delay: 0 },
      { phase: 'to-lk', delay: 1000 },
      { phase: 'swap-lk', delay: 600 },
      { phase: 'insert-and', delay: 600 },
      { phase: 'expand', delay: 500 },
      { phase: 'complete', delay: 700 },
    ];

    let totalDelay = 0;
    phases.forEach(({ phase: p, delay }) => {
      totalDelay += delay;
      const timer = setTimeout(() => {
        setPhase(p);
        if (p === 'complete') {
          setIsAnimating(false);
          if (!isInitial) {
            // 检查是否有待执行的反向动画
            setPendingDirection(prev => {
              if (prev === 'reverse') {
                setTimeout(() => runReverseAnimation(), 50);
              }
              return null;
            });
          }
          onComplete?.();
        }
      }, totalDelay);
      animationRef.current.push(timer);
    });
  };

  const runReverseAnimation = () => {
    clearTimers();
    setIsAnimating(true);
    setPendingDirection(null);
    
    const phases: { phase: AnimationPhase; delay: number }[] = [
      { phase: 'expand', delay: 0 },
      { phase: 'insert-and', delay: 400 },
      { phase: 'swap-lk', delay: 400 },
      { phase: 'to-lk', delay: 400 },
      { phase: 'locking', delay: 400 },
    ];

    let totalDelay = 0;
    phases.forEach(({ phase: p, delay }) => {
      totalDelay += delay;
      const timer = setTimeout(() => {
        setPhase(p);
        if (p === 'locking') {
          setIsAnimating(false);
          // 检查是否有待执行的正向动画
          setPendingDirection(prev => {
            if (prev === 'forward') {
              setTimeout(() => runForwardAnimation(), 50);
            }
            return null;
          });
        }
      }, totalDelay);
      animationRef.current.push(timer);
    });
  };

  useEffect(() => {
    if (!hasStarted) {
      const timer = setTimeout(() => {
        setHasStarted(true);
        runForwardAnimation(true);
      }, startDelay);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, startDelay]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const handleMouseEnter = () => {
    if (phase === 'complete' && !isAnimating) {
      // 动画完成且没有正在播放，直接开始反向
      runReverseAnimation();
    } else if (isAnimating) {
      // 正在播放动画，记录待执行方向
      setPendingDirection('reverse');
    }
  };

  const handleMouseLeave = () => {
    if (phase === 'locking' && !isAnimating) {
      // 已经在 locking 且没有正在播放，直接开始正向
      runForwardAnimation();
    } else if (isAnimating) {
      // 正在播放动画，记录待执行方向
      setPendingDirection('forward');
    }
  };

  const baseStyle = {
    textShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(236, 72, 153, 0.6)',
  };



  if (!hasStarted) {
    return null;
  }

  return (
    <LayoutGroup>
      <motion.div 
        className={`inline-flex items-baseline justify-center cursor-pointer select-none ${className}`}
        layout
        style={{ ...baseStyle, minHeight: '1.2em' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
          <AnimatePresence mode="popLayout">
            {/* Locking 阶段 - 显示完整单词，L和k用layoutId以便后续动画 */}
            {phase === 'locking' && (
              <>
                <motion.span
                  key="L-locking"
                  layoutId="char-L"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  L
                </motion.span>
                <motion.span
                  key="oc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  oc
                </motion.span>
                <motion.span
                  key="k-locking"
                  layoutId="char-k"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  k
                </motion.span>
                <motion.span
                  key="ing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  ing
                </motion.span>
              </>
            )}

            {/* Lk 阶段 - oc和ing消失，只剩L和k */}
            {phase === 'to-lk' && (
              <>
                <motion.span
                  key="L-lk"
                  layoutId="char-L"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  L
                </motion.span>
                <motion.span
                  key="k-lk"
                  layoutId="char-k"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  k
                </motion.span>
              </>
            )}

            {/* kL 交换阶段 */}
            {phase === 'swap-lk' && (
              <>
                <motion.span
                  key="k-swap"
                  layoutId="char-k"
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  k
                </motion.span>
                <motion.span
                  key="L-swap"
                  layoutId="char-L"
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  L
                </motion.span>
              </>
            )}

            {/* k&L 和 Funk&Love 阶段合并处理 */}
            {(phase === 'insert-and' || phase === 'expand' || phase === 'complete') && (
              <>
                <motion.span
                  key="Fun"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ 
                    opacity: phase === 'insert-and' ? 0 : 1, 
                    width: phase === 'insert-and' ? 0 : 'auto' 
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ overflow: 'hidden', display: 'inline-block' }}
                >
                  Fun
                </motion.span>
                <motion.span
                  key="k-combined"
                  layoutId="char-k"
                  transition={{ duration: 0.3 }}
                >
                  k
                </motion.span>
                <motion.span
                  key="amp-combined"
                  layoutId="char-amp"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-pink-400"
                >
                  &
                </motion.span>
                <motion.span
                  key="L-combined"
                  layoutId="char-L"
                  transition={{ duration: 0.3 }}
                >
                  L
                </motion.span>
                <motion.span
                  key="ove"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ 
                    opacity: phase === 'insert-and' ? 0 : 1, 
                    width: phase === 'insert-and' ? 0 : 'auto' 
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ overflow: 'hidden', display: 'inline-block' }}
                >
                  ove
                </motion.span>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
  );
}
