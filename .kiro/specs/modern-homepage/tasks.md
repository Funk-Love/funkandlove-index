# Implementation Plan

- [x] 1. 安装依赖和配置项目基础





  - 安装 framer-motion 和 lucide-react 依赖包
  - 配置 next.config.ts 支持外部图片域名
  - _Requirements: 8.1_
- [x] 2. 创建核心工具库和配置文件




- [ ] 2. 创建核心工具库和配置文件

- [x] 2.1 创建站点配置文件


  - 在 lib/constants.ts 中定义 SITE_CONFIG 和 NAV_LINKS
  - 包含团队信息、特色、社交链接、图片路径等所有内容
  - 添加清晰的注释说明每个图片位置的建议尺寸
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 7.2, 7.3_


- [x] 2.2 创建动画变体配置

  - 在 lib/animations.ts 中定义 fadeInUp, fadeIn, slideInLeft, slideInRight, staggerContainer, scaleOnHover 等动画变体
  - 确保动画持续时间符合需求（Hero 动画 ≤ 1.2s，滚动动画 ≤ 0.8s）
  - _Requirements: 1.3, 2.2, 3.1, 3.2_

- [x] 2.3 创建动态渐变工具函数


  - 在 lib/gradients.ts 中实现 interpolateColor 颜色插值函数
  - 实现 getDistanceFromMouse 距离计算函数
  - 实现 useMousePosition 自定义 Hook 追踪鼠标位置
  - _Requirements: 3.2, 8.5_
- [x] 3. 创建基础 UI 组件




- [ ] 3. 创建基础 UI 组件

- [x] 3.1 实现 ImagePlaceholder 组件


  - 创建 app/components/ui/ImagePlaceholder.tsx
  - 使用 Next.js Image 组件，支持图片加载失败处理
  - 显示 "404 - 图片待补充" 占位符和建议尺寸
  - 支持骨架屏加载状态
  - _Requirements: 1.4, 4.5, 7.1, 7.4, 7.5_


- [x] 3.2 实现 Card 组件

  - 创建 app/components/ui/Card.tsx
  - 支持半透明背景、圆角、阴影、backdrop-blur 效果
  - 支持悬停动画效果
  - _Requirements: 3.3, 8.4, 8.5_

- [x] 3.3 实现 CursorGlow 组件


  - 创建 app/components/ui/CursorGlow.tsx
  - 实现全局鼠标光晕效果，跟随鼠标移动
  - 使用 pointer-events: none 避免干扰交互
  - 应用模糊效果和混合模式
  - _Requirements: 3.2, 8.5_

- [x] 4. 实现 Navigation 导航组件




  - 创建 app/components/Navigation.tsx
  - 实现固定顶部导航栏，滚动时添加毛玻璃背景效果
  - 桌面端：水平导航链接
  - 移动端：汉堡菜单 + 全屏侧边栏，使用 Framer Motion 动画
  - 实现平滑滚动功能，点击导航链接滚动到对应区域
  - 确保响应式设计，移动端触摸区域 ≥ 44x44px
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 6.3_


- [x] 5. 实现 Hero Section 组件





  - 创建 app/components/Hero.tsx
  - 实现全屏高度布局 (min-h-screen)
  - 实现鼠标跟随径向渐变背景，使用 useMousePosition Hook
  - 移动端使用自动动画或简化渐变效果
  - 实现渐入动画序列：标题、Slogan、描述依次出现
  - 添加向下滚动指示器（动画箭头）
  - 使用 ImagePlaceholder 组件处理背景图片
  - 添加文字发光效果 (text-shadow)
  - 确保响应式文字大小
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 3.2, 3.4, 6.1, 6.2, 8.2, 8.4, 8.5_

- [x] 6. 实现 TeamInfo 团队信息组件




  - 创建 app/components/TeamInfo.tsx
  - 实现两栏布局（桌面）和单栏布局（移动）
  - 左侧使用 ImagePlaceholder 展示团队照片
  - 右侧展示团队基本信息，使用 Lucide Icons 图标
  - 实现滚动触发动画：进入视口时从左/右滑入
  - 使用视觉化方式展示信息，避免大段文字堆砌
  - _Requirements: 3.1, 3.3, 4.1, 4.2, 4.5, 6.1, 6.2, 6.4, 8.3, 8.4_


- [x] 7. 实现 TeamFeatures 团队特色组件




  - 创建 app/components/TeamFeatures.tsx
  - 实现响应式网格布局：4列（桌面）/ 2列（平板）/ 1列（移动）
  - 使用 Card 组件展示 4 个特色卡片
  - 每个卡片包含 Lucide Icon、标题、描述
  - 实现鼠标距离驱动的动态背景色变化，创造"波纹"效果
  - 实现滚动触发的 stagger 动画，卡片依次淡入
  - 实现悬停效果：卡片上浮、阴影增强、背景色变化
  - 图标颜色根据鼠标位置动态变化
  - _Requirements: 3.1, 3.2, 3.3, 4.3, 6.1, 6.2, 8.3, 8.4, 8.5_

- [x] 8. 实现 TeamSpirit 团队精神组件



  - 创建 app/components/TeamSpirit.tsx
  - 实现全宽背景区域，居中大字号文字
  - 实现滚动驱动渐变背景，使用 useScroll 和 useTransform
  - 背景色根据滚动位置在多个颜色间平滑过渡
  - 实现文字动画：逐字淡入或打字机效果
  - 添加鼠标跟随光晕效果
  - 添加文字动态发光效果
  - 突出显示 Slogan 和理念，使用大字号和特殊排版
  - _Requirements: 3.1, 3.2, 4.4, 8.2, 8.4, 8.5_

- [x] 9. 实现 SocialLinks 社交媒体链接组件





  - 创建 app/components/SocialLinks.tsx
  - 实现水平排列的社交媒体图标，居中对齐
  - 使用 Lucide Icons 展示平台图标
  - 实现悬停效果：图标放大 + 颜色变化为平台品牌色
  - 处理筹备中状态：灰色显示 + "筹备中" 标签 + 禁用点击
  - 可用链接在新标签页打开，使用 noopener,noreferrer
  - 确保响应式布局，移动端适配
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 8.3_

- [x] 10. 组装主页面





  - 更新 app/page.tsx，按顺序组装所有组件
  - 添加 CursorGlow 全局鼠标光晕效果
  - 为每个区域添加 id 属性，支持导航跳转
  - 确保页面流畅滚动和动画性能
  - _Requirements: 1.1, 2.1, 3.4, 6.4_
- [x] 11. 更新全局样式和 metadata



- [ ] 11. 更新全局样式和 metadata

- [x] 11.1 更新 app/globals.css


  - 添加 CSS 变量定义（颜色、字体、间距等）
  - 添加全局样式和 Tailwind 指令
  - 优化动画性能，使用 will-change 属性
  - _Requirements: 1.5, 8.1, 8.2, 8.4, 8.5_

- [x] 11.2 更新 app/layout.tsx metadata


  - 更新 title、description、keywords
  - 配置 OpenGraph 信息
  - 设置 favicon 和 icon 为 S3 URL
  - 添加 authors 信息
  - _Requirements: 1.5, 8.1_

- [x] 12. 性能优化和最终调整





  - 验证所有动画帧率 ≥ 50 FPS
  - 确保图片占位符正常工作
  - 测试响应式布局在不同设备上的表现
  - 验证平滑滚动功能
  - 测试动态渐变效果在不同浏览器的兼容性
  - _Requirements: 3.4, 6.1, 6.2, 6.5, 7.5_
