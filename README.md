# Funk & Love - 官方网站

> 浙江大学DFM街舞社Locking团队官方主页

## 项目简介

Funk & Love 是浙江大学 DFM 街舞社的 Locking 团队官方网站。以 70s Funk 复古海报风格呈现团队介绍、合照、历届队长与成员，并提供可交互的 3D 黑胶唱片播放器。

**Slogan**: Lock it, Point it, Groove it!  
**理念**: 用舞蹈传递快乐

## 技术栈

- **框架**: Next.js 16 (App Router, `output: 'export'` 纯静态导出)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4,语义 token 全部定义在 `app/globals.css` 的 `@theme`
- **动画**: GSAP(滚动揭示 `useReveal`、Leaders 横滚、Hero 文字形变 Flip)+ Framer Motion(仅弹窗 / 抽屉 / Toast 进出场)
- **3D 与音频**: Three.js 黑胶与纸套场景 + 原生 HTML Audio + LRC 同步歌词
- **视频**: hls.js + Plyr(HLS 多码率宣传片)
- **字体**: 本地自托管(`app/fonts/`,经 `next/font/local`):Inter(正文与形变标题)、Righteous(展示标题)
- **图标**: Lucide React,经 `lib/icons.ts` 注册表按名解析(`Sparkles` 全局禁用,ESLint 强制)
- **部署**: 阿里云 OSS 静态托管 + OSS 图片处理(webp 转码)

## 设计语言(2026 版)

70s Funk 海报 × 编辑部网格。奶油纸面承担阅读区,深棕舞台承托 Hero 与队长区,焦橙 / 芥末黄做重点,暖金属只给创始人荣誉。

- token 家族:`paper-*`(纸面)/ `ink-*`(墨)/ `stage-*`(舞台)/ `accent-*`(焦橙)/ `pop-*`(芥末黄)/ `warm-*`(暖金属)/ `cool-*`(青)/ `ok-*`(绿)/ `role-*`(队长角色配对)
- 工具类:`paper-grain` / `paper-grain-dark`(纸张颗粒,每段最多一层)、`shadow-hard*`(海报硬阴影,只给强调元素)、`grid-editorial`(12 列)、`rule-accent`
- 动效词汇:`lib/motion.ts`(过冲锁定 / 克制揭示),局部使用,不改 `gsap.defaults()`
- Hero 主视觉:`app/components/hero/`，Three.js 黑胶与纸套模型已接入，静帧用于首屏加载与移动端初始展示
- 重构方案与决策记录:`DESIGN_REFACTOR_PLAN.md`

## 功能特性

- **Hero 文字形变**：首轮自动播放，之后点击唱片重播；标题悬停不触发。
- **3D 唱片播放器**：点击“听点 Funk”，同一个黑胶和纸套模型展开为播放器；支持播放/暂停、切歌、进度、音量及顺序播放。
- **多行滚动歌词**：当前句居中高亮，点击歌词跳转；手动浏览后可恢复跟随。无有效时间轴的歌词按正文展示。
- **导航迷你播放器**：离开 Hero 后显示曲名、当前歌词、可拖动进度及播放/暂停、前后切歌；品牌文字与播放器短过渡切换，图标仅在播放器显示且播放时匀速旋转，暂停或返回品牌时用 220ms 就近转正。桌面和手机共用同一个音频与歌词数据，浏览其他区段时持续播放。
- **团队合照轮廓**：SVG 轮廓高亮与跟随花名，支持鼠标、键盘和触摸。
- **历年队长横滚**：桌面端滚动驱动横向浏览，点击查看详情；队长与副队长通过角色配色区分。
- **历年成员**：按届次浏览，输入花名实时生成个人上场名牌，无需提交。
- **响应式与减少动效**：桌面、手机共用内容数据；减少动效时关闭吸附，队长改为网格，揭示内容直接可见。
- **纯静态发布**：构建时生成页面，生产环境不需要 Node.js 服务。

### 滚动与播放器交互

桌面端前四段（Hero、介绍、合照、特色）及队长区入口使用锚点切换，进入队长区后自然滚动驱动横移，后续成员与关注区自由滚动。吸附仅在宽度 ≥ 1024px、高度 ≥ 720px、前四段均可完整容纳且未启用减少动效时开启。

