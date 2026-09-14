"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { oss } from "@/lib/cdn";
import SectionHeader from "./ui/SectionHeader";

gsap.registerPlugin(useGSAP);

interface TeamConfig {
  width: number;
  height: number;
  persons: { name: string; contour: [number, number][] }[];
}

interface OutlineData {
  viewBox: string;
  members: { name: string; path: string }[];
}

// 相邻点中点间的二次曲线，消除像素轮廓的小折角；只在数据加载时计算。
function smoothContour(points: [number, number][]) {
  const midpoint = (a: number[], b: number[]) => `${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2}`;
  return `M${midpoint(points[points.length - 1], points[0])}` +
    points.map((point, i) => `Q${point.join(",")} ${midpoint(point, points[(i + 1) % points.length])}`).join(" ") + "Z";
}

/** SVG 自带的 slice 与图片 object-cover 对齐，无尺寸监听或滚动计算。 */
export default function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [outlines, setOutlines] = useState<OutlineData | null>(null);
  const [activeName, setActiveName] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/images/team-config.json", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("轮廓数据加载失败");
        return res.json() as Promise<TeamConfig>;
      })
      .then((config) => {
        const groups = new Map<string, string[]>();
        for (const person of config.persons) {
          if (person.contour.length < 3) continue;
          const paths = groups.get(person.name) ?? [];
          paths.push(smoothContour(person.contour));
          groups.set(person.name, paths);
        }
        setOutlines({
          viewBox: `0 0 ${config.width} ${config.height}`,
          members: [...groups].map(([name, paths]) => ({ name, path: paths.join(" ") })),
        });
      })
      .catch(() => { /* 合照独立显示，轮廓请求失败不阻断页面。 */ });
    return () => controller.abort();
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const label = labelRef.current;
    if (!section || !label) return;
    const mm = gsap.matchMedia();
    mm.add({ fine: "(hover: hover) and (pointer: fine)", reduce: "(prefers-reduced-motion: reduce)", all: "all" }, (context) => {
      const { fine, reduce } = context.conditions!;
      const xTo = gsap.quickTo(label, "x", { duration: .16, ease: "power3.out" });
      const yTo = gsap.quickTo(label, "y", { duration: .16, ease: "power3.out" });
      let positioned = false;
      const position = (x: number, y: number, immediate = false) => {
        x = gsap.utils.clamp(12, Math.max(12, window.innerWidth - 208), x + 18);
        y = gsap.utils.clamp(12, Math.max(12, window.innerHeight - 128), y + 18);
        if (!positioned || reduce || immediate) {
          xTo.tween.pause(); yTo.tween.pause();
          gsap.set(label, { x, y });
        } else { xTo(x); yTo(y); }
        positioned = true;
      };
      const move = (event: PointerEvent) => {
        if (fine && event.pointerType !== "touch") position(event.clientX, event.clientY);
      };
      const leave = () => { positioned = false; xTo.tween.pause(); yTo.tween.pause(); };
      const focus = (event: FocusEvent) => {
        const target = event.target;
        if (!(target instanceof SVGElement) || !target.matches("[data-member]")) return;
        if (fine && !target.matches(":focus-visible")) return;
        const rect = target.getBoundingClientRect();
        position(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
      };
      section.addEventListener("pointermove", move, { passive: true });
      section.addEventListener("pointerleave", leave);
      section.addEventListener("focusin", focus);
      return () => {
        section.removeEventListener("pointermove", move);
        section.removeEventListener("pointerleave", leave);
        section.removeEventListener("focusin", focus);
      };
    });
    const visibility = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setActiveName(null);
    });
    visibility.observe(section);
    return () => { visibility.disconnect(); mm.revert(); };
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} onPointerLeave={() => setActiveName(null)} className="relative h-screen w-full overflow-hidden bg-stage">
      <Image
        src={oss("/images/team-bg.jpg")!}
        alt="Funk & Love 团队合照"
        fill
        sizes="100vw"
        loading="eager"
        className="object-cover object-center"
      />
      <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-stage/85 via-stage/40 to-transparent pointer-events-none" />
      {outlines && (
        <svg className="absolute inset-0 h-full w-full overflow-hidden"
          viewBox={outlines.viewBox} preserveAspectRatio="xMidYMid slice">
          {outlines.members.map(({ name, path }) => (
            <path key={name} d={path} data-member tabIndex={0} role="img" aria-label={name}
              strokeWidth={2} vectorEffect="non-scaling-stroke"
              className="outline-none cursor-pointer fill-transparent stroke-transparent hover:fill-pop-500/20 hover:stroke-pop-500 focus-visible:fill-pop-500/20 focus-visible:stroke-pop-500 transition-[fill,stroke] duration-150 motion-reduce:transition-none"
              onMouseEnter={() => setActiveName(name)} onMouseLeave={() => setActiveName(null)}
              onFocus={() => setActiveName(name)} onBlur={() => setActiveName(null)} />
          ))}
        </svg>
      )}
      <div className="absolute top-24 left-0 right-0 text-center px-6 pointer-events-none">
        <SectionHeader index={2} eyebrow="team" title="我们的团队" subtitle="将鼠标悬停在成员上查看名字" theme="dark" align="center" />
      </div>
      <div ref={labelRef} aria-hidden="true" className={`fixed left-0 top-0 z-50 max-w-48 rounded-sm border border-ink/20 bg-paper px-4 py-2 text-lg font-semibold text-ink shadow-paper-sm pointer-events-none transition-opacity duration-150 motion-reduce:transition-none ${activeName ? "opacity-100" : "opacity-0"}`}>
        {activeName ?? "\u00a0"}
      </div>
    </div>
  );
}
