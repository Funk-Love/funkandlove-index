"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";

/**
 * 锁定/解锁 body 滚动
 */
function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLocked]);
}

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
  cardX?: string;
  modalY?: string;
  role: 'founder' | 'captain' | 'vice' | 'other';
}

const LEADERS: Leader[] = [
  {
    id: "17-fangxiang",
    name: "方翔",
    title: "建队",
    term: "17届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/17%E5%B1%8A-%E9%98%9F%E9%95%BF-%E6%96%B9%E7%BF%94.jpg",
    bio: "locking舞队17届队长，音乐人Laymen，量子计算科研人",
    modalY: "0%",
    role: 'founder'
  },
  {
    id: "18-xiaomai",
    name: "小麦",
    title: "队长",
    term: "18-19届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/18-19%E5%B1%8A-%E9%98%9F%E9%95%BF-%E5%B0%8F%E9%BA%A6.jpg",
    bio: "2017级入学，2018届副队，2019届队长，跳舞特点是黏糊糊的",
    role: 'captain'
  },
  {
    id: "18-shuishui",
    name: "水水",
    title: "副队长",
    term: "18-19届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/18-19%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E6%B0%B4%E6%B0%B4.jpg",
    bio: "18届副队长",
    role: 'vice'
  },
  {
    id: "19-titi",
    name: "蹄蹄",
    title: "副队长",
    term: "19届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/19%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E8%B9%84%E8%B9%84.jpg",
    bio: "19级locking副队长，临床医学",
    role: 'vice'
  },
  {
    id: "20-gege",
    name: "格格",
    title: "队长",
    term: "20届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/20%E5%B1%8A-%E9%98%9F%E9%95%BF-%E6%A0%BC%E6%A0%BC.jpg",
    bio: "19级法学+01年天秤，LK队长，身份法师，技能端水。ENFP快乐小狗，遵循LK的核心宗旨，律动是up，心情是快乐！",
    role: 'captain'
  },
  {
    id: "20-xiaoshi",
    name: "小柿",
    title: "队长",
    term: "20届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/20%E5%B1%8A-%E9%98%9F%E9%95%BF-%E5%B0%8F%E6%9F%BF.jpg",
    bio: "20届队长，电子科学与技术",
    role: 'captain'
  },
  {
    id: "21-xiaoxue",
    name: "小雪",
    title: "队长",
    term: "21届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/21%E5%B1%8A-%E9%98%9F%E9%95%BF-%E5%B0%8F%E9%9B%AA.jpg",
    bio: "lk舞队21届队长，物理学专业",
    modalY: "30%",
    role: 'captain'
  },
  {
    id: "21-kuku",
    name: "库库",
    title: "队长",
    term: "21届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/21%E5%B1%8A-%E9%98%9F%E9%95%BF-%E5%BA%93%E5%BA%93.jpg",
    bio: "主张快乐跳舞，有时间就去跳舞",
    role: 'captain'
  },
  {
    id: "21-beibei",
    name: "贝贝",
    title: "队长",
    term: "21届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/21%E5%B1%8A-%E9%98%9F%E9%95%BF-%E8%B4%9D%E8%B4%9D.jpg",
    bio: "lk舞队21届队长，法学专业。lk队于我而言承载了许多值得纪念的瞬间，我爱这个队也爱这个队里的人。",
    role: 'captain'
  },
  {
    id: "21-kuzi",
    name: "裤子",
    title: "音乐总监",
    term: "21届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/21%E5%B1%8A-%E9%9F%B3%E4%B9%90%E6%80%BB%E7%9B%91-%E8%A3%A4%E5%AD%90.jpg",
    bio: "locking舞队21届音乐总监，建筑学专业",
    cardX: "100%",
    modalY: "0%",
    role: 'other'
  },
  {
    id: "22-pidan",
    name: "皮蛋",
    title: "队长",
    term: "22届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/22%E5%B1%8A-%E9%98%9F%E9%95%BF-%E7%9A%AE%E8%9B%8B.jpg",
    bio: "22-23年队长。现在是天选打工人，设计院画图狗。无比怀念和大家一起跳舞、旅游、团建、吃饭、通宵……的日子。Funk&love forever!!!",
    role: 'captain'
  },
  {
    id: "22-xiaoming",
    name: "小明",
    title: "副队长",
    term: "22届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/22%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E5%B0%8F%E6%98%8E.jpg",
    bio: "大暗爹，21年入队，22届locking副队长，热爱locking",
    role: 'vice'
  },
  {
    id: "23-gongchou",
    name: "觥筹",
    title: "队长",
    term: "23届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/23%E5%B1%8A-%E9%98%9F%E9%95%BF-%E8%A7%A5%E7%AD%B9.jpg",
    bio: "23届lk舞队队长",
    role: 'captain'
  },
  {
    id: "23-ake",
    name: "阿珂",
    title: "副队长",
    term: "23届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/23%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E9%98%BF%E7%8F%82.jpg",
    bio: "23届lk舞队副队长，本科22级机械工程，isfj",
    role: 'vice'
  },
  {
    id: "23-xiangpi",
    name: "橡皮",
    title: "副队长",
    term: "23届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/23%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E6%A9%A1%E7%9A%AE.jpg",
    bio: "23届lk副队长，单身可撩",
    role: 'vice'
  },
  {
    id: "24-xiaocha",
    name: "小查",
    title: "队长",
    term: "24届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/24%E5%B1%8A-%E9%98%9F%E9%95%BF-%E5%B0%8F%E6%9F%A5.jpg",
    bio: "24～25年locking队长，🐸门徒（自封版），小孩哥（自封版），hiphop locking双修（自封版）",
    modalY: "30%",
    role: 'captain'
  },
  {
    id: "24-jojo",
    name: "JOJO",
    title: "副队长",
    term: "24届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/24%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-JOJO.jpg",
    bio: "24届locking舞队副队长，男，未婚",
    modalY: "20%",
    role: 'vice'
  },
  {
    id: "24-awei",
    name: "阿威",
    title: "副队长",
    term: "24届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/24%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E9%98%BF%E5%A8%81.jpg",
    bio: "24届locking舞队副队长，目前是信电老博，肥宅desu，欢迎约舞，一起索，锁出青春",
    modalY: "10%",
    role: 'vice'
  },
  {
    id: "25-dragon",
    name: "dragon",
    title: "队长",
    term: "25届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/25%E5%B1%8A-%E9%98%9F%E9%95%BF-dragon.jpg",
    bio: "locking舞队25届队长，westside汉语言，其他人都比我强，和大家一起感受locking最本真的快乐。永远的放克·赫艾！",
    modalY: "30%",
    role: 'captain'
  },
  {
    id: "25-tudou",
    name: "土豆",
    title: "副队长",
    term: "25届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/25%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E5%9C%9F%E8%B1%86.jpg",
    bio: "lk舞队25届副队长，物理学专业，rapstar",
    role: 'vice'
  },
  {
    id: "25-afai",
    name: "阿fai",
    title: "副队长",
    term: "25届",
    image: "https://funkandlove-main.s3.bitiful.net/index/history/leaders/25%E5%B1%8A-%E5%89%AF%E9%98%9F%E9%95%BF-%E9%98%BFfai.jpg",
    bio: "25届lk副队长，电气工程专业，喜欢唱歌，偶尔追星，练习时长一年半。在舞队的时光会成为我大学生活最重要的记忆之一🥰",
    modalY: "30%",
    role: 'vice'
  }
];

