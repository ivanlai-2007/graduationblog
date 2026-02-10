//developed by Ivan_Lai with google AIstudio 
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, NavItem } from '../types';
import { Menu, X, Home, Image, MessageSquare, Phone, GraduationCap, BookOpen, ShieldCheck, Github, Twitter } from 'lucide-react';

const Layout: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { key: 'nav.home', path: '/', icon: Home },
    { key: 'nav.memories', path: '/memories', icon: BookOpen },
    { key: 'nav.gallery', path: '/gallery', icon: Image },
    { key: 'nav.guestbook', path: '/guestbook', icon: MessageSquare },
    { key: 'nav.contact', path: '/contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = '#'}>
              {/* TODO: Replace the src below with your actual attached image URL */}
              <img 
                src="https://i.ibb.co/4gKDZF7M/Pix-Pin-2026-02-10-19-13-24.png" 
                alt="Class Logo" 
                className="h-10 w-10 rounded-full object-cover border border-gray-200"
              />
              <span className="font-serif font-bold text-xl text-primary tracking-wide">
                ClassOf2026
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 items-center">
              {navItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {t(item.key)}
                </NavLink>
              ))}
              
              {/* Language Switcher */}
              <div className="relative group ml-4">
                <button className="flex items-center text-sm font-medium text-gray-600 hover:text-primary border px-3 py-1 rounded-full border-gray-200 hover:border-primary transition-all">
                  {language === Language.EN ? 'EN' : language === Language.ZH_CN ? '简' : '繁'}
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <button onClick={() => setLanguage(Language.EN)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg">English</button>
                  <button onClick={() => setLanguage(Language.ZH_CN)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">简体中文</button>
                  <button onClick={() => setLanguage(Language.ZH_TW)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg">繁體中文</button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden gap-4">
               {/* Mobile Language Toggle (Simple Cycle) */}
               <button 
                onClick={() => {
                    if (language === Language.EN) setLanguage(Language.ZH_CN);
                    else if (language === Language.ZH_CN) setLanguage(Language.ZH_TW);
                    else setLanguage(Language.EN);
                }}
                className="text-xs font-bold text-primary border border-primary px-2 py-1 rounded"
              >
                 {language === Language.EN ? 'EN' : language === Language.ZH_CN ? '简' : '繁'}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-primary focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${
                      isActive
                        ? 'text-primary bg-blue-50'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {t(item.key)}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <GraduationCap className="h-8 w-8 mx-auto mb-4 text-gray-600" />
          <p className="font-serif text-lg text-gray-300 mb-2">Class of 2026</p>
            <p className="text-sm">
            &copy; {new Date().getFullYear()} Graduation Committee. All rights reserved.
            <a 
              href="https://github.com/ivanlai-2007/graduationblog" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors inline-flex items-center gap-1 ml-2"
            >
              <Github size={12} /> Star it!
            </a>
            </p>
          <div className="mt-4">
            <NavLink to="/admin" className="text-xs text-gray-600 hover:text-gray-400 flex items-center justify-center gap-1">
              <ShieldCheck size={12} /> Admin
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;


/*
  #####   ######   ######     ##     ##  ##            ######    ####    ######   #####     #####
 ##   ##  # ## #    ##  ##   ####    ##  ##             ##  ##    ##      ##  ##   ## ##   ##   ##
 #          ##      ##  ##  ##  ##   ##  ##             ##  ##    ##      ##  ##   ##  ##  #
  #####     ##      #####   ##  ##    ####              #####     ##      #####    ##  ##   #####
      ##    ##      ## ##   ######     ##               ##  ##    ##      ## ##    ##  ##       ##
 ##   ##    ##      ##  ##  ##  ##     ##               ##  ##    ##      ##  ##   ## ##   ##   ##
  #####    ####    #### ##  ##  ##    ####             ######    ####    #### ##  #####     #####


*/