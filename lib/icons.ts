/**
 * 图标注册表:配置与数据层只写图标名(字符串),组件侧用 getIcon() 解析。
 * 这是全站唯一的 名字 → lucide 组件 映射,TeamFeatures / MobileFeatures / 导航 / 社媒都走这里。
 *
 * 注意:Sparkles 全局禁用(eslint 强制),不要加进来。
 */
import {
  Bot,
  Cloud,
  Flame,
  Ghost,
  Heart,
  Instagram,
  MessageCircle,
  Scale,
  Shirt,
  Star,
  Target,
  Tv,
  Users,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  // 团队特色
  Scale,
  Heart,
  Users,
  Flame,
  Star,
  // 导航子项
  Ghost,
  Target,
  Zap,
  Shirt,
  Cloud,
  Bot,
  // 社交平台
  Video,
  MessageCircle,
  Tv,
  Instagram,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function getIcon(name: IconName | string | undefined): LucideIcon | undefined {
  if (!name) return undefined;
  return (ICONS as Record<string, LucideIcon>)[name];
}
