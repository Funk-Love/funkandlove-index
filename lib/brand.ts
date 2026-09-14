/**
 * 社交平台品牌色。独立于设计 token 维护(品牌色不随站点换皮变化)。
 * 桌面 SocialLinks 与移动 MobileSocial 共用,不再各写一份。
 */
export const PLATFORM_COLORS: Record<string, string> = {
  抖音: "#fe2c55",
  微信视频号: "#07c160",
  B站: "#00a1d6",
  Instagram: "#e4405f",
};

/** 未知平台的兜底色(站点主强调色) */
export const PLATFORM_FALLBACK_COLOR = "#e4572e";

export function platformColor(platform: string): string {
  return PLATFORM_COLORS[platform] ?? PLATFORM_FALLBACK_COLOR;
}
