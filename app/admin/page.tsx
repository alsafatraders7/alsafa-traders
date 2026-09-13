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
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard'|'buttons'>('dashboard');
  const [newCatName, setNewCatName] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [darazFetching, setDarazFetching] = useState(false);
  const [form, setForm] = useState({
    name:'', price:'', category:'', image_url:'', affiliate_link:'',
    is_best_seller:false, is_featured:false, is_active:true, display_theme:'default'
  });

  useEffect(()=>{
    const init=async()=>{
      const {data}=await supabase.auth.getSession();
      if(data.session){ setIsAuthenticated(true); setEmail(data.session.user.email||''); }
      setCheckingAuth(false);
    };
    init();
    const {data:lis}=supabase.auth.onAuthStateChange((_e,s)=>{ setIsAuthenticated(!!s); if(s?.user?.email) setEmail(s.user.email); });
    return ()=>lis.subscription.unsubscribe();
  },[]);

  useEffect(()=>{ if(isAuthenticated){ fetchProducts(); fetchCategories(); } },[isAuthenticated]);

  const fetchProducts=async()=>{
    setLoading(true);
    const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false}).limit(100);
    if(data) setProducts(data);
    setLoading(false);
  };
  const fetchCategories=async()=>{
    const {data}=await supabase.from('categories').select('*').order('name');
    if(data) setCategoriesList(data);
  };

  const handleImageUpload=async(e:any)=>{
    const file=e.target.files[0]; if(!file) return; setImageUploading(true);
    const fileName=`${Date.now()}-${file.name}`;
    const {error}=await supabase.storage.from('product-images').upload(fileName,file);
    if(error){ alert('Supabase > Storage > product-images > Public ON karo'); setImageUploading(false); return; }
    const {data}=supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm(f=>({...f, image_url:data.publicUrl}));
    setImageUploading(false);
  };

  const handleFetchDaraz=async()=>{
    if(!form.affiliate_link) return alert('Pehle s.daraz.pk?cc wala link dalo');
    setDarazFetching(true);
    try{
      const res=await fetch('/api/daraz-price',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url:form.affiliate_link})});
      const d=await res.json();
      if(d.success && d.price){
        setForm(f=>({...f, name: d.name || f.name, price: String(d.price), image_url: d.image || f.image_url}));
        alert('Daraz Connected! Rs. '+d.price+' PKR Auto Aagaya');
      } else alert('Price nahi mila - Manual Rs. likh do -?cc safe rahega');
    }catch{ alert('Error'); }
    setDarazFetching(false);
  };

  const addCategory=async()=>{
    if(!newCatName.trim()) return;
    const slug=newCatName.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    await supabase.from('categories').insert([{name:newCatName.trim(), slug}]);
    await supabase.from('nav_buttons').insert([{label:newCatName.trim(), slug, type:'category', active:true, order_index:0}]);
    setNewCatName(''); fetchCategories();
  };
  const deleteCategory=async(slug:string)=>{
    if(!confirm('Public se button hat jayega - Delete?')) return;
    await supabase.from('categories').delete().eq('slug',slug);
    await supabase.from('nav_buttons').delete().eq('slug',slug);
    fetchCategories();
  };

  const handleLogin=async(e:React.FormEvent)=>{
    e.preventDefault(); setAuthLoading(true); setAuthError('');
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error){ setAuthError(error.message); setAuthLoading(false); } else { setIsAuthenticated(true); setAuthLoading(false); }
  };

  const handleSave=async(e:React.FormEvent)=>{
    e.preventDefault();
    const finalPayload = {
      name:form.name,
      price:parseFloat(form.price),
      category:form.category,
      image_url:form.image_url,
      affiliate_link:form.affiliate_link,
      is_best_seller:form.is_best_seller,
      is_featured:form.is_featured,
      is_active:true,
      display_theme:form.display_theme
    };
    if(editingProduct){
      await supabase.from('products').update(finalPayload).eq('id',editingProduct.id);
    } else {
      const slug=form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Date.now();
      await supabase.from('products').insert([{...finalPayload, slug}]);
    }
    setShowAddForm(false); setEditingProduct(null);
    setForm({ name:'', price:'', category:'', image_url:'', affiliate_link:'', is_best_seller:false, is_featured:false, is_active:true, display_theme:'default' });
    fetchProducts();
  };

  const handleEdit=(p:any)=>{ setEditingProduct(p); setForm({ name:p.name, price:String(p.price), category:p.category, image_url:p.image_url, affiliate_link:p.affiliate_link, is_best_seller:p.is_best_seller||false, is_featured:p.is_featured||false, is_active:true, display_theme:p.display_theme||'default' }); setShowAddForm(true); };
  const handleDelete=async(id:string)=>{ if(!confirm('Delete product?')) return; await supabase.from('products').delete().eq('id',id); fetchProducts(); };
  const handleAutoUpdate=async(p:any)=>{
    setUpdatingId(p.id);
    try{
      const res=await fetch('/api/daraz-price',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url:p.affiliate_link})});
      const data=await res.json();
      if(data.success && confirm('New: Rs. '+data.price+' PKR Old: Rs.'+p.price+' Update?')){ await supabase.from('products').update({price:data.price}).eq('id',p.id); fetchProducts(); }
      else alert(data.error||'Price not found');
    }catch(e:any){ alert(e.message); }
    setUpdatingId(null);
  };

  const filtered=products.filter((p:any)=>p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const categories=Array.from(new Set(products.map((p:any)=>p.category))) as string[];
  const bestSellers=products.filter((p:any)=>p.is_best_seller);
  const featured=products.filter((p:any)=>p.is_featured);

  if(checkingAuth) return <div className="min-h-screen bg-[#0f2e26] text-white flex items-center justify-center">Checking...</div>;

  if(!isAuthenticated){
    return (
      <div className="min-h-screen bg-[#0f2e26] flex items-center justify-center p-4">
        <div className="bg-white rounded-[20px] p-8 w-full max-w-[400px] shadow-2xl">
          <div className="text-center mb-6"><div className="w-16 h-16 bg-[#0f2e26] rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">AT</div><h1 className="text-[22px] font-bold">Al Safa Traders</h1><p className="text-[11px] text-gray-500">Admin Panel Locked - Secure Login</p></div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="text-[11px] font-bold">Email</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-[14px] mt-1" /></div>
            <div><label className="text-[11px] font-bold">Password</label><div className="relative"><input type={showPassword? "text" : "password"} required value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-[14px] mt-1 pr-16" /><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-2 top-[7px] bg-gray-100 px-3 py-1.5 rounded-full text-[11px] font-bold">{showPassword? 'Hide' : 'Show'}</button></div></div>
            {authError && <p className="text-red-600 text-[12px] bg-red-50 p-2 rounded">{authError}</p>}
            <button type="submit" disabled={authLoading} className="w-full bg-[#0f2e26] text-white py-3.5 rounded-xl font-bold">{authLoading? 'Unlocking...' : 'Unlock Admin Panel'}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9f6] flex text-[13px]">
      <div className="w-[260px] bg-[#0f2e26] text-white hidden lg:flex flex-col fixed h-screen">
        <div className="p-5 flex items-center gap-3"><div className="w-10 h-10 bg-[#d4a15a] rounded-lg flex items-center justify-center font-bold">AT</div><div><p className="font-bold text-[#f0d9a0]">Al Safa Traders</p><p className="text-[10px] text-gray-400">Quality Products - {form.display_theme}</p></div></div>
        <div className="px-3 space-y-0.5 flex-1 overflow-y-auto">
          <div className="bg-[#c49a4b] text-black px-4 py-2.5 rounded-lg font-semibold">Dashboard - {products.length}</div>
          <div className="px-4 py-2.5 text-gray-300">Products - {products.length}</div>
          <div className="px-4 py-2.5 text-gray-300">Featured - {featured.length}</div>
          <div className="px-4 py-2.5 text-gray-300">Best Sellers - {bestSellers.length}</div>
          <div className="px-4 py-2.5 text-gray-300">Categories - {categoriesList.length||categories.length}</div>
          <div className="px-4 py-2.5 text-gray-300">Daraz - Total Connected</div>
          <div className="px-4 py-2.5 text-gray-300">Public Controls - Active</div>
          <button onClick={async()=>{await supabase.auth.signOut(); setIsAuthenticated(false);}} className="w-full px-4 py-2.5 text-left text-gray-300 mt-4 border-t border-white/10 pt-4">Lock Panel</button>
        </div>
        <div className="p-4 border-t border-white/10 text-[10px] text-gray-400">{email}<br/>Secure Login - All Features</div>
      </div>
      {mobileMenu && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={()=>setMobileMenu(false)}></div><div className="absolute left-0 top-0 w-[270px] h-full bg-[#0f2e26] text-white p-4"><p className="font-bold mb-4">Al Safa Traders</p><button onClick={async()=>{await supabase.auth.signOut(); setIsAuthenticated(false);}} className="w-full px-4 py-2.5 bg-red-500/20 rounded-lg">Lock</button></div></div>}
      <div className="flex-1 lg:ml-[260px]">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1"><button onClick={()=>setMobileMenu(true)} className="lg:hidden text-[22px]">☰</button><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search products, theme..." className="bg-[#f8f9f6] border rounded-lg px-4 py-2 w-full max-w-[350px] text-[13px]" /></div>
          <div className="flex items-center gap-2"><button onClick={()=>setActiveTab(activeTab==='dashboard'?'buttons':'dashboard')} className="border px-3 py-2 rounded-lg text-[11px] font-bold">{activeTab==='dashboard'?'Button Controls':'Dashboard'}</button><button onClick={()=>{setEditingProduct(null); setForm({ name:'', price:'', category:'', image_url:'', affiliate_link:'', is_best_seller:false, is_featured:false, is_active:true, display_theme:'default' }); setShowAddForm(true);}} className="bg-[#c49a4b] text-black px-4 py-2 rounded-lg text-[12px] font-bold">+ Add Product</button></div>
        </div>
        <div className="p-3 lg:p-6">
          {activeTab==='buttons'? (
            <div className="bg-white rounded-xl p-5 border">
              <h2 className="font-bold text-[16px]">Public Page Ke Sare Controls - Admin Se - Daraz Total Connect</h2>
              <p className="text-[11px] text-gray-500">Yahan se Shop All | Bartan | Crockery | Electronics | Kids | Kitchen | Storage wale buttons control honge - Daraz?cc Safe</p>
              <div className="flex gap-2 mt-4"><input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Nayi Category - Jaise Toys" className="flex-1 border rounded-xl px-4 py-2.5" /><button onClick={addCategory} className="bg-black text-white px-5 rounded-xl font-bold">+ Add Button</button></div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoriesList.map((c:any)=>(<div key={c.slug} className="flex justify-between border rounded-xl p-3"><span>{c.name}</span><button onClick={()=>deleteCategory(c.slug)} className="text-red-500 text-[11px]">Delete</button></div>))}
                {categoriesList.length===0 && categories.map((cat:string)=>(<div key={cat} className="flex justify-between border rounded-xl p-3"><span>{cat}</span><span className="text-[10px] text-gray-400">from products</span></div>))}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2 bg-gradient-to-r from-[#fdf6e3] to-[#f5e6c8] rounded-xl p-5 flex justify-between items-center border">
                  <div><h1 className="text-[22px] font-bold">Welcome Back, Admin! 100% Done</h1><p className="text-[12px] text-gray-600 mt-1">Daraz Total Connected: {form.display_theme} | Featured: {featured.length} | Best: {bestSellers.length} | Public Controls Active</p><div className="flex gap-2 mt-4"><a href="https://alsafatraders.pk" target="_blank" className="bg-[#0f2e26] text-white px-4 py-2 rounded-lg text-[12px]">View Website</a><span className="bg-[#c49a4b] text-black px-4 py-2 rounded-lg text-[12px] font-bold">100% Working</span></div></div>
                  <img src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=200" className
