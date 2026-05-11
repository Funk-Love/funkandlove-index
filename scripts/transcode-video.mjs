// 视频转码:把 4K 母版切成 6 档 HLS ABR + poster。
// 走 NVENC(N 卡硬件编码,preset p7 最高质量档),约 1-2 分钟跑完。
//
// 输出:public/video/promo/
//   ├── master.m3u8
//   ├── poster.webp
//   ├── v2160p/{index.m3u8, seg_*.ts}
//   ├── v1440p/...
//   ├── v1080p/...
//   ├── v720p/...
//   ├── v480p/...
//   └── v360p/...
//
// 用法:node scripts/transcode-video.mjs

import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const INPUT = resolve(ROOT, "完整版.mp4");
const OUT_DIR = resolve(ROOT, "public/video/promo");

// 6 档阶梯:同 YouTube。码率单位 kbps。
const LADDERS = [
  { name: "2160p", h: 2160, vbr: 14000, maxrate: 16000, bufsize: 28000, abr: 192 },
  { name: "1440p", h: 1440, vbr: 8000, maxrate: 9200, bufsize: 16000, abr: 160 },
  { name: "1080p", h: 1080, vbr: 5000, maxrate: 5800, bufsize: 10000, abr: 128 },
  { name: "720p", h: 720, vbr: 2800, maxrate: 3200, bufsize: 5600, abr: 128 },
  { name: "480p", h: 480, vbr: 1200, maxrate: 1400, bufsize: 2400, abr: 96 },
  { name: "360p", h: 360, vbr: 600, maxrate: 700, bufsize: 1200, abr: 96 },
];

const HLS_TIME = 6; // 6 秒分片
const FPS = 25;
const GOP = HLS_TIME * FPS; // 关键帧间隔 = 分片时长 × fps,允许干净切片

function run(cmd, args) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: "inherit" });
    p.on("exit", (code) => (code === 0 ? res() : rej(new Error(`${cmd} exit ${code}`))));
    p.on("error", rej);
  });
}

function ffmpegPath(path) {
  return path.replace(/\\/g, "/");
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

// 1. 抽 poster(第 1 秒一帧,webp Q80)
console.log("\n[poster] generating...");
await run("ffmpeg", [
  "-y",
  "-ss", "1",
  "-i", INPUT,
  "-frames:v", "1",
  "-vf", "scale=1920:-2",
  "-q:v", "80",
  resolve(OUT_DIR, "poster.webp"),
]);

// 2. 构造 filter_complex:split → scale to each height (-2 保证宽偶数)
const splits = LADDERS.map((_, i) => `[v${i}]`).join("");
const filter = [
  `[0:v]split=${LADDERS.length}${splits}`,
  ...LADDERS.map((l, i) => `[v${i}]scale=-2:${l.h}[vo${i}]`),
].join(";");

// 3. 拼 ffmpeg 主命令(NVENC p7 高质量,VBR HQ 模式)
const args = ["-y", "-i", INPUT, "-filter_complex", filter];

LADDERS.forEach((l, i) => {
  args.push(
    "-map", `[vo${i}]`,
    `-c:v:${i}`, "h264_nvenc",
    `-preset:v:${i}`, "p7",      // p1 最快 ~ p7 最慢最优
    `-tune:v:${i}`, "hq",
    `-rc:v:${i}`, "vbr",
    `-cq:v:${i}`, "19",
    `-b:v:${i}`, `${l.vbr}k`,
    `-maxrate:v:${i}`, `${l.maxrate}k`,
    `-bufsize:v:${i}`, `${l.bufsize}k`,
    `-profile:v:${i}`, "high",
    `-g:v:${i}`, `${GOP}`,
    `-keyint_min:v:${i}`, `${GOP}`,
    "-sc_threshold:v", "0",
  );
});

LADDERS.forEach((l, i) => {
  args.push("-map", "a:0", `-c:a:${i}`, "aac", `-b:a:${i}`, `${l.abr}k`, "-ac", "2");
});

const varStreamMap = LADDERS.map((l, i) => `v:${i},a:${i},name:${l.name}`).join(" ");

args.push(
  "-f", "hls",
  "-hls_time", `${HLS_TIME}`,
  "-hls_playlist_type", "vod",
  "-hls_segment_filename", ffmpegPath(resolve(OUT_DIR, "v%v/seg_%03d.ts")),
  "-master_pl_name", "master.m3u8",
  "-var_stream_map", varStreamMap,
  ffmpegPath(resolve(OUT_DIR, "v%v/index.m3u8")),
);

console.log("\n[hls] encoding 6 ladders with NVENC p7...");
console.time("encode");
await run("ffmpeg", args);
console.timeEnd("encode");

console.log(`\n✓ done -> ${OUT_DIR}`);
