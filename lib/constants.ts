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
      icon: "Music",
      title: "充满律动的Locking舞蹈",
      description: "专业的Locking技巧训练，感受放克音乐的魅力"
    },
    {
      icon: "Heart",
      title: "欢乐友爱的团队氛围",
      description: "温暖的大家庭，每个人都能找到归属感"
    },
    {
      icon: "Users",
      title: "专业的舞蹈指导",
      description: "经验丰富的导师团队，系统化的教学体系"
    },
    {
      icon: "Sparkles",
      title: "丰富的演出机会",
      description: "校内外各类演出平台，展示自我风采"
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
    hero: "/images/hero-bg.jpg",
    
    /**
     * 团队合照
     * 建议尺寸: 800x600px (4:3) 或 1200x800px
     * 用途: 团队介绍区域展示
     */
    teamPhoto: "/images/team-photo.jpg",
    
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
