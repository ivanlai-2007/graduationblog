import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Memory } from '../types';
import { ArrowUpRight, BookOpen, LoaderCircle } from 'lucide-react';
import PageHeading from '../components/PageHeading';
import { Language } from '../types';

const Memories: React.FC = () => {
  const { t, language } = useLanguage();
  const tr=(en:string,cn:string,tw:string)=>language===Language.EN?en:language===Language.ZH_CN?cn:tw;
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  async function load() { setLoading(true); const result = await supabase.from('memories').select('id,title,content,created_at,author').order('created_at',{ascending:false}); setError(!!result.error); if(result.data) setMemories(result.data as Memory[]); setLoading(false); }
  useEffect(()=>{ void load(); },[]);
  return <div className="page-surface"><div className="page-container narrow-page"><PageHeading eyebrow="WORDS & STORIES / 02" title={t('memories.title')} description={tr('A collection of stories from the people behind the lens.', '镜头背后的人，也有值得记录的故事。', '鏡頭背後的人，也有值得記錄的故事。')}/>
    {loading ? <div className="page-state"><LoaderCircle className="animate-spin"/>{t('common.loading')}</div> : error ? <div className="page-state" role="alert">{t('common.error')}<button className="outline-button" onClick={load}>{tr('Try again','重试','重試')}</button></div> : memories.length === 0 ? <div className="page-state"><BookOpen/>{t('memories.empty')}</div> : <div className="story-list">{memories.map((m,i)=><Link to={`/memories/${m.id}`} className="story-row" key={m.id}><span className="story-number">{String(i+1).padStart(2,'0')}</span><div><div className="story-meta">{new Date(m.created_at).toLocaleDateString(language)} {m.author && ` / ${m.author}`}</div><h2>{m.title}</h2><p>{m.content.replace(/[#*`_\[\]]/g,'').slice(0,150)}</p><span className="text-link">{t('memories.readMore')} <ArrowUpRight size={16}/></span></div><ArrowUpRight className="story-arrow" size={22}/></Link>)}</div>}
  </div></div>;
};
export default Memories;
