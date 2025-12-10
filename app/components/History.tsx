"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { X, Coffee } from "lucide-react";

/**
 * 历届队长数据
 */
interface Leader {
  id: string;
  name: string;
  title: string;
  term: string;
  image: string;
  bio: string;
  /** 竖版卡片的图片左右位置，默认 "50%"，小于50%偏左，大于50%偏右 */
  cardX?: string;
  /** 横版弹窗的图片上下位置，默认 "50%"，小于50%偏上，大于50%偏下 */
  modalY?: string;
}

const LEADERS: Leader[] = [
  {
    id: "17-fangxiang",
    name: "方翔",
    title: "队长",
    term: "17届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/17%E5%B1%8A-%E9%98%9F%E9%95%BF-%E6%96%B9%E7%BF%94.jpg",
    bio: "locking舞队17届队长，音乐人Laymen，量子计算科研人",
    modalY: "0%"
  },
  {
    id: "18-xiaomai",
    name: "小麦",
    title: "队长",
    term: "18-19届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/18-19%E5%B1%8A-%E9%98%9F%E9%95%BF-%E5%B0%8F%E9%BA%A6.jpg",
    bio: "2017级入学，2018届副队，2019届队长，跳舞特点是黏糊糊的"
  },
  {
    id: "18-shuishui",
    name: "水水",
    title: "副队长",
    term: "18-19届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/18-19%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E6%B0%B4%E6%B0%B4.jpg",
    bio: "18届副队长"
  },
  {
    id: "19-titi",
    name: "蹄蹄",
    title: "副队长",
    term: "19届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/19%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E8%B9%84%E8%B9%84.jpg",
    bio: "19级locking副队长，临床医学"
  },
  {
    id: "20-gege",
    name: "格格",
    title: "队长",
    term: "20届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/20%E5%B1%8A-%E9%98%9F%E9%95%BF-%E6%A0%BC%E6%A0%BC.jpg",
    bio: "19级法学+01年天秤，LK队长，身份法师，技能端水。ENFP快乐小狗，遵循LK的核心宗旨，律动是up，心情是快乐！"
  },
  {
    id: "20-xiaoshi",
    name: "小柿",
    title: "队长",
    term: "20届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/20%E5%B1%8A-%E9%98%9F%E9%95%BF-%E5%B0%8F%E6%9F%BF.jpg",
    bio: "20届队长，电子科学与技术"
  },
  {
    id: "21-xiaoxue",
    name: "小雪",
    title: "队长",
    term: "21届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/21%E5%B1%8A-%E9%98%9F%E9%95%BF-%E5%B0%8F%E9%9B%AA.jpg",
    bio: "lk舞队21届队长，物理学专业",
    modalY: "30%"
  },
  {
    id: "21-kuku",
    name: "库库",
    title: "队长",
    term: "21届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/21%E5%B1%8A-%E9%98%9F%E9%95%BF-%E5%BA%93%E5%BA%93.jpg",
    bio: "主张快乐跳舞，有时间就去跳舞"
  },
  {
    id: "21-beibei",
    name: "贝贝",
    title: "队长",
    term: "21届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/21%E5%B1%8A-%E9%98%9F%E9%95%BF-%E8%B4%9D%E8%B4%9D.jpg",
    bio: "lk舞队21届队长，法学专业。lk队于我而言承载了许多值得纪念的瞬间，我爱这个队也爱这个队里的人。"
  },
  {
    id: "21-kuzi",
    name: "裤子",
    title: "音乐总监",
    term: "21届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/21%E5%B1%8A-%E9%9F%B3%E4%B9%90%E6%80%BB%E7%9B%91-%E8%A3%A4%E5%AD%90.jpg",
    bio: "locking舞队21届音乐总监，建筑学专业",
    cardX: "100%",
    modalY: "0%"
  },
  {
    id: "22-pidan",
    name: "皮蛋",
    title: "队长",
    term: "22届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/22%E5%B1%8A-%E9%98%9F%E9%95%BF-%E7%9A%AE%E8%9B%8B.jpg",
    bio: "22-23年队长。现在是天选打工人，设计院画图狗。无比怀念和大家一起跳舞、旅游、团建、吃饭、通宵……的日子。Funk&love forever!!!"
  },
  {
    id: "22-xiaoming",
    name: "小明",
    title: "副队长",
    term: "22届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/22%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E5%B0%8F%E6%98%8E.jpg",
    bio: "大暗爹，21年入队，22届locking副队长，热爱locking"
  },
  {
    id: "23-gongchou",
    name: "觥筹",
    title: "队长",
    term: "23届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/23%E5%B1%8A-%E9%98%9F%E9%95%BF-%E8%A7%A5%E7%AD%B9.jpg",
    bio: "23届lk舞队队长"
  },
  {
    id: "23-ake",
    name: "阿珂",
    title: "副队长",
    term: "23届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/23%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E9%98%BF%E7%8F%82.jpg",
    bio: "23届lk舞队副队长，本科22级机械工程，isfj"
  },
  {
    id: "23-xiangpi",
    name: "橡皮",
    title: "副队长",
    term: "23届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/23%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E6%A9%A1%E7%9A%AE.jpg",
    bio: "23届lk副队长，单身可撩"
  },
  {
    id: "24-xiaocha",
    name: "小查",
    title: "队长",
    term: "24届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/24%E5%B1%8A-%E9%98%9F%E9%95%BF-%E5%B0%8F%E6%9F%A5.jpg",
    bio: "24～25年locking队长，🐸门徒（自封版），小孩哥（自封版），hiphop locking双修（自封版）",
    modalY: "30%"
  },
  {
    id: "24-jojo",
    name: "JOJO",
    title: "副队长",
    term: "24届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/24%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-JOJO.jpg",
    bio: "24届locking舞队副队长，男，未婚",
    modalY: "20%"
  },
  {
    id: "24-awei",
    name: "阿威",
    title: "副队长",
    term: "24届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/24%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E9%98%BF%E5%A8%81.jpg",
    bio: "24届locking舞队副队长，目前是信电老博，肥宅desu，欢迎约舞，一起索，锁出青春",
    modalY: "10%"
  },
  {
    id: "25-dragon",
    name: "dragon",
    title: "队长",
    term: "25届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/25%E5%B1%8A-%E9%98%9F%E9%95%BF-dragon.jpg",
    bio: "locking舞队25届队长，westside汉语言，其他人都比我强，和大家一起感受locking最本真的快乐。永远的放克·赫艾！",
    modalY: "30%"
  },
  {
    id: "25-tudou",
    name: "土豆",
    title: "副队长",
    term: "25届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/25%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E5%9C%9F%E8%B1%86.jpg",
    bio: "lk舞队25届副队长，物理学专业，rapstar"
  },
  {
    id: "25-afai",
    name: "阿fai",
    title: "副队长",
    term: "25届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/25%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E9%98%BFfai.jpg",
    bio: "25届lk副队长，电气工程专业，喜欢唱歌，偶尔追星，练习时长一年半。在舞队的时光会成为我大学生活最重要的记忆之一🥰",
    modalY: "30%"
  }
];

