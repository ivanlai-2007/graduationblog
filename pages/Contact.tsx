import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ContactInfo } from '../types';
import { supabase } from '../services/supabaseClient';
import { Mail, Github, Twitter, UserCircle, Plus, X } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';


const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSocial, setNewSocial] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('contacts').select('*');
    if (data) {
      setContacts(data as ContactInfo[]);
    }
    setIsLoading(false);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
        alert('請先完成安全驗證');
        return;
    }

    if (!newName || !newRole) return;

    const { data, error } = await supabase.from('contacts').insert([{
        name: newName,
        role: newRole,
        email: newEmail,
        social: newSocial
        // 需要將 token 傳給後端進行二度驗證(developing)
    }]).select();

    if (data) {
        setContacts([...contacts, data[0] as ContactInfo]);
        setShowModal(false);
        setNewName(''); setNewRole(''); setNewEmail(''); setNewSocial('');
        setTurnstileToken(null); // 提交後重置 Token
    } else {
        alert('Failed to add contact');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white min-h-screen py-12 relative">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16 relative">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contacts.map((contact) => (
                <div key={contact.id} className="flex flex-col items-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-sm mb-4 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <UserCircle size={64} strokeWidth={1} />
                    </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-1">{contact.name}</h3>
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
        )}
      </div>

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
                        <input required type="text" value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full border rounded p-2" />
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
                        disabled={!turnstileToken || isLoading} // 若未驗證或載入中則禁用
                        className={`w-full py-2 rounded font-bold transition-colors ${
                            !turnstileToken || isLoading 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-primary text-white hover:bg-blue-800'
                        }`}
                    >
                        {isLoading ? 'Saving...' : 'Save Contact'}
                    </button>
                      
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Contact;