function getRoleBadgeStyle(role: Leader['role']) {
  switch (role) {
    case 'founder':
      return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30';
    case 'captain':
      return 'bg-purple-500/90 text-white';
    case 'vice':
      return 'bg-blue-500/80 text-white';
    default:
      return 'bg-gray-500/80 text-white';
  }
}

function getCardBorderStyle(role: Leader['role']) {
  switch (role) {
    case 'founder':
      return 'border-amber-500/50 group-hover:border-amber-400 group-hover:shadow-amber-500/30';
    case 'captain':
      return 'border-white/10 group-hover:border-purple-500/50 group-hover:shadow-purple-500/20';
    case 'vice':
      return 'border-white/10 group-hover:border-blue-500/50 group-hover:shadow-blue-500/20';
    default:
      return 'border-white/10 group-hover:border-gray-500/50 group-hover:shadow-gray-500/20';
  }
}

function getTitleColor(role: Leader['role']) {
  switch (role) {
    case 'founder':
      return 'text-amber-400';
    case 'captain':
      return 'text-purple-300';
    case 'vice':
      return 'text-blue-300';
    default:
      return 'text-gray-400';
  }
}


function LeaderModal({
  leader,
  onClose,
}: {
  leader: Leader | null;
  onClose: () => void;
}) {
  if (!leader) return null;
  
  const isFounder = leader.role === 'founder';
  const modalBorderClass = isFounder 
    ? 'border-amber-500/50' 
    : leader.role === 'captain' 
      ? 'border-purple-500/30' 
      : 'border-white/10';

  return (
    <motion.div
      initial={{ opacity: 0, pointerEvents: "none" as const }}
      animate={{ opacity: 1, pointerEvents: "auto" as const }}
      exit={{ opacity: 0, pointerEvents: "none" as const }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
      data-modal-open="true"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className={`relative max-w-2xl w-full bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border ${modalBorderClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isFounder && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
        )}
        
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
          <div className={`absolute inset-0 bg-gradient-to-t ${isFounder ? 'from-neutral-900 via-neutral-900/50 to-amber-900/20' : 'from-neutral-900 via-neutral-900/50 to-transparent'}`} />
        </div>

        <div className="p-8 -mt-20 relative">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`inline-block px-4 py-1.5 text-sm font-medium rounded-full ${getRoleBadgeStyle(leader.role)}`}>
              {leader.term} · {leader.title}
            </span>
            {isFounder && (
              <span className="inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-black rounded-full">
                ⭐ 建队
              </span>
            )}
          </div>
          <h3 className="text-4xl font-bold text-white mb-4">{leader.name}</h3>
          <p className="text-lg text-gray-300 leading-relaxed">{leader.bio}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * 历年队长 Section - 优化版：使用原生滚动事件 + RAF 节流
 */
export default function Leaders() {
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 弹窗打开时锁定 body 滚动
  useBodyScrollLock(selectedLeader !== null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [translateX, setTranslateX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>(0);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const CARD_WIDTH = 320;
  const CARD_GAP = 28;
  const TOTAL_WIDTH = LEADERS.length * (CARD_WIDTH + CARD_GAP);
  const SCROLL_DISTANCE = TOTAL_WIDTH - windowWidth + 64;
  const containerHeight = windowWidth + SCROLL_DISTANCE;
  
  // 使用 RAF 节流的滚动处理
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) {
        rafRef.current = 0;
        return;
      }
      
      const rect = containerRef.current.getBoundingClientRect();
      const scrollStart = -rect.top;
      const scrollEnd = containerHeight - window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1, scrollStart / scrollEnd));
      
      setTranslateX(-scrollProgress * SCROLL_DISTANCE);
      setProgress(scrollProgress * 100);
      rafRef.current = 0;
    });
  }, [containerHeight, SCROLL_DISTANCE]);
  
  // IntersectionObserver 检测可见性
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // 只在可见时监听滚动
  useEffect(() => {
    if (!isVisible) return;
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 初始计算
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isVisible, handleScroll]);

  return (
    <>
      <div 
        ref={containerRef}
        className="relative bg-neutral-900"
        style={{ height: `${containerHeight}px` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* 背景装饰 - 减小尺寸和模糊程度 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16">
            {/* 标题 - 使用 CSS 动画 */}
            <div
              className={`mb-8 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                历年队长
              </h2>
              <p className="text-xl text-gray-400">
                从17届至今，一代代队长带领我们走过每一个精彩瞬间
              </p>
            </div>

            {/* 卡片容器 - 使用 CSS transform + will-change */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-7 will-change-transform"
              style={{ transform: `translateX(${translateX}px)` }}
            >
              {LEADERS.map((leader, index) => {
                const isFounder = leader.role === 'founder';
                
                return (
                  <div
                    key={leader.id}
                    className={`shrink-0 cursor-pointer group transition-transform duration-300 hover:-translate-y-2 ${isFounder ? 'relative' : ''}`}
                    style={{ width: isFounder ? CARD_WIDTH + 20 : CARD_WIDTH }}
                    onClick={() => setSelectedLeader(leader)}
                  >
                    {isFounder && (
                      <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                    
                    <div 
                      className={`relative overflow-hidden rounded-2xl bg-neutral-800 border transition-all duration-300 group-hover:shadow-2xl ${getCardBorderStyle(leader.role)} ${isFounder ? 'border-2' : ''}`}
                      style={{ height: isFounder ? '500px' : '460px' }}
                    >
                      <div className="absolute inset-0">
                        <img
                          src={leader.image}
                          alt={leader.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ 
                            minWidth: '100%', 
                            minHeight: '100%',
                            objectPosition: `${leader.cardX || "50%"} center`
                          }}
                          loading={index < 5 ? "eager" : "lazy"}
                        />
                      </div>
                      <div className={`absolute inset-0 bg-gradient-to-t ${isFounder ? 'from-black via-black/50 to-amber-900/20' : 'from-black via-black/40 to-transparent'}`} />

                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${getRoleBadgeStyle(leader.role)}`}>
                          {leader.term}
                        </span>
                        {isFounder && (
                          <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-black rounded-full flex items-center gap-1">
                            ⭐ 建队
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <h3 className={`font-bold text-white mb-1 ${isFounder ? 'text-3xl' : 'text-2xl'}`}>{leader.name}</h3>
                        <p className={getTitleColor(leader.role)}>{leader.title}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 进度条 - 使用 CSS 宽度 */}
            <div className="mt-8 max-w-md">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm text-gray-500">滚动浏览</span>
                <span className="text-sm text-gray-500">→</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
