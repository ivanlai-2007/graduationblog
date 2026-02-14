import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../services/supabaseClient';
import { ShoppingBag, ArrowUp, X, Gift, Tag, CheckCircle, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export interface SouvenirItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string; // 配合資料庫蛇底式命名
  in_stock: boolean;
}

export interface CartItem extends SouvenirItem {
  quantity: number;
}

const Souvenirs: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<SouvenirItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Cart & Modal State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Checkout Form State
  const [orderName, setOrderName] = useState('');
  const [orderContact, setOrderContact] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Back to Top State
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchSouvenirs();

    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSouvenirs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('souvenirs').select('*').order('created_at', { ascending: false });
    if (data) setItems(data as SouvenirItem[]);
    if (error) console.error('Error fetching souvenirs:', error);
    setIsLoading(false);
  };

  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category));
    return ['All', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter(item => item.category === activeCategory);
  }, [items, activeCategory]);

  // --- 購物車邏輯 ---
  const addToCart = (item: SouvenirItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    // 可選：加入購物車的小提示
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.id === id) {
        const newQ = c.quantity + delta;
        return newQ > 0 ? { ...c, quantity: newQ } : c;
      }
      return c;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
        alert('請先完成安全驗證');
        return;
    }
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
        // 呼叫 Edge Function 處理訂單與驗證
        const { data, error } = await supabase.functions.invoke('submit-order', {
            body: {
                name: orderName,
                contact: orderContact,
                items: cart,
                total_amount: cartTotal,
                turnstileToken: turnstileToken
            }
        });

        if (error) throw error;

        alert('預購成功！我們已收到您的訂單。');
        setCart([]);
        setShowCartModal(false);
        setOrderName('');
        setOrderContact('');
        setTurnstileToken(null);
    } catch (err) {
        console.error(err);
        alert('驗證或送出失敗，請稍後再試。');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-12 relative">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Gift size={32} className="text-primary" />
             {t('title.souvenirs')}
          </h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded"></div>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto text-sm">
            {t('subtitle.souvenirs')}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-4 animate-pulse">
             <ShoppingBag size={32} className="opacity-50" />
             <p>Loading items...</p>
          </div>
        ) : (
          <>
            {/* 分類過濾器 */}
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat !== 'All' && <Tag size={14} className="opacity-70" />}
                  {cat === 'All' ? t('all.items') : cat}
                </button>
              ))}
            </div>

            {/* 商品展示網格 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-500 flex flex-col group overflow-hidden">
                  <div className="h-56 bg-gray-200 relative overflow-hidden">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                    {!item.in_stock && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                        <span className="font-serif font-bold text-2xl text-gray-800 tracking-wider">售罄 SOLD OUT</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-gray-500 text-sm mb-6 flex-grow">{item.description}</p>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <span className="text-secondary font-serif font-bold text-2xl">¥{item.price}</span>
                      </div>
                      <button 
                        onClick={() => addToCart(item)}
                        disabled={!item.in_stock}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                          item.in_stock ? 'bg-primary text-white hover:bg-blue-800 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag size={16} /> {t('add.cart')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 浮動按鈕：購物車與回到頂部 */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-3">
        {cartItemCount > 0 && (
          <button
            onClick={() => setShowCartModal(true)}
            className="bg-secondary text-white p-4 rounded-full shadow-lg hover:bg-yellow-600 transition-all duration-300 relative transform hover:scale-105"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {cartItemCount}
            </span>
          </button>
        )}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 hidden'}`}
        >
          <ArrowUp size={24} />
        </button>
      </div>

      {/* 購物車與結帳 Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col relative">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingCart size={24} className="text-primary" /> 購物車結帳
                    </h2>
                    <button onClick={() => setShowCartModal(false)} className="text-gray-400 hover:text-gray-700 hover:rotate-90 transition-all duration-300">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500 my-8">{t('empty.cart')}</p>
                    ) : (
                        <div className="space-y-4 mb-6">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                                        <div className="text-secondary font-serif font-bold text-sm">¥{item.price}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                                            <button type="button" onClick={() => updateCartQuantity(item.id, -1)} className="p-1 text-gray-500 hover:text-primary"><Minus size={14} /></button>
                                            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                                            <button type="button" onClick={() => updateCartQuantity(item.id, 1)} className="p-1 text-gray-500 hover:text-primary"><Plus size={14} /></button>
                                        </div>
                                        <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {cart.length > 0 && (
                        <form onSubmit={handleOrderSubmit} className="space-y-4 border-t border-gray-100 pt-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">您的姓名 / Name</label>
                                <input required type="text" value={orderName} onChange={e => setOrderName(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="請輸入真實姓名" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                    {t('buy.contact')}</label>
                                <input required type="text" value={orderContact} onChange={e => setOrderContact(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="以便我們通知取貨" />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-100">
                                <span className="text-sm font-bold text-primary">{t('sumup')}</span>
                                <span className="text-secondary font-serif font-bold text-2xl">¥{cartTotal}</span>
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
                                disabled={!turnstileToken || isSubmitting}
                                className={`w-full py-3 rounded-lg font-bold text-white transition-all transform ${
                                    (!turnstileToken || isSubmitting) ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-blue-800 active:scale-95 shadow-lg'
                                }`}
                            >
                                {isSubmitting ? '處理中...' : t('sending.order') }
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Souvenirs;