/**
 * 队长详情弹窗
 */
function LeaderModal({
  leader,
  onClose,
}: {
  leader: Leader | null;
  onClose: () => void;
}) {
  if (!leader) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative max-w-2xl w-full bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative h-80 overflow-hidden bg-neutral-800">
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{ 
              backgroundImage: `url(${leader.image})`,
              backgroundPosition: `center ${leader.modalY || "50%"}`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
        </div>

        <div className="p-8 -mt-20 relative">
          <span className="inline-block px-4 py-1.5 text-sm font-medium bg-purple-500 text-white rounded-full mb-4">
            {leader.term} · {leader.title}
          </span>
          <h3 className="text-4xl font-bold text-white mb-4">{leader.name}</h3>
          <p className="text-lg text-gray-300 leading-relaxed">{leader.bio}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}


/**
 * 历年队长 Section - 全屏 + 滚动驱动横向滚动
 */
function LeadersSection({
  onSelectLeader,
}: {
  onSelectLeader: (leader: Leader) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(1200);
  
  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // 卡片尺寸
  const CARD_WIDTH = 320;
  const CARD_GAP = 28;
  const TOTAL_WIDTH = LEADERS.length * (CARD_WIDTH + CARD_GAP);
  
  // 需要滚动的距离 = 总宽度 - 屏幕宽度 + 左边距
  const SCROLL_DISTANCE = TOTAL_WIDTH - windowWidth + 64;
  
  // 容器高度 = 1屏 + 滚动距离（让滚动条和内容同步）
  const containerHeight = windowWidth + SCROLL_DISTANCE;
  
  // 滚动进度 - 基于容器的滚动位置
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // 将垂直滚动映射到水平位移
  const x = useTransform(scrollYProgress, [0, 1], [0, -SCROLL_DISTANCE]);
  
  // 进度条
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div 
      ref={containerRef}
      className="relative bg-neutral-900"
      style={{ height: `${containerHeight}px` }}
    >
      {/* Sticky 容器 - 固定在视口 */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16">
          {/* 标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              历年队长
            </h2>
            <p className="text-xl text-gray-400">
              从17届至今，一代代队长带领我们走过每一个精彩瞬间
            </p>
          </motion.div>

          {/* 卡片横向滚动区域 */}
          <motion.div
            className="flex gap-7"
            style={{ x }}
          >
            {LEADERS.map((leader) => (
              <motion.div
                key={leader.id}
                className="shrink-0 cursor-pointer group"
                style={{ width: CARD_WIDTH }}
                onClick={() => onSelectLeader(leader)}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-neutral-800 border border-white/10 group-hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/20"
                  style={{ height: '460px' }}
                >
                  {/* 图片容器 - 绝对定位填满 */}
                  <div className="absolute inset-0">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ 
                        minWidth: '100%', 
                        minHeight: '100%',
                        objectPosition: `${leader.cardX || "50%"} center`
                      }}
                    />
                  </div>
                  {/* 渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 text-sm font-medium bg-purple-500/90 backdrop-blur-sm text-white rounded-full">
                      {leader.term}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <h3 className="text-2xl font-bold text-white mb-1">{leader.name}</h3>
                    <p className="text-purple-300">{leader.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 进度指示器 */}
          <div className="mt-8 max-w-md">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm text-gray-500">滚动浏览</span>
              <span className="text-sm text-gray-500">→</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 重大历史事件 Section - 全屏 + Not Coming Soon
 */
function EventsSection() {
  return (
    <section className="relative h-screen bg-neutral-900 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 30%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 text-center px-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 15 }}
          className="mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            <Coffee className="w-24 h-24 text-purple-400" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold text-white mb-6"
        >
          重大历史事件
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Not Coming Soon™
          </p>
          <p className="text-xl text-gray-400">
            （因为我们还在创造历史中...）
          </p>
          <p className="text-gray-500 mt-8">
            🎤 每一次演出都是历史 · 💃 每一支舞都是传奇 · 🎉 每一次团建都是回忆
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 inline-block"
        >
          <div className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
            <span className="text-gray-400">
              等我们老了，再来写这段历史 ✨
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * History 历史组件
 */
export default function History() {
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  return (
    <>
      <LeadersSection onSelectLeader={setSelectedLeader} />
      <EventsSection />

      <AnimatePresence>
        {selectedLeader && (
          <LeaderModal
            leader={selectedLeader}
            onClose={() => setSelectedLeader(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
