import library from "@/public/audio/music/library.json";

export const MUSIC_TRACKS = library;
export type MusicTrack = (typeof MUSIC_TRACKS)[number];
export interface LyricLine { time: number; text: string }

/** These supplied LRCs put translations at the next line's time. Display original English. */
export function parseLyrics(source: string): LyricLine[] {
  const lines = new Map<number, string>();
  const offset = Number(source.match(/\[offset:([+-]?\d+)\]/i)?.[1] ?? 0) / 1000;
  for (const raw of source.split(/\r?\n/)) {
    const stamps = [...raw.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];
    const text = raw.replace(/\[[^\]]*\]/g, "").trim();
    if (/[\u3400-\u9fff]/.test(text) || /written by|https?:|www\./i.test(text)) continue;
    for (const stamp of stamps) {
      const time = Number(stamp[1]) * 60 + Number(stamp[2]) + offset;
      if (time <= 0 || (!text && lines.has(time))) continue;
      lines.set(time, text);
    }
  }
  return [...lines].map(([time, text]) => ({ time, text })).sort((a, b) => a.time - b.time);
}

export function musicTime(seconds: number) {
  const value = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}
