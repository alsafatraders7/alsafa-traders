'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  affiliate_link: string;
  is_best_seller: boolean;
  is_active: boolean;
  slug?: string;
  created_at?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name:'', price:'', category:'', image_url:'', affiliate_link:'', is_best_seller:false, is_active:true });

  useEffect(()=>{
    const init = async()=>{
      const {data} = await supabase.auth.getSession();
      if(data.session){
        setIsAuthenticated(true);
        setEmail(data.session.user.email||'');
      }
      setCheckingAuth(false);
    };
    init();
    const {data:lis} = supabase.auth.onAuthStateChange((_e,s)=>{
      setIsAuthenticated(!!s);
      if(s?.user?.email) setEmail(s.user.email);
    });
    return ()=>lis.subscription.unsubscribe();
  },[]);

  useEffect(()=>{ if(isAuthenticated) fetchProducts(); },[isAuthenticated]);

  const fetchProducts = async()=>{
    setLoading(true);
    const {data, error} = await supabase.from('products').select('*').order('created_at',{ascending:false}).limit(100);
    if(error) console.log(error);
    if(data) setProducts(data as Product[]);
    setLoading(false);
  };

  const handleLogin = async(e:React.FormEvent)=>{
    e.preventDefault();
    setAuthLoading(true); setAuthError('');
    const {error} = await supabase.auth.signInWithPassword({email,password});
    if(error){ setAuthError(error.message); setAuthLoading(false); }
    else { setIsAuthenticated(true); setAuthLoading(false); }
  };

  const handleSave = async(e:React.FormEvent)=>{
    e.preventDefault();
    try {
      if(editingProduct){
        const {error} = await supabase.from('products').update({
          name: form.name,
          price: parseFloat(form.price),
          category: form.category,
          image_url: form.image_url,
          affiliate_link: form.affiliate_link,
          is_best_seller: form.is_best_seller,
          is_active: form.is_active
        }).eq('id',editingProduct.id);
        if(error) throw error;
      } else {
        const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')+'-'+Date.now();
        const {error} = await supabase.from('products').insert([{
          name: form.name,
          price: parseFloat(form.price),
          category: form.category,
          image_url: form.image_url,
          affiliate_link: form.affiliate_link,
          is_best_seller: form.is_best_seller,
          is_active: form.is_active,
          slug
        }]);
        if(error) throw error;
      }
      setShowAddForm(false);
      setEditingProduct(null);
      setForm({ name:'', price:'', category:'', image_url:'', affiliate_link:'', is_best_seller:false, is_active:true });
      fetchProducts();
    } catch(err:any) {
      alert(err.message);
    }
  };

  const handleEdit = (p:Product)=>{
    setEditingProduct(p);
    setForm({
      name:p.name,
      price:String(p.price),
      category:p.category,
      image_url:p.image_url,
      affiliate_link:p.affiliate_link,
      is_best_seller:!!p.is_best_seller,
      is_active:!!p.is_active
    });
    setShowAddForm(true);
  };

  const handleDelete = async(id:string)=>{
    if(!confirm('Delete this product?')) return;
    const {error} = await supabase.from('products').delete().eq('id',id);
    if(error) alert(error.message);
    else fetchProducts();
  };

  const handleAutoUpdate = async(p:Product)=>{
    setUpdatingId(p.id);
    try{
      const res = await fetch('/api/daraz-price',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({url:p.affiliate_link})
      });
      const data = await res.json();
      if(data.success && data.price){
        if(confirm(`New Price: Rs.${data.price} \nOld Price: Rs.${p.price} \nUpdate karna hai?`)){
          await supabase.from('products').update({price: data.price}).eq('id',p.id);
          fetchProducts();
        }
      } else {
        alert(data.error || 'Price nahi mila. Link check karo.');
      }
    }catch(e:any){ alert(e.message); }
    setUpdatingId(null);
  };

  const filtered = products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const categories = [...new Set(products.map(p=>p.category).filter(Boolean))];

  if(checkingAuth) return <div className="min-h-screen bg-[#0f2e26] text-white flex items-center justify-center">Checking Auth...</div>;

  if(!isAuthenticated){
    return (
      <div className="min-h-screen bg-[#0f2e26] flex items-center justify-center p-4">
        <div className="bg-white rounded-[20px] p-8 w-full max-w-[400px] shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#0f2e26] rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-[20px]">AT</div>
            <h1 className="text-[22px] font-bold">Al Safa Traders</h1>
            <p className="text-[11px] text-gray-500">Admin Panel Locked - Login Required</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold">Email</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@email.com" className="w-full border rounded-xl px-4 py-3 text-[14px] outline-none mt-1 focus:border-[#0f2e26]" />
            </div>
            <div>
              <label className="text-[11px] font-bold">Password</label>
              <div className="relative">
                <input type={showPassword? "text" : "password"} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl px-4 py-3 text-[14px] outline-none mt-1 focus:border-[#0f2e26]" />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-[10px] text-gray-400">{showPassword? 'Visible' : 'Hidden'}</p>
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-[11px] text-[#0f2e26] font-bold">{showPassword? 'Hide' : 'Show'}</button>
              </div>
            </div>
            {authError && <p className="text-red-600 text-[12px] bg-red-50 p-2 rounded border border-red-100">{authError}</p>}
            <button type="submit" disabled={authLoading} className="w-full bg-[#0f2e26] text-white py-3.5 rounded-xl font-bold disabled:opacity-60">{authLoading? 'Unlocking...' : 'Unlock Admin Panel'}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9f6] flex text-[13px]">
      <div className="w-[260px] bg-[#0f2e26] text-white hidden lg:flex flex-col fixed h-screen">
        <div className="p-5 flex items-center gap-3"><div className="w-10 h-10 bg-[#d4a15a] rounded-lg flex items-center justify-center font-bold">AT</div><div><p className="font-bold text-[#f0d9a0]">Al Safa Traders</p><p className="text-[10px] text-gray-400">Quality Products</p></div></div>
        <div className="px-3 space-y-0.5 flex-1 overflow-y-auto">
          <div className="bg-[#c49a4b] text-black px-4 py-2.5 rounded-lg font-semibold">Dashboard</div>
          <div className="px-4 py-2.5 text-gray-300">Products - {products.length}</div>
          <div className="px-4 py-2.5 text-gray-300">Categories - {categories.length}</div>
          <div className="px-4 py-2.5 text-gray-300">Affiliate - Connected</div>
          <div className="px-4 py-2.5 text-gray-300">Public Website - Live</div>
          <button onClick={async()=>{await supabase.auth.signOut(); setIsAuthenticated(false);}} className="w-full px-4 py-2.5 text-left text-gray-300 mt-4 border-t border-white/10 pt-4 hover:text-white">Lock Panel</button>
        </div>
        <div className="p-4 border-t border-white/10 text-[10px] text-gray-400 truncate">{email}<br/>Responsive</div>
      </div>
      {mobileMenu && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={()=>setMobileMenu(false)}></div><div className="absolute left-0 top-0 w-[270px] h-full bg-[#0f2e26] text-white p-4"><p className="font-bold mb-4">Al Safa Traders</p><button onClick={async()=>{await supabase.auth.signOut(); setIsAuthenticated(false);}} className="w-full px-4 py-2.5 bg-red-500/20 rounded-lg">Lock</button></div></div>}
      <div className="flex-1 lg:ml-[260px]">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1"><button onClick={()=>setMobileMenu(true)} className="lg:hidden text-[22px]">☰</button><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search products..." className="bg-[#f8f9f6] border rounded-lg px-4 py-2 w-full max-w-[350px] text-[13px] outline-none" /></div>
          <div className="flex items-center gap-2"><button onClick={()=>{setEditingProduct(null); setForm({ name:'', price:'', category:'', image_url:'', affiliate_link:'', is_best_seller:false, is_active:true }); setShowAddForm(true);}} className="bg-[#c49a4b] text-black px-4 py-2 rounded-lg text-[12px] font-bold">+ Add Product</button><button onClick={async()=>{await supabase.auth.signOut(); setIsAuthenticated(false);}} className="border px-3 py-2 rounded-lg text-[11px]">Lock</button></div>
        </div>
        <div className="p-3 lg:p-6">
          {loading? <div className="text-center py-20">Loading products...</div> : <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2 bg-gradient-to-r from-[#fdf6e3] to-[#f5e6c8] rounded-xl p-5 flex justify-between items-center border">
              <div><h1 className="text-[22px] font-bold">Welcome Back, Admin!</h1><p className="text-[12px] text-gray-600 mt-1">Manage your products and keep website updated.</p><div className="flex gap-2 mt-4"><a href="https://alsafatraders.pk" target="_blank" className="bg-[#0f2e26] text-white px-4 py-2 rounded-lg text-[12px]">View Website</a><span className="bg-[#c49a4b] text-black px-4 py-2 rounded-lg text-[12px] font-bold">Dashboard</span></div><p className="text-[11px] text-green-700 mt-2">● Connected</p></div>
              <img src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=200" className="w-[140px] h-[100px] object-cover rounded-xl hidden md:block" alt="" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-xl p-4 border"><p className="font-semibold text-[13px]">Website Status</p><p className="text-[12px] mt-1">Live</p><p className="text-[11px] text-gray-500">Running smoothly.</p></div>
              <div className="bg-white rounded-xl p-4 border"><p className="font-semibold text-[13px]">Admin Account</p><p className="text-[10px] text-green-700 bg-green-50 p-1 rounded mt-1 truncate">{email} - Active</p></div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-xl p-4 border"><p className="text-[11px] text-gray-500">Total Products</p><p className="text-[22px] font-bold">{products.length}</p><p className="text-[10px] text-green-600">Published</p></div>
            <div className="bg-white rounded-xl p-4 border"><p className="text-[11px] text-gray-500">Categories</p><p className="text-[22px] font-bold">{categories.length}</p><p className="text-[10px] text-green-600">Active</p></div>
            <div className="bg-white rounded-xl p-4 border"><p className="text-[11px] text-gray-500">Total Clicks</p><p className="text-[22px] font-bold">1,248</p><p className="text-[10px] text-green-600">Affiliate</p></div>
            <div className="bg-[#fffaf0] rounded-xl p-4 border"><p className="text-[11px] text-gray-500">Affiliate Status</p><p className="text-[14px] font-bold">Connected</p><p className="text-[10px] text-green-600">Active</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="font-bold mb-3">Recent Products - {filtered.length}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {filtered.slice(0,20).map((p)=>(
                <div key={p.id} className="border rounded-xl p-2.5 hover:shadow-md transition">
                  <img src={p.image_url} className="w-full h-[100px] object-cover rounded-lg bg-gray-50" alt={p.name} />
                  <p className="text-[11px] font-medium mt-2 line-clamp-1">{p.name}</p>
                  <p className="text-[10px] text-gray-500">{p.category}</p>
                  <p className="text-[12px] font-bold">Rs. {p.price}</p>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    <button onClick={()=>handleAutoUpdate(p)} disabled={updatingId===p.id} className="bg-black text-white text-[9px] py-1.5 rounded-full">{updatingId===p.id?'...':'Auto'}</button>
                    <a href={p.affiliate_link} target="_blank" rel="noopener noreferrer" className="bg-[#f85606] text-white text-[9px] py-1.5 rounded-full text-center font-bold">Buy Now</a>
                  </div>
                  <div className="flex gap-1 mt-1"><button onClick={()=>handleEdit(p)} className="flex-1 border rounded-full text-[9px] py-1 hover:bg-gray-50">Edit</button><button onClick={()=>handleDelete(p.id)} className="flex-1 border rounded-full text-[9px] py-1 hover:bg-red-50">Del</button></div>
                </div>
              ))}
              {filtered.length===0 && <p className="col-span-full text-center py-8 text-gray-400">No products found - Add karo</p>}
            </div>
          </div>
          </>}
        </div>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h3 className="font-bold text-[16px]">{editingProduct? 'Edit' : 'Add'} Product</h3><button onClick={()=>{setShowAddForm(false); setEditingProduct(null);}} className="w-8 h-8 bg-gray-100 rounded-full">X</button></div>
            <form onSubmit={handleSave} className="space-y-3">
              <input required placeholder="Product Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] outline-none" />
              <div className="grid grid-cols-2 gap-2"><input required type="number" step="0.01" placeholder="Price Rs." value={form.price} onChange={e=>setForm({...form, price:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] outline-none" /><input required placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] outline-none" /></div>
              <input required placeholder="Image URL (https://...)" value={form.image_url} onChange={e=>setForm({...form, image_url:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] outline-none" />
              {form.image_url && <img src={form.image_url} className="w-full h-[120px] object-contain bg-gray-50 rounded-lg border" alt="preview" />}
              <input required placeholder="Affiliate Link (Daraz Buy Link)" value={form.affiliate_link} onChange={e=>setForm({...form, affiliate_link:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] border-orange-300 outline-none" />
              <div className="flex gap-4 text-[12px] py-1"><label className="flex gap-1.5 items-center cursor-pointer"><input type="checkbox" checked={form.is_best_seller} onChange={e=>setForm({...form, is_best_seller:e.target.checked})} /> Best Seller</label><label className="flex gap-1.5 items-center cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active:e.target.checked})} /> Active</label></div>
              <button type="submit" className="w-full bg-[#0f2e26] text-white py-3 rounded-xl font-bold hover:bg-black">Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
