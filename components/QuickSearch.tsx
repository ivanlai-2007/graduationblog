import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search, X, LoaderCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDialog } from '../hooks/useDialog';

interface Result { id: string; title: string; note: string; path: string; }
export default function QuickSearch({ onClose }: { onClose: () => void }) {
  const { t, language } = useLanguage(); const navigate = useNavigate(); const ref = useDialog(onClose); const [query, setQuery] = useState(''); const [remote, setRemote] = useState<Result[]>([]); const [loading, setLoading] = useState(false); const [failed, setFailed] = useState(false);
  const en = language === 'en'; const tw = language === 'zh-TW';
  const pages = [['nav.gallery', '/gallery'], ['nav.memories', '/memories'], ['nav.contact', '/contact'], ['nav.guestbook', '/guestbook'], ['nav.souvenirs', '/souvenirs']].map(([key,path]) => ({ id: path, title: t(key), path, note: en ? 'PAGE' : '頁面' }));
  useEffect(() => {
    let current = true; setRemote([]); setFailed(false); if (query.trim().length < 2) { setLoading(false); return; }
    setLoading(true);
    const timeout = window.setTimeout(async () => {
      try {
      const { supabase } = await import('../services/supabaseClient');
      const term = query.trim().replace(/[%_\\]/g, '').slice(0, 60);
      const results = await Promise.allSettled([
        supabase.from('memories').select('id,title').ilike('title', `%${term}%`).limit(6),
        supabase.from('contacts').select('id,name,role').ilike('name', `%${term}%`).limit(6),
      ]);
      if (!current) return;
      const found: Result[] = []; let errors = 0;
      results.forEach((r,i) => { if (r.status !== 'fulfilled' || r.value.error) { errors++; return; } r.value.data?.forEach((item: any) => found.push(i === 0 ? { id:`story:${item.id}`, title:item.title, note:en?'STORY':'故事', path:`/memories/${item.id}` } : {id:`member:${item.id}`,title:item.name,note:item.role,path:`/contact?q=${encodeURIComponent(item.name)}`})); });
      setRemote(found); setFailed(errors > 0); setLoading(false);
      } catch { if (current) { setFailed(true); setLoading(false); } }
    }, 250);
    return () => { current = false; window.clearTimeout(timeout); };
  }, [query, language]);
  const matches = pages.filter(p => !query || p.title.toLowerCase().includes(query.toLowerCase())); const results = [...matches, ...remote];
  const go = (path: string) => { onClose(); navigate(path); };
  return createPortal(<div className="search-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}><div ref={ref} className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="quick-search-heading"><h2 id="quick-search-heading" className="sr-only">{en?'Search Time':'搜尋時光'}</h2><div className="search-top"><Search size={20}/><input autoFocus id="search-title" aria-label={en?'Search pages, stories and people':'搜尋頁面、故事與成員'} placeholder={en?'Find a story, a person, a place…':tw?'找一篇故事、一位成員、一個瞬間…':'找一篇故事、一位成员、一个瞬间…'} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && results[0]) go(results[0].path); }}/><button onClick={onClose} aria-label={en?'Close search':'關閉搜尋'}><X size={20}/></button></div><p className="search-hint">{en?'EXPLORE TIME.':'探索時光'} <span>{en?'Type 2+ characters to search stories & members':tw?'輸入至少兩個字元，搜尋故事與成員':'输入至少两个字符，搜索故事与成员'}</span></p><div className="search-results">{results.map(result => <button key={result.id} onClick={() => go(result.path)}><div><span>{result.note}</span><strong>{result.title}</strong></div><ArrowUpRight size={17}/></button>)}{loading && <p role="status"><LoaderCircle className="animate-spin" size={18}/>{en?'Searching…':'搜尋中…'}</p>}{!loading && results.length === 0 && <p>{en?'No matches found. Try another word.':'沒有找到結果，換個關鍵字試試。'}</p>}{failed && <p>{en?'Some results are unavailable. Please try again.':'部分搜尋結果暫時無法載入，請稍後再試。'}</p>}</div><div className="search-bottom"><span>↵ {en?'OPEN':'開啟'}</span><span>ESC {en?'CLOSE':'關閉'}</span></div></div></div>, document.body);
}
