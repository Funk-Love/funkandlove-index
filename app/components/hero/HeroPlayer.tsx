"use client";

import { Disc3, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { MUSIC_TRACKS, musicTime } from "@/lib/music";
import PlayerLyrics from "./PlayerLyrics";
import { useMusic } from "../music/MusicProvider";

interface Props { open: boolean }

export default function HeroPlayer({ open }: Props) {
  const { index, track, playing, waiting, time, volume, duration, error, toggle, select, seek, setVolume, currentLyrics } = useMusic();
  return <div className="deck-content">
    <div className="deck-left">
      <div className="deck-record-space" aria-hidden="true" />
      <div className="deck-track-heading" aria-live="polite">
        <h2>{track.title}</h2>
        <p>{track.artist}</p>
      </div>
      <div className="deck-seek">
        <input aria-label="播放进度" aria-valuetext={`${musicTime(time)} / ${musicTime(duration)}`} type="range" min={0} max={duration} step={.1} value={Math.min(time, duration)}
          onChange={event => seek(Number(event.target.value))} />
        <div><span>{musicTime(time)}</span><span>{musicTime(duration)}</span></div>
      </div>
      <div className="deck-transport">
        <div className="deck-play-buttons">
          <button type="button" aria-label="上一首" onClick={() => select(index - 1)}><SkipBack size={19} /></button>
          <button type="button" className="deck-play" aria-label={playing || waiting ? "暂停" : "播放"} onClick={toggle}>
            {playing || waiting ? <Pause size={23} fill="currentColor" /> : <Play size={23} fill="currentColor" />}
          </button>
          <button type="button" aria-label="下一首" onClick={() => select(index + 1)}><SkipForward size={19} /></button>
        </div>
        <div className="deck-volume">
          <button type="button" aria-label={volume ? "静音" : "取消静音"} onClick={() => setVolume(volume ? 0 : .65)}>
            {volume ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <input aria-label="音量" type="range" min="0" max="1" step=".01" value={volume} onChange={event => setVolume(Number(event.target.value))} />
        </div>
      </div>
      <p className="deck-status" role="status">{error || (waiting ? "唱片加载中…" : "")}</p>
    </div>
    <div className="deck-right">
      <div className="deck-lyrics" aria-label="歌词">
        {!currentLyrics ? <p className="deck-lyric-next">歌词加载中…</p> : currentLyrics.error ? <p>歌词暂时无法读取，音乐仍可播放。</p> : currentLyrics.plain ?
          <div className="deck-plain-lyrics" tabIndex={0} aria-label="完整歌词，无同步时间轴">{currentLyrics.plain}</div> :
          <PlayerLyrics key={track.id} lines={currentLyrics.lines} time={time} open={open} onSeek={seek} />}
      </div>
      <div className="deck-library-heading"><span>唱片架</span><span>{MUSIC_TRACKS.length} tracks</span></div>
      <ol className="deck-library">
        {MUSIC_TRACKS.map((item, i) => <li key={item.id}>
          <button type="button" aria-label={`播放 ${item.title}`} aria-current={i === index ? "true" : undefined} onClick={() => select(i)}>
            <span className="deck-track-number">{i === index && playing ? <Disc3 size={16} /> : String(i + 1).padStart(2, "0")}</span>
            <span className="deck-track-name">{item.title}<small>{item.artist}</small></span>
            <span className="deck-track-duration">{musicTime(item.durationSeconds)}</span>
          </button>
        </li>)}
      </ol>
    </div>
  </div>;
}
