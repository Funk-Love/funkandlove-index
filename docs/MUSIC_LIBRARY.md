# Funk / Locking 舞曲库

## 本地资源整理（2026-09-14）

用户提供的原文件位于 `funkmusic/`，全部保留。已将 6 首音频及对应歌词复制到 `public/audio/music/`，共约 57.55 MiB。Hero 右侧“听点 Funk”进入 3D 唱片播放器；本次没有下载文件、转码、安装依赖或部署。

曲库清单：[`library.json`](../public/audio/music/library.json)，包含歌曲名、艺术家、时长、静态 URL、歌词格式及时间轴核验状态。构建后资源路径为 `/audio/music/…`；不要预加载整个曲库。

| 已整理曲目 | 音频时长 | 歌词情况 |
| --- | --- | --- |
| September — Earth, Wind & Fire | 3:35 | 新补 LRC，最后时间戳 3:34 |
| Let's Groove — Earth, Wind & Fire | 5:39 | LRC，最后时间戳 5:39 |
| Boogie Wonderland — Earth, Wind & Fire | 4:48 | LRC，最后时间戳 4:39；选用与歌词同名的音频文件 |
| Brick House — Commodores | 3:34 | LRC，最后时间戳 3:15 |
| Sing a Song — Earth, Wind & Fire | 3:21 | 有歌词正文，但原 LRC 每行都标为 3:20；已去掉无效时间戳，保存为 TXT，只支持静态展示 |
| Get Up Offa That Thing — James Brown | 4:10 | LRC 到 3:31；用户确认尾部为互动与即兴喊声，无需补词，正常入库 |

7 个源 MP3 均为 44.1 kHz、双声道、约 320 kbps，已用 FFmpeg 从头到尾解码并启用遇错退出，全部成功；首批 4 个入库音频另做了复制前后 SHA-256 一致性检查。当前清单的 12 个资源路径均存在且非空，歌词解析与时间范围检查通过。

这里的检查确认文件可完整解码、有对应歌词正文，不能证明与发行母版完全一致，也没有逐句听写、校时或校对翻译。5 份 LRC 保留原歌词及时间戳（新增两份仅清除网站宣传行），清单标为 `not-audition-verified`。播放器展示英文原词，跳过时间错位的中文译文及创作署名行；空时间点保留为间奏。TXT 标为 `untimed`，在播放器中静态滚动阅读，不伪造同步时间轴。

| 暂未入库 | 原因 / 需要补充 |
| --- | --- |
| Too Hot to Stop, Pt. 1 | 只有 LRC，没有音频 |
| Boogie Wonderland 的另一份 MP3（文件名尾号 15368602） | 4:45，解码正常，但来自另一张专辑、时长不同；避免重复入库，保留原件备用 |

## 播放器约定

