"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EASE, DURATION, STAGGER } from "@/lib/motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * 滚动揭示(GSAP ScrollTrigger.batch)。
 *
 * 用法:在容器上挂返回的 ref,需要揭示的子元素加 `data-reveal`;
 * `data-reveal="lock"` 走过冲锁定缓动(标题、强调物),默认走克制的 power2.out。
 * 元素初始由 GSAP 设为 opacity 0 / y 24,进入视口后按 stagger 依次揭示,只播一次。
 *
 * reduced-motion:不做任何处理,元素保持可见。
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: { start?: string }) {
  const ref = useRef<T>(null);
  const reducedMotion = usePrefersReducedMotion();
  const start = options?.start ?? "top 85%";

  useGSAP(
    (_context, contextSafe) => {
      if (reducedMotion || !contextSafe) return;
      const root = ref.current;
      if (!root) return;
      const items = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-reveal]"));
      if (!items.length) return;

      gsap.set(items, { opacity: 0, y: 24 });

      ScrollTrigger.batch(items, {
        start,
        once: true,
        onEnter: contextSafe((batch: Element[]) => {
          const els = batch as HTMLElement[];
          const lockItems = els.filter((el) => el.dataset.reveal === "lock");
          const softItems = els.filter((el) => el.dataset.reveal !== "lock");
          if (softItems.length) {
            gsap.to(softItems, {
              opacity: 1,
              y: 0,
              duration: DURATION.reveal,
              ease: EASE.reveal,
              stagger: STAGGER,
              overwrite: true,
            });
          }
          if (lockItems.length) {
            gsap.fromTo(
              lockItems,
              { opacity: 0, y: 32, scale: 0.96 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: DURATION.lock,
                ease: EASE.lock,
                stagger: STAGGER,
                overwrite: true,
              }
            );
          }
        }),
      });
    },
    { scope: ref, dependencies: [reducedMotion, start], revertOnUpdate: true }
  );

  return ref;
}
