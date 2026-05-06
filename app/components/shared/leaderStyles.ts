import type { Leader } from "@/lib/types";

export function getRoleBadgeStyle(role: Leader["role"]): string {
  switch (role) {
    case "founder":
      return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30";
    case "captain":
      return "bg-purple-500/90 text-white";
    case "vice":
      return "bg-blue-500/80 text-white";
    default:
      return "bg-gray-500/80 text-white";
  }
}

export function getCardBorderStyle(role: Leader["role"]): string {
  switch (role) {
    case "founder":
      return "border-amber-500/50 group-hover:border-amber-400 group-hover:shadow-amber-500/30";
    case "captain":
      return "border-white/10 group-hover:border-purple-500/50 group-hover:shadow-purple-500/20";
    case "vice":
      return "border-white/10 group-hover:border-blue-500/50 group-hover:shadow-blue-500/20";
    default:
      return "border-white/10 group-hover:border-gray-500/50 group-hover:shadow-gray-500/20";
  }
}

export function getTitleColor(role: Leader["role"]): string {
  switch (role) {
    case "founder":
      return "text-amber-400";
    case "captain":
      return "text-purple-300";
    case "vice":
      return "text-blue-300";
    default:
      return "text-gray-400";
  }
}

export function getModalBorderStyle(role: Leader["role"]): string {
  switch (role) {
    case "founder":
      return "border-amber-500/50";
    case "captain":
      return "border-purple-500/30";
    default:
      return "border-white/10";
  }
}
