import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, MessageSquare, BookOpen } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url("https://i.ibb.co/R47VxYh6/LYF0952.jpg")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <h2 className="text-secondary font-bold tracking-widest uppercase text-sm md:text-base mb-4">
              Est. 2023 - 2026
            </h2>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-6 leading-tight">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light mb-8 italic">
              "{t('home.subtitle')}"
            </p>
            <p className="text-gray-300 mb-10 max-w-xl mx-auto text-sm md:text-base">
              {t('home.welcome')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button 
                onClick={() => navigate('/gallery')}
                className="group w-full sm:w-auto bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t('home.cta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/memories')}
                className="group w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t('home.cta.memories')}
                <BookOpen className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <Star size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">1,095 Days</h3>
                <p className="text-gray-500">Of memories shared together.</p>
            </div>
            <div className="p-6">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
                    <Star size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">42 Students</h3>
                <p className="text-gray-500">One incredible family.</p>
            </div>
            <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <Star size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Infinite Future</h3>
                <p className="text-gray-500">The journey has just begun.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;