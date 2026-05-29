import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../services/supabaseClient';
import { ShoppingBag, ArrowUp, X, Gift, Tag, CheckCircle, ShoppingCart, Plus, Minus, Trash2, Search, Package, Clock, CheckCircle2, XCircle, Copy } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export interface SouvenirItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  in_stock: boolean;
}

export interface CartItem extends SouvenirItem {
  quantity: number;
}

interface OrderResult {
  id: string;
  order_number: string;
  customer_name: string;
  contact_info: string;
  items: CartItem[];
  total_amount: number;
  status: string;
  created_at: string;
}

type OrderStatus = 'pending' | 'completed' | 'cancelled';

const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  pending:    { label: '待處理',   icon: <Clock size={18} />,       color: 'text-amber-600',  bgColor: 'bg-amber-50 border-amber-200' },
  completed:  { label: '已完成',   icon: <CheckCircle2 size={18} />,color: 'text-green-600',  bgColor: 'bg-green-50 border-green-200' },
  cancelled:  { label: '已取消',   icon: <XCircle size={18} />,     color: 'text-red-600',    bgColor: 'bg-red-50 border-red-200' },
};

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
  const [orderAddress, setOrderAddress] = useState('');
  const [orderContact, setOrderContact] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Order Success State
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Order Lookup State
  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState<OrderResult | null>(null);
  const [isLooking, setIsLooking] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [showLookupSection, setShowLookupSection] = useState(false);

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

  // --- 複製訂單編號 ---
  const copyOrderId = () => {
    if (orderResult?.order_number) {
      navigator.clipboard.writeText(orderResult.order_number);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
  };

  // --- 提交訂單 ---
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
        alert('請先完成安全驗證');
        return;
    }
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
        const { data, error } = await supabase.functions.invoke('submit-order', {
            body: {
                name: orderName,
                contact: orderContact,
                address: orderAddress,
                items: cart,
                total_amount: cartTotal,
                turnstileToken: turnstileToken
            }
        });

        console.log('[submit-order] response data:', JSON.stringify(data, null, 2));
        console.log('[submit-order] response error:', error);

        if (error) {
            // 嘗試提取詳細錯誤信息
            const errDetail = (error as any)?.message
              || (error as any)?.context?.msg
              || JSON.stringify(error);
            throw new Error(errDetail);
        }

        // 展示成功界面
        const result: OrderResult = data?.order
          ? data.order
          : {
              id: data?.id || `tmp-${Date.now()}`,
              order_number: data?.order_number || '生成中...',
              customer_name: data?.customer_name || data?.name || orderName,
              contact_info: data?.contact_info || data?.contact || orderContact,
              items: data?.items || [...cart],
              total_amount: data?.total_amount || cartTotal,
              status: data?.status || 'pending',
              created_at: data?.created_at || new Date().toISOString(),
            };

        setOrderResult(result);
        setShowCartModal(false);
        setShowSuccessModal(true);

        // 清空表單
        setCart([]);
        setOrderName('');
        setOrderContact('');
        setOrderAddress('');
        setTurnstileToken(null);
    } catch (err: any) {
        console.error('[submit-order] full error:', err);
        alert(`送出失敗：${err?.message || '未知錯誤，請查看 Console'}\n\n請截圖 Console 中的 [submit-order] 日誌回報。`);
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- 訂單查詢 ---
  const handleOrderLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;

    setIsLooking(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', lookupId.trim().toUpperCase())
        .single();

      if (error || !data) {
        setLookupError('找不到該訂單，請確認訂單編號是否正確。');
      } else {
        setLookupResult(data as OrderResult);
      }
    } catch (err) {
      console.error(err);
      setLookupError('查詢失敗，請稍後再試。');
    } finally {
      setIsLooking(false);
    }
  };

  // --- 格式化日期 ---
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
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

          {/* 訂單查詢入口 */}
          <button
            onClick={() => setShowLookupSection(!showLookupSection)}
            className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:text-blue-800 transition-colors font-medium"
          >
            <Search size={16} />
            {t('orderlookup')}
          </button>
        </div>

        {/* 訂單查詢區域 */}
        {showLookupSection && (
          <div className="mb-12 animate-in slide-in-from-top-4 duration-300">
            <div className="max-w-lg mx-auto bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} className="text-primary" />
                {t('orderlookup')}
              </h3>
              <form onSubmit={handleOrderLookup} className="flex gap-3">
                <input
                  type="text"
                  value={lookupId}
                  onChange={e => { setLookupId(e.target.value); setLookupError(''); }}
                  placeholder="請輸入訂單編號，如 ORD-000001"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={isLooking || !lookupId.trim()}
                  className={`px-6 py-3 rounded-xl font-bold text-sm text-white transition-all ${
                    isLooking || !lookupId.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary hover:bg-blue-800 active:scale-95 shadow-md'
                  }`}
                >
                  {isLooking ? '查詢中...' : '查詢'}
                </button>
              </form>

              {/* 查詢錯誤 */}
              {lookupError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
                  <XCircle size={16} />
                  {lookupError}
                </div>
              )}

              {/* 查詢結果 */}
              {lookupResult && (
                <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                  {/* 狀態標頭 */}
                  <div className={`px-5 py-4 flex items-center justify-between ${ORDER_STATUS_MAP[lookupResult.status as OrderStatus]?.bgColor || 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      {ORDER_STATUS_MAP[lookupResult.status as OrderStatus]?.icon || <Clock size={18} />}
                      <span className={`font-bold text-sm ${ORDER_STATUS_MAP[lookupResult.status as OrderStatus]?.color || 'text-gray-600'}`}>
                        {ORDER_STATUS_MAP[lookupResult.status as OrderStatus]?.label || lookupResult.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(lookupResult.created_at)}</span>
                  </div>

                  {/* 訂單詳情 */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t('orderid')}</span>
                      <span className="font-mono font-bold text-gray-900">{lookupResult.order_number}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t('ordername')}</span>
                      <span className="text-gray-800">{lookupResult.customer_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t('ordercontact')}</span>
                      <span className="text-gray-800">{lookupResult.contact_info}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t('sumup')}</span>
                      <span className="font-serif font-bold text-secondary text-lg">¥{lookupResult.total_amount}</span>
                    </div>

                    {/* 商品列表 */}
                    {lookupResult.items && lookupResult.items.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{t('orderitem')}</p>
                        <div className="space-y-2">
                          {lookupResult.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-700">{item.name} × {item.quantity}</span>
                              <span className="text-gray-500">¥{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
                        <ShoppingCart size={24} className="text-primary" /> {t('your.cart')}
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

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">您的地址 / Address</label>
                                <input required type="text" value={orderAddress} onChange={e => setOrderAddress(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 h-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="請輸入完整郵寄地址" />
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

      {/* ==================== 訂單成功 Modal ==================== */}
      {showSuccessModal && orderResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
            {/* 頂部裝飾 */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={36} className="text-white" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mb-1">預購成功！</h2>
              <p className="text-green-100 text-sm">我們已收到您的訂單</p>
            </div>

            {/* 訂單編號 */}
            <div className="px-6 -mt-4">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">訂單編號</p>
                  <p className="font-mono text-xl font-bold text-gray-900">{orderResult.order_number}</p>
                </div>
                <button
                  onClick={copyOrderId}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-primary bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  {copiedOrderId ? <><CheckCircle size={14} /> copied</> : <><Copy size={14} /> copy</>}
                </button>
              </div>
            </div>

            {/* 訂單明細 */}
            <div className="p-6 space-y-4">
              {/* 收件資訊 */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">收件資訊</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">{t('ordername')}</span>
                  <span className="text-gray-800 font-medium">{orderResult.customer_name}</span>
                  <span className="text-gray-500">{t('ordercontact')}</span>
                  <span className="text-gray-800 font-medium">{orderResult.contact_info}</span>
                </div>
              </div>

              {/* 商品列表 */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{t('orderitem')}</p>
                <div className="space-y-2">
                  {orderResult.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg p-3">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">{item.name}</span>
                        <span className="text-gray-400 ml-2">× {item.quantity}</span>
                      </div>
                      <span className="text-gray-600 font-mono">¥{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 總計 */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-700">{t('sumup')}</span>
                <span className="text-secondary font-serif font-bold text-2xl">¥{orderResult.total_amount}</span>
              </div>

              {/* 提示 */}
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                {t('ordersignL1')}<br />
                {t('ordersignL2')}
              </p>

              {/* 關閉按鈕 */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-800 transition-all active:scale-95 shadow-lg"
              >
                t('complete')
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Souvenirs;
