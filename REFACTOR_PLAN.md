# Funk & Love 移动端重设计 + 重构计划

> 文档定位：本次重构的**唯一参考依据**。设计系统部分参考 `ui-ux-pro-max` skill 推荐 + 现有品牌融合；移动端结构按 Community Landing 模式重写；PC 端做最小数据层重构以共享。
>
> 生成时间：2026-05-07

---

## 1. 现状与目标

### 1.1 现状

- 桌面端：8 段 scrolljacking 单页，使用自研 `useSnapScroll` 劫持滚轮，配合 sticky 布局做 Leaders 横滚 / Members 时间线。视觉完成度高。
- 移动端（`app/components/MobileView.tsx`）：仅有 hero + "请去 PC 浏览"提示 + 外部活动/周边链接。**桌面端 8 个 section 中有 6 个完全缺失**（团队介绍 / 合照 / 特色 / 精神 / 历届队长 / 成员时间线）。
- 数据耦合：`Leaders.tsx` 内联 200+ 行 `LEADERS` 数组，`Members.tsx` 内联 `GENERATIONS` 数据；移动端无法复用。

### 1.2 目标

1. 移动端独立成立，呈现完整内容，**不再出现"请去 PC 浏览"**。
2. 桌面端**视觉零变化**，只做数据层和共享组件抽取。
3. 维护一套数据源、一套视觉规范，两端按布局差异化呈现。
4. 性能：Lighthouse 移动端 ≥ 90，无明显卡顿。

---

## 2. 设计系统（Design System）

### 2.1 风格定位

**Vibrant & Block-based** —— 来自 ui-ux-pro-max 推荐：bold / energetic / playful / 几何块状 / 高对比 / duotone。与 Locking 街舞文化的能量调性吻合。

避免：极简北欧风、企业级冷淡风、水墨/古风（与团队气质冲突）。

### 2.2 色彩

| 角色 | Token | Hex | 用法 |
|---|---|---|---|
| 底色 | `bg-neutral-950` | `#0a0a0a` | 全站默认背景 |
| 卡片底 | `bg-neutral-900` | `#171717` | 卡片、模态框基底 |
| 主紫 | `violet-500` | `#8b5cf6` | 渐变左端、链接强调 |
| 主粉 | `pink-500` | `#ec4899` | 渐变中段、热点高亮 |
| 强调金 | `amber-500` | `#f59e0b` | "建队人" / 特殊角色专属 |
| **CTA 绿** | `green-500` | `#22C55E` | **新增**，专门给"加入我们 / 报名活动 / 购买周边"等转化按钮 |
| 文字主色 | `text-white` / `text-white/90` | — | 标题、正文 |
| 文字次色 | `text-white/60` | — | 副标题、提示 |
| 文字弱色 | `text-white/40` | — | 时间戳、版权 |

#### 渐变规范（仅用于：主标题文字、Hero 蒙层、特殊高亮卡片）

```css
/* 品牌主渐变 */
background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);

/* Hero 蒙层（在背景图之上） */
background: linear-gradient(135deg, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.4) 50%, rgba(245,158,11,0.4) 100%);
```

> **不要把渐变用在所有按钮上**——按钮渐变 + 链接渐变 + 标题渐变会视觉过载。CTA 用纯绿，链接用纯紫，标题文字用渐变 clip。

### 2.3 字体

