import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Memory } from '../types';
import Markdown from 'react-markdown';
import { ArrowLeft, Calendar, User, Loader2 } from 'lucide-react';

const MemoryDetail: React.FC = () => {
  const { id } = useParams();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchMemory(id);
  }, [id]);

  const fetchMemory = async (memId: string) => {
    setIsLoading(true);
    const { data } = await supabase
      .from('memories')
      .select('*')
      .eq('id', memId)
      .single();
    
    if (data) setMemory(data as Memory);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 size={40} className="animate-spin text-primary" />
        </div>
    );
  }

  if (!memory) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Memory not found</h2>
              <Link to="/memories" className="text-primary hover:underline">Back to list</Link>
          </div>
      )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/memories" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} /> Back
        </Link>

        <article className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <header className="mb-10 text-center border-b border-gray-100 pb-8">
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {memory.title}
                </h1>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(memory.created_at).toLocaleDateString()}
                    </span>
                    {memory.author && (
                        <span className="flex items-center gap-1">
                            <User size={14} />
                            {memory.author}
                        </span>
                    )}
                </div>
            </header>

            <div className="prose prose-lg prose-blue max-w-none font-serif text-gray-700">
                <Markdown>{memory.content}</Markdown>
            </div>
        </article>
      </div>
    </div>
  );
};

export default MemoryDetail;