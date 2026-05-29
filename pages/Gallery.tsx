import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { PhotoAlbum } from '../types';
import { Cloud, ExternalLink, Lock, Upload } from 'lucide-react';

const Gallery: React.FC = () => {
  const { t } = useLanguage();

  const albums: PhotoAlbum[] = [
    {
      id: '1',
      titleKey: 'album.campus',
      descriptionKey: 'album.campus.desc',
      coverImage: 'https://i.ibb.co/svkXNykC/q4-1-IMG-20241018-225803.jpg',
      link: 'https://drive.google.com',
      platform: 'Google Drive'
    },
    {
      id: '2',
      titleKey: 'album.sports',
      descriptionKey: 'album.sports.desc',
      coverImage: 'https://i.ibb.co/cKhYkJMK/83b4bb7303b538a4e64dfdd2b7916cf0.jpg',
      link: 'https://1drv.ms/f/c/3e1d9ee25a5a5c48/IgBF9bd5NVTwQ5zQ5SpeyMsXAdrq40_7idbryVSaNE0NdpA?e=lNhK9R',
      platform: 'OneDrive'
    },
    {
      id: '3',
      titleKey: 'album.grad',
      descriptionKey: 'album.grad.desc',
      coverImage: 'https://i.ibb.co/zh95KKSH/q4-1-55b296f1978109c443a3af1e2061ce9.jpg',
      link: 'https://pan.baidu.com',
      platform: 'Baidu Pan'
    }
  ];
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">{t('gallery.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" /> {t('gallery.desc')}
          </p>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {albums.map((album) => (
            <div key={album.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={album.coverImage} 
                  alt={t(album.titleKey)} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-gray-800 flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  {album.platform}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{t(album.titleKey)}</h3>
                <p className="text-gray-500 mb-6 text-sm min-h-[40px]">{t(album.descriptionKey)}</p>
                <a 
                  href={album.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-primary transition-colors flex items-center justify-center gap-2"
                >
                  {t('btn.access')} <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Module (External Link) */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">{t('gallery.upload.title')}</h2>
            <p className="text-gray-500 text-sm">{t('gallery.upload.desc')}</p>
          </div>

          <a 
            href="https://c.wss.pet/s/j5662tnn15f"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full group"
          >
             <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center transition-colors group-hover:border-primary group-hover:bg-blue-50/50 cursor-pointer">
                <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Upload size={32} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-primary transition-colors flex items-center gap-2">
                  {t('gallery.upload.linkText')} <ExternalLink size={16} />
                </span>
             </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Gallery;