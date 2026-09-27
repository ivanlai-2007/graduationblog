import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Play } from 'lucide-react';

// 定義場景腳本介面
interface ScriptLine {
  main: string;
  sub: string;
}

const Home: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 狀態管理
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEndMenu, setShowEndMenu] = useState(false);

  // DOM Refs (用於高效能的直接操作，避免 React 頻繁 Re-render 導致動畫卡頓)
  const orbRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const particleLayerRef = useRef<HTMLDivElement>(null);
  
  // 保存定時器以便在組件卸載時清理
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  let particleInterval: NodeJS.Timeout | null = null;

  // 將你的語系設定融入動畫腳本
  const scriptLines: ScriptLine[] = [
    { main: t('home.title') || "IN THE BEGINNING", sub: "Est. 2006" },
    { main: t('home.subtitle') || "A SINGLE SPARK", sub: "AWAKENED THE DIMENSIONS" },
    { main: t('home.welcome') || "TIME BEGAN TO FLOW", sub: "WE ARE ALL STARDUST" },
    { main: "7,305 Days", sub: "OF TIME SHARED TOGETHER" },
    { main: "Infinite Future", sub: "THE JOURNEY HAS JUST BEGUN" }
  ];

  // 清理所有定時器 (防止記憶體洩漏)
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (particleInterval) clearInterval(particleInterval);
  };

  // 組件卸載時執行清理
  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  // 粒子生成系統 (使用 Vanilla DOM 確保效能)
  const createParticle = () => {
    if (!particleLayerRef.current) return;
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const animDuration = Math.random() * 4 + 3;
    const opacity = Math.random() * 0.5 + 0.2;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${animDuration}s`;
    particle.style.opacity = `${opacity}`;
    
    if(Math.random() > 0.7) particle.style.filter = 'blur(2px)';

    particleLayerRef.current.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) particle.remove();
    }, animDuration * 1000);
  };

  // 文字顯現系統
  const showText = (index: number, duration: number) => {
    if (index >= scriptLines.length || !textContainerRef.current) return;

    const textDiv = document.createElement('div');
    textDiv.className = 'title-text';
    textDiv.innerHTML = `
        ${scriptLines[index].main}
        <span class="subtitle-text">${scriptLines[index].sub}</span>
    `;
    textContainerRef.current.appendChild(textDiv);

    // 進場
    const t1 = setTimeout(() => textDiv.classList.add('active'), 50);
    // 出場
    const t2 = setTimeout(() => {
        textDiv.classList.remove('active');
        textDiv.classList.add('exit');
        setTimeout(() => textDiv.remove(), 2000);
    }, duration);

    timeoutsRef.current.push(t1, t2);
  };

  // 核心時間軸導演系統
  const startExperience = () => {
    setIsPlaying(true);
    
    const safeSetTimeout = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timeoutsRef.current.push(id);
    };

    // 0.0s - 光球初現
    safeSetTimeout(() => {
      if(orbRef.current) {
        orbRef.current.style.opacity = '1';
        orbRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    }, 500);

    // 2.0s - 台詞 1
    safeSetTimeout(() => showText(0, 3500), 2000);

    // 5.0s - 空間變化
    safeSetTimeout(() => {
      if(bg1Ref.current) bg1Ref.current.style.opacity = '1';
      if(orbRef.current) {
        orbRef.current.style.transform = 'translate(-50%, -50%) scale(2)';
        orbRef.current.style.boxShadow = '0 0 40px 10px rgba(255, 255, 255, 0.8), 0 0 100px 50px rgba(65, 105, 225, 0.6)';
      }
    }, 5000);

    // 6.5s - 台詞 2
    safeSetTimeout(() => showText(1, 3000), 6500);

    // 9.0s - 粒子開始上升
    safeSetTimeout(() => {
      particleInterval = setInterval(createParticle, 150);
      if(orbRef.current) {
        orbRef.current.style.transform = 'translate(-50%, -40%) scale(0.5)';
        orbRef.current.style.boxShadow = '0 0 10px 5px #fff, 0 0 50px 20px #ff6b6b';
      }
    }, 9000);

    // 10.0s - 台詞 3
    safeSetTimeout(() => showText(2, 3000), 10000);

    // 13.5s - 視覺高潮 (色彩爆炸)
    safeSetTimeout(() => {
      if(bg2Ref.current) bg2Ref.current.style.opacity = '0.8';
      if(orbRef.current) {
        orbRef.current.style.transform = 'translate(-50%, -50%) scale(50)';
        orbRef.current.style.opacity = '0'; 
      }
      if(particleInterval) clearInterval(particleInterval);
      particleInterval = setInterval(createParticle, 40); // 粒子加速
    }, 13500);

    // 14.5s - 台詞 4
    safeSetTimeout(() => showText(3, 3500), 14500);

    // 19.0s - 台詞 5
    safeSetTimeout(() => showText(4, 4000), 19000);

    // 23.0s - 視覺淡出
    safeSetTimeout(() => {
      if(bg2Ref.current) bg2Ref.current.style.opacity = '0';
      if(bg1Ref.current) bg1Ref.current.style.opacity = '0';
      if(particleInterval) clearInterval(particleInterval);
      
      const allParticles = document.querySelectorAll('.particle') as NodeListOf<HTMLElement>;
      allParticles.forEach(p => p.style.opacity = '0');
    }, 23000);

    // 25.0s - 顯示最終導覽選單
    safeSetTimeout(() => {
      setShowEndMenu(true);
    }, 25000);
  };

  return (
    <div className="relative w-full h-screen bg-[#030305] overflow-hidden font-sans text-white">
      {/* 
        將特效需要的 CSS 注入 (利用局部 style 避免污染全域)
      */}
      <style>{`
        .layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
        
        #bg-layer-1 {
            background: radial-gradient(circle at 50% 120%, #1a0b2e 0%, #030305 70%);
            transition: opacity 4s ease-in-out;
        }
        #bg-layer-2 {
            background: radial-gradient(circle at 50% 50%, #ffffff 0%, #ffdf91 20%, #ff6b6b 50%, #030305 100%);
            transition: opacity 3s cubic-bezier(0.4, 0, 0.2, 1);
            mix-blend-mode: screen;
        }
        #orb {
            position: absolute; top: 50%; left: 50%; width: 2px; height: 2px;
            background: #fff; border-radius: 50%; transform: translate(-50%, -50%);
            box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.8), 0 0 60px 30px rgba(138, 43, 226, 0.4);
            filter: blur(2px); transition: all 2s cubic-bezier(0.25, 1, 0.5, 1);
        }
        
        .particle {
            position: absolute; background: #fff; border-radius: 50%; bottom: -10px;
            animation: floatUp linear forwards; pointer-events: none;
        }
        @keyframes floatUp {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }

        .title-text {
            position: absolute; top: 45%; width: 100%; text-align: center;
            font-family: "Noto Serif TC", "Songti TC", serif; font-size: 2rem;
            letter-spacing: 0.5em; font-weight: 300; opacity: 0;
            transform: translateY(30px) scale(0.95);
            transition: opacity 2s ease, transform 3s cubic-bezier(0.2, 0.8, 0.2, 1);
            text-shadow: 0 0 20px rgba(255,255,255,0.3);
        }
        @media (max-width: 640px) { .title-text { font-size: 1.25rem; } }

        .title-text.active { opacity: 1; transform: translateY(0) scale(1); }
        .title-text.exit {
            opacity: 0; transform: translateY(-30px) scale(1.05); filter: blur(5px);
            transition: opacity 1.5s ease, transform 2s ease, filter 1.5s ease;
        }
        .subtitle-text {
            font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
            font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase;
            color: #d4af37; margin-top: 1rem; display: block;
        }
      `}</style>

      {/* 背景層 */}
      <div ref={bg1Ref} id="bg-layer-1" className="layer opacity-0"></div>
      <div ref={bg2Ref} id="bg-layer-2" className="layer opacity-0 z-0"></div>
      
      {/* 粒子層 */}
      <div ref={particleLayerRef} className="layer z-10 overflow-hidden"></div>
      
      {/* 核心光球 */}
      <div ref={orbRef} id="orb" className="opacity-0 z-20"></div>
      
      {/* 文字容器 */}
      <div ref={textContainerRef} className="layer z-30 flex flex-col justify-center items-center"></div>

      {/* 開場播放按鈕 (結合 Tailwind) */}
      {!isPlaying && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <button 
            onClick={startExperience}
            className="group flex flex-col items-center gap-4 text-white/70 hover:text-white transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:border-white/80 transition-all duration-500 bg-white/5 backdrop-blur-md">
              <Play className="w-6 h-6 ml-1" />
            </div>
            <span className="tracking-[0.3em] text-sm font-light">BEGIN EXPERIENCE</span>
          </button>
        </div>
      )}

      {/* 結尾選單 (取代原本的 Hero Buttons) */}
      <div 
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-3000 ${
          showEndMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light tracking-widest mb-4">
            {t('home.title') || "Welcome"}
          </h1>
          <p className="text-gray-400 italic tracking-widest text-sm">
            Est. 2006 - 2026
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 px-4 w-full max-w-2xl">
          <button 
            onClick={() => navigate('/gallery')}
            className="group w-full sm:w-auto bg-[#d4af37]/20 hover:bg-[#d4af37] text-white px-8 py-4 rounded-full font-medium transition-all duration-500 flex items-center justify-center gap-3 border border-[#d4af37]/50 hover:border-[#d4af37]"
          >
            {t('home.cta') || "ENTER GALLERY"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => navigate('/memories')}
            className="group w-full sm:w-auto bg-white/5 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-medium transition-all duration-500 flex items-center justify-center gap-3 backdrop-blur-sm"
          >
            {t('home.cta.memories') || "OUR MEMORIES"}
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
