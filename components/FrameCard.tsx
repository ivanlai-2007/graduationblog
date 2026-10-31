import React from 'react';
import { ArrowUpRight, Heart } from 'lucide-react';
import { EditorialFrame, FRAME_CATEGORIES } from '../constants/editorial';
import { useLanguage } from '../contexts/LanguageContext';
import { useExperience } from '../contexts/ExperienceContext';

export default function FrameCard({ frame, index, onOpen }: { frame: EditorialFrame; index: number; onOpen: () => void }) {
  const { language } = useLanguage(); const { saved, toggleSaved } = useExperience(); const liked = saved.includes(`frame:${frame.id}`);
  return <article className={`frame-card frame-${frame.category}`}>
    <div className="frame-image-wrap"><button className="frame-open" onClick={onOpen} aria-label={`${frame.title[language]} · ${language === 'en' ? 'View image' : '查看影像'}`}><img src={frame.src} alt={frame.description[language]} loading="lazy" width={frame.category === 'everyday' ? 1024 : 1536} height={frame.category === 'everyday' ? 1536 : 1024}/><span className="frame-hover"><ArrowUpRight size={23}/></span></button><span className="frame-edition">STUDY {String(index + 1).padStart(2, '0')}</span><button className={`save-frame ${liked ? 'is-saved' : ''}`} onClick={() => toggleSaved(`frame:${frame.id}`)} aria-pressed={liked} aria-label={language === 'en' ? (liked ? 'Unsave image' : 'Save image') : (liked ? '取消收藏影像' : '收藏影像')}><Heart size={18} fill={liked ? 'currentColor' : 'none'}/></button></div>
    <div className="frame-caption"><div><span className="micro-label">{FRAME_CATEGORIES[frame.category][language]} / AI EDITORIAL</span><h3><button onClick={onOpen}>{frame.title[language]}</button></h3></div><span className="frame-index">/{String(index + 1).padStart(2, '0')}</span></div>
  </article>;
}
