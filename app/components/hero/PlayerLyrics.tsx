"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Disc3 } from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { musicTime, type LyricLine } from "@/lib/music";

gsap.registerPlugin(useGSAP);

export default function PlayerLyrics({ lines, time, open, onSeek }: {
  lines: LyricLine[]; time: number; open: boolean; onSeek: (time: number) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [following, setFollowing] = useState(true);
  const reduced = usePrefersReducedMotion();
  const { contextSafe } = useGSAP({ scope: viewport });
  let active = -1;
  lines.forEach((line, index) => { if (line.time <= time) active = index; });

  useEffect(() => {
    const element = viewport.current;
    if (!element || !open) return;
    const align = contextSafe((instant = false) => {
      element.style.setProperty('--lyric-padding', `${element.clientHeight / 2}px`);
      if (!following) return;
      const line = element.querySelector<HTMLElement>(`[data-line="${Math.max(0, active)}"]`);
      if (!line) return;
      const top = line.offsetTop - (element.clientHeight - line.offsetHeight) / 2;
      gsap.to(element, { scrollTop: top, duration: reduced || instant ? 0 : .5, ease: 'power3.out', overwrite: true });
    });
    align();
    let lastSize = `${element.clientWidth}:${element.clientHeight}`;
    const observer = new ResizeObserver(() => {
      const size = `${element.clientWidth}:${element.clientHeight}`;
      if (size !== lastSize) { lastSize = size; align(true); }
    });
    observer.observe(element);
    return () => { observer.disconnect(); gsap.killTweensOf(element); };
  }, [active, following, open, reduced, lines, contextSafe]);

  const browse = () => { if (viewport.current) gsap.killTweensOf(viewport.current); setFollowing(false); };
  return <div className="deck-lyric-window">
    <div ref={viewport} className="deck-lyric-scroll" tabIndex={0} aria-label="滚动歌词，可点击歌词跳转"
      onWheel={browse} onTouchStart={browse}
      onKeyDown={event => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) browse(); }}>
      <div className="deck-lyric-lines">
        {lines.map((line, index) => <button key={`${line.time}-${index}`} type="button" data-line={index}
          className="deck-lyric-line" aria-current={index === active ? 'true' : undefined}
          aria-label={`${musicTime(line.time)} ${line.text || '间奏'}`}
          onClick={() => { setFollowing(true); onSeek(line.time); }}>
          {line.text || <Disc3 size={22} strokeWidth={1.3} aria-hidden="true" />}
        </button>)}
      </div>
    </div>
    {!following && <button className="deck-lyric-follow" type="button" onClick={() => setFollowing(true)}>回到当前</button>}
  </div>;
}
