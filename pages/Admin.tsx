import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../services/supabaseClient';
import { ContactInfo, Memory } from '../types';
import { Trash2, Plus, ShieldCheck, LogOut, Loader2 } from 'lucide-react';

const Admin: React.FC = () => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'contacts' | 'memories'>('contacts');
  
  // Data State
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [memTitle, setMemTitle] = useState('');
  const [memContent, setMemContent] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2024') {
        setIsAuthenticated(true);
        fetchData();
    } else {
        alert('Incorrect Password');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const contactsReq = supabase.from('contacts').select('*');
    const memoriesReq = supabase.from('memories').select('*').order('created_at', {ascending: false});
    
    const [cData, mData] = await Promise.all([contactsReq, memoriesReq]);
    
    if (cData.data) setContacts(cData.data);
    if (mData.data) setMemories(mData.data);
    setLoading(false);
  };

  const handleDeleteContact = async (id: number) => {
      if(!confirm('Delete this contact?')) return;
      await supabase.from('contacts').delete().eq('id', id);
      setContacts(contacts.filter(c => c.id !== id));
  };

  const handleDeleteMemory = async (id: number) => {
      if(!confirm('Delete this memory article?')) return;
      await supabase.from('memories').delete().eq('id', id);
      setMemories(memories.filter(m => m.id !== id));
  };

  const handleAddMemory = async (e: React.FormEvent) => {
      e.preventDefault();
      const { data } = await supabase.from('memories').insert([{
          title: memTitle,
          content: memContent,
          author: 'Admin'
      }]).select();

      if (data) {
          setMemories([data[0], ...memories]);
          setMemTitle('');
          setMemContent('');
      }
  };

  if (!isAuthenticated) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
                  <div className="flex justify-center mb-6 text-primary">
                      <ShieldCheck size={48} />
                  </div>
                  <h1 className="text-2xl font-bold text-center mb-6">{t('admin.title')}</h1>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={t('admin.pass')}
                    className="w-full border p-3 rounded-lg mb-4"
                  />
                  <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors">
                      {t('admin.login')}
                  </button>
              </form>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <ShieldCheck /> {t('admin.title')}
                </div>
                <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 hover:text-red-500">
                    <LogOut size={20} />
                </button>
            </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button 
                    onClick={() => setActiveTab('contacts')}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'contacts' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                >
                    {t('admin.tab.contacts')}
                </button>
                <button 
                    onClick={() => setActiveTab('memories')}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'memories' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                >
                    {t('admin.tab.memories')}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20"><Loader2 className="animate-spin mx-auto" /></div>
            ) : (
                <>
                {activeTab === 'contacts' && (
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map(c => (
                                    <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="p-3 font-medium">{c.name}</td>
                                        <td className="p-3 text-sm text-gray-500">{c.role}</td>
                                        <td className="p-3 text-sm">{c.email}</td>
                                        <td className="p-3">
                                            <button onClick={() => handleDeleteContact(c.id!)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                )}

                {activeTab === 'memories' && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* List */}
                        <div className="lg:col-span-2 space-y-4">
                            {memories.map(m => (
                                <div key={m.id} className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{m.title}</h3>
                                        <p className="text-sm text-gray-500 truncate w-64 md:w-96">{m.content}</p>
                                    </div>
                                    <button onClick={() => handleDeleteMemory(m.id)} className="text-red-500 hover:text-red-700 p-2">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Plus size={18} /> {t('admin.addMemory')}
                                </h3>
                                <form onSubmit={handleAddMemory} className="space-y-4">
                                    <input 
                                        type="text" 
                                        value={memTitle}
                                        onChange={e => setMemTitle(e.target.value)}
                                        placeholder="Title"
                                        className="w-full border p-2 rounded"
                                        required
                                    />
                                    <textarea 
                                        value={memContent}
                                        onChange={e => setMemContent(e.target.value)}
                                        placeholder="Content (Markdown supported)"
                                        rows={10}
                                        className="w-full border p-2 rounded"
                                        required
                                    />
                                    <button type="submit" className="w-full bg-primary text-white py-2 rounded font-medium hover:bg-blue-800">
                                        Publish
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                </>
            )}
        </div>
    </div>
  );
};

export default Admin;