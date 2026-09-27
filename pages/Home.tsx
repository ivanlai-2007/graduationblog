import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, BookOpen } from 'lucide-react'; // 移除了未使用的 MessageSquare

// 定義場景腳本介面
interface ScriptLine {
  main: string;
  sub: string;
}

const Home: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 狀態管理：控制動畫圖層與主內容的顯示
  const [showCinematic, setShowCinematic] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // DOM Refs (用於高效能的直接操作，確保進場動畫 60FPS)
  const orbRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const particleLayerRef = useRef<HTMLDivElement>(null);
  
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  let particleInterval: NodeJS.Timeout | null = null;

  // 動態抓取你的語系檔內容來作為進場台詞
  const scriptLines: ScriptLine[] = [
    { main: "Est. 2006", sub: "7,305 DAYS OF MEMORIES" },
    { main: t('home.subtitle') || "A SINGLE SPARK", sub: "AWAKENED THE DIMENSIONS" },
    { main: t('home.title') || "WELCOME", sub: "THE JOURNEY CONTINUES" }
  ];

  // 清理定時器
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (particleInterval) clearInterval(particleInterval);
  };

  useEffect(() => {
    // 進入頁面直接觸發動畫
    startExperience();
    return () => clearAllTimeouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 粒子生成系統
  const createParticle = () => {
    if (!particleLayerRef.current) return;
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const animDuration = Math.random() * 3 + 2; // 加快粒子速度
    const opacity = Math.random() * 0.5 + 0.3;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${animDuration}s`;
    particle.style.opacity = `${opacity}`;
    
    if(Math.random() > 0.6) particle.style.filter = 'blur(2px)';

    particleLayerRef.current.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) particle.remove();
    }, animDuration * 1000);
  };

  const showText = (index: number, duration: number) => {
    if (index >= scriptLines.length || !textContainerRef.current) return;

    const textDiv = document.createElement('div');
    textDiv.className = 'title-text';
    textDiv.innerHTML = `
        ${scriptLines[index].main}
        <span class="subtitle-text">${scriptLines[index].sub}</span>
    `;
    textContainerRef.current.appendChild(textDiv);

    const t1 = setTimeout(() => textDiv.classList.add('active'), 50);
    const t2 = setTimeout(() => {
        textDiv.classList.remove('active');
        textDiv.classList.add('exit');
        setTimeout(() => textDiv.remove(), 1500);
    }, duration);

    timeoutsRef.current.push(t1, t2);
  };

  // 核心時間軸 (總長約 10.5 秒)
  const startExperience = () => {
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
    }, 100);

    // 1.0s - 台詞 1
    safeSetTimeout(() => showText(0, 2000), 1000);

    // 3.5s - 空間變化 & 台詞 2
    safeSetTimeout(() => {
      if(bg1Ref.current) bg1Ref.current.style.opacity = '1';
      if(orbRef.current) {
        orbRef.current.style.transform = 'translate(-50%, -50%) scale(1.5)';
        orbRef.current.style.boxShadow = '0 0 40px 10px rgba(255, 255, 255, 0.8), 0 0 100px 50px rgba(59, 130, 246, 0.6)'; // Blue tint
      }
      showText(1, 2000);
    }, 3500);

    // 6.0s - 粒子上升 & 台詞 3
    safeSetTimeout(() => {
      particleInterval = setInterval(createParticle, 100);
      if(orbRef.current) {
        orbRef.current.style.transform = 'translate(-50%, -40%) scale(0.5)';
        orbRef.current.style.boxShadow = '0 0 10px 5px #fff, 0 0 60px 25px #d4af37'; // Gold tint
      }
      showText(2, 2500);
    }, 6000);

    // 8.5s - 視覺高潮 (光芒爆發) -> 開始顯現真實主頁
    safeSetTimeout(() => {
      if(bg2Ref.current) bg2Ref.current.style.opacity = '1'; // 全白光芒
      if(orbRef.current) {
        orbRef.current.style.transform = 'translate(-50%, -50%) scale(80)';
        orbRef.current.style.opacity = '0'; 
      }
      if(particleInterval) clearInterval(particleInterval);
      
      // 提早讓底下的真實內容出現
      setShowMainContent(true);
    }, 8500);

    // 9.5s - 動畫圖層開始淡出
    safeSetTimeout(() => {
      setIsFadingOut(true);
    }, 9500);

    // 11.5s - 徹底銷毀動畫圖層，恢復正常網頁狀態
    safeSetTimeout(() => {
      setShowCinematic(false);
    }, 11500);
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      
      {/* =========================================
          1. 你的真實主頁 (Main Content)
          ========================================= */}
      <div 
        className={`relative transition-opacity duration-[2000ms] ease-in-out ${
          showMainContent ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'
        }`}
      >
        {/* Hero Section */}
        <div className="relative h-[80vh] w-full overflow-hidden bg-gray-900">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-[10s] ease-out hover:scale-105"
            style={{ backgroundImage: 'url("https://i.ibb.co/4g03vJ50/865534-C2-2517-4419-B821-F5-BCDD0-B19-F0.jpg")' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto">
            <div className={`transition-all duration-1000 delay-500 transform ${showMainContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-[#d4af37] font-bold tracking-widest uppercase text-sm md:text-base mb-4 drop-shadow-lg">
                Est. 2006 - 2026
              </h2>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-6 leading-tight drop-shadow-2xl">
                {t('home.title')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 font-light mb-8 italic drop-shadow-md">
                "{t('home.subtitle')}"
              </p>
              <p className="text-gray-300 mb-10 max-w-xl mx-auto text-sm md:text-base drop-shadow-md">
                {t('home.welcome')}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button 
                  onClick={() => navigate('/gallery')}
                  className="group w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50"
                >
                  {t('home.cta') || 'Enter Gallery'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => navigate('/memories')}
                  className="group w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {t('home.cta.memories') || 'Our Memories'}
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className={`p-6 transition-all duration-1000 delay-[800ms] ${showMainContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-sm border border-blue-100">
                      <Star size={28} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3 text-gray-900">7,305 Days</h3>
                  <p className="text-gray-500 font-light">Of "Time" shared together.</p>
              </div>
              <div className={`p-6 transition-all duration-1000 delay-[1000ms] ${showMainContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#d4af37] shadow-sm border border-amber-100">
                      <Star size={28} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3 text-gray-900">xx Members</h3>
                  <p className="text-gray-500 font-light">One incredible family.</p>
              </div>
              <div className={`p-6 transition-all duration-1000 delay-[1200ms] ${showMainContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-sm border border-green-100">
                      <Star size={28} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3 text-gray-900">Infinite Future</h3>
                  <p className="text-gray-500 font-light">The journey has just begun.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          2. 沉浸式進場圖層 (Cinematic Overlay)
          ========================================= */}
      {showCinematic && (
        <div 
          className={`fixed inset-0 z-50 bg-[#030305] pointer-events-none transition-opacity duration-[2000ms] ease-out ${
            isFadingOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <style>{`
            .layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
            #bg-layer-1 {
                background: radial-gradient(circle at 50% 120%, #1a0b2e 0%, #030305 70%);
                transition: opacity 3s ease-in-out;
            }
            #bg-layer-2 {
                background: radial-gradient(circle at 50% 50%, #ffffff 0%, #ffdf91 30%, transparent 100%);
                transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
                mix-blend-mode: screen;
            }
            #orb {
                position: absolute; top: 50%; left: 50%; width: 2px; height: 2px;
                background: #fff; border-radius: 50%; transform: translate(-50%, -50%);
                box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.6), 0 0 40px 20px rgba(138, 43, 226, 0.3);
                filter: blur(1px); transition: all 2.5s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .particle {
                position: absolute; background: #fff; border-radius: 50%; bottom: -10px;
                animation: floatUp linear forwards;
            }
            @keyframes floatUp {
                0% { transform: translateY(0) scale(1); opacity: 0; }
                20% { opacity: 0.8; }
                80% { opacity: 0.8; }
                100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
            }
            .title-text {
                position: absolute; top: 45%; width: 100%; text-align: center;
                font-family: "Noto Serif TC", "Songti TC", serif; font-size: 2.5rem;
                letter-spacing: 0.3em; font-weight: 300; opacity: 0; color: #fff;
                transform: translateY(20px) scale(0.95);
                transition: opacity 1.5s ease, transform 2.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                text-shadow: 0 0 20px rgba(255,255,255,0.4);
            }
            @media (max-width: 640px) { .title-text { font-size: 1.5rem; } }
            .title-text.active { opacity: 1; transform: translateY(0) scale(1); }
            .title-text.exit {
                opacity: 0; transform: translateY(-20px) scale(1.05); filter: blur(8px);
                transition: opacity 1s ease, transform 1.5s ease, filter 1s ease;
            }
            .subtitle-text {
                font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
                font-size: 0.75rem; letter-spacing: 0.4em; text-transform: uppercase;
                color: #d4af37; margin-top: 1.2rem; display: block;
            }
          `}</style>

          <div ref={bg1Ref} id="bg-layer-1" className="layer opacity-0"></div>
          <div ref={bg2Ref} id="bg-layer-2" className="layer opacity-0 z-0"></div>
          
          <div ref={particleLayerRef} className="layer z-10 overflow-hidden"></div>
          
          <div ref={orbRef} id="orb" className="opacity-0 z-20"></div>
          
          <div ref={textContainerRef} className="layer z-30 flex flex-col justify-center items-center"></div>
        </div>
      )}
      
    </div>
  );
};

export default Home;
