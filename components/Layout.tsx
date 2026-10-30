import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import logo from '../assets/favicon-512x512.png';

const Layout: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [location.pathname]);
  const items = [['nav.home','/'],['nav.memories','/memories'],['nav.gallery','/gallery'],['nav.guestbook','/guestbook'],['nav.contact','/contact'],['nav.souvenirs','/souvenirs']];
  return <div className="site-shell"><button className="skip-link" onClick={() => document.getElementById('main-content')?.focus()}>Skip to content</button>
    <header className="site-header"><div className="header-inner"><Link to="/" className="brand" aria-label="Time Photography Club home"><img src={logo} alt=""/><span><strong>TIME.</strong><small>PHOTOGRAPHY CLUB</small></span></Link>
      <nav className={`site-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">{items.map(([key,path])=><NavLink key={key} to={path} end={path === '/'} className={({isActive})=>isActive?'active':''}>{t(key)}</NavLink>)}</nav>
      <div className="header-actions"><label className="language-picker"><span className="sr-only">Language</span><select value={language} onChange={e=>setLanguage(e.target.value as Language)}><option value={Language.ZH_CN}>简体</option><option value={Language.ZH_TW}>繁體</option><option value={Language.EN}>EN</option></select></label><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?'Close menu':'Open menu'} aria-expanded={open}>{open?<X/>:<Menu/>}</button></div>
    </div></header><main id="main-content" className="site-main" tabIndex={-1}><Outlet/></main>
    <footer className="site-footer"><div className="footer-inner"><div><p className="footer-brand">TIME<span>.</span></p><p>PHOTOGRAPHY CLUB · EST. 2006</p></div><div className="footer-links"><Link to="/gallery">{t('nav.gallery')}</Link><Link to="/memories">{t('nav.memories')}</Link><Link to="/contact">{t('nav.contact')}</Link><Link to="/admin">Admin</Link></div><a href="https://github.com/ivanlai-2007/graduationblog" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15}/></a></div><div className="footer-bottom">© {new Date().getFullYear()} Time. Photography Club <span>MADE OF MOMENTS</span></div></footer>
  </div>;
};
export default Layout;
