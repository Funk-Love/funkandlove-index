/**
 * 颜色插值与鼠标距离工具。目前只服务 TeamFeatures 的图标 / 卡片随鼠标变色。
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

/**
 * 两个 hex 颜色之间线性插值,返回 "rgb(r, g, b)"。
 * factor 0 → color1,1 → color2。
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const t = Math.max(0, Math.min(1, factor));
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 鼠标对元素的影响强度(0–1):距离越近越大,超过 maxDistance 为 0。
 */
export function getMouseInfluence(
  mouseX: number,
  mouseY: number,
  elementX: number,
  elementY: number,
  maxDistance: number = 500
): number {
  const dx = mouseX - elementX;
  const dy = mouseY - elementY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, 1 - distance / maxDistance);
}
