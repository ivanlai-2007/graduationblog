import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../services/supabaseClient';
import { ContactInfo, Memory } from '../types';
// import { fetchSettingValue } from '../services/settingsService'; 
import { Turnstile } from '@marsidev/react-turnstile'; // 1. 引入 Turnstile
import { 
  Trash2, Plus, ShieldCheck, LogOut, Loader2, Package, ShoppingCart, 
  CheckCircle, AlertCircle, X 
} from 'lucide-react';

// --- 類型定義 ---
type TabType = 'contacts' | 'memories' | 'souvenirs' | 'orders';
type ToastType = 'success' | 'error';

interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

const Admin: React.FC = () => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('contacts');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  // Data State
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [souvenirs, setSouvenirs] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | number | null>(null); // 用於追蹤特定按鈕的讀取狀態
  
  // Toast Notification State
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Forms State
  const [memTitle, setMemTitle] = useState('');
  const [memContent, setMemContent] = useState('');
  
  const [newSouvenir, setNewSouvenir] = useState({
      name: '', category: '', price: 0, description: '', image_url: '', in_stock: true
  });

  // --- Helper: 顯示通知 ---
  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // --- Auth ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!turnstileToken) {
        showToast('請先完成機器人驗證', 'error');
        return;
    }

    setIsLoginLoading(true);
    try {
        // 呼叫 admin-action 進行登入驗證
        const { data, error } = await supabase.functions.invoke('admin-action', {
            body: {
                action: 'login',
                password: password,
                turnstileToken: turnstileToken
            }
        });

        if (error) throw error; // Edge Function 回傳非 2xx 或 throw error

        setIsAuthenticated(true);
        showToast('登入成功', 'success');
        fetchData();
        setTurnstileToken(null); // 登入後清除 token
        
    } catch (err: any) {
        console.error("Login error", err);
        // 如果後端回傳錯誤訊息，顯示出來 (例如：密碼錯誤)
        // 注意：這裡可能需要解析 err body，如果 supabase client 自動解析了
        // 通常是 err.message
        showToast('登入失敗：' + (err.message || '密碼錯誤或驗證失效'), 'error');
        setTurnstileToken(null); // 失敗後重置 Turnstile，強迫重新驗證
    } finally {
        setIsLoginLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
        const [cData, mData, sData, oData] = await Promise.all([
            supabase.from('contacts').select('*'),
            supabase.from('memories').select('*').order('created_at', {ascending: false}),
            supabase.from('souvenirs').select('*').order('created_at', {ascending: false}),
            supabase.from('orders').select('*').order('created_at', {ascending: false})
        ]);
        
        if (cData.data) setContacts(cData.data as ContactInfo[]);
        if (mData.data) setMemories(mData.data as Memory[]);
        if (sData.data) setSouvenirs(sData.data);
        if (oData.data) setOrders(oData.data);
    } catch (error) {
        showToast('數據加載失敗', 'error');
    }
    setLoading(false);
  };

  // --- 通用刪除處理 ---
  const handleDelete = async (table: string, id: any, stateUpdater: Function, currentState: any[]) => {
    if(!confirm(`確定要從 ${table} 刪除此項目嗎？`)) return;
    
    setProcessingId(id);
    try {
      // 修改處：呼叫 admin-action
      // Mapping table names to action names
      const actionMap: Record<string, string> = {
          'memories': 'delete-memory',
          'souvenirs': 'delete-souvenir',
          'orders': 'delete-order',
          'contacts': 'delete-contact'
      };

      const { error } = await supabase.functions.invoke('admin-action', {
          body: {
              action: actionMap[table],
              payload: { id },
              password: password // 將使用者輸入的密碼傳給後端驗證
          }
      });

      if (error) throw error;
      
      stateUpdater(currentState.filter(item => item.id !== id));
      showToast('刪除成功');
    } catch (error: any) {
      console.error(error);
      showToast('刪除失敗: ' + error.message, 'error');
    } finally {
      setProcessingId(null);
    }
};

  // --- Handlers: Memories ---
  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingId('add-memory');
    try {
      // 修改處：呼叫 admin-action
      const { data, error } = await supabase.functions.invoke('admin-action', {
          body: {
              action: 'add-memory',
              payload: { 
                  title: memTitle, 
                  content: memContent, 
                  author: 'Admin' 
              },
              password: password
          }
      });

      if (error) throw error;
      const newItem = Array.isArray(data) ? data[0] : data;

      if (newItem) {
          setMemories([newItem, ...memories]);
          setMemTitle('');
          setMemContent('');
          showToast('回憶錄發布成功');
      }
    } catch (error: any) {
        showToast('發布失敗: ' + error.message, 'error');
    } finally {
        setProcessingId(null);
    }
};

  // --- Handlers: Souvenirs ---
  const handleAddSouvenir = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingId('add-souvenir');
    try {
      // 修改處：呼叫 admin-action
      const { data, error } = await supabase.functions.invoke('admin-action', {
          body: {
              action: 'add-souvenir',
              payload: newSouvenir,
              password: password
          }
      });

      if (error) throw error;
      const newItem = Array.isArray(data) ? data[0] : data;

      if (newItem) { 
          setSouvenirs([newItem, ...souvenirs]); 
          setNewSouvenir({name: '', category: '', price: 0, description: '', image_url: '', in_stock: true});
          showToast('商品上架成功');
      }
    } catch (error: any) {
        showToast('商品上架失敗: ' + error.message, 'error');
    } finally {
        setProcessingId(null);
    }
};

    const toggleStock = async (id: string, currentStatus: boolean) => {
    setProcessingId(id);
    try {
      const { data, error } = await supabase.functions.invoke('admin-action', {
          body: {
              action: 'update-stock',
              payload: { id, in_stock: !currentStatus },
              password: password
          }
      });

      if (error) throw error;
      const updatedItem = Array.isArray(data) ? data[0] : data;

      if (updatedItem) {
          setSouvenirs(souvenirs.map(s => s.id === id ? updatedItem : s));
          showToast(currentStatus ? '已標記為缺貨' : '已標記為有貨');
      }
    } catch (error) {
        showToast('更新庫存狀態失敗', 'error');
    } finally {
        setProcessingId(null);
    }
};

  // --- Handlers: Orders ---
  const updateOrderStatus = async (id: string, newStatus: string) => {
      setProcessingId(id); // 這裡雖然是 select，但我們可以用 loading id 來鎖住操作
      try {
        const { data, error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id).select();
        if (error) throw error;
        if (data) {
            setOrders(orders.map(o => o.id === id ? data[0] : o));
            showToast('訂單狀態已更新');
        }
      } catch (error) {
          showToast('更新失敗', 'error');
      } finally {
          setProcessingId(null);
      }
  };

  // --- Render Toast Component ---
  const Toast = () => (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none' } ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
        {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <span className="font-medium text-sm">{toast.message}</span>
        <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-2 opacity-50 hover:opacity-100"><X size={16} /></button>
    </div>
  );

  if (!isAuthenticated) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
              <Toast />
              <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
                  <div className="flex justify-center mb-6 text-primary"><ShieldCheck size={48} /></div>
                  <h1 className="text-2xl font-bold text-center mb-6">{t('admin.title')}</h1>
                  
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder={t('admin.pass')} 
                    className="w-full border p-3 rounded-lg mb-4" 
                    disabled={isLoginLoading} 
                  />

                  {/* 4. 加入 Turnstile 元件 */}
                  <div className="flex justify-center mb-4">
                      <Turnstile 
                          siteKey="0x4AAAAAACaXdAvIDhYzaJd3" // 你的 Site Key
                          onSuccess={(token) => setTurnstileToken(token)}
                          onExpire={() => setTurnstileToken(null)}
                          onError={() => setTurnstileToken(null)}
                          options={{ size: 'normal' }}
                      />
                  </div>

                  <button 
                    type="submit" 
                    // 5. 如果沒有 Token 或正在讀取，就鎖住按鈕
                    disabled={isLoginLoading || !turnstileToken}
                    className={`w-full py-3 rounded-lg font-bold transition-colors flex justify-center items-center gap-2 ${
                        isLoginLoading || !turnstileToken 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary text-white hover:bg-blue-800'
                    }`}
                  >
                      {isLoginLoading ? <Loader2 className="animate-spin" /> : t('admin.login')}
                  </button>
              </form>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 relative">
        <Toast />
        
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-xl text-primary"><ShieldCheck /> Admin Dashboard</div>
                <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 hover:text-red-500"><LogOut size={20} /></button>
            </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-8 bg-white p-2 rounded-xl shadow-sm inline-flex">
                {[
                    { id: 'contacts', label: '通訊錄' },
                    { id: 'memories', label: '回憶錄' },
                    { id: 'souvenirs', label: '周邊商品', icon: Package },
                    { id: 'orders', label: '預購訂單', icon: ShoppingCart }
                ].map(tab => (
                    <button 
                        key={tab.id} onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        {tab.icon && <tab.icon size={16} />} {tab.label}
                    </button>
                ))}
            </div>

            {loading ? ( <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-primary" size={40} /></div> ) : (
                <>
                {/* 1. CONTACTS TAB */}
                {activeTab === 'contacts' && (
                    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
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
                                            <button 
                                                onClick={() => handleDelete('contacts', c.id, setContacts, contacts)} 
                                                disabled={processingId === c.id}
                                                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                            >
                                                {processingId === c.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 2. MEMORIES TAB */}
                {activeTab === 'memories' && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {memories.map(m => (
                                <div key={m.id} className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{m.title}</h3>
                                        <p className="text-sm text-gray-500 truncate w-64 md:w-96">{m.content}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete('memories', m.id, setMemories, memories)} 
                                        disabled={processingId === m.id}
                                        className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
                                    >
                                        {processingId === m.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus size={18} /> {t('admin.addMemory')}</h3>
                                <form onSubmit={handleAddMemory} className="space-y-4">
                                    <input type="text" value={memTitle} onChange={e => setMemTitle(e.target.value)} placeholder="Title" className="w-full border p-2 rounded" required />
                                    <textarea value={memContent} onChange={e => setMemContent(e.target.value)} placeholder="Content (Markdown supported)" rows={10} className="w-full border p-2 rounded" required />
                                    <button 
                                        type="submit" 
                                        disabled={processingId === 'add-memory'}
                                        className="w-full bg-primary text-white py-2 rounded font-medium hover:bg-blue-800 disabled:bg-gray-400 flex justify-center"
                                    >
                                        {processingId === 'add-memory' ? <Loader2 className="animate-spin" /> : 'Publish'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. SOUVENIRS TAB */}
                {activeTab === 'souvenirs' && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {souvenirs.map(s => (
                                <div key={s.id} className="bg-white p-5 rounded-xl shadow-sm flex gap-4">
                                    <img src={s.image_url} alt={s.name} className="w-24 h-24 object-cover rounded-lg border bg-gray-100" />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-lg">{s.name} <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2">{s.category}</span></h3>
                                            <div className="text-secondary font-bold">¥{s.price}</div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                                        <div className="mt-3 flex gap-3 items-center">
                                            <button 
                                                onClick={() => toggleStock(s.id, s.in_stock)} 
                                                disabled={processingId === s.id}
                                                className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 transition-colors ${
                                                    s.in_stock ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                            >
                                                {processingId === s.id && <Loader2 size={10} className="animate-spin" />}
                                                {s.in_stock ? '🟢 上架中' : '🔴 已缺貨'}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete('souvenirs', s.id, setSouvenirs, souvenirs)} 
                                                disabled={processingId === s.id}
                                                className="text-red-500 text-xs hover:underline flex items-center gap-1 disabled:opacity-50"
                                            >
                                                <Trash2 size={12}/> 刪除
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm sticky top-24 h-fit">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus size={18} /> 新增商品</h3>
                            <form onSubmit={handleAddSouvenir} className="space-y-4">
                                <input type="text" placeholder="商品名稱" required value={newSouvenir.name} onChange={e => setNewSouvenir({...newSouvenir, name: e.target.value})} className="w-full border p-2 rounded" />
                                <div className="flex gap-2">
                                    <input type="text" placeholder="分類 (如: 服飾)" required value={newSouvenir.category} onChange={e => setNewSouvenir({...newSouvenir, category: e.target.value})} className="w-1/2 border p-2 rounded" />
                                    <input type="number" placeholder="價格" required value={newSouvenir.price} onChange={e => setNewSouvenir({...newSouvenir, price: Number(e.target.value)})} className="w-1/2 border p-2 rounded" />
                                </div>
                                <input type="url" placeholder="圖片網址 (URL)" required value={newSouvenir.image_url} onChange={e => setNewSouvenir({...newSouvenir, image_url: e.target.value})} className="w-full border p-2 rounded" />
                                <textarea placeholder="商品描述" rows={3} required value={newSouvenir.description} onChange={e => setNewSouvenir({...newSouvenir, description: e.target.value})} className="w-full border p-2 rounded" />
                                <label className="flex items-center gap-2 text-sm font-bold">
                                    <input type="checkbox" checked={newSouvenir.in_stock} onChange={e => setNewSouvenir({...newSouvenir, in_stock: e.target.checked})} />
                                    直接上架 (有庫存)
                                </label>
                                <button 
                                    type="submit" 
                                    disabled={processingId === 'add-souvenir'}
                                    className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-blue-800 disabled:bg-gray-400 flex justify-center"
                                >
                                    {processingId === 'add-souvenir' ? <Loader2 className="animate-spin" /> : '儲存商品'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* 4. ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3">訂單編號/時間</th>
                                    <th className="p-3">預購人資訊</th>
                                    <th className="p-3">購買內容</th>
                                    <th className="p-3">總計</th>
                                    <th className="p-3">狀態</th>
                                    <th className="p-3">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-xs text-gray-500">
                                            {o.id.substring(0,8)}...<br/>
                                            {new Date(o.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold">{o.customer_name}</div>
                                            <div className="text-xs text-gray-500">{o.customer_contact}</div>
                                        </td>
                                        <td className="p-3 text-sm">
                                            <ul className="list-disc list-inside">
                                                {o.items?.map((item: any, idx: number) => (
                                                    <li key={idx}>{item.name} x {item.quantity}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="p-3 font-bold text-secondary">¥{o.total_amount}</td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                {processingId === o.id && <Loader2 size={14} className="animate-spin text-gray-500" />}
                                                <select 
                                                    value={o.status || 'pending'} 
                                                    disabled={processingId === o.id}
                                                    onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                    className={`text-xs font-bold p-1 rounded border outline-none cursor-pointer disabled:opacity-50 ${o.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                                >
                                                    <option value="pending">待處理</option>
                                                    <option value="completed">已完成/已取貨</option>
                                                    <option value="cancelled">已取消</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <button 
                                                onClick={() => handleDelete('orders', o.id, setOrders, orders)} 
                                                disabled={processingId === o.id}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded disabled:opacity-50"
                                            >
                                                {processingId === o.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && <div className="text-center py-10 text-gray-400">目前沒有訂單紀錄</div>}
                    </div>
                )}
                </>
            )}
        </div>
    </div>
  );
};

export default Admin;

/*
          /\   /\
         //\\_//\\
         \_     _/
          / ^ ^ \          ________________________
         (  "v"  )        /   _   _      _    _  _   \
          \     /        /   | | \ \  / / \  | \| |   \
           |   |        /    | |  \ \/ / ^ \ |  \ |    |
  / \_    /     \______/     |_|   \_/  / \_\|_|\_|   /
  /    \_/      |                                  /
 /             /                                  /
 \____________/__________________________________/
 */