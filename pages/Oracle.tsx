//develpoing 2026_2_10
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { askOracle } from '../services/aiService';
import { ChatMessage } from '../types';
import { Sparkles, Send, Bot, User, RefreshCcw } from 'lucide-react';

const Oracle: React.FC = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isThinking]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const answer = await askOracle(input);
    
    setChatHistory(prev => [...prev, { role: 'assistant', content: answer }]);
    setIsThinking(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-2xl z-10 flex flex-col h-[80vh]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30 animate-pulse-slow">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="font-serif text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
            {t('oracle.title')}
          </h1>
          <p className="text-gray-400 mt-2">{t('oracle.subtitle')}</p>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 overflow-y-auto mb-4 shadow-inner custom-scrollbar flex flex-col gap-4">
          {chatHistory.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60">
              <Sparkles size={48} className="mb-2" />
              <p>The time capsule is ready...</p>
            </div>
          )}
          
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center shrink-0 border border-indigo-700">
                  <Bot size={16} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-700 text-gray-200 rounded-bl-none border border-gray-600'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center shrink-0 border border-indigo-700">
                <Bot size={16} />
              </div>
              <div className="bg-gray-700/50 border border-gray-600 text-gray-400 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 text-xs">
                <RefreshCcw size={12} className="animate-spin" />
                {t('oracle.thinking')}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('oracle.input')}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="absolute right-2 top-2 p-2 bg-primary text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-primary transition-all"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Oracle;