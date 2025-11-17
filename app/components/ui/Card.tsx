'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: boolean;
  hoverShadow?: boolean;
  style?: React.CSSProperties;
}

export default function Card({
  children,
  className = '',
  hoverScale = true,
  hoverShadow = true,
  style,
}: CardProps) {
  return (
    <motion.div
      className={`
        relative
        bg-white/10
        backdrop-blur-md
        rounded-xl
        shadow-lg
        border border-white/20
        overflow-hidden
        transition-all duration-300
        ${hoverShadow ? 'hover:shadow-2xl' : ''}
        ${className}
      `}
      style={style}
      whileHover={
        hoverScale
          ? {
              scale: 1.05,
              y: -8,
            }
          : undefined
      }
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}
