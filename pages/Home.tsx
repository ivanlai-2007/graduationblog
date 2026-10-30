import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, Aperture, BookOpen, Image, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const copy = {
    [Language.EN]: { eyebrow: 'A PHOTOGRAPHY CLUB · EST. 2006', title: 'Hold on to the moments.', intro: 'Through our lenses, ordinary days become stories worth keeping.', explore: 'Explore the archive', note: 'A place for the people, photographs and stories that make up Time.', section: 'A living archive', sectionSub: 'Every frame has a story. Find yours here.', gallery: 'Photographs & shared albums', memories: 'Stories from our community', guestbook: 'Leave a note for the future', more: 'Explore', footer: 'Made of moments, together.' },
    [Language.ZH_CN]: { eyebrow: '时光摄影社 · 始于 2006', title: '把每个瞬间，留给时光。', intro: '透过镜头，平凡的日子也成为值得珍藏的故事。', explore: '探索我们的记录', note: '这里收藏时光摄影社的人、照片与故事。', section: '让记忆继续生长', sectionSub: '每一帧都有故事，从这里找寻属于你的那一刻。', gallery: '照片与共享相册', memories: '来自社团的故事', guestbook: '给未来留一句话', more: '探索', footer: '一起收藏，属于我们的时光。' },
    [Language.ZH_TW]: { eyebrow: '時光攝影社 · 始於 2006', title: '把每個瞬間，留給時光。', intro: '透過鏡頭，平凡的日子也成為值得珍藏的故事。', explore: '探索我們的記錄', note: '這裡收藏時光攝影社的人、照片與故事。', section: '讓記憶繼續生長', sectionSub: '每一幀都有故事，從這裡找尋屬於你的那一刻。', gallery: '照片與共享相簿', memories: '來自社團的故事', guestbook: '給未來留一句話', more: '探索', footer: '一起收藏，屬於我們的時光。' },
  }[language];
  const links = [
    {to:'/gallery', number:'01', icon:Image, title:t('nav.gallery'), desc:copy.gallery},
    {to:'/memories', number:'02', icon:BookOpen, title:t('nav.memories'), desc:copy.memories},
    {to:'/guestbook', number:'03', icon:MessageCircle, title:t('nav.guestbook'), desc:copy.guestbook},
  ];
  return <div className="home-page">
    <section className="home-hero">
      <div className="hero-grain" aria-hidden="true" />
      <div className="home-hero-inner">
        <div className="hero-copy"><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p className="hero-intro">{copy.intro}</p><Link className="hero-button" to="/gallery">{copy.explore}<ArrowRight size={18}/></Link></div>
        <div className="hero-art" aria-hidden="true"><div className="lens-ring lens-outer"><div className="lens-ring lens-middle"><div className="lens-core"><Aperture size={72} strokeWidth={0.7}/></div></div></div><span className="hero-art-label">TIME. / PHOTOGRAPHY</span><span className="hero-art-index">01 — 06</span></div>
      </div>
      <div className="hero-bottom"><span>{copy.note}</span><ArrowDownRight size={20}/></div>
    </section>
    <section className="home-archive"><div className="archive-heading"><div><p className="eyebrow">THE TIME ARCHIVE / 01</p><h2>{copy.section}</h2></div><p>{copy.sectionSub}</p></div><div className="archive-grid">{links.map(({to,number,icon:Icon,title,desc})=><Link className="archive-card" to={to} key={to}><div className="card-top"><span>{number} / 03</span><Icon size={24} strokeWidth={1.3}/></div><div><h3>{title}</h3><p>{desc}</p></div><span className="card-link">{copy.more} <ArrowRight size={16}/></span></Link>)}</div><p className="archive-signoff">{copy.footer} <span>TIME. PHOTOGRAPHY CLUB</span></p></section>
  </div>;
};
export default Home;
