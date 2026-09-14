"use client";

import { useEffect, useRef } from "react";
import type { VinylScene } from "./createVinylScene";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/** Mobile loads the model only after entering the player; reduced motion uses a still pose. */
export default function HeroVisual({ onReplay, studio = false, open = false, prepare = false, playing = false, onSceneStatus }: {
  onReplay?: () => boolean; studio?: boolean; open?: boolean; prepare?: boolean; playing?: boolean;
  onSceneStatus?: (status: "loading" | "ready" | "error") => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<VinylScene | null>(null);
  const reduced = usePrefersReducedMotion();
  const state = useRef({ open, prepare, playing });
  const loadRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    state.current = { open, prepare, playing };
    loadRef.current?.();
  }, [open, prepare, playing]);
  useEffect(() => { sceneRef.current?.setPlayer(open); }, [open]);
  useEffect(() => { sceneRef.current?.setPlaying(playing); }, [playing]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const media = matchMedia("(min-width: 1024px) and (pointer: fine)");
    let scene: VinylScene | undefined;
    let controller: AbortController | undefined;
    let visible = false;
    let scheduled = 0;
    let dead = false;
    const updateActivity = () => scene?.setActive(visible && !document.hidden && !document.querySelector('[aria-modal="true"]'));
    const load = () => {
      if (dead || controller || !visible || ((!media.matches || reduced) && !state.current.prepare && !state.current.open)) return;
      onSceneStatus?.("loading");
      controller = new AbortController();
      const signal = controller.signal;
      scheduled = window.setTimeout(() => {
        import("./createVinylScene").then(module => module.createVinylScene(element, signal, studio, reduced)).then(instance => {
          if (dead || signal.aborted) { instance.dispose(); return; }
          scene = instance;
          sceneRef.current = instance;
          if (studio) instance.setPlayer(state.current.open, true);
          instance.setPlaying(state.current.playing);
          updateActivity();
          // Reveal WebGL only after it has rendered the current pose.
          element.dataset.scene = "ready";
          onSceneStatus?.("ready");
        }).catch(error => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          if (dead || signal.aborted) return;
          element.dataset.scene = "poster";
          onSceneStatus?.("error");
          console.warn("Hero uses its static render:", error);
        });
      }, state.current.prepare ? 0 : 200);
    };
    const stop = () => {
      clearTimeout(scheduled); controller?.abort(); controller = undefined;
      scene?.dispose(); scene = undefined;
      sceneRef.current = null;
      element.dataset.scene = "poster";
      onSceneStatus?.("loading");
    };
    const sync = () => { if ((!media.matches || reduced) && !state.current.open && !state.current.prepare) stop(); else load(); };
    loadRef.current = load;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; load(); updateActivity(); });
    observer.observe(element);
    const modalObserver = new MutationObserver(updateActivity);
    modalObserver.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-modal"] });
    const onLost = (event: Event) => { event.preventDefault(); stop(); };
    element.addEventListener("webglcontextlost", onLost, true);
    document.addEventListener("visibilitychange", updateActivity);
    media.addEventListener("change", sync);
    return () => {
      dead = true; clearTimeout(scheduled); controller?.abort(); scene?.dispose();
      sceneRef.current = null;
      loadRef.current = null;
      observer.disconnect(); modalObserver.disconnect();
      element.removeEventListener("webglcontextlost", onLost, true);
      document.removeEventListener("visibilitychange", updateActivity);
      media.removeEventListener("change", sync);
    };
  }, [reduced, studio, onSceneStatus]);

  return <div className={`vinyl-visual ${studio ? "vinyl-studio" : ""}`} ref={host} data-scene="poster">
    {studio && <div className="studio-paper-fallback" aria-hidden="true" />}
    <picture className="vinyl-poster">
      <source srcSet="/images/hero/vinyl-scene.webp" type="image/webp" />
      <img src="/images/hero/vinyl-scene.png" alt="" width={1080} height={1080} fetchPriority="high" draggable={false} />
    </picture>
    {onReplay && !reduced && <div className={studio ? "studio-hit-shell" : "contents"} inert={open} aria-hidden={open || undefined}><button
      type="button"
      aria-label="重播标题动画"
      className="absolute left-[28%] top-[16%] z-10 h-[64%] w-[62%] rounded-full pointer-events-auto cursor-pointer focus-visible:outline-offset-4"
      onClick={() => { if (onReplay()) sceneRef.current?.spin(); }}
    /></div>}
  </div>;
}
