import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ContactInfo } from '../types';
import { supabase } from '../services/supabaseClient';
import { Mail, Github, Twitter, UserCircle, Plus, X, ArrowUp, Hash } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  // Back to Top State
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSocial, setNewSocial] = useState('');

  useEffect(() => {
    fetchContacts();
    
    // Scroll listener for Back-to-Top button
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('contacts').select('*');
    if (data) {
      setContacts(data as ContactInfo[]);
    }
    setIsLoading(false);
  };

  // --- 分组核心逻辑 ---
  const groupedContacts = useMemo(() => {
    const groups: Record<string, ContactInfo[]> = {};
    
    contacts.forEach(contact => {
      let groupName = contact.role;
      
      // 正则匹配：以4位数字+“届”开头（例如：2025届社员 -> 2025届）
      // 这里的 regex ^(\d{4}届) 会捕获 "2025届"
      const match = contact.role.match(/^(\d{4}届)/);
      if (match) {
        groupName = match[1];
      }

      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(contact);
    });

    return groups;
  }, [contacts]);
  const sortedCategories = useMemo(() => {
    return Object.keys(groupedContacts).sort((a, b) => {
      return b.localeCompare(a, 'zh-CN'); 
    });
  }, [groupedContacts]);

  // --- 滚动逻辑 ---
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`cat-${category}`);
    if (element) {
      // 减去头部偏移量，避免遮挡
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本攔截
    if (!turnstileToken) {
        alert('請先完成安全驗證');
        return;
    }
    if (!newName || !newRole || isForbiddenRole) return;
    setIsLoading(true);
    try {
        //Edge Function
        const { data, error } = await supabase.functions.invoke('add-contact', {
            body: {
                name: newName,
                role: newRole,
                email: newEmail,
                social: newSocial,
                turnstileToken: turnstileToken
            }
        });

        if (error) throw error;

        // 成功後的處理
        setContacts([...contacts, data[0] as ContactInfo]);
        setShowModal(false);
        setNewName(''); setNewRole(''); setNewEmail(''); setNewSocial('');
        setTurnstileToken(null);
        alert('添加成功！');
    } catch (err) {
        console.error(err);
        alert('驗證或保存失敗，請檢查網絡或稍後再試');
    } finally {
        setIsLoading(false);
    }
};

const isForbiddenRole = newRole === '2026届社员' || newRole === '2026届社长' || newRole === '2026届' || newRole === '2026届副社长' || newRole === '2026屆';//驗證輸入合法性
const isSubmitDisabled = !turnstileToken || isLoading || isForbiddenRole;
  return (
    <div className="bg-white min-h-screen py-12 relative">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">{t('contact.title')}</h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded"></div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="absolute right-0 top-0 hidden md:flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
          >
            <Plus size={16} /> {t('contact.add')}
          </button>
        </div>

        {/* Mobile Add Button */}
        <div className="md:hidden flex justify-center mb-8">
             <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
              >
                <Plus size={16} /> {t('contact.add')}
              </button>
        </div>

        {isLoading ? (
             <div className="text-center py-10">Loading contacts...</div>
        ) : (
            <>
                {/* --- 1. 分类直达按钮区 --- */}
                {sortedCategories.length > 0 && (
                    <div className="mb-12 flex flex-wrap justify-center gap-3">
                        {sortedCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => scrollToCategory(cat)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-primary hover:text-primary hover:shadow-sm transition-all"
                            >
                                <Hash size={14} className="opacity-50" />
                                {cat}
                                <span className="bg-gray-100 text-gray-500 text-xs py-0.5 px-1.5 rounded-full ml-1">
                                    {groupedContacts[cat].length}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* --- 2. 按分类展示内容 --- */}
                <div className="space-y-16">
                    {sortedCategories.map((category) => (
                        <div key={category} id={`cat-${category}`} className="scroll-mt-24">
                            {/* Category Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
                                <div className="h-px bg-gray-200 flex-grow"></div>
                            </div>

                            {/* Contacts Grid for this Category */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {groupedContacts[category].map((contact) => (
                                    <div key={contact.id} className="flex flex-col items-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                                        <div className="w-24 h-24 bg-white rounded-full p-1 shadow-sm mb-4 group-hover:scale-105 transition-transform">
                                            <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                                <UserCircle size={64} strokeWidth={1} />
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-xl text-gray-900 mb-1">{contact.name}</h3>
                                        {/* 显示原始 Role，或者你也可以在这里也只显示简化后的分类 */}
                                        <span className="text-primary text-sm font-medium uppercase tracking-wide mb-4">
                                            {contact.role}
                                        </span>
                                        
                                        <div className="space-y-2 w-full">
                                            {contact.social && (
                                            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm bg-white py-2 rounded border border-gray-200">
                                                <Twitter size={14} /> {contact.social}
                                            </div>
                                            )}
                                            {contact.email && (
                                            <a href={`mailto:${contact.email}`} className="flex items-center justify-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm bg-white py-2 rounded border border-gray-200">
                                                <Mail size={14} /> {contact.email}
                                            </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
      </div>

      {/* --- 3. 回到顶部按钮 --- */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform ${
            showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={24} />
      </button>

      {/* Modal Section (Unchanged logic) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fade-in-up">
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-6">{t('contact.add')}</h2>
                <form onSubmit={handleAddContact} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('guestbook.input.name')}</label>
                        <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('contact.role')}</label>
                        <input required type="text" value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="e.g. 2025届社员" className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('contact.social')}</label>
                        <input type="text" value={newSocial} onChange={e => setNewSocial(e.target.value)} className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('contact.email')}</label>
                        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full border rounded p-2" />
                    </div>

                    <div className="my-4 flex justify-center">
                    <Turnstile 
                        siteKey="0x4AAAAAACaXdAvIDhYzaJd3"
                        onSuccess={(token) => setTurnstileToken(token)}
                        onExpire={() => setTurnstileToken(null)}
                        onError={() => setTurnstileToken(null)}
                    />
                    </div>
                    <button 
                        type="submit" 
                        // 1. 使用 disabled 屬性從根本禁用點擊
                        disabled={isSubmitDisabled} 
                        className={`w-full py-2 rounded font-bold transition-colors ${
                            isSubmitDisabled
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500' // 禁用時的樣式
                            : 'bg-primary text-white hover:bg-blue-800'     // 啟用時的樣式
                        }`}
                    >
                        {isLoading ? 'Saving...' : 
                        isForbiddenRole ? '暫不支持導入 26 屆成員，請稍後再試' : 
                        'Save Contact'
                        }
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Contact;