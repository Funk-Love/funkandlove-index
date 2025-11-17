import { useState, useEffect } from "react";

/**
 * RGB 颜色接口
 */
interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * 将十六进制颜色转换为 RGB
 * @param hex - 十六进制颜色字符串 (如 "#8b5cf6")
 * @returns RGB 对象
 */
function hexToRgb(hex: string): RGB {
  // 移除 # 符号
  const cleanHex = hex.replace("#", "");
  
  // 解析 RGB 值
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * 颜色插值函数
 * 在两个颜色之间进行线性插值
 * 
 * @param color1 - 起始颜色 (十六进制格式，如 "#8b5cf6")
 * @param color2 - 结束颜色 (十六进制格式，如 "#ec4899")
 * @param factor - 插值因子 (0-1 之间，0 返回 color1，1 返回 color2)
 * @returns 插值后的 RGB 颜色字符串 (如 "rgb(139, 92, 246)")
 * 
 * @example
 * interpolateColor("#8b5cf6", "#ec4899", 0.5) // 返回两个颜色的中间色
 */
export function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  // 确保 factor 在 0-1 范围内
  const clampedFactor = Math.max(0, Math.min(1, factor));
  
  // 转换为 RGB
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  // 线性插值
  const r = Math.round(c1.r + (c2.r - c1.r) * clampedFactor);
  const g = Math.round(c1.g + (c2.g - c1.g) * clampedFactor);
  const b = Math.round(c1.b + (c2.b - c1.b) * clampedFactor);
  
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 计算鼠标与元素中心的距离
 * 
 * @param mouseX - 鼠标 X 坐标
 * @param mouseY - 鼠标 Y 坐标
 * @param elementX - 元素中心 X 坐标
 * @param elementY - 元素中心 Y 坐标
 * @returns 欧几里得距离（像素）
 * 
 * @example
 * const distance = getDistanceFromMouse(100, 100, 200, 200);
 * // 返回约 141.42 (√((200-100)² + (200-100)²))
 */
export function getDistanceFromMouse(
  mouseX: number,
  mouseY: number,
  elementX: number,
  elementY: number
): number {
  const dx = mouseX - elementX;
  const dy = mouseY - elementY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 鼠标位置追踪 Hook
 * 实时追踪鼠标在页面上的位置
 * 
 * @returns 包含 x 和 y 坐标的对象
 * 
 * @example
 * const { x, y } = useMousePosition();
 * // x 和 y 会随鼠标移动实时更新
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // 鼠标移动事件处理函数
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ 
        x: e.clientX, 
        y: e.clientY 
      });
    };
    
    // 添加事件监听器
    window.addEventListener("mousemove", handleMouseMove);
    
    // 清理函数：移除事件监听器
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  return position;
}

/**
 * 计算鼠标影响强度
 * 根据鼠标与元素的距离计算影响强度（0-1）
 * 距离越近，强度越大
 * 
 * @param mouseX - 鼠标 X 坐标
 * @param mouseY - 鼠标 Y 坐标
 * @param elementX - 元素中心 X 坐标
 * @param elementY - 元素中心 Y 坐标
 * @param maxDistance - 最大影响距离（像素），超过此距离强度为 0
 * @returns 影响强度 (0-1)
 * 
 * @example
 * const intensity = getMouseInfluence(100, 100, 150, 150, 200);
 * // 如果距离为 70.7px，强度约为 0.65
 */
export function getMouseInfluence(
  mouseX: number,
  mouseY: number,
  elementX: number,
  elementY: number,
  maxDistance: number = 500
): number {
  const distance = getDistanceFromMouse(mouseX, mouseY, elementX, elementY);
  
  // 距离越近，强度越大
  // 超过 maxDistance 时强度为 0
  const intensity = Math.max(0, 1 - distance / maxDistance);
  
  return intensity;
}

/**
 * 将鼠标位置转换为百分比
 * 用于 CSS 渐变定位
 * 
 * @param mouseX - 鼠标 X 坐标
 * @param mouseY - 鼠标 Y 坐标
 * @returns 包含 x 和 y 百分比的对象
 * 
 * @example
 * const { x, y } = getMousePercentage(960, 540);
 * // 在 1920x1080 屏幕上返回 { x: 50, y: 50 }
 */
export function getMousePercentage(mouseX: number, mouseY: number) {
  const x = (mouseX / window.innerWidth) * 100;
  const y = (mouseY / window.innerHeight) * 100;
  
  return { x, y };
}
