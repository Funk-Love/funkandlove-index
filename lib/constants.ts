import { LucideIcon, Video, MessageCircle, Tv, Instagram } from "lucide-react";

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
 * 导航链接配置
 */
export interface NavLink {
  id: string;
  label: string;
  href: string;
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
  
  // 团队描述
  teamDescription: `Funk & Love是浙江大学DFM街舞社的Locking团队，我们用充满律动的锁舞诠释放克精神。Locking是一种充满欢乐和表现力的街舞风格，以突然的"锁定"动作、指向性手势Point和夸张的表情为特征。`,
  
  // 团队理念
  philosophy: "用舞蹈传递快乐",
  
  // 团队特色 - 4个核心特色点
  features: [
    {
      icon: "Scale",
      title: "平等的",
      description: "每个成员都是团队的重要一员，我们尊重每个人的声音"
    },
    {
      icon: "Heart",
      title: "包容的",
      description: "接纳不同背景和水平的舞者，共同成长进步"
    },
    {
      icon: "Users",
      title: "真诚的",
      description: "用真心对待每一位成员，建立信任与友谊"
    },
    {
      icon: "Sparkles",
      title: "热烈的",
      description: "充满激情与活力，用舞蹈点燃生活的热情"
    }
  ] as Feature[],
  
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
     * Hero 背景图片
     * 建议尺寸: 1920x1080px (16:9)
     * 用途: 主页顶部全屏背景
     */
    hero: "https://funkandlove-main.s3.bitiful.net/index/hero-bg.jpg",
    
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
    id: "about", 
    label: "团队介绍", 
    href: "#team-info" 
  },
  { 
    id: "features", 
    label: "团队特色", 
    href: "#features" 
  },
  { 
    id: "contact", 
    label: "联系我们", 
    href: "#social" 
  }
];