- `HeroExperience` 管理两种视图；`createVinylScene` 用同一个纸套 mesh、黑胶 mesh 和相机完成转场，纸套印刷直接进入材质，避免共面贴片遮挡。标题只淡出，TextMorph 的逻辑、字体及 Flip 参数不变。
- 原唱片点击仍可重播标题；右侧独立入口进入播放器。进入不自动出声，支持播放/暂停、上一首/下一首、选曲、进度、音量、歌词和自然结束后顺序播放。收起或 Hero 离屏后继续播放；离开 Hero 后导航显示曲名及播放/暂停、前后切歌，手机同样可用。
- `MusicProvider` 位于桌面/手机断点分发之外，持有单一 audio 元素，初始无音源且 preload=none；首次进入才设置当前音源并读取 metadata，不预加载整库。大播放器和导航控制同一实例，切换断点不会重置进度。歌词按曲目请求并在切换时取消旧请求。播放失败可点击重试或换歌。
- 手动暂停与视频开始播放统一执行 300ms 淡出；Web Audio GainNode 使用音频时钟调度，淡出结束后暂停 audio。播放直接恢复设定音量，没有淡入；淡出期间再次播放或切歌会取消待执行的暂停。视频结束后不自动恢复音乐；主动播放音乐会暂停正在播放的视频。捕获原生 video play 事件联动，不修改 Plyr / HLS 内部逻辑。
- 手机首次浏览使用静帧，主动点击后先加载 Three.js 并保留原画面；模型实际绘制就绪后才同步展开纸面和播放器，加载中的 canvas 不替换静帧。减少动效下直接切换至静态姿态，不播放转场或持续旋转。离屏、后台及其他弹窗出现时停止 3D 渲染，卸载释放资源。
- 歌词和曲库的滚轮/键盘不冒泡给页面吸附；播放器其他区域保留锚点切换，进度与音量输入由原控制器忽略键盘事件。手机和平板展开高度按视口分配，歌词与曲库在内部滚动；桌面迷你播放器位于导航栏内，竖屏的播放器位于导航抽屉内，由右上角品牌 icon 小按钮打开。没有修改 section 2/3/4 的滚动控制器。播放器不是模态弹窗，不锁 body、不创建新的 ScrollTrigger。
- 黑胶展开位置从 `.deck-record-space` 的实际布局测量，尺寸变化由 ResizeObserver 同步；曲名在该区域下方保留 24px 间距，不再独立猜测模型坐标。纸套阴影接收层使用模型局部坐标且不写深度，随悬停一起倾斜，避免与纸套相交。
- LRC 使用完整多行滚动视图，当前句居中高亮；点击歌词可 seek，手动滚动后暂停跟随，点击“回到当前”恢复。只在换句/恢复跟随/尺寸改变时滚动，不逐帧更新 React 布局。
- 导航迷你播放器显示当前句与已播放时间，细进度条可点击、拖动或用键盘调整；大小播放器由 MusicProvider 共享一次歌词请求与解析。品牌文字与播放器在同一位置短过渡，图标仅在播放器显示且播放时每 8 秒匀速转一圈；暂停或退出播放器状态时，保留当前角度并用 220ms 就近转正。隐藏的控制条保留节点但不可交互；减少动效下直接切换并保持图标正向。无时间轴的 TXT 在迷你视图显示首行正文，不伪造同步歌词。
- 静态服务器需支持 MP3 MIME 和 HTTP Range 才能可靠 seek。本地可在项目根目录执行 `node scripts/preview.mjs`（先构建），预览地址 `http://127.0.0.1:4174`。此脚本仅用于本地，部署继续使用现有流程。

## 候选曲目

优先试听前六首。以下顺序是为本站挑选的建议，不是权威排名；先找原版录音室版本，避免同名 remix、现场版和加速版混在一起。

| 顺序 | 歌曲 | 艺术家 |
| --- | --- | --- |
| 1 | September | Earth, Wind & Fire |
| 2 | Let's Groove | Earth, Wind & Fire |
| 3 | Get Up Offa That Thing | James Brown |
| 4 | Get On The Good Foot | James Brown |
| 5 | Holy Ghost | The Bar-Kays |
| 6 | Brick House | Commodores |
| 7 | Boogie Wonderland | Earth, Wind & Fire with The Emotions |
| 8 | Shining Star | Earth, Wind & Fire |
| 9 | Sing a Song | Earth, Wind & Fire |
| 10 | Too Hot to Stop, Pt. 1 | The Bar-Kays |
| 11 | Machine Gun | Commodores |
| 12 | Le Freak | Chic |

曲目信息与音源入口：

- [Earth, Wind & Fire 官方网站](https://www.earthwindandfire.com/)及[官方艺人介绍](https://www.earthwindandfire.com/history/biography/)。
- [Earth, Wind & Fire — Apple Music](https://music.apple.com/us/artist/earth-wind-fire/290699)。
- [James Brown 官方音乐目录](https://jamesbrown.com/pages/music)。
- [The Bar-Kays — Apple Music](https://music.apple.com/us/artist/the-bar-kays/382848)。
- [Commodores — The Definitive Collection / Spotify](https://open.spotify.com/track/7FkIhGQuSUa9G5PnKh2QYm)，包含 Brick House、Machine Gun。
- [Chic — Le Freak / Apple Music](https://music.apple.com/us/song/1810479480)。

后续文件仍可放入 `funkmusic/`，使用“艺术家 - 歌名.mp3”及同名 `.lrc` 配对。公开资源采用小写英文短横线文件名；不得凭空生成同步时间戳，缺词或坏时间轴需要明确记录。
