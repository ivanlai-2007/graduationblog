import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Memory } from '../types';
import { BookOpen, Calendar, ChevronRight, Loader2 } from 'lucide-react';

const Memories: React.FC = () => {
  const { t } = useLanguage();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('memories')
      .select('id, title, content, created_at, author')
      .order('created_at', { ascending: false });
    
    if (data) setMemories(data as Memory[]);
    setIsLoading(false);
  };

  // Helper to extract a short preview from markdown content
  const getExcerpt = (content: string) => {
    // Remove markdown headers
    const plain = content.replace(/[#*`_]/g, '');
    return plain.length > 150 ? plain.substring(0, 150) + '...' : plain;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">{t('memories.title')}</h1>
          <div className="h-1 w-20 bg-secondary mx-auto rounded"></div>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-20 text-primary">
                <Loader2 size={40} className="animate-spin" />
            </div>
        ) : memories.length === 0 ? (
            <div className="text-center py-20 text-gray-400 bg-white rounded-xl shadow-sm border border-gray-100">
                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p>No memories written yet.</p>
            </div>
        ) : (
            <div className="space-y-6">
                {memories.map((memory) => (
                    <Link 
                        key={memory.id} 
                        to={`/memories/${memory.id}`}
                        className="block bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-secondary/30 transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold font-serif text-gray-800 group-hover:text-primary transition-colors">
                                {memory.title}
                            </h2>
                            <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                <Calendar size={12} />
                                {new Date(memory.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                            {getExcerpt(memory.content)}
                        </p>
                        <div className="flex items-center text-secondary font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                            {t('memories.readMore')} <ChevronRight size={16} />
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Memories;