import type { Leader } from "@/lib/types";

/**
 * 角色 → 视觉映射,全站唯一出口。只用 globals.css 的 role-* token。
 * founder = 暖金属(荣誉),captain = 焦橙,vice = 青,other = 墨色。
 */

/** 届数 / 头衔徽章 */
export function getRoleBadgeStyle(role: Leader["role"]): string {
  switch (role) {
    case "founder":
      return "bg-role-founder text-ink";
    case "captain":
      return "bg-role-captain text-paper";
    case "vice":
      return "bg-role-vice text-paper";
    default:
      return "bg-role-other text-paper";
  }
}

/** 卡片相框边框(静态 + hover) */
export function getCardBorderStyle(role: Leader["role"]): string {
  switch (role) {
    case "founder":
      return "border-role-founder group-hover:shadow-[4px_4px_0_0_var(--color-role-founder)]";
    case "captain":
      return "border-ink group-hover:border-role-captain group-hover:shadow-[4px_4px_0_0_var(--color-role-captain)]";
    case "vice":
      return "border-ink group-hover:border-role-vice group-hover:shadow-[4px_4px_0_0_var(--color-role-vice)]";
    default:
      return "border-ink group-hover:shadow-hard";
  }
}

/** 卡片底部头衔文字色(压在深色照片渐变上) */
export function getTitleColor(role: Leader["role"]): string {
  switch (role) {
    case "founder":
      return "text-role-founder-ink";
    case "captain":
      return "text-role-captain-ink";
    case "vice":
      return "text-role-vice-ink";
    default:
      return "text-paper-3";
  }
}

/** 详情弹窗边框 */
export function getModalBorderStyle(role: Leader["role"]): string {
  switch (role) {
    case "founder":
      return "border-role-founder";
    case "captain":
      return "border-role-captain";
    case "vice":
      return "border-role-vice";
    default:
      return "border-ink";
  }
}