- **CJK 正文**：保留系统字体栈（不引入网络请求字体，避免中文加载成本）。
- **拉丁标题 / Slogan**：引入 `Atkinson Hyperlegible`（来自 skill 推荐，accessibility 优先 + 复古圆润，与 funk 调性合拍）。仅用于英文显示（"Funk & Love" / "Lock it, Point it, Groove it!"）。中文正文不动。
- **引入方式（关键，与静态导出有关）**：必须使用 `next/font/google`，**不**用 `@import url(...)` 或 `<link href="https://fonts.googleapis.com/...">`。
  - `next/font/google` 在 `next build` 时把 woff2 文件物理打包进 `out/_next/static/media/`，访客只从自有源（S3/CDN）下载，无任何 Google 请求，国内访问稳定。
  - `@import` 方式会让每个访客实时请求 `fonts.googleapis.com`，国内访问慢甚至失败。
  - 与 `output: 'export'` 完全兼容（已在 Next 14+ 验证）。
  - 用法示例：
    ```ts
    // app/layout.tsx
    import { Atkinson_Hyperlegible } from 'next/font/google';
    const atkinson = Atkinson_Hyperlegible({
      subsets: ['latin'],
      weight: ['400', '700'],
      variable: '--font-atkinson',
      display: 'swap',
    });
    // <body className={atkinson.variable}>
    ```
    ```css
    /* globals.css */
    .font-display { font-family: var(--font-atkinson), system-ui, sans-serif; }
    ```
- **字号梯度**：
  - 大标题 `text-4xl md:text-6xl`（≥32px）
  - 段标题 `text-2xl md:text-3xl`
  - 正文 `text-base md:text-lg`（≥16px，移动端最小 16px）
  - 辅助文字 `text-sm`（≥14px）
- **行高**：正文 `leading-relaxed`（1.625），标题 `leading-tight`。

### 2.4 间距与块级布局

- **section 间垂直间距** ≥ 64px（移动端）/ 96px（桌面端）。
- **触摸目标** ≥ 44×44px，相邻可点击元素间距 ≥ 8px。
- **容器最大宽度**：`max-w-screen-md` 移动主容器，`max-w-7xl` 桌面。
- **内边距统一**：`px-4 sm:px-6 lg:px-8`。
- **圆角统一**：卡片 `rounded-2xl`，按钮 `rounded-xl`，徽章 `rounded-full`。

### 2.5 玻璃拟态 / 边框

- **深色玻璃**：`bg-white/10 backdrop-blur-md border border-white/20`（已有，继续用）
- **强调卡（建队等）**：`border-2 border-amber-500/50` + 外发光 `shadow-amber-500/30`
- **避免**：在浅色背景下使用 `bg-white/10`（不可见）；本项目全黑底，OK。

### 2.6 动画

- **微交互**：150–300ms（按钮 hover、卡片浮起）
- **section 进场**：`fadeInUp` 600ms
- **避免**：>500ms 的 UI 动画；持续运行的鼠标跟随渐变（移动端禁用）；layout 动画在长列表上。
- **必须**：尊重 `prefers-reduced-motion: reduce` —— 此时禁用所有非必要动画。
- **transform/opacity 优先**，不动 `width/height/top/left`。

### 2.7 图标（强约束）

**核心原则：禁止使用 emoji 作为 UI 图标。** UI 图标必须来自图标库 SVG，emoji 仅允许出现在用户生成内容（如队长 bio）里。

