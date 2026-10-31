import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, Search, X, MoveUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useExperience } from '../contexts/ExperienceContext';
import { Language } from '../types';
const QuickSearch = lazy(() => import('./QuickSearch'));

export default function Layout() {
  const { language, setLanguage, t } = useLanguage(); const { motion, toggleMotion } = useExperience();
  const [open, setOpen] = useState(false); const [searchOpen, setSearchOpen] = useState(false); const [scrolled, setScrolled] = useState(false); const location = useLocation();
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40); const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(value => !value); }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('keydown', onKey); onScroll();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); };
  }, []);
  useEffect(() => {
    const labels: Record<string,string> = {'/':'home.title','/gallery':'nav.gallery','/memories':'nav.memories','/contact':'nav.contact','/guestbook':'nav.guestbook','/souvenirs':'nav.souvenirs','/admin':'admin.title'};
    if (labels[location.pathname]) document.title = `${t(labels[location.pathname])} — Time.`;
  }, [location.pathname, language]);
  const items = [['nav.gallery', '/gallery'], ['nav.memories', '/memories'], ['nav.contact', '/contact'], ['nav.guestbook', '/guestbook'], ['nav.souvenirs', '/souvenirs']];
  const en = language === Language.EN;
  return <div className="site-shell"><button className="skip-link" onClick={() => document.getElementById('main-content')?.focus()}>{en?'Skip to content':'跳至內容'}</button>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}><div className="header-inner"><Link to="/" className="brand" aria-label="Time Photography Club home"><strong>time<span>.</span></strong><span className="brand-note">PHOTOGRAPHY<br/>CLUB / 2006</span></Link>
      <nav id="site-navigation" className={`site-nav ${open ? 'is-open' : ''}`} aria-label={en?'Main navigation':'主要導覽'}>{items.map(([key,path],i) => <NavLink key={key} to={path} className={({ isActive }) => isActive ? 'active' : ''} style={{ '--nav-i': i } as React.CSSProperties}><sup>0{i+1}</sup><span>{t(key)}</span><ArrowUpRight className="mobile-nav-arrow" size={18}/></NavLink>)}</nav>
      <div className="header-actions"><button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label={en?'Search · Ctrl or Command K':'搜尋 · Ctrl 或 Command K'}><Search size={18}/><kbd>⌘ K</kbd></button><label className="language-picker"><span className="sr-only">Language</span><select value={language} onChange={e => setLanguage(e.target.value as Language)}><option value={Language.ZH_CN}>简</option><option value={Language.ZH_TW}>繁</option><option value={Language.EN}>EN</option></select></label><button className="menu-toggle" onClick={() => setOpen(!open)} aria-controls="site-navigation" aria-expanded={open} aria-label={open?(en?'Close menu':'關閉選單'):(en?'Open menu':'開啟選單')}>{open?<X/>:<Menu/>}</button></div>
    </div></header>
    <main id="main-content" className="site-main" tabIndex={-1}><div className="route-enter" key={location.pathname}><Outlet/></div></main>
    <footer className="site-footer"><div className="footer-intro"><p className="eyebrow">KEEP LOOKING. KEEP FEELING.</p><Link to="/guestbook">{en?'Leave a little of yourself.':language==='zh-CN'?'给时光，留下一句话。':'給時光，留下一句話。'}<MoveUpRight strokeWidth={1}/></Link></div><div className="footer-middle"><Link to="/" className="footer-wordmark" aria-label="Time home">time<span>.</span></Link><div className="footer-links">{items.map(([key,path]) => <Link key={path} to={path}>{t(key)}</Link>)}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} TIME. PHOTOGRAPHY CLUB</span><div><button onClick={toggleMotion} aria-pressed={motion}>{en?'Motion':language==='zh-CN'?'动态效果':'動態效果'} <span className="motion-dot" data-on={motion}/>{motion?'ON':'OFF'}</button><Link to="/admin">ADMIN</Link><a href="https://github.com/ivanlai-2007/graduationblog" target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={12}/></a></div></div></footer>
    {searchOpen && <Suspense fallback={null}><QuickSearch onClose={closeSearch}/></Suspense>}
  </div>;
}
