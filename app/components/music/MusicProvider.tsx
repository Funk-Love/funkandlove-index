"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { MUSIC_TRACKS, parseLyrics, type LyricLine, type MusicTrack } from "@/lib/music";

const FADE_SECONDS = .3;
interface Lyrics { id: string; lines: LyricLine[]; plain: string; error?: boolean }

interface Music {
  activated: boolean; activate: () => void; index: number; track: MusicTrack;
  playing: boolean; waiting: boolean; time: number; volume: number; duration: number; error: string;
  toggle: () => void; select: (index: number) => void; seek: (time: number) => void; setVolume: (volume: number) => void;
  currentLyrics: Lyrics | null;
}
const MusicContext = createContext<Music | null>(null);

export function useMusic() {
  const music = useContext(MusicContext);
  if (!music) throw new Error("MusicProvider is missing");
  return music;
}

export default function MusicProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const graph = useRef<{ context: AudioContext; gain: GainNode } | null>(null);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const request = useRef(0);
  const initialized = useRef(false);
  const volumeRef = useRef(.65);
  const [activated, setActivated] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [time, setTime] = useState(0);
  const [volume, setVolumeState] = useState(.65);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [error, setError] = useState("");
  const [lyricState, setLyricState] = useState<Lyrics | null>(null);
  const track = MUSIC_TRACKS[index];

  useEffect(() => {
    if (!activated) return;
    const abort = new AbortController();
    fetch(track.lyrics, { signal: abort.signal }).then(response => {
      if (!response.ok) throw new Error("Lyrics unavailable");
      return response.text();
    }).then(text => {
      if (!abort.signal.aborted) setLyricState({ id: track.id, lines: track.lyricsFormat === "lrc" ? parseLyrics(text) : [], plain: track.lyricsFormat === "txt" ? text : "" });
    }).catch(() => { if (!abort.signal.aborted) setLyricState({ id: track.id, lines: [], plain: "", error: true }); });
    return () => abort.abort();
  }, [activated, track]);

  const cancelPause = useCallback(() => {
    if (pauseTimer.current !== null) clearTimeout(pauseTimer.current);
    pauseTimer.current = null;
  }, []);

  const activate = useCallback(() => {
    const el = audio.current;
    if (!el || initialized.current) return;
    initialized.current = true;
    setActivated(true);
    el.preload = "metadata";
    el.src = MUSIC_TRACKS[0].audio;
  }, []);

  const pause = useCallback(() => {
    const el = audio.current;
    if (!el || pauseTimer.current !== null) return;
    request.current++;
    setPlaying(false);
    setWaiting(false);
    const sound = graph.current;
    if (el.paused || !sound || sound.context.state !== "running") { el.pause(); return; }
    // Audio-clock automation keeps the fade smooth even if the page is busy.
    const now = sound.context.currentTime;
    sound.gain.gain.cancelScheduledValues(now);
    sound.gain.gain.setValueAtTime(sound.gain.gain.value, now);
    sound.gain.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);
    pauseTimer.current = setTimeout(() => {
      pauseTimer.current = null;
      el.pause();
    }, FADE_SECONDS * 1000);
  }, []);

  const play = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    activate();
    cancelPause();
    const version = ++request.current;
    setError("");
    setWaiting(true);
    try {
      if (!graph.current) {
        const context = new AudioContext();
        const gain = context.createGain();
        context.createMediaElementSource(el).connect(gain);
        gain.connect(context.destination);
        graph.current = { context, gain };
      }
      const { context, gain } = graph.current;
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setValueAtTime(volumeRef.current, context.currentTime);
      // Starting music is also an explicit switch away from any playing video.
      document.querySelectorAll('video').forEach(video => { if (!video.paused) video.pause(); });
      if (el.error) el.load();
      void Promise.all([context.resume(), el.play()]).then(() => {
        if (version === request.current) { setPlaying(true); setWaiting(false); }
      }).catch((reason: DOMException) => {
        if (version !== request.current || reason.name === "AbortError") return;
        el.pause();
        setPlaying(false);
        setWaiting(false);
        setError(reason.name === "NotAllowedError" ? "点击播放，开始听歌。" : "音频未能播放，请重试或换一首。");
      });
    } catch {
      setWaiting(false);
      setError("音频未能播放，请重试。");
    }
  }, [activate, cancelPause]);

  const select = useCallback((next: number) => {
    const el = audio.current;
    if (!el) return;
    activate();
    cancelPause();
    request.current++;
    const target = (next + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    setIndex(target);
    setTime(0);
    setMediaDuration(0);
    el.src = MUSIC_TRACKS[target].audio;
    el.load();
    play();
  }, [activate, cancelPause, play]);

  const toggle = () => {
    if (pauseTimer.current !== null || (audio.current?.paused && !waiting)) play();
    else pause();
  };
  const setVolume = (value: number) => {
    const next = Math.max(0, Math.min(1, value));
    volumeRef.current = next;
    setVolumeState(next);
    const sound = graph.current;
    if (sound && pauseTimer.current === null) sound.gain.gain.setValueAtTime(next, sound.context.currentTime);
  };
  const duration = mediaDuration || MUSIC_TRACKS[index].durationSeconds;
  const seek = (value: number) => {
    if (audio.current && audio.current.readyState > 0) {
      const position = Math.max(0, Math.min(value, duration));
      audio.current.currentTime = position;
      setTime(position);
    }
  };

  useEffect(() => {
    // Media play events do not bubble, so listen in capture without changing Plyr/HLS.
    const onVideoPlay = (event: Event) => { if (event.target instanceof HTMLVideoElement) pause(); };
    document.addEventListener("play", onVideoPlay, true);
    return () => document.removeEventListener("play", onVideoPlay, true);
  }, [pause]);

  useEffect(() => {
    const el = audio.current;
    const pending = request;
    return () => {
      pending.current++;
      cancelPause();
      el?.pause();
      const sound = graph.current;
      graph.current = null;
      if (sound) void sound.context.close();
    };
  }, [cancelPause]);

  const music = { activated, activate, index, track: MUSIC_TRACKS[index], playing, waiting, time, volume, duration, error,
    toggle, select, seek, setVolume, currentLyrics: lyricState?.id === track.id ? lyricState : null };
  return <MusicContext.Provider value={music}>
    <audio ref={audio} preload="none" aria-label="Funk 音乐播放器"
      onLoadedMetadata={event => setMediaDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
      onPlaying={() => { if (pauseTimer.current === null) { setPlaying(true); setWaiting(false); } }}
      onPause={() => { setPlaying(false); setWaiting(false); }}
      onWaiting={() => { if (pauseTimer.current === null) setWaiting(true); }}
      onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
      onEnded={() => { if (pauseTimer.current === null) select(index + 1); }}
      onError={() => { setPlaying(false); setWaiting(false); setError("音频加载失败，点击播放重试，或换一首。"); }}
    />
    {children}
  </MusicContext.Provider>;
}
