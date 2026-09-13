# Funk & Love - 官方网站

> 浙江大学DFM街舞社Locking团队官方主页

## 项目简介

Funk & Love 是浙江大学 DFM 街舞社的 Locking 团队官方网站。采用现代化的设计和流畅的动画效果，展示团队风采和精神理念。

**Slogan**: Lock it, Point it, Groove it!  
**理念**: 用舞蹈传递快乐

## 技术栈

- **框架**: Next.js 16 (App Router, `output: 'export'` 纯静态导出)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **动画**: GSAP(时间轴 / 滚动 / 高频指针特效)+ Framer Motion(挂载卸载、进出场、滚动揭示),正在增量迁移到 GSAP
- **视频**: hls.js + Plyr(HLS 多码率宣传片)
- **字体**: Inter 可变字体本地自托管(`app/fonts/`,经 `next/font/local`)
- **图标**: Lucide React(`Sparkles` 全局禁用,ESLint 强制)
- **部署**: 阿里云 OSS 静态托管 + OSS 图片处理(webp 转码)

## 功能特性

- ✨ 现代化响应式设计
- 🎨 鼠标跟随渐变效果
- 📜 视差滚动动画
- 🎭 逐字淡入文字动画
- 🌈 滚动驱动的背景色变化
- 📱 移动端专用简化视图
- ⚡ SSR 支持，SEO 友好

### 移动端设计

移动端（屏幕宽度 < 768px）走 `app/components/mobile/` 下的独立视图,内容与桌面端完整对齐（Hero、团队介绍、合照/宣传片、特色、历届队长、成员、社媒）,布局按竖屏重排。桌面端走 `app/components/desktop/`,为 8 段 snap 滚动的单页设计。两端共用 `lib/data/` 数据源和 `app/components/shared/` 组件。

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build     # 静态导出到 out/
```

### 其他脚本

```bash
npm run lint      # ESLint
npm run lqip      # 为大图生成 LQIP 占位图(scripts/gen-lqip.mjs)
node scripts/transcode-video.mjs   # 宣传片转 HLS 多码率切片
```

## 项目结构

```
funkandlove-index/
├── app/
│   ├── components/
│   │   ├── desktop/DesktopView.tsx   # 桌面端入口(8 段 snap 滚动)
│   │   ├── mobile/                   # 移动端各 section
│   │   ├── shared/                   # 两端共用组件(LeaderCard、RecruitDialog 等)
│   │   ├── ui/                       # 基础 UI 组件
│   │   ├── Hero.tsx / TeamInfo.tsx / Team.tsx / TeamFeatures.tsx
│   │   ├── Leaders.tsx / Members.tsx / SocialLinks.tsx   # 桌面端 section
│   │   ├── Navigation.tsx / SectionIndicator.tsx
│   │   ├── TextMorphAnimation.tsx    # GSAP Flip 文字形变
│   │   └── VideoPlayer.tsx           # hls.js + Plyr
│   ├── hooks/                        # useSnapScroll、useMediaQuery 等
│   ├── fonts/                        # 自托管 Inter 字体
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                      # 断点分发 Mobile / Desktop
├── lib/
│   ├── data/                         # 内容数据源(leaders / members / team)
│   ├── constants.ts                  # 站点配置、导航、社媒
│   ├── cdn.ts                        # OSS 图片处理 URL 拼接
│   └── animations.ts / gradients.ts / types.ts
├── scripts/
│   ├── deploy.ps1                    # 构建 + ossutil 同步到 OSS
│   ├── gen-lqip.mjs                  # LQIP 生成
│   └── transcode-video.mjs           # HLS 转码
├── public/                           # 静态资源(1GB+,不入库,本地维护)
│   ├── images/                       # 团队图、历届队长、成员头像
│   └── video/promo/                  # HLS 切片 + poster
└── package.json
```

## 配置说明

### 静态资源

`public/` 已被 gitignore,图片与视频只在本地和 OSS 上维护。关键文件:

- `images/team-bg.jpg` - 首屏 / 合照背景(原图 6000px 级,线上经 OSS 处理限宽 3840 转 webp)
- `images/team-bg-lqip.webp` - 上图的 LQIP 占位,由 `npm run lqip` 生成
- `images/leaders/`、`images/members/` - 历届队长、成员头像
- `video/promo/master.m3u8` - 宣传片 HLS 入口

图片 URL 统一经 `lib/cdn.ts` 的 `oss()` 挂 `x-oss-process` 参数;本地 dev 会忽略该参数直接返回原图。

### 内容配置

- `lib/data/leaders.ts` / `members.ts` / `team.ts` - 队长、成员、团队介绍与特色
- `lib/constants.ts` - 站点信息、社交媒体、导航菜单与子站链接

## 部署

线上为阿里云 OSS 静态托管(bucket `funkandlove-index`,杭州),域名 https://funk-and.love 。

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
