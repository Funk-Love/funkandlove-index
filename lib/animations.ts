import { Variants } from "framer-motion";

/**
 * framer-motion 共享 variants。
 * 按 D5,framer 只负责组件进出场;这里只保留仍有消费者的定义。
 */

/** 从下方淡入并上移。用途: Hero / MobileHero / SocialLinks */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** 从左侧滑入。用途: TeamInfo */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** 从右侧滑入。用途: TeamInfo */
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** 交错容器,子元素延迟 0.1s。用途: TeamFeatures */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

/** staggerContainer 的子项。用途: TeamFeatures 卡片 */
export const cardItem: Variants = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/** 上下浮动循环。用途: Hero 滚动指示器 */
export const floatUp: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};