- **图标库**：全站统一 `lucide-react`，已在依赖里。如有 lucide 无法覆盖的需求（品牌 logo 类）才用 [`simple-icons`](https://simpleicons.org/) 或自定义 SVG。
- **禁用场景**（必查）：
  - ❌ 标题前缀（如"⭐ 建队"）→ 用 `<Crown />` 或 `<Star />`
  - ❌ 按钮成功反馈"已复制 ✓"→ 用 `<Check className="w-4 h-4" />`
  - ❌ 加载/错误/警告状态 → 用 `<Loader2 />` / `<AlertCircle />` / `<XCircle />`
  - ❌ 装饰性符号 🎉 ✨ 🔥 → 用对应 lucide（`<PartyPopper />` / `<Sparkles />` / `<Flame />`）或直接去掉
  - ❌ 列表项目符号 → 用 CSS `list-style` 或 `<ChevronRight />`
- **允许保留 emoji 的场景**：
  - ✅ 队长 / 成员 bio 数据（用户生成内容，如"ENFP 快乐小狗"中的 emoji、"自封版🐸"）
  - ✅ 错误的现有数据中已有 emoji 的展示文案，保留原文
- **尺寸规范**：
  - 行内图标 `w-4 h-4`（16px）
  - 按钮内图标 `w-5 h-5`（20px）
  - 卡片图标 `w-6 h-6`（24px）
  - 特色卡大图标 `w-10 h-10`（40px）
- **颜色**：继承文字色（`currentColor`），hover 时配合容器色变。
- **stroke**：lucide 默认 2，需要更纤细可设 `strokeWidth={1.5}`。
- **现存待修清单**（重构时一起处理）：
  - `Leaders.tsx` 第 350、536 行的"⭐ 建队"emoji 替换为 `<Crown />`
  - 招新弹窗草图中所有 emoji 用 lucide 实现

---

## 3. 移动端信息架构

### 3.1 整体结构（参考 Community Landing 模式）

```
┌────────────────────────────────────────┐
│ 1. Hero                                 │  全屏（100vh）
│    - 团队大图 + 渐变蒙层                  │
│    - Logo + 名称（渐变文字）              │
│    - Slogan                             │
│    - 主 CTA（绿）："加入我们" → 招新提示弹窗 │
│    - 次 CTA（玻璃）："了解更多" → 锚点滚动  │
├────────────────────────────────────────┤
│ 2. 团队介绍                              │  自然高度
│    - 一段文字（teamDescription）          │
│    - 数据三联：40+ 队员 / 9 届 / 1 团队精神 │
├────────────────────────────────────────┤
│ 3. 团队合照                              │
│    - 单图全宽 16:10                      │
│    - 图说 caption                        │
├────────────────────────────────────────┤
│ 4. 团队特色 4 卡                          │
│    - 纵向堆叠（不再 mousemove 渐变）       │
│    - 每卡：图标 + 标题 + 描述              │
│    - 图标用 violet/pink/amber 三色循环    │
├────────────────────────────────────────┤
│ 5. 团队精神                              │  自然高度
│    - 已有 TextMorphAnimation 简化版       │
│    - 移动端只显示静态终态文字              │
├────────────────────────────────────────┤
│ 6. 历届队长                              │
│    - 横向 scroll-snap-x（原生 CSS）        │
│    - 卡片宽度 240–280px，固定高度          │
│    - 建队人 amber 金边 + ⭐ 徽章            │
│    - 点击 → 全屏 BottomSheet              │
├────────────────────────────────────────┤
│ 7. 历届成员                              │
│    - 按届折叠 Accordion（年份倒序）        │
│    - 展开后：3 列网格 + 缩略图             │
│    - 缩略图 80×80，懒加载，?w=80&q=30      │
│    - 点击 → 全屏 lightbox 看大图           │
├────────────────────────────────────────┤
│ 8. 关注我们                              │
│    - 社交链接横排（4 图标）                │
│    - 活动 / 周边 / 产品 三组外链             │
│    - CTA 绿："查看 2026 队服"             │
├────────────────────────────────────────┤
│ 9. Footer                               │
│    - 版权 + 备案号                        │
└────────────────────────────────────────┘
```

### 3.1.1 招新提示弹窗（"加入我们"CTA 行为）

主 CTA"加入我们"**不**指向报名表单或外链，而是打开一个轻量提示弹窗（桌面 modal / 移动 bottom sheet，复用 `<DetailSheet>`）。

**弹窗内容**：

```
┌──────────────────────────────────┐
│  [Sparkles icon] 想加入 Funk & Love？│
│                                  │
│  欢迎所有热爱 Locking 的朋友！     │
│  无论你是零基础还是已经在跳，       │
│  我们都期待和你一起 funk。         │
│                                  │
│  请联系 25 届队长 dragon：         │
│  ┌────────────────────────────┐  │
│  │ 微信号                       │  │
│  │ superhandsomezwl  [Copy ic] │  │
│  └────────────────────────────┘  │
│                                  │
│           [ 关闭 ]                │
└──────────────────────────────────┘

> 草图里所有 `[xxx icon]` 占位符都对应 lucide-react 图标，**不**使用 emoji。
> 标题图标：`<Sparkles className="w-5 h-5 text-amber-400" />`
> 复制按钮图标：默认 `<Copy />`，复制成功后 2 秒内换成 `<Check className="text-green-500" />` + 文字"已复制"
```

**实现要点**：

- 微信号字符串单独抽到 `lib/data/team.ts`：`export const RECRUIT_CONTACT = { name: 'dragon', wechat: 'superhandsomezwl', term: '25 届' };`，避免散落多处。
- "复制"按钮使用 `navigator.clipboard.writeText`，复制成功后按钮临时变文字"已复制 ✓"（2 秒回退），不弹 alert。
- 移动端微信号字号 ≥ 16px（避免 iOS Safari 自动放大焦点输入），使用等宽字体便于辨认。
- 弹窗有清晰关闭手势（X 按钮 + 遮罩点击 + ESC 键 + 移动端下滑关闭）。
- 跳过分析跟踪/外链跳转，避免被微信浏览器拦截。

### 3.2 移动端关键交互规范

| 场景 | 规范 |
|---|---|
| 滚动 | 原生纵向滚动，**不**做 wheel 劫持，**不**做 scroll-snap-y（避免影响阅读节奏） |
| 顶部导航 | 简化为浮动汉堡按钮（`top-4 right-4`），点击展开抽屉，包含锚点跳转 + 外链 |
| 队长详情 | 全屏 BottomSheet，从底部滑入，含拖拽关闭手势（可选） |
| 成员展开 | 同页 accordion，不切页 |
| 图片 | 占位符（aspect-ratio）防 CLS，`loading="lazy"` 默认，hero 图 `priority` |
| 触摸反馈 | `active:bg-white/15` 替代 hover；点击瞬时降亮 |

### 3.3 桌面端结构（保持现状）

桌面端 8 段 scrolljacking 结构、`useSnapScroll` 钩子、Leaders 横滚 sticky、Members 时间线均**保持不变**。本次重构不动视觉，仅替换数据来源（从内联改为 `import`）。

---

## 4. 代码重构方案

### 4.1 目录调整

```
funkandlove-index/
├── app/
│   ├── components/
│   │   ├── desktop/                      # ← 新增，桌面专属（迁移现有组件）
│   │   │   ├── Hero.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Team.tsx
│   │   │   ├── TeamFeatures.tsx
│   │   │   ├── TeamSpirit.tsx
│   │   │   ├── TeamInfo.tsx
│   │   │   ├── TeamPhotoBackground.tsx
│   │   │   ├── Leaders.tsx               # 横滚 scrolljacking 版
│   │   │   ├── Members.tsx               # 时间线版
│   │   │   ├── SocialLinks.tsx
│   │   │   └── SectionIndicator.tsx
│   │   ├── mobile/                       # ← 新增
│   │   │   ├── MobileView.tsx            # 总入口
│   │   │   ├── MobileHero.tsx
│   │   │   ├── MobileTeamInfo.tsx
│   │   │   ├── MobileTeamPhoto.tsx
│   │   │   ├── MobileFeatures.tsx
│   │   │   ├── MobileTeamSpirit.tsx
│   │   │   ├── MobileLeaders.tsx         # 横向 scroll-snap-x 版
│   │   │   ├── MobileMembers.tsx         # accordion 版
│   │   │   ├── MobileSocial.tsx
│   │   │   └── MobileNav.tsx             # 抽屉式导航
│   │   ├── shared/                       # ← 新增，跨端复用
│   │   │   ├── LeaderCard.tsx            # 队长卡片基础视觉
│   │   │   ├── LeaderDetail.tsx          # 详情视觉（modal/sheet 包装它）
│   │   │   ├── MemberAvatar.tsx          # 成员头像 + lazyload
│   │   │   ├── DetailSheet.tsx           # 通用：桌面 modal / 移动 bottom sheet
│   │   │   ├── GradientText.tsx          # 渐变文字封装
│   │   │   ├── CTAButton.tsx             # 绿色 CTA
│   │   │   ├── GhostButton.tsx           # 玻璃拟态按钮
│   │   │   └── RecruitDialog.tsx         # 招新提示弹窗（联系 dragon）
│   │   └── ui/                           # （已有）通用原子组件
│   ├── hooks/
│   │   ├── useSnapScroll.ts              # （已有）桌面专属
│   │   ├── useBodyScrollLock.ts          # （已有）共享
│   │   ├── useMediaQuery.ts              # ← 新增，统一断点判断
│   │   └── usePrefersReducedMotion.ts    # ← 新增
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── favicon.ico
├── lib/
│   ├── data/                             # ← 新增，纯数据
│   │   ├── leaders.ts                    # 历届队长（从 Leaders.tsx 抽出）
│   │   ├── members.ts                    # 历届成员（从 Members.tsx 抽出）
│   │   ├── team.ts                       # 团队介绍 / 特色 / 精神
│   │   └── nav.ts                        # 导航配置（从 constants.ts 拆出）
│   ├── types.ts                          # ← 新增，共享类型
│   ├── constants.ts                      # 仅留 SITE_CONFIG / NAV_HEIGHT / 图片 URL
│   ├── animations.ts
│   └── gradients.ts
└── ...
```

### 4.2 数据层抽取

**`lib/types.ts`**（新）：

```ts
export type LeaderRole = 'founder' | 'captain' | 'vice' | 'other';

export interface Leader {
  id: string;
  name: string;
  title: string;
  term: string;
  image: string;
  bio: string;
  cardX?: string;
  modalY?: string;
  role: LeaderRole;
}

export interface Member {
  name: string;
  image: string;
}

export interface Generation {
  term: string;
  year: string;
  members: Member[];
  isCollecting?: boolean;
}

export interface Feature {
  icon: string; // Lucide name
  title: string;
  description: string;
}
```

**`lib/data/leaders.ts`**（新）：从 `Leaders.tsx` 把 `LEADERS` 数组完整搬过来。

**`lib/data/members.ts`**（新）：从 `Members.tsx` 把 `GENERATIONS` + `buildMemberImageUrl` + `getThumbnailUrl` 搬过来。

**`lib/data/team.ts`**（新）：从 `constants.ts` 把 `SITE_CONFIG.teamDescription / philosophy / features` 抽出，并新增招新联系常量：

```ts
export const RECRUIT_CONTACT = {
  name: 'dragon',
  wechat: 'superhandsomezwl',
  term: '25 届',
} as const;
```

**重要约束**：数据文件**仅 import 类型和必要工具**（lucide 图标可在数据里引用），不 import React/Framer Motion。

### 4.3 共享组件契约

**`shared/DetailSheet.tsx`**：

```tsx
interface DetailSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'modal' | 'sheet'; // 默认按 useMediaQuery 自动选
}
```

桌面端 `variant='modal'`：居中弹窗 + 暗色蒙层；
移动端 `variant='sheet'`：从底部滑入，圆角顶部，可拖拽关闭。

**`shared/LeaderCard.tsx`**：

```tsx
interface LeaderCardProps {
  leader: Leader;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg'; // sm 用于移动端横滚，lg 用于桌面端
  priority?: boolean; // 首屏图片
}
```

桌面端 `Leaders.tsx` 横滚里和移动端 `MobileLeaders.tsx` 横滚里**用同一个 `LeaderCard`**，仅外层容器不同。

**`shared/CTAButton.tsx`**：

```tsx
interface CTAButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost'; // primary = 绿色 CTA
  size?: 'sm' | 'md' | 'lg';
  external?: boolean;
}
```

### 4.4 入口路由

**`app/page.tsx`**：保留 `useSyncExternalStore` 检测 isMobile，分发到 `MobileView` 或桌面端 `DesktopView`（即现 `page.tsx` 的桌面分支提取为 `app/components/desktop/DesktopView.tsx`）。

```tsx
export default function Home() {
  const isMobile = useSyncExternalStore(subscribeResize, getIsMobile, getServerSnapshot);
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

---

## 5. 实施分阶段

### Phase 1：数据层抽取（零视觉影响，零风险）

**目标**：现有 PC 端外观 100% 不变，仅来源改为 import。

- [ ] 创建 `lib/types.ts`
- [ ] 创建 `lib/data/leaders.ts`、`lib/data/members.ts`、`lib/data/team.ts`
- [ ] `Leaders.tsx` / `Members.tsx` / `TeamFeatures.tsx` 改为从 `lib/data` 引入
- [ ] `npx tsc --noEmit` 验证

**预计工时**：1 小时。**回归点**：检查 PC 端历届队长 / 成员区域无视觉变化。

### Phase 2：共享组件抽取

- [ ] `shared/CTAButton.tsx` / `GhostButton.tsx` / `GradientText.tsx`
- [ ] `shared/DetailSheet.tsx`（桌面 modal / 移动 sheet 双形态）
- [ ] `shared/LeaderCard.tsx`、`LeaderDetail.tsx`
- [ ] `shared/MemberAvatar.tsx`
- [ ] `shared/RecruitDialog.tsx`（招新弹窗，含微信号复制按钮）
- [ ] PC 端 `Leaders.tsx` / `Members.tsx` 改为引用共享组件
- [ ] PC 端 `Hero` / 桌面导航也接入"加入我们"按钮 → 触发同一 `RecruitDialog`

**预计工时**：3-4 小时。**回归点**：PC 端队长卡片、点击弹窗、成员头像、视觉与交互无差异。

### Phase 3：移动端组件实现

- [ ] `mobile/MobileNav.tsx`（汉堡 + 抽屉）
- [ ] `mobile/MobileHero.tsx`（全屏 + 双 CTA）
- [ ] `mobile/MobileTeamInfo.tsx`（介绍 + 数据三联）
- [ ] `mobile/MobileTeamPhoto.tsx`（单图）
- [ ] `mobile/MobileFeatures.tsx`（4 卡纵堆，无 mousemove）
- [ ] `mobile/MobileTeamSpirit.tsx`（静态终态文字）
- [ ] `mobile/MobileLeaders.tsx`（横向 scroll-snap-x + LeaderCard sm）
- [ ] `mobile/MobileMembers.tsx`（accordion，按届折叠）
- [ ] `mobile/MobileSocial.tsx`（社交矩阵 + 外链）
- [ ] `mobile/MobileView.tsx`（总装）

**预计工时**：5-6 小时。**回归点**：375 / 414 / 768 三档断点视觉验证；触摸目标 ≥ 44px；无横向滚动溢出。

### Phase 4：路由整合 + 桌面端整理

- [ ] 把现 `page.tsx` 桌面端 JSX 抽到 `desktop/DesktopView.tsx`
- [ ] `page.tsx` 仅保留断点分发逻辑

**预计工时**：30 分钟。

### Phase 5：性能与可访问性收尾

- [ ] 引入 `usePrefersReducedMotion`，全站动画包一层
- [ ] Hero 图加 `priority`，其它图 `loading="lazy"` + `sizes`
- [ ] 移动端禁用 `useMousePosition`（在 `MobileFeatures` 里直接走静态色）
- [ ] Lighthouse 移动端跑分 ≥ 90
- [ ] 跑 axe / Lighthouse 无障碍检查
- [ ] `next build && next start` 静态导出验证

**预计工时**：2 小时。

**总工时预估**：12-14 小时。

---

## 6. 已敲定的设计决策

> 2026-05-07 确认。

| # | 决策项 | 结论 |
|---|---|---|
| 1 | CTA 绿 `#22C55E` | ✅ **采用**。"加入我们" / "查看周边" 等转化按钮统一用绿色。 |
| 2 | Atkinson Hyperlegible 字体 | ✅ **采用**。仅用于英文标题/slogan；通过 `next/font/google` 自托管，woff2 物理打包进 `out/`。 |
| 3 | 移动端"PC 浏览更佳"提示 | ❌ **不保留**。移动端独立成立。 |
| 4 | "加入我们" CTA 行为 | **打开招新提示弹窗**，引导联系 25 届队长 dragon（微信号 `superhandsomezwl`），不直接跳外部表单。详见 §3.1.1。 |
| 5 | 历届队长数据结构 | 扁平数组，与现有结构保持一致。 |
| 6 | 成员 accordion | 默认展开最近一届（25 届），其它折叠。 |
| 7 | 移动端导航 | 简化方案：右下角浮动"回顶部"按钮 + 顶部汉堡按钮抽屉（含锚点链接 + 外部活动/周边链接）。 |

---

## 7. 不在本次重构范围内（明确划出）

- ❌ 桌面端视觉 / 动画修改
- ❌ 后端 / API 引入（保持纯静态导出）
- ❌ 国际化 i18n
- ❌ 暗色 / 浅色模式切换（项目本就是暗色）
- ❌ PWA / Service Worker
- ❌ 数据可视化 / 图表
- ❌ 服务端渲染（保持 `output: 'export'`）

---

## 8. 验收清单

### 功能完整性
- [ ] 移动端 9 个 section 全部可见可滚动
- [ ] 队长点击可看详情
- [ ] 成员折叠可展开
- [ ] 所有外链可点击且 `target="_blank" rel="noopener noreferrer"`
- [ ] 备案号可点击跳工信部

### 视觉一致性
- [ ] 桌面端 8 段视觉与重构前 0 像素差（关键截图对比）
- [ ] 移动端 375 / 414 / 768 三档无横向溢出
- [ ] 配色严格按本文 §2.2 规范
- [ ] 触摸目标 ≥ 44×44px
- [ ] **全站 UI 无 emoji 图标**（grep 检查 .tsx 文件中是否还有 emoji 字符出现在 JSX 文本里，bio 等用户内容除外）

### 性能
- [ ] Lighthouse 移动端 Performance ≥ 90
- [ ] LCP ≤ 2.5s（移动端 4G 模拟）
- [ ] CLS ≤ 0.1
- [ ] 图片有 `width/height` 或 `aspect-ratio` 防 CLS

### 可访问性
- [ ] 文字对比度 ≥ 4.5:1
- [ ] 所有图片有 `alt`
- [ ] 所有图标按钮有 `aria-label`
- [ ] 键盘 Tab 顺序合理
- [ ] `prefers-reduced-motion` 生效（动画停止或简化）

### 代码质量
- [ ] `npx tsc --noEmit` 0 error
- [ ] `npx eslint .` 0 error
- [ ] 数据层不依赖 React
- [ ] 共享组件桌面 / 移动均复用

---

## 9. 文件级 TODO 速查

| 文件 | 操作 |
|---|---|
| `lib/types.ts` | 新建 |
| `lib/data/leaders.ts` | 新建（迁移 `Leaders.tsx::LEADERS`） |
| `lib/data/members.ts` | 新建（迁移 `Members.tsx::GENERATIONS`） |
| `lib/data/team.ts` | 新建（从 `SITE_CONFIG` 抽出 features / description） |
| `lib/constants.ts` | 瘦身：仅留 `SITE_CONFIG.images / name / slogan / NAV_HEIGHT` |
| `app/components/desktop/*` | 现有桌面组件迁入 |
| `app/components/mobile/*` | 全部新建（10 个文件） |
| `app/components/shared/*` | 全部新建（7 个文件） |
| `app/hooks/useMediaQuery.ts` | 新建 |
| `app/hooks/usePrefersReducedMotion.ts` | 新建 |
| `app/page.tsx` | 简化为分发入口 |
| `app/components/MobileView.tsx` | 删除（被 `mobile/MobileView.tsx` 取代） |
| `app/layout.tsx` | 引入 `next/font/google` 的 `Atkinson_Hyperlegible`，挂载 CSS 变量 |
| `app/globals.css` | 新增 `.font-display { font-family: var(--font-atkinson), system-ui, sans-serif; }` |

---

**结束。** 等敲定 §6 的待确认事项后即可从 Phase 1 开始动手。
