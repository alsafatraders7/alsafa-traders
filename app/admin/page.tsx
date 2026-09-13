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
        alert('【entity-Daraz¦canonical_name=Daraz】 Connected! Rs. '+d.price+' PKR Auto Aagaya - Manual bhi change kar sakte ho');
      } else alert('Price nahi mila - Manual Rs. likh do -?cc safe rahega');
    }catch{ alert('Error - /api/daraz-price route check karo'); }
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
      const res=await fetch('/api/【entity-daraz¦canonical_name=Daraz】-price',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url:p.affiliate_link})});
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
          <div className="text-center mb-6"><div className="w-16 h-16 bg-[#0f2e26] rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">AT</div><h1 className="text-[22px] font-bold">Al Safa Traders</h1><p className="text-[11px] text-gray-500">Admin Panel Locked</p></div>
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
        <div className="p-5 flex items-center gap-3"><div className="w-10 h-10 bg-[#d4a15a] rounded-lg flex items-center justify-center font-bold">AT</div><div><p className="font-bold text-[#f0d9a0]">Al Safa Traders</p><p className="text-[10px] text-gray-400">Quality Products</p></div></div>
        <div className="px-3 space-y-0.5 flex-1 overflow-y-auto">
          <div className="bg-[#c49a4b] text-black px-4 py-2.5 rounded-lg font-semibold">Dashboard - {products.length}</div>
          <div className="px-4 py-2.5 text-gray-300">Products - {products.length}</div>
          <div className="px-4 py-2.5 text-gray-300">【entity-Daraz¦canonical_name=Daraz】 Total Connected</div>
          <button onClick={async()=>{await supabase.auth.signOut(); setIsAuthenticated(false);}} className="w-full px-4 py-2.5 text-left text-gray-300 mt-4 border-t border-white/10 pt-4">Lock Panel</button>
        </div>
        <div className="p-4 border-t border-white/10 text-[10px] text-gray-400">{email}</div>
      </div>
      <div className="flex-1 lg:ml-[260px]">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1"><button onClick={()=>setMobileMenu(true)} className="lg:hidden text-[22px]">☰</button><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search products..." className="bg-[#f8f9f6] border rounded-lg px-4 py-2 w-full max-w-[350px] text-[13px]" /></div>
          <div className="flex items-center gap-2"><button onClick={()=>setActiveTab(activeTab==='dashboard'?'buttons':'dashboard')} className="border px-3 py-2 rounded-lg text-[11px] font-bold">{activeTab==='dashboard'?'Button Controls':'Dashboard'}</button><button onClick={()=>{setEditingProduct(null); setForm({ name:'', price:'', category:'', image_url:'', affiliate_link:'', is_best_seller:false, is_featured:false, is_active:true, display_theme:'default' }); setShowAddForm(true);}} className="bg-[#c49a4b] text-black px-4 py-2 rounded-lg text-[12px] font-bold">+ Add Product</button></div>
        </div>
        <div className="p-3 lg:p-6">
          {activeTab==='buttons'? (
            <div className="bg-white rounded-xl p-5 border">
              <h2 className="font-bold text-[16px]">Public Page Controls - 【entity-Daraz Total Connect¦canonical_name=Daraz】</h2>
              <div className="flex gap-2 mt-4"><input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Nayi Category" className="flex-1 border rounded-xl px-4 py-2.5" /><button onClick={addCategory} className="bg-black text-white px-5 rounded-xl font-bold">+ Add Button</button></div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoriesList.map((c:any)=>(<div key={c.slug} className="flex justify-between border rounded-xl p-3"><span>{c.name}</span><button onClick={()=>deleteCategory(c.slug)} className="text-red-500 text-[11px]">Delete</button></div>))}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl p-4 border">
                <p className="font-bold mb-3">Recent Products - {filtered.length}</p>
                {loading? <p className="text-center py-8">Loading...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {filtered.slice(0,10).map((p:any)=>(
                    <div key={p.id} className="border rounded-xl p-2.5 relative">
                      <img src={p.image_url} className="w-full h-[100px] object-cover rounded-lg bg-gray-50" alt="" />
                      <p className="text-[11px] font-medium mt-2 line-clamp-1">{p.name}</p>
                      <p className="text-[12px] font-bold">Rs. {p.price} PKR</p>
                      <div className="grid grid-cols-2 gap-1 mt-2">
                        <button onClick={()=>handleAutoUpdate(p)} disabled={updatingId===p.id} className="bg-black text-white text-[9px] py-1.5 rounded-full">{updatingId===p.id?'...':'Auto Rs.'}</button>
                        <a href={p.affiliate_link} target="_blank" className="bg-[#f85606] text-white text-[9px] py-1.5 rounded-full text-center font-bold">Buy Now</a>
                      </div>
                      <div className="flex gap-1 mt-1"><button onClick={()=>handleEdit(p)} className="flex-1 border rounded-full text-[9px] py-1">Edit</button><button onClick={()=>handleDelete(p.id)} className="flex-1 border rounded-full text-[9px] py-1">Del</button></div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h3 className="font-bold">{editingProduct? 'Edit' : 'Add'} Product - Daraz Total Connect</h3><button onClick={()=>{setShowAddForm(false); setEditingProduct(null);}} className="w-8 h-8 bg-gray-100 rounded-full">X</button></div>
            <form onSubmit={handleSave} className="space-y-3">
              <input required placeholder="Product Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px]" />
              <div className="grid grid-cols-2 gap-2">
                <input required type="number" placeholder="Price - Daraz Auto (Rs. PKR)" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px]" />
                <select required value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] bg-yellow-50 font-bold">
                  <option value="">Category - Public Control</option>
                  {categoriesList.map((c:any)=><option key={c.slug} value={c.name}>{c.name}</option>)}
                  {categories.map((c:string)=><option key={c} value={c}>{c}</option>)}
                  <option value="Kitchen">Kitchen</option><option value="Bartan">Bartan</option><option value="Storage">Storage</option>
                </select>
              </div>
              <div className="p-3 border rounded-lg bg-gray-50">
                <label className="text-[11px] font-bold">Gallery Se Upload - Public Control</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full mt-1 text-[12px]" />
                {imageUploading && <p className="text-[10px] text-blue-600">Uploading...</p>}
                <input required placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form, image_url:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-2 bg-white" />
                {form.image_url && <img src={form.image_url} className="w-20 h-20 rounded-lg mt-2 object-cover border" alt="" />}
              </div>
              <div className="flex gap-2">
                <input required placeholder="Affiliate Link s.【entity-daraz¦canonical_name=Daraz】.pk?cc Safe" value={form.affiliate_link} onChange={e=>setForm({...form, affiliate_link:e.target.value})} className="flex-1 border rounded-lg px-3 py-2.5 text-[13px] border-orange-300" />
                <button type="button" onClick={handleFetchDaraz} disabled={darazFetching} className="bg-black text-white px-3 rounded-lg text-[11px] font-bold">{darazFetching?'...':'Daraz Auto'}</button>
              </div>
              <p className="text-[10px] text-gray-500">Auto dabao to Name/Price/Image auto -?cc safe rahega - Public pe update hoga! Manual Rs. PKR bhi likh sakte ho</p>
              <div className="grid grid-cols-3 gap-2 text-[11px] p-2 bg-gray-50 rounded-lg">
                <label className="flex gap-1 items-center"><input type="checkbox" checked={form.is_best_seller} onChange={e=>setForm({...form, is_best_seller:e.target.checked})} /> Best Seller</label>
                <label className="flex gap-1 items-center"><input type="checkbox" checked={form.is_featured} onChange={e=>setForm({...form, is_featured:e.target.checked})} /> Featured</label>
                <label className="flex gap-1 items-center"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active:e.target.checked})} /> Active</label>
              </div>
              <button type="submit" className="w-full bg-[#0f2e26] text-white py-3 rounded-xl font-bold">Save - Daraz Total Connected - Public Live</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
