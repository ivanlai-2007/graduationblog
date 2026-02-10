import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GuestbookMessage } from '../types';
import { supabase } from '../services/supabaseClient';
import { Send, Trash2, Loader2 } from 'lucide-react';

const COLORS = [
  'bg-red-100 text-red-600',
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600',
];

const Guestbook: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load messages from Supabase
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setMessages(data as GuestbookMessage[]);
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            name: name,
            content: content,
          },
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setMessages([data[0], ...messages]);
        setContent('');
      }
    } catch (err: any) {
      console.error('Error adding message:', err);
      alert('Failed to post message. Please try again.');
    }
  };

  const getAvatarColor = (name: string) => {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return COLORS[Math.abs(hash) % COLORS.length];
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-4xl font-bold text-center mb-10 text-gray-900">{t('guestbook.title')}</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('guestbook.input.name')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('guestbook.input.msg')}</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Send size={16} /> {t('guestbook.submit')}
                </button>
              </form>
            </div>
          </div>

          {/* Messages List */}
          <div className="md:col-span-2 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12 text-primary">
                <Loader2 size={32} className="animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl">
                <p>{error}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="italic">No messages yet. Be the first to write something!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${getAvatarColor(msg.name)}`}>
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-900">{msg.name}</h3>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap font-serif leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guestbook;