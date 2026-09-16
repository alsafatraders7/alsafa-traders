'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage(){
  const [isAuthenticated,setIsAuthenticated]=useState(false);
  const [checkingAuth,setCheckingAuth]=useState(true);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [showPassword,setShowPassword]=useState(false);
  const [authError,setAuthError]=useState('');
  const [authLoading,setAuthLoading]=useState(false);
  const [mobileMenu,setMobileMenu]=useState(false);
  const [products,setProducts]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAddForm,setShowAddForm]=useState(false);
  const [searchQuery,setSearchQuery]=useState('');
  const [editingProduct,setEditingProduct]=useState<any>(null);
  const [categoriesList,setCategoriesList]=useState<any[]>([]);
  const [activeTab,setActiveTab]=useState('dashboard');
  const [newCatName,setNewCatName]=useState('');
  const [imageUploading,setImageUploading]=useState(false);
  const [darazFetching,setDarazFetching]=useState(false);
  const [updatingId,setUpdatingId]=useState<string|null>(null);
  const [form,setForm]=useState({name:'',price:'',category:'',image_url:'',image_url2:'',image_url3:'',image_url4:'',detail:'',affiliate_link:'',fomo_text:'Only 5 Left!',fake_views:'128',fake_sold:'45',timer_hours:'2',bundle_text:'Buy 2 Get 10% OFF',is_best_seller:false,is_featured:false,is_active:true,display_theme:'default'});

  useEffect(()=>{
    const init=async()=>{
      const {data}=await supabase.auth.getSession();
      if(data.session){setIsAuthenticated(true);setEmail(data.session.user.email||'');}
      setCheckingAuth(false);
    };
    init();
  },[]);

  useEffect(()=>{if(isAuthenticated){fetchProducts();fetchCategories();}},[isAuthenticated]);

  const fetchProducts=async()=>{setLoading(true);const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false}).limit(100);if(data)setProducts(data);setLoading(false);};
  const fetchCategories=async()=>{const {data}=await supabase.from('categories').select('*').order('name');if(data)setCategoriesList(data);};

  const handleImageUpload=async(e:any, key='image_url')=>{
    const file=e.target.files[0]; if(!file) return; setImageUploading(true);
    const fileName=`${Date.now()}-${file.name}`.replace(/\s+/g,'-');
    const {error}=await supabase.storage.from('product-images').upload(fileName,file);
    if(error){alert(error.message);setImageUploading(false);return;}
    const {data}=supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm((f:any)=>({...f,[key]:data.publicUrl}));
    setImageUploading(false);
  };
