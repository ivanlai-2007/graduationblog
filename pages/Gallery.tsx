import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';
import { ArrowUpRight, Cloud, Upload, LockKeyhole } from 'lucide-react';
import PageHeading from '../components/PageHeading';

const Gallery: React.FC = () => {
  const { t, language } = useLanguage();
  const tr = (en:string, cn:string, tw:string) => language === Language.EN ? en : language === Language.ZH_CN ? cn : tw;
  const albums = [
    { title: t('album.sports'), description: t('album.sports.desc'), platform:'OneDrive', link:'https://1drv.ms/f/c/3e1d9ee25a5a5c48/IgBF9bd5NVTwQ5zQ5SpeyMsXAdrq40_7idbryVSaNE0NdpA?e=lNhK9R' },
    { title: tr('More collections', '更多相册', '更多相簿'), description: tr('This collection is being prepared.', '相册正在整理中。', '相簿正在整理中。'), platform:tr('Coming soon', '整理中', '整理中'), link:'' },
  ];
  return <div className="page-surface"><div className="page-container"><PageHeading eyebrow="THE ARCHIVE / 01" title={t('gallery.title')} description={t('gallery.desc')} />
    <div className="gallery-grid">{albums.map((album, i) => <article className="gallery-card" key={album.platform}><div className={`gallery-art gallery-art-${i}`}><span>TIME. ARCHIVE</span><Cloud size={56} strokeWidth={.8}/><span>0{i+1} / COLLECTION</span></div><div className="gallery-body"><span className="micro-label">{album.platform}</span><h2>{album.title}</h2><p>{album.description}</p>{album.link ? <a href={album.link} target="_blank" rel="noopener noreferrer" className="text-link">{t('btn.access')} <ArrowUpRight size={17}/></a> : <span className="muted-label">{t('gallery.pending')}</span>}</div></article>)}</div>
    <section className="contribute-panel"><div className="contribute-icon"><Upload size={24}/></div><div><p className="eyebrow">CONTRIBUTE / 02</p><h2>{t('gallery.upload.title')}</h2><p>{t('gallery.upload.desc')}</p></div><a className="outline-button" href="https://c.wss.pet/s/j5662tnn15f" target="_blank" rel="noopener noreferrer">{t('gallery.upload.linkText')} <ArrowUpRight size={16}/></a></section>
    <p className="privacy-note"><LockKeyhole size={15}/>{tr('Shared albums may require permission from their owners.', '共享相册可能需要所有者授权。', '共享相簿可能需要擁有者授權。')}</p>
  </div></div>;
};
export default Gallery;
