"use client";

import { useEffect, useRef } from "react";
import "plyr/dist/plyr.css";
import "./video-player.css";

interface Props {
  src: string;
  poster?: string;
  className?: string;
}

/** Plyr 列表里 0 表示 Auto(交还 hls.js ABR)。 */
const AUTO = 0;

/**
 * HLS 视频:hls.js + Plyr。
 * 优先走 hls.js 以接入 Plyr 画质菜单;不支持 MSE 时才退回原生 HLS。
 */
export default function VideoPlayer({ src, poster, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: import("hls.js").default | null = null;
    let player: import("plyr").default | null = null;
    let cancelled = false;

    (async () => {
      const [{ default: Hls }, { default: Plyr }] = await Promise.all([
        import("hls.js"),
        import("plyr"),
      ]);
      if (cancelled || !videoRef.current) return;

      const baseControls = [
        "play-large",
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "pip",
        "fullscreen",
      ];

      const createNativePlayer = () => {
        video.src = src;
        player = new Plyr(video, {
          controls: baseControls,
          settings: ["speed"],
          speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
          ratio: "16:9",
          i18n: {
            speed: "速度",
            normal: "正常",
          },
        });
      };

      if (!Hls.isSupported()) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          createNativePlayer();
        }
        return;
      }

      hls = new Hls({
        startLevel: -1,
        capLevelToPlayerSize: true,
        maxBufferLength: 120,
        maxBufferSize: 0,
        maxMaxBufferLength: 600,
      });
      hls.attachMedia(video);
      hls.loadSource(src);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (cancelled || !videoRef.current || !hls) return;

        // 从高到低,Auto 排首位
        const heights = [...new Set(hls.levels.map((l) => l.height).filter(Boolean))]
          .sort((a, b) => b - a);
        const options = [AUTO, ...heights];

        // 关键:Plyr 必须在 MANIFEST_PARSED 后用包含 quality.options 的完整配置创建,
        // 中途用 player.quality= 改无法重建菜单。
        player = new Plyr(video, {
          controls: baseControls,
          settings: ["quality", "speed"],
          speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
          ratio: "16:9",
          quality: {
            default: AUTO,
            options,
            forced: true,
            onChange(newQuality: number) {
              if (!hls) return;
              if (newQuality === AUTO) {
                hls.currentLevel = -1;
                return;
              }
              const i = hls.levels.findIndex((l) => l.height === newQuality);
              if (i !== -1) hls.currentLevel = i;
            },
          },
          i18n: {
            speed: "速度",
            normal: "正常",
            quality: "画质",
            qualityLabel: { [AUTO]: "自动" },
          },
        });

        // 实时把 "Auto" 标签更新成 "Auto (xxxp)",反馈 ABR 当前实际档位
        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
          if (!hls) return;
          const span = document.querySelector<HTMLSpanElement>(
            `.plyr__menu__container [data-plyr='quality'][value='${AUTO}'] span`
          );
          if (!span) return;
          span.textContent = hls.autoLevelEnabled
            ? `自动 (${hls.levels[data.level].height}p)`
            : "自动";
        });
      });
    })();

    return () => {
      cancelled = true;
      player?.destroy();
      hls?.destroy();
    };
  }, [src]);

  return (
    <div className={`plyr-funk ${className ?? ""}`}>
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        preload="metadata"
        className="w-full h-full"
      />
    </div>
  );
}
