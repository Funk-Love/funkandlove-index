# 静态资源说明

`public/` 不入库（见 `.gitignore`）。图片、音频、视频全部托管在阿里云 OSS，**公有读**，不需要任何密钥就能拉。本文档说明资源在哪、怎么拉、以及哪些是构建硬依赖。

## 资源地址

| 项 | 值 |
|---|---|
| Bucket | `funkandlove-index`（华东1 杭州） |
| 访问域名 | `https://funk-and.love` |
| 路径规则 | `public/` 下的相对路径 = 线上 URL 路径 |

`public/images/team-bg.jpg` 对应 `https://funk-and.love/images/team-bg.jpg`。因为站点本身也静态托管在同一个 bucket，`next build` 产出的 `out/` 会把 `public/` 铺到根目录，所以资源路径和线上 URL 天然一致。

含中文的目录（`images/members/25届/`）需要逐段 percent-encode，拉取脚本已经处理。

## 怎么拉

bucket 是公有读但**不公有 list**（任何列举请求都被静态网站托管回落成首页 HTML），所以没法自动发现文件。仓库里提交了一份清单 `asset-manifest.json`，按它拉：

```bash
npm run fetch-assets                      # required + recommended，约 133 MB
npm run fetch-assets -- --tier=required   # 只拉构建必需的，约 63 MB
npm run fetch-assets -- --all             # 含宣传片，约 1.3 GB
npm run fetch-assets -- --dry-run         # 只看要拉什么，不写文件
```

脚本按文件大小跳过已经正确的本地文件，可以随时重跑补齐；下载先写 `.part` 再改名，中断不会留半个文件。`--force` 强制重下。

## 三档资源

清单里每个文件都标了 `tier`：

### `required` — 77 个文件，63 MB

缺了 `npm run build` 直接失败：

- `audio/music/library.json` — 被 [lib/music.ts](../lib/music.ts#L1) 在构建期 `import`，缺了编译不过
- `audio/music/*.lrc`、`*.txt` — 歌词
- `images/leaders/`、`images/members/` — 历届队长与成员**原图**。`prebuild` 的两个预览图生成器要读它们，缺了 `stat` 报 ENOENT 中断
- `images/hero/` — 黑胶场景贴图与首屏静帧
- `favicon.ico`、`icon*.png`、`beian.html` 等根文件

### `recommended` — 116 个文件，70 MB

dev server 能起，但页面视觉残缺：

- `images/team-bg.jpg` + `team-bg-lqip.webp` + `team-config.json` — 团队合照与轮廓配置
- `images/features-bg.png` — 团队特色配图
- `images/leader-previews/`、`images/member-previews/` — 预览 WebP。也可以不下载，本地跑 `npm run leader-previews` / `npm run member-previews` 从原图生成
- `audio/music/*.mp3` — 曲库音频，58 MB。不拉播放器没声音

### `optional` — 105 个文件，1.18 GB

- `video/promo/` — 宣传片 HLS 六档码率切片。**只改视频播放器时才需要**，日常开发跳过

## 改了资源之后

往 `public/` 加了或删了文件，要重新生成清单并提交：

```bash
node scripts/gen-asset-manifest.mjs   # 重写 asset-manifest.json
npm run deploy                        # 构建 + ossutil 同步到 OSS
```

清单是按本地 `public/` 扫出来的，可能包含还没部署上去的文件。拉取时线上 404 的条目会在末尾单独列出，不算失败 —— 那是清单里的过期条目。

分档规则写在 [scripts/gen-asset-manifest.mjs](../scripts/gen-asset-manifest.mjs) 的 `tierFor()` 里，加了新类型的资源记得同步。

## 为什么不用 Git LFS

`public/` 1.3 GB，其中 92% 是宣传片切片。GitHub LFS 免费额度是 1 GB 存储 / 1 GB 月带宽，几个人 clone 一次就超。资源本来就要部署到 OSS，从 OSS 拉是零额外成本的。
