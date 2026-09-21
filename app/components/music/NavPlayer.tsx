"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Disc3, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { musicTime } from "@/lib/music";
import { usePrefersReducedMotion } from "@/app/hooks/usePrefersReducedMotion";
import BrandMark from "../shared/BrandMark";
import { useMusic } from "./MusicProvider";
import "./nav-player.css";

gsap.registerPlugin(useGSAP);

export default function NavPlayer({ mobile = false, onHome, brandClassName = "", menuOpen }: {
  mobile?: boolean;
  onHome?: () => void;
  brandClassName?: string;
  menuOpen?: boolean;
}) {
  const music = useMusic();
  const recordRef = useRef<HTMLSpanElement>(null);
  const rotation = useRef<gsap.core.Tween | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [outsideHero, setOutsideHero] = useState(false);
  useEffect(() => {
    if (mobile) return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setOutsideHero(!entry.isIntersecting), {
      rootMargin: "-80px 0px 0px",
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [mobile]);
  const active = mobile ? Boolean(menuOpen) : music.activated && outsideHero;
  useGSAP(() => {
    const record = recordRef.current;
    if (!record) return;
    // Kill only the previous rotation, preserving its current angle on interruption.
    rotation.current?.kill();
    rotation.current = gsap.to(record, active && music.playing && !reducedMotion ? {
      rotation: "+=360", duration: 8, repeat: -1, ease: "none",
    } : {
      rotation: "0_short", duration: reducedMotion ? 0 : .22, ease: "power2.out",
    });
  }, { dependencies: [active, music.playing, reducedMotion] });
  const lyrics = music.currentLyrics;
  let line = "前奏";
  if (!music.activated) line = music.track.artist;
  else if (!lyrics) line = "歌词加载中…";
  else if (lyrics.error) line = "歌词暂时不可用";
  else if (lyrics.plain) line = lyrics.plain.split(/\r?\n/).find(text => text.trim()) || music.track.artist;
  else lyrics.lines.forEach(item => { if (item.time <= music.time) line = item.text || "间奏"; });
  const caption = music.error ? "暂时无法播放，点击重试" : music.waiting ? "唱片加载中…" : line;

  const player = <div className={`nav-player${mobile ? " nav-player-mobile" : ""}`} role="group" aria-label="迷你音乐播放器"
    data-active={active} data-playing={music.playing} aria-hidden={!active} inert={!active}>
    <div className="nav-player-main">
    {mobile && <span ref={recordRef} className="nav-drawer-record" aria-hidden="true"><Disc3 size={18} strokeWidth={1.4} /></span>}
    <div className="nav-player-track" title={`${music.track.title} — ${music.track.artist}`}>
      <strong>{music.track.title}</strong>
    </div>
    <button type="button" aria-label="音乐上一首" onClick={() => music.select(music.index - 1)}><SkipBack size={15} /></button>
    <button type="button" className="nav-player-toggle" aria-label={music.playing || music.waiting ? "暂停音乐" : "播放音乐"} onClick={music.toggle}>
      {music.playing || music.waiting ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
    </button>
    <button type="button" aria-label="音乐下一首" onClick={() => music.select(music.index + 1)}><SkipForward size={15} /></button>
    </div>
    <div className="nav-player-caption" title={lyrics?.plain ? `${caption}（无同步时间轴）` : caption}>
      <span className="nav-player-lyric">{caption}</span>
      <span className="nav-player-time" aria-hidden="true">{musicTime(music.time)}</span>
    </div>
    <input className="nav-player-seek" aria-label="迷你播放器进度" aria-valuetext={`${musicTime(music.time)} / ${musicTime(music.duration)}`}
      type="range" min={0} max={music.duration} step={.1} value={Math.min(music.time, music.duration)} disabled={!music.activated}
      style={{ '--played': `${Math.min(100, music.time / music.duration * 100)}%` } as CSSProperties}
      onChange={event => music.seek(Number(event.target.value))} />
  </div>;

  if (mobile) return player;
  return <div className={`nav-brand-group ${brandClassName}`} data-player-active={active}>
    <button type="button" onClick={onHome} className="nav-brand-icon" aria-label="回到顶部">
      <span ref={recordRef} className="nav-brand-record"><BrandMark className="w-9 h-9" /></span>
    </button>
    <div className="nav-brand-content">
      <button type="button" onClick={onHome} className="nav-brand-name font-display text-xl tracking-wide">
        Funk <span className="font-sans font-semibold">&amp;</span> Love
      </button>
      {player}
    </div>
  </div>;
}
