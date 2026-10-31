import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, Heart, Maximize2, Minimize2 } from 'lucide-react';
import { EditorialFrame } from '../constants/editorial';
import { useLanguage } from '../contexts/LanguageContext';
import { useExperience } from '../contexts/ExperienceContext';
import { useDialog } from '../hooks/useDialog';

export default function Lightbox({ frames, initialIndex, onClose }: { frames: EditorialFrame[]; initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex); const [expanded, setExpanded] = useState(false);
  const { language } = useLanguage(); const { saved, toggleSaved } = useExperience(); const ref = useDialog(onClose); const frame = frames[index];
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { setIndex(i => (i + 1) % frames.length); setExpanded(false); }
      if (event.key === 'ArrowLeft') { setIndex(i => (i - 1 + frames.length) % frames.length); setExpanded(false); }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [frames.length]);
  const move = (delta: number) => { setIndex(i => (i + delta + frames.length) % frames.length); setExpanded(false); };
  const liked = saved.includes(`frame:${frame.id}`);
  return createPortal(<div className="lightbox-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div ref={ref} className="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
      <div className="lightbox-toolbar"><span>TIME. / EDITORIAL STUDIES</span><div><button onClick={() => setExpanded(v => !v)} aria-label={language === 'en' ? 'Toggle image size' : '切換影像大小'}>{expanded ? <Minimize2 size={19}/> : <Maximize2 size={19}/>}</button><button aria-pressed={liked} onClick={() => toggleSaved(`frame:${frame.id}`)} aria-label={language === 'en' ? 'Save image' : '收藏影像'}><Heart size={19} fill={liked ? 'currentColor' : 'none'}/></button><button onClick={onClose} aria-label={language === 'en' ? 'Close viewer' : '關閉預覽'}><X size={23}/></button></div></div>
      <div className={`lightbox-stage ${expanded ? 'expanded' : ''}`}><button className="lightbox-arrow" onClick={() => move(-1)} aria-label={language === 'en' ? 'Previous image' : '上一張'}><ChevronLeft/></button><div className="lightbox-image" key={frame.id}><img src={frame.src} alt={frame.description[language]}/></div><button className="lightbox-arrow" onClick={() => move(1)} aria-label={language === 'en' ? 'Next image' : '下一張'}><ChevronRight/></button></div>
      <div className="lightbox-caption"><div><h2 id="lightbox-title">{frame.title[language]}</h2><p>{frame.description[language]}</p><small>{language === 'en' ? 'AI editorial study · Not a club submission' : language === 'zh-CN' ? 'AI 编辑视觉示意 · 非社团投稿作品' : 'AI 編輯視覺示意 · 非社團投稿作品'}</small></div><span>{String(index + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}</span></div>
    </div>
  </div>, document.body);
}