播放器打开时保留页面锚点切换，歌词和曲库独立处理内部滚动；进度和音量输入不会触发键盘翻页。移动端和平板展开高度按视口约束，长内容在内部滚动，不撑长 Hero。桌面迷你播放器位于导航栏内；竖屏保留右上角品牌 icon 小按钮，播放器放在点开后的导航抽屉内。进入播放器不自动出声，收起或 Hero 离屏后音乐继续播放。手动暂停或开始播放视频时，音乐用 300ms 淡出后暂停；恢复播放直接使用设定音量，不淡入。视频结束后不自动恢复音乐，主动播放音乐会暂停正在播放的视频。

竖屏在客户端确认断点前显示品牌占位，避免静态导出的桌面布局闪现。首次进入播放器先准备 3D 模型，期间保留原画面；模型绘制就绪后再执行展开转场。

所有“加入我们”入口共用 `RECRUIT_CONTACT`：26届队长乙烯，微信 `LKSnFL2026`。

`MusicProvider` 在桌面/手机视图之外持有一个 audio 元素，切换断点不重置曲目与进度；首次进入播放器才设置音源，不预加载整库。3D 场景按需加载与渲染，离屏停止渲染但不停止音乐，移动端主动进入播放器后才加载模型。

当前曲库包含 September、Let's Groove、Boogie Wonderland、Brick House、Sing a Song、Get Up Offa That Thing。资源清单、歌词状态和接入约定见 [舞曲库说明](docs/MUSIC_LIBRARY.md)。

### 移动端设计

移动端（屏幕宽度 < 768px）走 `app/components/mobile/` 下的独立视图，桌面端走 `app/components/desktop/`。两端均为 7 段：Hero、团队介绍、合照、特色、历届队长、成员、社媒。移动端按竖屏重排、自然滚动，两端共用 `lib/data/` 数据源和 `app/components/shared/` 组件。

## 快速开始

### 安装依赖

准备 Node.js 与 npm，并补齐本地维护的 `public/` 静态资源。该目录不入库，包含构建时直接导入的 `audio/music/library.json` 和生成队长预览图所需的原始照片；仅下载代码不能完成构建。

```bash
npm ci
```

### 开发环境

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

开发验收直接检查 3000 页面。若热更新后出现新组件搭配旧样式，先确认浏览器实际加载的 CSS，刷新仍异常时重启开发服务；不要只凭静态构建预览判断开发页面正常。

### 构建生产版本

```bash
npm run build     # 静态导出到 out/
```

构建前会自动执行 `leader-previews` 和 `member-previews`。队长卡片使用 WebP、个人详情保留原图；成员时间线使用 128px / Q82 圆头像，桌面成员弹窗与手机网格使用最长边 800px / Q84 预览图，成员原图另行保留。`out/` 应交给静态服务器托管；本项目不使用 `npm run start` 预览静态导出。

需要验证音频进度拖动时，静态服务器须支持 MP3 MIME 和 HTTP Range。本地已有预览脚本（先构建）：

```bash
node scripts/preview.mjs
```

