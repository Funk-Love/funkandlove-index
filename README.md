# Funk & Love - 官方网站

> 浙江大学DFM街舞社Locking团队官方主页

## 项目简介

Funk & Love 是浙江大学 DFM 街舞社的 Locking 团队官方网站。采用现代化的设计和流畅的动画效果，展示团队风采和精神理念。

**Slogan**: Lock it, Point it, Groove it!  
**理念**: 用舞蹈传递快乐

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **动画**: Framer Motion
- **图标**: Lucide React
- **部署**: Vercel

## 功能特性

- ✨ 现代化响应式设计
- 🎨 鼠标跟随渐变效果
- 📜 视差滚动动画
- 🎭 逐字淡入文字动画
- 🌈 滚动驱动的背景色变化
- 📱 移动端专用简化视图
- ⚡ SSR 支持，SEO 友好

### 移动端设计

移动端（屏幕宽度 < 768px）将显示专用的简化视图：
- 全屏Hero背景图片
- 核心品牌信息（Logo、标题、Slogan）
- 快速导航链接
- PC端浏览提示信息

桌面端则展示完整的多区块页面设计。

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
npm run build
npm start
```

## 项目结构

```
funkandlove-index/
├── app/                    # Next.js App Router
│   ├── components/         # React 组件
│   │   ├── ui/            # UI 基础组件
│   │   ├── Hero.tsx       # 首屏组件
│   │   ├── Navigation.tsx # 导航栏
│   │   ├── MobileView.tsx # 移动端专用视图
│   │   ├── TeamInfo.tsx   # 团队介绍
│   │   ├── TeamSpirit.tsx # 团队精神
│   │   ├── TeamFeatures.tsx # 团队特色
│   │   └── SocialLinks.tsx # 社交媒体
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页（含移动端检测）
├── lib/                   # 工具函数
│   ├── constants.ts       # 常量配置
│   ├── animations.ts      # 动画配置
│   └── gradients.ts       # 渐变工具
├── public/                # 静态资源
│   └── images/           # 图片资源
└── package.json          # 项目配置
```

## 配置说明

### 图片资源

将图片放入 `public/images/` 目录：

- `hero-bg.jpg` - 首屏背景图 (建议尺寸: 1920x1080px)
- `team-photo.jpg` - 团队合照 (建议尺寸: 1200x800px)

### 内容配置

编辑 `lib/constants.ts` 修改：
- 团队信息
- 社交媒体链接
- 导航菜单
- 团队特色

## 部署

推荐使用 Vercel 部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Hofmann8/funkandlove-index)

## 开发团队

- **开发者**: Hofmann88
- **团队**: Funk & Love - 浙江大学DFM街舞社Locking团队

## License

MIT License

---

**用舞蹈传递快乐 | Lock it, Point it, Groove it!**
