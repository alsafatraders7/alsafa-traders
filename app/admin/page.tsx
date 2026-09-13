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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard'|'buttons'>('dashboard');
  const [imageUploading, setImageUploading] = useState(false);
  const [darazFetching, setDarazFetching] = useState(false);
  const [form, setForm] = useState({ name:'', price:'', category:'', image_url:'', affiliate_link:'', is_best_seller:false, is_featured:false, is_active:true, display_theme:'default' });

  useEffect(()=>{
    const init=async()=>{
      const {data}=await supabase.auth.getSession();
      if(data.session){ setIsAuthenticated(true); setEmail(data.session.user.email||''); }
      setCheckingAuth(false);
    };
    init();
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
    const fileName=Date.now()+'-'+file.name;
    const {error}=await supabase.storage.from('product-images').upload(fileName,file);
    if(error){ alert('Supabase > Storage > product-images bucket Public banao'); setImageUploading(false); return; }
    const {data}=supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm(f=>({...f, image_url:data.publicUrl})); setImageUploading(false);
  };

  const handleFetchDaraz=async()=>{
    if(!form.affiliate_link) return alert('Pehle affiliate link dalo');
    setDarazFetching(true);
    try{
      const res=await fetch('/api/【entity-daraz¦canonical_name=Daraz】-price',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url:form.affiliate_link})});
      const data=await res.json();
      if(data.success && data.price){ setForm(f=>({...f, name:data.name||f.name, price:String(data.price), image_url:data.image||f.image_url})); }
    }catch{} setDarazFetching(false);
  };

  const addCategory=async()=>{
    if(!newCatName.trim()) return;
    const slug=newCatName.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    await supabase.from('categories').insert([{name:newCatName.trim(), slug}]);
    setNewCatName(''); fetchCategories();
  };

  const handleLogin=async(e:React.FormEvent)=>{
    e.preventDefault(); setAuthLoading(true); setAuthError('');
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error){ setAuthError(error.message); setAuthLoading(false); } else { setIsAuthenticated(true); setAuthLoading(false); }
  };

  const handleSave=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(editingProduct){
      await supabase.from('products').update({ name:form.name, price:parseFloat(form.price), category:form.category, image_url:form.image_url, affiliate_link:form.affiliate_link, is_best_seller:form.is_best_seller, is_featured:form.is_featured, is_active:form.is_active, display_theme:form.display_theme }).eq('id',editingProduct.id);
    } else {
      const slug=form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Date.now();
      await supabase.from('products').insert([{ name:form.name, price:parseFloat(form.price), category:form.category, image_url:form.image_url, affiliate_link:form.affiliate_link, is_best_seller:form.is_best_seller, is_featured:form.is_featured, is_active:form.is_active, display_theme:form.display_theme, slug }]);
    }
    setShowAddForm(false); setEditingProduct(null);
    setForm({name:'',price:'',category:'',image_url:'',affiliate_link:'',is_best_seller:false,is_featured:false,is_active:true,display_theme:'default'});
    fetchProducts();
  };

  const handleEdit=(p:any)=>{ setEditingProduct(p); setForm({name:p.name, price:String(p.price), category:p.category, image_url:p.image_url, affiliate_link:p.affiliate_link, is_best_seller:p.is_best_seller||false, is_featured:p.is_featured||false, is_active:p.is_active!==false, display_theme:p.display_theme||'default'}); setShowAddForm(true); };
  const handleDelete=async(id:string)=>{ if(!confirm('Delete?')) return; await supabase.from('products').delete().eq('id',id); fetchProducts(); };

  const filtered=products.filter((p:any)=>p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if(checkingAuth) return <div className="min-h-screen bg-[#0f2e26] text-white flex items-center justify-center">Checking...</div>;
  if(!isAuthenticated){
    return (
      <div className="min-h-screen bg-[#0f2e26] flex items-center justify-center p-4">
        <div className="bg-white rounded-[20px] p-8 w-full max-w-[400px]">
          <div className="text-center mb-6"><div className="w-16 h-16 bg-[#0f2e26] rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">AT</div><h1 className="text-[22px] font-bold">Al Safa Traders</h1><p className="text-[12px] text-gray-500">Aapki pehli website ka admin</p></div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl px-4 py-3" />
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl px-4 py-3" />
            {authError && <p className="text-red-600 text-[12px] bg-red-50 p-2 rounded">{authError}</p>}
            <button type="submit" disabled={authLoading} className="w-full bg-[#0f2e26] text-white py-3.5 rounded-xl font-bold">Unlock Admin Panel</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9f6] flex">
      <div className="w-[260px] bg-[#0f2e26] text-white hidden lg:flex flex-col fixed h-screen p-5">
        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-[#d4a15a] rounded-lg flex items-center justify-center font-bold">AT</div><div><p className="font-bold text-[#f0d9a0]">Al Safa Traders</p><p className="text-[10px] text-gray-400">Quality Products - Pehli Website</p></div></div>
        <div className="mt-6 text-[13px]"><div className="bg-[#c49a4b] text-black px-4 py-2.5 rounded-lg font-semibold">Dashboard - {products.length}</div><div className="px-4 py-2.5 text-gray-300">Email: {email}</div><button onClick={async()=>{await supabase.auth.signOut(); setIsAuthenticated(false);}} className="w-full text-left px-4 py-2.5 text-gray-300 mt-4 border-t border-white/10">Lock Panel</button></div>
      </div>
      <div className="flex-1 lg:ml-[260px]">
        <div className="bg-white border-b px-6 py-3 flex justify-between sticky top-0 z-20">
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search products..." className="bg-[#f8f9f6] border rounded-lg px-4 py-2 w-full max-w-[350px]" />
          <button onClick={()=>{setEditingProduct(null); setForm({name:'',price:'',category:'',image_url:'',affiliate_link:'',is_best_seller:false,is_featured:false,is_active:true,display_theme:'default'}); setShowAddForm(true);}} className="bg-[#c49a4b] text-black px-4 py-2 rounded-lg font-bold text-[12px]">+ Add Product</button>
        </div>
        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <button onClick={()=>setActiveTab('dashboard')} className={`px-4 py-2 rounded-full text-[12px] font-bold ${activeTab==='dashboard'?'bg-black text-white':'bg-white border'}`}>Dashboard - {products.length} Products</button>
            <button onClick={()=>setActiveTab('buttons')} className={`px-4 py-2 rounded-full text-[12px] font-bold ${activeTab==='buttons'?'bg-black text-white':'bg-white border'}`}>Button Controls - Pehli Website Ke Buttons</button>
          </div>
          {activeTab==='buttons' && (
            <div className="bg-white rounded-xl p-5 border mb-4">
              <h2 className="font-bold">Public Page Buttons Control - Aapki Pehli Website</h2>
              <p className="text-[11px] text-gray-500">Yahan se Shop All | Kitchen | Bartan wale buttons control honge -?cc safe</p>
              <div className="flex gap-2 mt-4">
                <input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Nayi Category - Jaise Crockery" className="flex-1 border rounded-xl px-4 py-2.5" />
                <button onClick={addCategory} className="bg-black text-white px-5 rounded-xl">+ Add</button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {categoriesList.map((c:any)=>(<div key={c.slug} className="flex justify-between border rounded-xl p-3"><span>{c.name}</span><span className="text-[10px] text-gray-400">{c.slug}</span></div>))}
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl p-4 border">
            <h2 className="font-bold mb-3">Recent Products - Aapki Pehli Website Ke {products.length} Products - Safe Hai</h2>
            {loading? <p>Loading...</p> : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {filtered.map((p:any)=>(
                  <div key={p.id} className="border rounded-xl p-2.5">
                    <img src={p.image_url} className="w-full h-[100px] object-cover rounded-lg bg-gray-50" alt="" />
                    <p className="text-[11px] font-medium mt-2 line-clamp-1">{p.name}</p>
                    <p className="text-[12px] font-bold">Rs. {p.price}</p>
                    <p className="text-[10px] text-gray-500">{p.category} - {p.display_theme||'default'}</p>
                    <div className="flex gap-1 mt-2"><button onClick={()=>handleEdit(p)} className="flex-1 border rounded-full text-[9px] py-1">Edit</button><button onClick={()=>handleDelete(p.id)} className="flex-1 border rounded-full text-[9px] py-1">Del</button></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h3 className="font-bold">{editingProduct?'Edit':'Add'} Product - Pehli Website Me</h3><button onClick={()=>{setShowAddForm(false); setEditingProduct(null);}} className="w-8 h-8 bg-gray-100 rounded-full">X</button></div>
            <form onSubmit={handleSave} className="space-y-3">
              <input required placeholder="Product Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border rounded-lg px-3 py-2.5" />
              <div className="grid grid-cols-2 gap-2">
                <input required type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} className="w-full border rounded-lg px-3 py-2.5" />
                <select required value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 bg-yellow-50 font-bold">
                  <option value="">Category</option>
                  {categoriesList.map((c:any)=><option key={c.slug} value={c.name}>{c.name}</option>)}
                  <option value="Kitchen">Kitchen</option><option value="Bartan">Bartan</option><option value="Storage">Storage</option><option value="Chopper">Chopper</option>
                </select>
              </div>
              <div className="p-3 border rounded-lg bg-gray-50">
                <label className="text-[11px] font-bold">Gallery Se Upload - NEW Setting</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full mt-1 text-[12px]" />
                {imageUploading && <p className="text-[10px] text-blue-600">Uploading...</p>}
                <input required placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form, image_url:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 mt-2 bg-white" />
                {form.image_url && <img src={form.image_url} className="w-20 h-20 rounded-lg mt-2 object-cover border" alt="" />}
              </div>
              <div className="flex gap-2">
                <input required placeholder="Affiliate Link s.daraz.pk?cc Safe" value={form.affiliate_link} onChange={e=>setForm({...form, affiliate_link:e.target.value})} className="flex-1 border rounded-lg px-3 py-2.5 border-orange-300" />
                <button type="button" onClick={handleFetchDaraz} disabled={darazFetching} className="bg-black text-white px-3 rounded-lg text-[11px] font-bold">{darazFetching?'...':'Auto Fetch - NEW'}</button>
              </div>
              <select value={form.display_theme} onChange={e=>setForm({...form, display_theme:e.target.value})} className="w-full border rounded-lg px-3 py-2.5">
                <option value="default">Display Theme - Default - NEW Setting</option><option value="featured">Featured</option><option value="minimal">Minimal</option><option value="premium">Premium</option>
              </select>
              <div className="grid grid-cols-3 gap-2 text-[11px] p-2 bg-gray-50 rounded-lg">
                <label className="flex gap-1 items-center"><input type="checkbox" checked={form.is_best_seller} onChange={e=>setForm({...form, is_best_seller:e.target.checked})} /> Best Seller</label>
                <label className="flex gap-1 items-center"><input type="checkbox" checked={form.is_featured} onChange={e=>setForm({...form, is_featured:e.target.checked})} /> Featured</label>
                <label className="flex gap-1 items-center"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active:e.target.checked})} /> Active</label>
              </div>
              <button type="submit" className="w-full bg-[#0f2e26] text-white py-3 rounded-xl font-bold">Save In Pehli Website -?cc Safe</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
