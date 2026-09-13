'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingPriceId, setUpdatingPriceId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', price: '', category: '', image_url: '', affiliate_link: '',
    is_best_seller: false, is_active: true
  });

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        setEmail(data.session.user.email || '');
      }
      setCheckingAuth(false);
    };
    init();
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthenticated(!!session);
      if (session?.user?.email) setEmail(session.user.email);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (isAuthenticated) fetchProducts(); }, [isAuthenticated]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(100);
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true); setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setAuthError(error.message); setAuthLoading(false); }
    else { setIsAuthenticated(true); setAuthLoading(false); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false); setEmail(''); setPassword('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const { error } = await supabase.from('products').insert([{
      name: form.name, price: parseFloat(form.price), category: form.category,
      image_url: form.image_url, affiliate_link: form.affiliate_link,
      is_best_seller: form.is_best_seller, is_active: form.is_active, slug: slug
    }]);
    if (!error) {
      setForm({ name: '', price: '', category: '', image_url: '', affiliate_link: '', is_best_seller: false, is_active: true });
      setShowAddForm(false); fetchProducts(); alert('Product Added!');
    } else alert(error.message);
  };

  const handleAutoPriceUpdate = async (product: any) => {
    setUpdatingPriceId(product.id);
    try {
      const res = await fetch('/api/【entity-daraz¦canonical_name=Daraz】-price', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: product.affiliate_link })
      });
      const data = await res.json();
      if (data.success && data.price) {
        if (confirm(`Naya price: Rs. ${data.price}\nPurana: Rs. ${product.price}\nUpdate kar dun?`)) {
          const { error } = await supabase.from('products').update({ price: data.price }).eq('id', product.id);
          if (!error) { alert('Price Updated!'); fetchProducts(); }
        }
      } else alert(data.error || 'Price nahi mila');
    } catch (err: any) { alert(err.message); }
    setUpdatingPriceId(null);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  if (checkingAuth) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Checking...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <div className="bg-white rounded-[24px] p-8 w-full max-w-[400px]">
          <h1 className="text-[22px] font-bold text-center">Al Safa Admin 🔐</h1>
          <p className="text-gray-500 text-[13px] mt-1 text-center">Supabase Email Login</p>
          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <input type="email" required placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-xl px-4 py-3.5 text-[14px]" />
            <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-xl px-4 py-3.5 text-[14px]" />
            {authError && <p className="text-red-500 text-[12px] bg-red-50 p-2 rounded-lg">{authError}</p>}
            <button type="submit" disabled={authLoading} className="w-full bg-black text-white py-3.5 rounded-xl font-semibold">{authLoading? 'Logging...' : 'Login'}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">
      <div className="bg-white border-b sticky top-0 z-20"><div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-[20px] font-bold">Al Safa Admin 🟢</h1>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 hidden md:block">{email}</span>
          <button onClick={() => setShowAddForm(true)} className="bg-[#FFD814] px-5 py-2.5 rounded-full font-semibold text-[13px]">+ Add Product</button>
          <button onClick={handleLogout} className="border px-4 py-2.5 rounded-full text-[12px]">Logout</button>
        </div></div></div>
      <div className="flex">
        <div className="w-[230px] bg-white border-r min-h-[calc(100vh-65px)] p-4 hidden lg:block">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-xl text-[14px] ${activeTab === 'dashboard'? 'bg-black text-white' : 'text-gray-600'}`}>📊 Dashboard</button>
          <div className="mt-6 p-3 bg-green-50 rounded-xl border"><p className="text-[11px] font-bold">🟢 ALL WORKING</p></div>
        </div>
        <div className="flex-1 p-4">
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full md:w-[300px] bg-white border rounded-full px-4 py-2 text-[14px] mb-4" />
          {loading? <p>Loading...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-white border rounded-xl p-3">
                  <img src={p.image_url} alt={p.name} className="w-full h-[140px] object-cover rounded-lg bg-gray-50" />
                  <p className="text-[13px] font-medium mt-2">{p.name}</p>
                  <p className="text-[14px] font-bold">Rs. {p.price}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleAutoPriceUpdate(p)} disabled={updatingPriceId === p.id} className="flex-1 bg-black text-white text-[11px] py-2 rounded-full">{updatingPriceId === p.id? 'Checking...' : 'Auto Update Price'}</button>
                    <a href={p.affiliate_link} target="_blank" className="px-3 py-2 border rounded-full text-[11px]">【entity-Daraz¦canonical_name=Daraz】</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] p-6">
            <div className="flex justify-between mb-4"><h3 className="font-bold text-[18px]">Add New Product</h3><button onClick={() => setShowAddForm(false)} className="w-8 h-8 bg-gray-100 rounded-full">X</button></div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required placeholder="Product Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value })} className="w-full border rounded-xl px-4 py-3 text-[14px]" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value })} className="w-full border rounded-xl px-4 py-3 text-[14px]" />
                <input required placeholder="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value })} className="w-full border rounded-xl px-4 py-3 text-[14px]" />
              </div>
              <input required placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value })} className="w-full border rounded-xl px-4 py-3 text-[14px]" />
              <input required placeholder="Affiliate Link" value={form.affiliate_link} onChange={(e) => setForm({...form, affiliate_link: e.target.value })} className="w-full border rounded-xl px-4 py-3 text-[14px]" />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={form.is_best_seller} onChange={(e) => setForm({...form, is_best_seller: e.target.checked })} /> Best Seller</label>
                <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked })} /> Active</label>
              </div>
              <button type="submit" className="w-full bg-black text-white py-3.5 rounded-xl font-semibold">Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
