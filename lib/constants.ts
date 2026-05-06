import { LucideIcon, Video, MessageCircle, Tv, Instagram, Ghost, Target, Zap, Cloud, Bot, Shirt } from "lucide-react";
import { TEAM_DESCRIPTION, TEAM_PHILOSOPHY, FEATURES } from "./data/team";

/**
 * 全站统一的 navbar 高度（px）
 * 滚动锚点偏移、sticky 计算等均基于此值
 */
export const NAV_HEIGHT = 80;

/**
 * 社交媒体链接配置
 */
export interface SocialLink {
  platform: string;
  icon: LucideIcon;
  url?: string;
  isComingSoon: boolean;
}

/**
 * 团队特色配置
 */
export interface Feature {
  icon: string; // Lucide icon name
  title: string;
  description: string;
}

/**
 * 活动子菜单配置
 */
export interface ActivitySubLink {
  id: string;
  label: string;
  url: string;
  icon?: LucideIcon;
}

/**
 * 导航链接配置
 */
export interface NavLink {
  id: string;
  label: string;
  href?: string;
  url?: string;
  subLinks?: ActivitySubLink[];
}

/**
 * 站点配置 - 包含所有团队信息和内容
 */
export const SITE_CONFIG = {
  // 基本信息
  name: "Funk & Love",
  slogan: "Lock it, Point it, Groove it!",
  description: "浙江大学DFM街舞社Locking团队",
  organization: "浙江大学DFM街舞社",
  danceStyle: "Locking（锁舞）",
  memberCount: "40+",
  
  // 团队描述（数据源于 lib/data/team.ts）
  teamDescription: TEAM_DESCRIPTION,

  // 团队理念（数据源于 lib/data/team.ts）
  philosophy: TEAM_PHILOSOPHY,

  // 团队特色（数据源于 lib/data/team.ts）
  features: FEATURES,
  
  // 社交媒体链接
  socialLinks: [
    {
      platform: "抖音",
      icon: Video,
      url: "https://www.douyin.com/user/MS4wLjABAAAAowd4J-nvC1oFpGl7FmBJ78xwqblR_a_wSAIiiYG5V1HEKfTwStguqsSPbARI7WuV",
      isComingSoon: false
    },
    {
      platform: "微信视频号",
      icon: MessageCircle,
      url: undefined,
      isComingSoon: true
    },
    {
      platform: "B站",
      icon: Tv,
      url: undefined,
      isComingSoon: true
    },
    {
      platform: "Instagram",
      icon: Instagram,
      url: undefined,
      isComingSoon: true
    }
  ] as SocialLink[],
  
  // 图片路径配置
  images: {
    /**
     * Hero 背景图片（使用团队合照）
     * 建议尺寸: 6000x4000px
     * 用途: 主页顶部全屏背景，与Team section共用同一张图
     */
    hero: "https://funkandlove-main.s3.bitiful.net/index/team-bg.jpg",
    
    /**
     * 团队合照
     * 建议尺寸: 800x600px (4:3) 或 1200x800px
     * 用途: 团队介绍区域展示
     */
    teamPhoto: "https://funkandlove-main.s3.bitiful.net/index/team-photo.jpg",
    
    /**
     * 团队特色背景图片
     * 建议尺寸: 1920x1080px (16:9)
     * 用途: 团队特色区域右侧背景
     */
    featuresBackground: "https://funkandlove-main.s3.bitiful.net/index/features-bg.png",
    
    /**
     * Favicon 图标
     * 尺寸: 32x32px 或 64x64px
     * 格式: .ico
     */
    favicon: "https://funkandlove-main.s3.bitiful.net/public/favicon.ico",
    
    /**
     * Logo 图标
     * 建议尺寸: 512x512px
     * 格式: .png (透明背景)
     * 用途: OpenGraph、PWA图标等
     */
    logo: "https://funkandlove-main.s3.bitiful.net/public/icon.png"
  }
};

/**
 * 导航链接配置
 * 用于顶部导航栏和平滑滚动
 */
export const NAV_LINKS: NavLink[] = [
  { 
    id: "home", 
    label: "首页", 
    href: "#hero" 
  },
  { 
    id: "plan", 
    label: "计划", 
    href: "#under-construction" 
  },
  { 
    id: "team", 
    label: "队伍", 
    href: "#team" 
  },
  { 
    id: "activities", 
    label: "活动",
    subLinks: [
      {
        id: "halloween",
        label: "万圣节特别活动",
        url: "https://activities.funk-and.love/activities/2025/halloween-club/index.html",
        icon: Ghost
      },
      {
        id: "xiaoming",
        label: "小明大师课",
        url: "https://activities.funk-and.love/activities/2025/xiaoming-masterclass/index.html",
        icon: Target
      },
      {
        id: "funk-you-up",
        label: "2025快闪",
        url: "https://activities.funk-and.love/activities/2025/funk-you-up/index.html",
        icon: Zap
      }
    ]
  },
  { 
    id: "history", 
    label: "历史", 
    href: "#leaders" 
  },
  {
    id: "merch",
    label: "周边",
    subLinks: [
      {
        id: "jersey2026",
        label: "2026队服",
        url: "https://merch.funk-and.love/jersey2026/",
        icon: Shirt
      }
    ]
  },
  {
    id: "products",
    label: "产品",
    subLinks: [
      {
        id: "lockcloud",
        label: "LockCloud",
        url: "https://cloud.funk-and.love",
        icon: Cloud
      },
      {
        id: "lockai",
        label: "LockAI",
        url: "https://ai.funk-and.love",
        icon: Bot
      }
    ]
  }
];