地址为 [http://127.0.0.1:4174](http://127.0.0.1:4174)，内容来自 `out/`，修改源码后需重新构建。该脚本仅用于本地预览，不参与部署。

### 其他脚本

```bash
npm run lint      # ESLint
npm run leader-previews  # 更换队长照片后，单独更新卡片 WebP
npm run member-previews  # 更换成员照片后，更新圆头像与网格 WebP
npm run lqip      # 为大图生成 LQIP 占位图(scripts/gen-lqip.mjs)
node scripts/transcode-video.mjs   # 宣传片转 HLS 多码率切片
```

## 项目结构

```
funkandlove-index/
├── app/
│   ├── components/
│   │   ├── desktop/DesktopView.tsx   # 桌面端入口(7 段，前段吸附 + 队长横滚)
│   │   ├── mobile/                   # 移动端各 section
│   │   ├── shared/                   # 两端共用组件(LeaderCard、RecruitDialog 等)
│   │   ├── ui/                       # 基础 UI 组件
│   │   ├── Hero.tsx / TeamInfo.tsx / Team.tsx / TeamFeatures.tsx
│   │   ├── Leaders.tsx / Members.tsx / SocialLinks.tsx   # 桌面端 section
│   │   ├── Navigation.tsx / SectionIndicator.tsx
│   │   ├── hero/                     # 3D 场景、HeroExperience、HeroPlayer、PlayerLyrics
│   │   ├── music/                    # 全站共享音频、淡出与视频联动、导航迷你播放器
│   │   ├── TextMorphAnimation.tsx    # GSAP Flip 文字形变(冻结)
│   │   └── VideoPlayer.tsx           # hls.js + Plyr
│   ├── hooks/                        # useSnapScroll、useReveal、useSectionTracker 等
│   ├── fonts/                        # 自托管 Inter / Righteous 字体
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                      # 断点分发 Mobile / Desktop
├── lib/
│   ├── data/                         # 内容数据源(leaders / members / team)
│   ├── constants.ts                  # 站点配置、导航、社媒
│   ├── cdn.ts                        # OSS 图片处理 URL 拼接
│   ├── music.ts                      # 曲库导入、LRC 解析与时间格式化
│   ├── icons.ts / brand.ts / palette.ts / motion.ts   # 图标注册表、品牌色、JS 调色板、动效常量
│   └── animations.ts / gradients.ts / types.ts
├── scripts/
│   ├── deploy.ps1                    # 构建 + ossutil 同步到 OSS
│   ├── preview.mjs                   # 本地静态预览，支持音频 HTTP Range
│   ├── gen-lqip.mjs                  # LQIP 生成
│   ├── gen-leader-previews.mjs       # 队长卡片 WebP 生成，保留原图
│   ├── gen-member-previews.mjs       # 成员 128px 圆头像与 800px 网格预览
│   └── transcode-video.mjs           # HLS 转码
├── public/                           # 静态资源(不入库，本地维护)
│   ├── audio/music/                  # library.json、MP3、LRC / TXT
│   ├── images/                       # Hero 贴图与静帧、团队图、队长预览与原图、成员头像
│   └── video/promo/                  # HLS 切片 + poster
├── docs/MUSIC_LIBRARY.md             # 曲库与播放器维护约定
├── _qa/                              # 本地调试产物及视觉验收记录，不入库
└── package.json
```

## 配置说明

### 静态资源

`public/` 已被 gitignore，图片、视频、音频及曲库清单在本地和 OSS 上维护。关键文件：

- `images/hero/` - 黑胶场景贴图与首屏静帧
- `images/team-bg.jpg` - 团队合照背景(原图 6000px 级,线上经 OSS 处理限宽 3840 转 webp；Hero 不再使用合照作为固定底图)
- `images/team-bg-lqip.webp` - 上图的 LQIP 占位,由 `npm run lqip` 生成
- `images/team-config.json` - 合照成员轮廓与花名配置
- `images/features-bg.png` - 团队特色配图，文字利用照片左侧留白排版
- `images/leaders/`、`images/members/` - 历届队长、成员头像
- `images/leader-previews/` - 卡片用 WebP，最长边受 1600×960 边界约束，不放大小图
- `images/member-previews/` - 按届次存放成员 WebP；`.thumb.webp` 为 128px 圆头像，其余最长边 800px，不放大小图
- `audio/music/library.json` 及同目录 MP3 / LRC / TXT - 曲库与歌词，不预加载整库
- `video/promo/master.m3u8` - 宣传片 HLS 入口

需要 OSS 转码的图片经 `lib/cdn.ts` 的 `oss()` 挂 `x-oss-process` 参数；本地 dev 会忽略该参数直接返回原图。已生成的 WebP（包括队长卡片预览）直接读取静态文件，本地与线上均使用 WebP。

### 内容配置

- `lib/data/leaders.ts` / `members.ts` / `team.ts` - 队长、成员、团队介绍与特色
- `lib/constants.ts` - 站点信息、社交媒体、导航菜单与子站链接
- `public/audio/music/library.json` - 曲名、艺术家、时长、音频与歌词 URL、歌词格式及核验状态

## 部署

线上为阿里云 OSS 静态托管(bucket `funkandlove-index`,杭州)，域名 [funk-and.love](https://funk-and.love)。

```bash
npm run deploy
```

流程:`next build` 产出 `out/` → `ossutil sync out/ oss://funkandlove-index/ --delete -f` 增量镜像同步。

前置条件:已安装 ossutil,且 `~/.ossutilconfig` 配好 endpoint 与 AccessKey。密钥不进仓库。

## 开发团队

- **开发者**: Hofmann88
- **团队**: Funk & Love - 浙江大学DFM街舞社Locking团队

## License

MIT License

---

**用舞蹈传递快乐 | Lock it, Point it, Groove it!**