const handleFetchDaraz=async()=>{
  if(!form.affiliate_link) return alert('Link dalo');
  setDarazFetching(true);
  try{
    const res=await fetch('/api/daraz-price',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:form.affiliate_link})});
    const d=await res.json();
    if(d.success && d.price){setForm(f=>({...f,name:d.name||f.name,price:String(d.price),image_url:d.image||f.image_url}));alert('Price mil gaya: Rs.'+d.price);}
    else alert('Manual price likh do');
  }catch{alert('Error');}
  setDarazFetching(false);
};
  const addCategory=async()=>{if(!newCatName.trim())return;const slug=newCatName.toLowerCase().replace(/[^a-z0-9]+/g,'-');await supabase.from('categories').insert([{name:newCatName.trim(),slug}]);await supabase.from('nav_buttons').insert([{label:newCatName.trim(),slug,type:'category',active:true,order_index:0}]);setNewCatName('');fetchCategories();};
  const deleteCategory=async(slug:string)=>{if(!confirm('Delete?'))return;await supabase.from('categories').delete().eq('slug',slug);await supabase.from('nav_buttons').delete().eq('slug',slug);fetchCategories();};
  const handleLogin=async(e:any)=>{e.preventDefault();setAuthLoading(true);setAuthError('');const {error}=await supabase.auth.signInWithPassword({email,password});if(error){setAuthError(error.message);setAuthLoading(false);}else{setIsAuthenticated(true);setAuthLoading(false);}};

  const handleSave=async(e:any)=>{
    e.preventDefault();
    const toCC=(u:string)=>{ if(!u) return ''; try{ return u.includes('?cc=')?u:u+(u.includes('?')?'&':'?')+'cc'; }catch{ return u; } };
    const extraDesc = `${form.detail} || IMG2:${form.image_url2} || IMG3:${form.image_url3} || IMG4:${form.image_url4} || FOMO:${form.fomo_text} || FAKE:${form.fake_views}|${form.fake_sold} || TIMER:${form.timer_hours} || BUNDLE:${form.bundle_text}`;
    const payload={name:form.name,price:parseFloat(form.price),category:form.category,image_url:form.image_url,affiliate_link:toCC(form.affiliate_link),description:extraDesc,is_best_seller:form.is_best_seller,is_featured:form.is_featured,is_active:true,display_theme:form.display_theme};
    if(editingProduct){await supabase.from('products').update(payload).eq('id',editingProduct.id);}
    else{const slug=form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Date.now();await supabase.from('products').insert([{...payload,slug}]);}
    setShowAddForm(false);setEditingProduct(null);
    setForm({name:'',price:'',category:'',image_url:'',image_url2:'',image_url3:'',image_url4:'',detail:'',affiliate_link:'',fomo_text:'Only 5 Left!',fake_views:'128',fake_sold:'45',timer_hours:'2',bundle_text:'Buy 2 Get 10% OFF',is_best_seller:false,is_featured:false,is_active:true,display_theme:'default'});fetchProducts();
  };

  const handleEdit=(p:any)=>{
    const parts=(p.description||'').split('||');
    const getVal=(key:string)=>{ const f=parts.find((x:any)=>x.includes(key+':')); return f? f.split(key+':')[1].trim() : ''; };
    const fake= getVal('FAKE').split('|');
    setEditingProduct(p);
    setForm({
      name:p.name,price:String(p.price),category:p.category,image_url:p.image_url,
      image_url2:getVal('IMG2'),image_url3:getVal('IMG3'),image_url4:getVal('IMG4'),
      detail:parts[0]?.trim()||'',
      affiliate_link:p.affiliate_link,
      fomo_text:getVal('FOMO')||'Only 5 Left!',
      fake_views:fake[0]||'128', fake_sold:fake[1]||'45',
      timer_hours:getVal('TIMER')||'2',
      bundle_text:getVal('BUNDLE')||'Buy 2 Get 10% OFF',
      is_best_seller:p.is_best_seller||false,is_featured:p.is_featured||false,is_active:true,display_theme:p.display_theme||'default'
    });
    setShowAddForm(true);
  };
  const handleDelete=async(id:string)=>{if(!confirm('Delete?'))return;await supabase.from('products').delete().eq('id',id);fetchProducts();};
  const handleAutoUpdate=async(p:any)=>{
    setUpdatingId(p.id);
    try{
      const res=await fetch('/api/daraz-price',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:p.affiliate_link})});
      const data=await res.json();
      if(data.success&&confirm('New Rs.'+data.price+' Old Rs.'+p.price)){await supabase.from('products').update({price:data.price}).eq('id',p.id);fetchProducts();}
    }catch{}
    setUpdatingId(null);
  };

  const filtered=products.filter((p:any)=>p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const categories=Array.from(new Set(products.map((p:any)=>p.category))) as string[];
  const bestSellers=products.filter((p:any)=>p.is_best_seller);
  const featured=products.filter((p:any)=>p.is_featured);

  const MenuBtn=({id,label,count}:{id:string,label:string,count?:any})=>(
    <button onClick={()=>setActiveTab(id)} className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold text-[13px] flex justify-between items-center transition ${activeTab===id?'bg-[#c49a4b] text-black':'text-gray-300 hover:bg-white/10'}`}>
      <span>{label}</span><span className="text-[11px] opacity-70">{count??''}</span>
    </button>
  );

  if(checkingAuth) return <div className="min-h-screen bg-[#0f2e26] text-white flex items-center justify-center">Checking...</div>;
  if(!isAuthenticated){return(<div className="min-h-screen bg-[#0f2e26] flex items-center justify-center p-4"><div className="bg-white rounded-[20px] p-8 w-full max-w-[400px]"><h1 className="text-[22px] font-bold text-center">Al Safa Traders</h1><form onSubmit={handleLogin} className="space-y-4 mt-4"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl px-4 py-3"/><div className="relative"><input type={showPassword?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl px-4 py-3"/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-2 top-2 bg-gray-100 px-3 py-1 rounded-full text-xs">{showPassword?'Hide':'Show'}</button></div>{authError&&<p className="text-red-600 text-xs bg-red-50 p-2 rounded">{authError}</p>}<button type="submit" className="w-full bg-[#0f2e26] text-white py-3 rounded-xl font-bold">{authLoading?'Unlocking...':'Unlock'}</button></form></div></div>);}

  let displayProducts=filtered;
  if(activeTab==='featured') displayProducts=filtered.filter((p:any)=>p.is_featured);
  if(activeTab==='bestsellers') displayProducts=filtered.filter((p:any)=>p.is_best_seller);

  return(
    <div className="min-h-screen bg-[#f8f9f6] flex text-[13px]">
      <div className="w-[260px] bg-[#0f2e26] text-white hidden lg:flex flex-col fixed h-screen">
        <div className="p-5 flex items-center gap-3"><div className="w-10 h-10 bg-[#d4a15a] rounded-lg flex items-center justify-center font-bold">AT</div><div><p className="font-bold text-[#f0d9a0]">Al Safa Traders</p><p className="text-[10px] text-gray-400">Quality Products - {form.display_theme}</p></div></div>
        <div className="px-3 space-y-1 flex-1 overflow-y-auto">
          <MenuBtn id="dashboard" label="Dashboard" count={products.length} />
          <MenuBtn id="products" label="Products" count={products.length} />
          <MenuBtn id="featured" label="Featured" count={featured.length} />
          <MenuBtn id="bestsellers" label="Best Sellers" count={bestSellers.length} />
          <MenuBtn id="categories" label="Categories" count={categoriesList.length||categories.length} />
          <MenuBtn id="daraz" label="Daraz - Total Connected" />
          <MenuBtn id="buttons" label="Public Controls - Active" />
          <button onClick={async()=>{await supabase.auth.signOut();setIsAuthenticated(false);}} className="w-full px-4 py-2.5 text-left text-gray-300 mt-4 border-t border-white/10 pt-4">Lock Panel</button>
        </div>
        <div className="p-4 border-t border-white/10 text-[10px] text-gray-400">{email}</div>
      </div>
      <div className="flex-1 lg:ml-[260px]">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1"><button onClick={()=>setMobileMenu(true)} className="lg:hidden text-[22px]">☰</button><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search products, theme..." className="bg-[#f8f9f6] border rounded-lg px-4 py-2 w-full max-w-[350px]"/></div>
          <div className="flex items-center gap-2"><button onClick={()=>setShowAddForm(true)} className="bg-[#c49a4b] text-black px-4 py-2 rounded-lg text-[12px] font-bold">+ Add Product</button></div>
        </div>
        <div className="p-3 lg:p-6">
          {activeTab==='dashboard'&&(
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2 bg-gradient-to-r from-[#fdf6e3] to-[#f5e6c8] rounded-xl p-5 flex justify-between items-center border">
                  <div><h1 className="text-[22px] font-bold">Welcome Back, Admin! 100% Done</h1><p className="text-[12px] text-gray-600 mt-1">Daraz Total Connected: {form.display_theme} | Featured: {featured.length} | Best: {bestSellers.length} | Public Controls Active</p><div className="flex gap-2 mt-4"><a href="https://alsafatraders.pk" target="_blank" className="bg-[#0f2e26] text-white px-4 py-2 rounded-lg text-[12px]">View Website</a><span className="bg-[#c49a4b] text-black px-4 py-2 rounded-lg text-[12px] font-bold">100% Working</span></div></div>
                  <img src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=200" className="w-[140px] h-[100px] object-cover rounded-xl hidden md:block" alt=""/>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white rounded-xl p-4 border"><p className="font-semibold">Website Status</p><p className="text-[12px]">Live - Daraz Connected</p></div>
                  <div className="bg-white rounded-xl p-4 border"><p className="font-semibold">Admin Account</p><p className="text-[10px] truncate">{email} - Secure</p></div>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-white rounded-xl p-4 border"><p className="text-[11px] text-gray-500">Total Products</p><p className="text-[22px] font-bold">{products.length}</p></div>
                <div className="bg-white rounded-xl p-4 border"><p className="text-[11px] text-gray-500">Featured</p><p className="text-[22px] font-bold">{featured.length}</p></div>
                <div className="bg-white rounded-xl p-4 border"><p className="text-[11px] text-gray-500">Best Sellers</p><p className="text-[22px] font-bold">{bestSellers.length}</p></div>
                <div className="bg-[#fffaf0] rounded-xl p-4 border"><p className="text-[11px]">Daraz Status</p><p className="font-bold">Total Connected</p><p className="text-[10px] text-green-600">?cc Safe</p></div>
              </div>
            </>
          )}

          {(activeTab==='dashboard'||activeTab==='products'||activeTab==='featured'||activeTab==='bestsellers')&&(
            <div className="bg-white rounded-xl p-4 border">
              <p className="font-bold mb-3">Recent Products - {displayProducts.length} | Theme: {form.display_theme}</p>
              {loading?<p className="text-center py-8">Loading...</p>:(
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {displayProducts.slice(0,20).map((p:any)=>(
                  <div key={p.id} className="border rounded-xl p-2.5 relative">
                    <img src={p.image_url} className="w-full h-[100px] object-cover rounded-lg bg-gray-50" alt=""/>
                    <p className="text-[11px] font-medium mt-2 line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-gray-500">{p.category}</p>
                    <p className="text-[12px] font-bold">Rs. {p.price} PKR</p>
                    <div className="grid grid-cols-2 gap-1 mt-2"><button onClick={()=>handleAutoUpdate(p)} className="bg-black text-white text-[9px] py-1.5 rounded-full">{updatingId===p.id?'...':'Auto Rs.'}</button><a href={p.affiliate_link} target="_blank" className="bg-[#f85606] text-white text-[9px] py-1.5 rounded-full text-center font-bold">Buy Now</a></div>
                    <div className="flex gap-1 mt-1"><button onClick={()=>handleEdit(p)} className="flex-1 border rounded-full text-[9px] py-1">Edit</button><button onClick={()=>handleDelete(p.id)} className="flex-1 border rounded-full text-[9px] py-1">Del</button></div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

          {activeTab==='categories'&&(
            <div className="bg-white rounded-xl p-5 border">
              <h2 className="font-bold text-[16px]">Categories - {categoriesList.length}</h2>
              <div className="flex gap-2 mt-4"><input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Nayi Category" className="flex-1 border rounded-xl px-4 py-2.5"/><button onClick={addCategory} className="bg-black text-white px-5 rounded-xl font-bold">+ Add Button</button></div>
              <div className="grid grid-cols-2 gap-2 mt-4">{categoriesList.map((c:any)=>(<div key={c.slug} className="flex justify-between border rounded-xl p-3"><span>{c.name}</span><button onClick={()=>deleteCategory(c.slug)} className="text-red-500 text-[11px]">Delete</button></div>))}</div>
            </div>
          )}

          {activeTab==='daraz'&&(
            <div className="bg-white rounded-xl p-5 border"><h2 className="font-bold">Daraz - Total Connected</h2><p className="text-[12px] mt-2">Status:?cc Safe - All {products.length} products Daraz se connected hain.</p><div className="mt-4 p-3 bg-green-50 rounded-xl border"><p>✅ Daraz Auto Fetch - ON</p><p>✅?cc Safe - ON</p><p>✅ 4 Pic Slider - ON</p></div></div>
          )}

          {activeTab==='buttons'&&(
            <div className="bg-white rounded-xl p-5 border">
              <h2 className="font-bold text-[16px]">Public Page Controls</h2>
              <div className="flex gap-2 mt-4"><input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Nayi Category" className="flex-1 border rounded-xl px-4 py-2.5"/><button onClick={addCategory} className="bg-black text-white px-5 rounded-xl font-bold">+ Add Button</button></div>
              <div className="grid grid-cols-2 gap-2 mt-4">{categoriesList.map((c:any)=>(<div key={c.slug} className="flex justify-between border rounded-xl p-3"><span>{c.name}</span><button onClick={()=>deleteCategory(c.slug)} className="text-red-500 text-[11px]">Delete</button></div>))}</div>
            </div>
          )}
        </div>
      </div>
      {showAddForm&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[560px] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h3 className="font-bold">{editingProduct?'Edit':'Add'} Product - Daraz Total Connect - 4 Pic</h3><button onClick={()=>{setShowAddForm(false);setEditingProduct(null);}} className="w-8 h-8 bg-gray-100 rounded-full">X</button></div>
            <form onSubmit={handleSave} className="space-y-3">
              <input required placeholder="Product Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2.5"/>
              <div className="grid grid-cols-2 gap-2"><input required type="number" placeholder="Price - Daraz Auto" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 bg-green-50 font-bold"/><select required value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 bg-yellow-50 font-bold"><option value="">Category</option>{categoriesList.map((c:any)=><option key={c.slug} value={c.name}>{c.name}</option>)}<option value="Kitchen">Kitchen</option><option value="Bartan">Bartan</option><option value="Storage">Storage</option></select></div>
              <div className="p-3 border-2 border-dashed rounded-lg bg-gray-50">
                <label className="text-[11px] font-bold">4 Pic Upload</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div><p className="text-[9px]">Pic 1</p><input type="file" onChange={e=>handleImageUpload(e,'image_url')} className="w-full text-[10px]"/><input required placeholder="Pic1 URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/></div>
                  <div><p className="text-[9px]">Pic 2</p><input type="file" onChange={e=>handleImageUpload(e,'image_url2')} className="w-full text-[10px]"/><input placeholder="Pic2 URL" value={form.image_url2} onChange={e=>setForm({...form,image_url2:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/></div>
                  <div><p className="text-[9px]">Pic 3</p><input type="file" onChange={e=>handleImageUpload(e,'image_url3')} className="w-full text-[10px]"/><input placeholder="Pic3 URL" value={form.image_url3} onChange={e=>setForm({...form,image_url3:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/></div>
                  <div><p className="text-[9px]">Pic 4</p><input type="file" onChange={e=>handleImageUpload(e,'image_url4')} className="w-full text-[10px]"/><input placeholder="Pic4 URL" value={form.image_url4} onChange={e=>setForm({...form,image_url4:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/></div>
                </div>
                {imageUploading&&<p className="text-[10px] text-blue-600 mt-1">Uploading...</p>}
              </div>
              <div className="flex gap-2"><input required placeholder="Affiliate Link s.daraz.pk?cc Safe" value={form.affiliate_link} onChange={e=>setForm({...form,affiliate_link:e.target.value})} className="flex-1 border rounded-lg px-3 py-2.5 border-orange-300"/><button type="button" onClick={handleFetchDaraz} disabled={darazFetching} className="bg-black text-white px-3 rounded-lg text-[11px] font-bold">{darazFetching?'...':'Daraz Auto'}</button></div>
              <button type="submit" className="w-full bg-[#0f2e26] text-white py-3 rounded-xl font-bold">Save - Daraz Total Connected - Public Live</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
