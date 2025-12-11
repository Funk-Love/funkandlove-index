"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

const CONFIG_URL = "https://funkandlove-main.s3.bitiful.net/index/team-config.json";

interface TeamMember {
  id: number;
  name: string;
  color: [number, number, number];
  contour: [number, number][];
}

interface TeamConfig {
  width: number;
  height: number;
  persons: TeamMember[];
}

/**
 * 团队 Section
 * 背景图由 TeamPhotoBackground 提供
 * SVG 轮廓交互在这里实现（fixed 定位，与背景图对齐）
 */
export default function Team() {
  const [config, setConfig] = useState<TeamConfig | null>(null);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ scale: 1, offsetX: 0, offsetY: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 检测 section 是否在视口中，离开时清除 hover 状态
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (!visible) setHoveredMember(null); // 离开时清除 hover
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 加载配置
  useEffect(() => {
    fetch(CONFIG_URL)
      .then((res) => res.json())
      .then((data: TeamConfig) => setConfig(data))
      .catch(() => {});
  }, []);

  // 计算 object-cover 的变换参数（与背景图保持一致）
  const calculateTransform = useCallback(() => {
    if (!config) return;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const imageWidth = config.width;
    const imageHeight = config.height;

    const containerRatio = containerWidth / containerHeight;
    const imageRatio = imageWidth / imageHeight;

    let scale: number;
    let offsetX = 0;
    let offsetY = 0;

    if (containerRatio > imageRatio) {
      scale = containerWidth / imageWidth;
      const scaledHeight = imageHeight * scale;
      offsetY = (scaledHeight - containerHeight) / 2 / scale;
    } else {
      scale = containerHeight / imageHeight;
      const scaledWidth = imageWidth * scale;
      offsetX = (scaledWidth - containerWidth) / 2 / scale;
    }

    setTransform({ scale, offsetX, offsetY });
  }, [config]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => calculateTransform());
    window.addEventListener("resize", calculateTransform);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", calculateTransform);
    };
  }, [calculateTransform]);

  // 按名字分组成员
  const memberGroups =
    config?.persons.reduce(
      (acc, person) => {
        if (person.contour.length < 3) return acc;
        if (!acc[person.name]) {
          acc[person.name] = { color: person.color, contours: [] };
        }
        acc[person.name].contours.push(person.contour);
        return acc;
      },
      {} as Record<string, { color: [number, number, number]; contours: [number, number][][] }>
    ) || {};

  // Catmull-Rom 平滑曲线
  const contourToSmoothPath = (points: [number, number][]): string => {
    if (points.length < 3) return "";
    const tension = 0.3;
    const n = points.length;
    const pts = [points[n - 1], ...points, points[0], points[1]];
    let d = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < pts.length - 2; i++) {
      const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2];
      const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
      const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
      const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
      const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }
    return d + " Z";
  };

  const getViewBox = () => {
    if (!config) return "0 0 100 100";
    const { offsetX, offsetY } = transform;
    const viewWidth = window.innerWidth / transform.scale;
    const viewHeight = window.innerHeight / transform.scale;
    return `${offsetX} ${offsetY} ${viewWidth} ${viewHeight}`;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* SVG 轮廓层 - fixed 定位与背景图对齐，仅在 section 可见时启用 */}
      {config && isVisible && (
        <svg
          className="fixed inset-0 w-full h-full z-10"
          viewBox={getViewBox()}
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
        >
          {Object.entries(memberGroups).map(([name, group]) =>
            group.contours.map((contour, idx) => (
              <path
                key={`${name}-${idx}`}
                d={contourToSmoothPath(contour)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  fill: hoveredMember === name ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  stroke: hoveredMember === name ? "rgba(255, 255, 255, 0.8)" : "transparent",
                  strokeWidth: 2 / transform.scale,
                  pointerEvents: "auto",
                }}
                onMouseEnter={() => setHoveredMember(name)}
                onMouseLeave={() => setHoveredMember(null)}
              />
            ))
          )}
        </svg>
      )}

      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute top-24 left-0 right-0 z-20 text-center pointer-events-none"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg">
          我们的团队
        </h2>
        <p className="text-lg text-white/80 drop-shadow-md">
          将鼠标悬停在成员上查看名字
        </p>
      </motion.div>

      {/* 悬浮名字标签 */}
      {hoveredMember && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed z-50 px-4 py-2 rounded-lg text-white font-medium pointer-events-none backdrop-blur-md"
          style={{
            left: mousePos.x + 15,
            top: mousePos.y + 15,
            background: "rgba(0, 0, 0, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {hoveredMember}
        </motion.div>
      )}
    </div>
  );
}
