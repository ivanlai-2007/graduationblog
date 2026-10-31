import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { Memory } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { readingMinutes } from '../services/textUtils';

export default function LatestStories() {
  const [stories, setStories] = useState<Memory[]>([]); const [loading, setLoading] = useState(true); const [failed, setFailed] = useState(false); const { language, t } = useLanguage();
  useEffect(() => { let current = true; supabase.from('memories').select('id,title,content,created_at,author').order('created_at', { ascending: false }).limit(3).then(({ data, error }) => { if (!current) return; if (data) setStories(data as Memory[]); setFailed(!!error); setLoading(false); }); return () => { current = false; }; }, []);
  if (loading) return <p className="editorial-empty" role="status">{t('common.loading')}</p>;
  if (failed) return <p className="editorial-empty">{t('common.error')} <Link to="/memories">{t('nav.memories')} ↗</Link></p>;
  if (!stories.length) return <p className="editorial-empty">{language==='en'?'Our stories will appear here. Explore the journal.':'故事將在這裡慢慢累積。先到回憶錄看看。'} <Link to="/memories">↗</Link></p>;
  return <div className="latest-stories">{stories.map((story,i) => <Link key={story.id} to={`/memories/${story.id}`}><span className="latest-number">0{i+1}</span><div><span className="micro-label">{new Date(story.created_at).toLocaleDateString(language)} · {readingMinutes(story.content)} MIN READ</span><h3>{story.title}</h3></div><ArrowUpRight size={24}/></Link>)}</div>;
}
