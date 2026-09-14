"use client";

import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Disc3 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import HeroVisual from "./HeroVisual";
import HeroPlayer from "./HeroPlayer";
import { useMusic } from "../music/MusicProvider";

gsap.registerPlugin(useGSAP);

/** One object, two uses. The paper and record stay in the same WebGL scene. */
export default function HeroExperience({ children, onReplay }: { children: ReactNode; onReplay?: () => boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const entry = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [requested, setRequested] = useState(false);
  const [sceneStatus, setSceneStatus] = useState<"loading" | "ready" | "error">("loading");
  const open = requested && sceneStatus !== "loading";
  const preparing = requested && sceneStatus === "loading";
  const [visited, setVisited] = useState(false);
  const { playing, activate } = useMusic();
  const reduced = usePrefersReducedMotion();
  useGSAP(() => {
    timeline.current?.kill();
    const tl = gsap.timeline();
    timeline.current = tl;
    tl.to(".studio-intro", { opacity: open ? 0 : 1, duration: reduced ? 0 : .28 }, open || reduced ? 0 : .55)
      .to(".studio-player", { opacity: open ? 1 : 0, y: open ? 0 : 12, duration: reduced ? 0 : .4, ease: "power3.out" }, open && !reduced && sceneStatus === "ready" ? .65 : 0);
    if (visited) (open ? back : entry).current?.focus({ preventScroll: true });
  }, { scope: root, dependencies: [open, reduced, visited, sceneStatus] });
  const close = () => { setRequested(false); };

  return <div ref={root} className="hero-studio" data-player-open={open}
    onWheel={event => {
      // The bounded lyrics/library scroll internally; transport retains page navigation.
      if (open && event.target instanceof Element && event.target.closest('.deck-lyrics, .deck-library')) event.stopPropagation();
    }}
    onKeyDown={event => {
      if (!requested) return;
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); }
      else if (event.key !== "Tab" && event.target instanceof Element && event.target.closest('.deck-lyrics, .deck-library')) event.stopPropagation();
    }}>
    <div className="studio-intro" inert={open} aria-hidden={open || undefined}>{children}</div>
    <div className="studio-art"><HeroVisual studio open={open} prepare={requested} playing={playing} onReplay={onReplay} onSceneStatus={setSceneStatus} /></div>
    <button ref={entry} type="button" className="studio-entry" aria-label="打开唱片播放器" aria-expanded={open} aria-controls="hero-player"
      inert={open} aria-busy={preparing} disabled={preparing}
      onClick={() => { activate(); setVisited(true); setRequested(true); }}>
      <Disc3 size={23} strokeWidth={1.4} /><span>{preparing ? "准备唱片…" : "听点 Funk"}</span><ArrowUpRight size={17} />
    </button>
    <div id="hero-player" className="studio-player" inert={!open} aria-hidden={!open}>
      <button ref={back} type="button" className="studio-back" onClick={close}><ArrowLeft size={16} />收起唱片</button>
      {visited && <HeroPlayer open={open} />}
    </div>
  </div>;
}
