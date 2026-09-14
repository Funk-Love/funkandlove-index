# Funk & Love 主站 · 设计语言重构方案(v2,施工边界稿)

> 用途:2026 换届版重构的施工依据。方向已定:**A(70s Funk 海报)为主、借 C(编辑部网格)的纪律,Hero 预留由 3D 设计师独立完成的立体主视觉。**
> v2 于 2026-09-13 根据前端专家与 3D 设计师的评审修订。v1 的四处事实错误已逐条对源码和构建产物核实后更正,见 §1。
> 冻结对象从"文件"改为"**行为 + 明确例外**"。

---

## 0. 一句话结论

- **冻结的是行为**:TextMorph 的动画逻辑、Leaders 普通模式的横滚机制、snap 的吸附范围与手感、数据内容、部署链路。允许的例外逐条列在 §2。
- **Phase 0 拆成 0A(视觉等价整理)和 0B(有预期差异的修复)**,验收标准不同,不能混用"截图零差异"。
- **token 能集中控制设计语言,但版式重构仍是组件级工作**。不承诺换皮只改几十行变量。
- **Hero 拆三层,预留主视觉插槽(D9)**,静态占位先行,3D 在 Phase 1 样板阶段介入。

---

## 1. v1 的事实更正(已核实)

| # | v1 说法 | 核实结果 | 对施工的影响 |
|---|---|---|---|
| 1 | "38 个 token 里 34 个是死的" | **错**。Tailwind v4 的工具类按命名空间读 CSS 变量。构建产物里 `.rounded-xl{border-radius:var(--radius-xl)}`、`.blur-sm{blur(var(--blur-sm))}`,而 globals.css `:root` 里 `--radius-xl:1.5rem`(默认 .75rem)、`--radius-lg:1rem`(默认 .5rem)、`--blur-sm:4px`(默认 8px)、`--blur-md:8px`(默认 12px)**正在静默覆盖默认值**。`--shadow-*` 被 Tailwind 内联不读变量、`--font-light…black` 命名空间不对(应为 `--font-weight-*`)、`--space-*` 不是命名空间,这三组才是真死。 | 0A 删变量前必须逐个查构建 CSS 和 computed style;radius/blur 四个覆盖值要**显式迁入 `@theme`** 而不是删 |
| 2 | Leaders 用 `quickTo` 平滑横移 | **错,是旧记忆**。当前 [Leaders.tsx:83-95](app/components/Leaders.tsx#L83) 是 `gsap.to` + `scrub:true` + `ease:"none"` 的 1:1 直驱,注释明确写了 quickTo 会尾段闪动所以弃用;弹窗时 `tween.pause()`,关闭后 `ScrollTrigger.refresh()` + `resume()`。DWELL 缓冲仍在。 | 冻结**当前**实现并重新建立回归基线,不按旧记忆"恢复"任何东西 |
| 3 | 导航"计划"是悬空锚点 | **半对**。[Navigation.tsx:247](app/components/Navigation.tsx#L247) 已拦截 `plan` 弹"功能还在制作中"的 Toast(移动抽屉分支 L524 也有)。真正的问题是:配置里仍写成 `href:"#under-construction"`,且 [MobileNav](app/components/mobile/MobileNav.tsx) 没有复用这段处理。 | 0B 把"制作中提示"抽成两端共用的行为,配置改为显式 `kind:"coming-soon"`,不新增 section |
| 4 | 移动端 8 段 | **错**。[MobileView.tsx](app/components/mobile/MobileView.tsx) 注释写 8 段,JSX 是 **7 个内容组件 + 1 个招新弹窗**。页脚(备案号等)包含在 MobileSocial 内。 | 排期与验收按 7 段;页脚算 MobileSocial 的一部分,不单列 |

另外核实:[useSnapScroll.ts:185](app/hooks/useSnapScroll.ts#L185) 在 `enabled=false` 时被动追踪 `currentIndex` 也一并停止,而返回的 `scrollToSection()` 仍会创建 GSAP 动画。所以 `enabled:false` 不等于 reduced-motion 方案,见 §5。

---

## 2. 冻结行为与明确例外

### 2.1 TextMorphAnimation(`app/components/TextMorphAnimation.tsx`)

**冻结**:阶段划分、时长、缓动、DOM 结构、`data-letter` 契约、事件绑定(hover 重播)、Flip 参数(`absolute:false` + `absoluteOnLeave:true`)、reduced-motion 分支。

**明确例外(D2,已采纳)**:仅 L194 的 `textShadow` 与 L25 的 `text-pink-400` 两处**颜色**允许改为语义 token。0A 阶段保持原值,Phase 1 换皮时再去霓虹。

**对外契约(重做区必须继续满足)**:
1. 字号 / 字重 / 颜色由父级 className 注入。
2. **字体显式指定为现有 Inter(D3)**。给形变标题单独挂 `font-[family-name:var(--font-inter)]` 之类的显式声明,不再依赖 body 继承,这样其他展示标题换复古字体时它不受影响。字形相似不作为 Flip 安全保证。
3. `usePrefersReducedMotion` 存在。
4. gsap / @gsap/react / Flip 保留;**不修改 `gsap.defaults()`**,CustomEase 只在局部 tween 上用。
5. 父级不裁剪、不禁 pointer-events;不访问其内部节点、不改其时间轴、不通过延时猜它播到哪。

### 2.2 Leaders 横滚(`app/components/Leaders.tsx`)

**冻结**:普通模式下 ScrollTrigger scrub 直驱、DWELL 缓冲、`invalidateOnRefresh`、弹窗 pause/refresh/resume 这套**机制**。

**明确例外**:
- 卡片外观、光斑、进度条样式全部可换。
- **允许新增 reduced-motion 展示分支**:显示正常文档流中的卡片网格。只关掉 ScrollTrigger 会让 sticky 容器的 `overflow-hidden` 裁掉后面的人,不可接受。
- **几何回归条款**:卡宽、间距、导航高度、sticky 高度都参与 `SCROLL_DISTANCE` 计算。**改这些尺寸即使不动计算代码也必须做横滚回归**(横移走满、DWELL 平台、sticky 释放无回跳)。

### 2.3 桌面 snap 滚动(`app/hooks/useSnapScroll.ts`)

**冻结**:hook 内部逻辑、吸附范围(hero → features 四段吸附,之后放开)、手感。

**明确例外**:调用层新增 reduced-motion 路径,见 §5.1。

### 2.4 内容与链路

- `lib/data/*`:内容不动。换字体导致队长图裁切位不对时,只允许调 `cardX / modalY`。
- `lib/constants.ts`:内容不动。允许两项结构改动:icon 从 lucide 组件改字符串名;`plan` 从悬空 href 改为 `kind:"coming-soon"`。
- `lib/cdn.ts`、`scripts/*`、`next.config.ts`、`.gitignore`、`VideoPlayer.tsx` 逻辑、`page.tsx` 断点分发、`layout.tsx` 元数据与 next/font/local 机制:不动。允许新增字体文件与 Plyr 主色。

### 2.5 结构

- 桌面 7 段 section 集合与 id 顺序不变(D7):hero / team-info / team / features / leaders / members / social。重复 id 收归外层统一持有。
- 移动端 7 段不增删,**补齐语义锚点**(D8),id 与桌面语义一一对应。
- "section 内部自由"有前提:前四段要维持 snap,**短屏(≤ 700px 高)和文字放大 125% / 150% 下内容必须可达**(不被吸附裁掉,可滚动读完)。

---

## 3. 决策记录(D1–D9,已定)

| # | 决策 | 结论 | 落地边界 |
|---|---|---|---|
| D1 | 主风格 | **A 为主,借 C 的网格** | 复古字体、色块、少量节奏性装饰建立身份;人物密集区整齐。**不要每张卡都叠颗粒 + 描边 + 倾斜 + 硬阴影** |
| D2 | TextMorph 两处颜色 | **允许,作为明确例外** | 见 §2.1。仅此两行,0A 保持原值 |
| D3 | Hero 标题字体 | **本轮保留 Inter,显式指定** | 其他展示标题可探索复古字体 |
| D4 | 底色 | **浅色主体 + 深棕 Hero** | 奶油纸面承担阅读区,深棕承托 Hero,橙黄做重点。**取消贯穿全站的固定底图**(TeamPhotoBackground 手法作废),合照在 Hero 或 Team 有明确展示位 |
| D5 | framer-motion | **保留,收敛到组件进出场** | `AnimatePresence` + `motion` 管弹窗、抽屉、Toast;GSAP 管编排与滚动关联;普通 hover / focus 用 CSS。不以移除依赖为目标 |
| D6 | snap | **普通模式保留,reduced-motion 关闭** | 减少动效时原生滚动 + 即时锚点跳转,仍保留导航与当前位置提示 |
| D7 | section 集合 | **不增删,桌面顺序不变** | "计划"统一为现有制作中提示 |
| D8 | 移动导航 | **修好锚点,暂不加悬浮指示器** | 保留菜单、加入入口、当前位置提示。先理顺"关抽屉 → 解滚动锁 → 跳转 → 焦点"的顺序 |
| D9 | Hero 3D 主视觉 | **预留插槽,由 3D 设计师独立完成** | 见 §4 |

---

## 4. D9:Hero 立体主视觉的预留规范

方向:**"70s Funk 海报 + 有实体质感的舞台道具"**。奶油纸面、焦橙烤漆、暖金属边缘、黑胶细纹、柔和投影。候选主体是基于品牌图形的立体徽章:有厚度、倒角、搪瓷或烤漆表面,鼠标移动时轻微倾斜与高光变化,短促转动后"锁住"。轮廓看品牌原稿再定。

TextMorph 继续担任文字主角,3D 装置与它共同构图,避开字母换位与离场空间,**不再加第二套文字动画**。

各位置预留程度:

| 位置 | 预留 | 用途 |
|---|---|---|
| Hero | 正式预留 | 独立立体主视觉,负责材质、空间感、品牌记忆 |
| Team 合照区 | 保留样式自由度 | 相片纸张、实体相框等轻量空间层次 |
| 队长卡 | 不预埋 WebGL | 统一光影、边框、少量 CSS 透视 |
| 导航、正文、成员、弹窗 | 常规界面 | 阅读、操作、照片优先 |

### 4.1 布局要求

- Hero 拆为 **背景层 / 主视觉层 / 内容层**,主视觉与内容是兄弟节点。
- 桌面允许偏心构图,不把"内容永远居中纵向堆叠"写死。标题字号与容器宽度仍须满足 Flip 回归。
- 移动版有独立构图参数,可用同一作品的静态渲染图,不裁切桌面画面。
- 视觉容器预先定尺寸或宽高比,加载完成后不推动文字、按钮或下一段。
- 合照仍在页面中完整承担团队展示功能。

### 4.2 隔离要求

- 3D canvas 的裁剪、透视、transform 只作用于主视觉层,不加在 TextMorph 的共同祖先上。
- 装饰层 `aria-hidden`,默认不截获点击、滚轮、触摸;鼠标跟随用不阻断事件的监听(`passive`,监听在 window / section 而非 canvas 上拦截)。
- 不访问 TextMorph 内部节点,不改其时间轴,不新增整页滚动控制。
- 暂不与 TextMorph 阶段联动,不用固定延时猜播放进度。

### 4.3 加载与生命周期

- 静态首屏独立可用,3D 模块 `dynamic import` 延迟加载。
- 页面不可见、视觉离开视口、弹窗覆盖时暂停渲染;卸载释放图形资源与监听。
- reduced-motion 用静止构图;加载失败或 WebGL 上下文丢失时保留同一作品的静态图。
- **静态图是正式交付内容**,与实时版本同构图同材质语言。

### 4.4 工程侧接口(本轮只做这个)

```tsx
type HeroCompositionProps = {
  visual: React.ReactNode;
  children: React.ReactNode;
};

function HeroComposition({ visual, children }: HeroCompositionProps) {
  return (
    <div className="hero-composition">
      <div className="hero-visual" aria-hidden="true">{visual}</div>
      <div className="hero-content">{children}</div>
    </div>
  );
}
```

工程师控制 `.hero-composition` 的尺寸与布局约束,3D 设计师接手 `.hero-visual` 内部。**页面业务代码不依赖相机、mesh、灯光或 shader。当前不安装 Three.js,预留阶段零依赖**;立体方案确定后再明确依赖与资源。

### 4.5 交接材料与验收

交接:Hero 桌面与移动截图、实际容器尺寸、标题安全区域、字体与颜色 token、Logo 原稿、当前静态占位图,并注明哪些已冻结、哪些可协商。

验收:先静态构图,再交互与性能。必查标题无遮挡、Flip 不偏移、导航可点击、滚动不受阻、移动设备加载与发热。性能不通过先优化模型、材质、渲染策略,不直接牺牲主体设计。

---

## 5. 滚动与动效边界的三个补充条件

### 5.1 snap 的 reduced-motion 不是 `enabled:false`

`enabled:false` 会同时停掉被动的 `currentIndex` 追踪,而 `scrollToSection()` 仍创建 GSAP 动画。调用层(DesktopView)需要:
- reduced-motion 时提供**静态导航路径**:锚点用 `scrollIntoView({behavior:"instant"})` 或直接改 `location.hash`;
- **独立的位置追踪**(IntersectionObserver 或 ScrollTrigger 的 `onToggle` 仅做状态更新)喂给 SectionIndicator 与 Navigation;
- 验收:运行中切换系统偏好,正在播的吸附动画是否及时停止。用 `gsap.matchMedia()` 管理创建与恢复,但**内容可达性由项目自己保证**,matchMedia 不管这个。

### 5.2 Leaders 的 reduced-motion 是内容分支,不是关动画

见 §2.2。减少动效时渲染文档流网格;不能只 `disable()` ScrollTrigger。

### 5.3 动效词汇表:少量品牌动作,不全站套弹性

- **强调元素**(Hero 装置、section 标题、CTA):可用过冲后锁定(`back.out` / CustomEase "lock")。
- **正文揭示**:克制,`power2.out`,短时长。
- **导航反馈**:直接,CSS transition 150–250ms。
- CustomEase 局部使用,**不改 `gsap.defaults()`**,避免波及冻结动画。
- SplitText 只用于少数展示标题,**不进入 TextMorph**。

---

## 6. 阶段划分

### Phase 0A · 视觉等价整理(可立即开工)

目标:换皮前把散落的样式收口。验收:**静态区域严格截图对比**(固定浏览器、视口、DPR、字体与图片加载完成状态);动画检查稳定阶段几何。

1. **建语义 token 层**(`@theme`),按"当前实际颜色"迁移。Tailwind v4 的 `purple-500` 是 OKLCH,和旧 hex `#8b5cf6` 不完全相等,**允许暂时保留两种值**,不为了统一提前改视觉。
   token 至少覆盖:
   - 表面:`bg / surface / surface-raised / line`
   - 文字:`ink / ink-muted / on-accent / on-dark`
   - 强调:`accent / accent-2 / accent-3` 各带 `hover / active` 状态
   - 焦点环:`ring-focus`
   - 反色区(深 Hero 上的浅色控件):`inverse-bg / inverse-ink`
   - 角色标签:`role-founder / captain / vice / other` 各带 `bg / ink / line` 三件套
   - 社媒品牌色**继续独立维护**,不进语义 token
   - radius / blur 四个覆盖值显式迁入 `@theme`(见 §1 #1)
2. 组件改引 token。按密度:Navigation → Members → leaderStyles → MobileFeatures → 其余。
3. 合并重复:PLATFORM_COLORS、iconMap 各归一处;constants.ts 的 icon 改字符串名。
4. 删**经构建 CSS 确认**的死代码:`--shadow-*`、`--font-light…black`、`--space-*`、JetBrains Mono 声明、9 个零引用 utility、CTAButton / GhostButton / GradientText、animations.ts 与 gradients.ts 的死导出、Navigation 里永不渲染的移动抽屉(L380–546)。
5. TextMorph 显式指定 Inter(D3)。此项无视觉变化,但要跑一次 Flip 回归确认。

### Phase 0B · 有预期差异的修复(每项写明预期差异,按行为验收)

| 项 | 预期差异 |
|---|---|
| 重复 id(`features`、`social`)收归外层 | 无视觉差异;锚点行为不变 |
| "计划"改 `kind:"coming-soon"`,两端共用提示 | 移动端点"计划"从静默变为提示 |
| 移动端语义锚点补齐 | 移动端菜单锚点从失效变为可跳转 |
| MobileNav 顺序:关抽屉 → 解滚动锁 → 跳转 → 焦点回到目标 section 标题 | 跳转后焦点位置变化 |
| SectionIndicator 44px 魔数改读尺寸变量 | lg 断点下滑块对齐修正 |
| reduced-motion:snap 静态路径 + 独立位置追踪;Leaders 网格分支;GSAP 侧 `matchMedia`;framer variants 加 reduced 分支 | 开启系统偏好后行为整体不同,单独验收 |

### Phase 1 · 设计系统落地 + 样板

token 换值、字体文件进 `app/fonts/`、原语(SectionHeader / Card / DetailSheet / LeaderCard / leaderStyles)按新语言重写。

**样板先行,桌面移动结对**:先做 **Hero 外壳(含 D9 插槽与静态占位)+ 导航 + 一张队长卡 + 一个详情弹窗**,两端同时验证,3D 设计师在此阶段介入定一张静态构图与一个可运行的立体样板。样板通过后再推广。无障碍与性能从这一步开始查。

### Phase 2 · 桌面 7 段推广

TeamInfo → Team(合照展示位,D4)→ TeamFeatures → Leaders 外观(含 §2.2 几何回归)→ Members → SocialLinks。

### Phase 3 · 移动端 7 段推广

复用 Phase 1 原语。

### Phase 4 · 收尾

动效词汇表统一(§5.3)、Lighthouse、reduced-motion 全站复验、CDP 真机验证关键动画。

---

## 7. 验收

- **静态区域**:固定 Chrome 版本、视口(1440×900 / 390×844)、DPR 1、字体与图片加载完成后截图比对。0A 要求一致;0B 按各项预期差异记录。
- **动画**:CDP 真实时间(不能用虚拟时钟,GSAP ticker 会冻住)。检查稳定阶段的几何位置,覆盖 hover 反向、快速移入移出、终态。TextMorph 五个阶段各截一帧与基线比对。
- **Leaders**:横移走满、DWELL 平台、sticky 释放无回跳;弹窗开关 x 位移为 0。任何尺寸变更后重跑。
- **可达性**:前四段在 ≤ 700px 高与 125% / 150% 字号下内容可达;键盘 Tab 顺序;焦点环可见;reduced-motion 下无劫持滚动、无自动动画、Leaders 全部人物可见。
- **性能**:Lighthouse 移动端 ≥ 90,固定测量条件(同一设备模拟、同一网络节流、冷缓存)。它不替代滚动、焦点与内容可达性验收。
- **每个 Phase**:`tsc --noEmit`、`npm run lint` 零错误,`npm run build` 通过。
