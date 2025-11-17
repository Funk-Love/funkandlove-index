import { Variants } from "framer-motion";

/**
 * 从下方淡入并上移动画
 * 用途: Hero 区域标题、描述等元素
 * 持续时间: 0.6s (符合 Hero 动画 ≤ 1.2s 要求)
 */
export const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 60 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * 简单淡入动画
 * 用途: 通用淡入效果
 * 持续时间: 0.8s (符合滚动动画 ≤ 0.8s 要求)
 */
export const fadeIn: Variants = {
  initial: { 
    opacity: 0 
  },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

/**
 * 从左侧滑入动画
 * 用途: 团队信息区域左侧内容
 * 持续时间: 0.6s
 */
export const slideInLeft: Variants = {
  initial: { 
    opacity: 0, 
    x: -60 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * 从右侧滑入动画
 * 用途: 团队信息区域右侧内容
 * 持续时间: 0.6s
 */
export const slideInRight: Variants = {
  initial: { 
    opacity: 0, 
    x: 60 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * 交错动画容器
 * 用途: 团队特色卡片等需要依次出现的元素
 * 子元素延迟: 0.1s
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

/**
 * 悬停缩放动画
 * 用途: 卡片、按钮等交互元素
 * 悬停: 放大 1.05 倍
 * 点击: 缩小 0.95 倍
 */
export const scaleOnHover: Variants = {
  initial: {
    scale: 1
  },
  whileHover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  whileTap: { 
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeInOut"
    }
  }
};

/**
 * 卡片项动画（用于 staggerContainer 的子元素）
 * 用途: 团队特色卡片
 * 持续时间: 0.5s
 */
export const cardItem: Variants = {
  initial: { 
    opacity: 0, 
    y: 40,
    scale: 0.9
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

/**
 * 向上浮动动画（循环）
 * 用途: 滚动指示器等需要持续动画的元素
 */
export const floatUp: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

/**
 * 脉冲动画（循环）
 * 用途: 强调元素、加载指示器
 */
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
