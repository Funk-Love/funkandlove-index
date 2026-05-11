// 生成 LQIP 占位图:把首屏关键图压成 ~40px 宽的 webp,放进 public/。
// 部署随静态资源推到 OSS,作为常规 .webp 走 CDN,
// 不吃 OSS 图片处理请求,体积 ~500B,与 HTML 几乎同时到。
//
// 用法:node scripts/gen-lqip.mjs(或 npm run lqip)

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, resolve, parse } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");

const SOURCES = ["public/images/team-bg.jpg"];

const LQIP_WIDTH = 40;
const LQIP_QUALITY = 40;

for (const src of SOURCES) {
  const inPath = resolve(ROOT, src);
  const { dir, name } = parse(src);
  const lqipOut = resolve(ROOT, dir, `${name}-lqip.webp`);
  await mkdir(dirname(lqipOut), { recursive: true });

  const lqip = await sharp(inPath)
    .resize({ width: LQIP_WIDTH })
    .webp({ quality: LQIP_QUALITY })
    .toFile(lqipOut);
  console.log(`[lqip] ${src} -> ${dir}/${name}-lqip.webp (${lqip.size}B, ${lqip.width}x${lqip.height})`);
}
