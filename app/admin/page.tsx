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
  const [activeTab,setActiveTab]=useState<'dashboard'|'buttons'>('dashboard');
  const [newCatName,setNewCatName]=useState('');
  const [imageUploading,setImageUploading]=useState(false);
  const [form,setForm]=useState({name:'',price:'',category:'',image_url:'',image_url2:'',image_url3:'',image_url4:'',detail:'',affiliate_link:'',is_best_seller:false,is_featured:false,is_active:true,display_theme:'default'});

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

  const toCC = (url:string) => {
    if(!url) return '';
    try{ return url.split('?')[0].split('&')[0] + '?cc'; }catch{ return url; }
  }

  const handleImageUpload=async(e:any, key='image_url')=>{
    const file=e.target.files[0]; if(!file) return; setImageUploading(true);
    const fileName=`${Date.now()}-${file.name}`.replace(/\s+/g,'-');
    const {error}=await supabase.storage.from('product-images').upload(fileName,file);
    if(error){alert('Storage bucket Public ON karo: '+error.message);setImageUploading(false);return;}
    const {data}=supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm(f=>({...f,[key]:data.publicUrl}));
    setImageUploading(false);
  };

  const addCategory=async()=>{if(!newCatName.trim())return;const slug=newCatName.toLowerCase().replace(/[^a-z0-9]+/g,'-');await supabase.from('categories').insert([{name:newCatName.trim(),slug}]);await supabase.from('nav_buttons').insert([{label:newCatName.trim(),slug,type:'category',active:true,order_index:0}]);setNewCatName('');fetchCategories();};
  const deleteCategory=async(slug:string)=>{if(!confirm('Delete?'))return;await supabase.from('categories').delete().eq('slug',slug);await supabase.from('nav_buttons').delete().eq('slug',slug);fetchCategories();};

  const handleLogin=async(e:any)=>{e.preventDefault();setAuthLoading(true);setAuthError('');const {error}=await supabase.auth.signInWithPassword({email,password});if(error){setAuthError(error.message);setAuthLoading(false);}else{setIsAuthenticated(true);setAuthLoading(false);}};

  const handleSave=async(e:any)=>{
    e.preventDefault();
    const aff = toCC(form.affiliate_link);
    const payload:any={name:form.name,price:parseFloat(form.price),category:form.category,image_url:form.image_url,affiliate_link:aff,is_best_seller:form.is_best_seller,is_featured:form.is_featured,is_active:true,display_theme:form.display_theme,description:`${form.detail} || IMG2:${form.image_url2} || IMG3:${form.image_url3} || IMG4:${form.image_url4}`};
    if(editingProduct){await supabase.from('products').update(payload).eq('id',editingProduct.id);}
    else{const slug=form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Date.now();await supabase.from('products').insert([{...payload,slug}]);}
    setShowAddForm(false);setEditingProduct(null);setForm({name:'',price:'',category:'',image_url:'',image_url2:'',image_url3:'',image_url4:'',detail:'',affiliate_link:'',is_best_seller:false,is_featured:false,is_active:true,display_theme:'default'});fetchProducts();
  };

  const handleEdit=(p:any)=>{
    const parts=(p.description||'').split('||');
    setEditingProduct(p);
    setForm({name:p.name,price:String(p.price),category:p.category,image_url:p.image_url,image_url2:parts[1]?.replace('IMG2:','')?.trim()||'',image_url3:parts[2]?.replace('IMG3:','')?.trim()||'',image_url4:parts[3]?.replace('IMG4:','')?.trim()||'',detail:parts[0]?.trim()||'',affiliate_link:p.affiliate_link,is_best_seller:p.is_best_seller||false,is_featured:p.is_featured||false,is_active:true,display_theme:p.display_theme||'default'});
    setShowAddForm(true);
  };
  const handleDelete=async(id:string)=>{if(!confirm('Delete?'))return;await supabase.from('products').delete().eq('id',id);fetchProducts();};

  const filtered=products.filter((p:any)=>p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const categories=Array.from(new Set(products.map((p:any)=>p.category))) as string[];
  const bestSellers=products.filter((p:any)=>p.is_best_seller);
  const featured=products.filter((p:any)=>p.is_featured);

  if(checkingAuth) return <div className="min-h-screen bg-[#0f2e26] text-white flex items-center justify-center">Checking...</div>;
  if(!isAuthenticated){return(<div className="min-h-screen bg-[#0f2e26] flex items-center justify-center p-4"><div className="bg-white rounded-[20px] p-8 w-full max-w-[400px]"><h1 className="text-[22px] font-bold text-center">Al Safa Traders</h1><form onSubmit={handleLogin} className="space-y-4 mt-4"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl px-4 py-3"/><div className="relative"><input type={showPassword?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl px-4 py-3"/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-2 top-2 bg-gray-100 px-3 py-1 rounded-full text-xs">{showPassword?'Hide':'Show'}</button></div>{authError&&<p className="text-red-600 text-xs bg-red-50 p-2 rounded">{authError}</p>}<button type="submit" className="w-full bg-[#0f2e26] text-white py-3 rounded-xl font-bold">{authLoading?'Unlocking...':'Unlock'}</button></form></div></div>);}

  return(
    <div className="min-h-screen bg-[#f8f9f6] flex text-[13px]">
      <div className="w-[260px] bg-[#0f2e26] text-white hidden lg:flex flex-col fixed h-screen">
        <div className="p-5"><p className="font-bold text-[#f0d9a0]">Al Safa Traders - {products.length} Products</p></div>
        <div className="px-3"><button onClick={async()=>{await supabase.auth.signOut();setIsAuthenticated(false);}} className="w-full px-4 py-2.5 text-left border-t border-white/10">Lock Panel</button></div>
      </div>
      <div className="flex-1 lg:ml-[260px]">
        <div className="bg-white border-b px-4 py-3 flex justify-between sticky top-0"><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search..." className="bg-[#f8f9f6] border rounded-lg px-4 py-2 w-[300px]"/><button onClick={()=>{setEditingProduct(null);setForm({name:'',price:'',category:'',image_url:'',image_url2:'',image_url3:'',image_url4:'',detail:'',affiliate_link:'',is_best_seller:false,is_featured:false,is_active:true,display_theme:'default'});setShowAddForm(true);}} className="bg-[#c49a4b] px-4 py-2 rounded-lg font-bold">+ Add Product</button></div>
        <div className="p-4">
          <div className="bg-white rounded-xl p-4 border">
            <p className="font-bold mb-3">Recent Products - {filtered.length} - 4 Pic LIVE -?cc Safe</p>
            <div className="grid grid-cols-5 gap-3">
              {filtered.slice(0,20).map((p:any)=>(
                <div key={p.id} className="border rounded-xl p-2.5">
                  <img src={p.image_url} className="w-full h-[100px] object-cover rounded-lg" alt=""/>
                  <p className="text-[11px] mt-2 line-clamp-1">{p.name}</p>
                  <p className="font-bold text-[12px]">Rs. {p.price}</p>
                  <div className="flex gap-1 mt-1"><button onClick={()=>handleEdit(p)} className="flex-1 border rounded-full text-[9px] py-1">Edit</button><button onClick={()=>handleDelete(p.id)} className="flex-1 border rounded-full text-[9px] py-1">Del</button></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showAddForm&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[550px] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h3 className="font-bold">{editingProduct?'Edit':'Add'} Product - 4 Pic</h3><button onClick={()=>{setShowAddForm(false);setEditingProduct(null);}} className="w-8 h-8 bg-gray-100 rounded-full">X</button></div>
            <form onSubmit={handleSave} className="space-y-3">
              <input required placeholder="Product Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2.5"/>
              <div className="grid grid-cols-2 gap-2"><input required type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 bg-green-50 font-bold"/><input required placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 bg-yellow-50"/></div>
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-[9px]">Pic 1</p><input type="file" onChange={e=>handleImageUpload(e,'image_url')} className="w-full text-[10px]"/><input required placeholder="Pic1 URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/></div>
                <div><p className="text-[9px]">Pic 2</p><input type="file" onChange={e=>handleImageUpload(e,'image_url2')} className="w-full text-[10px]"/><input placeholder="Pic2 URL" value={form.image_url2} onChange={e=>setForm({...form,image_url2:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/></div>
                <div><p className="text-[9px]">Pic 3</p><input type="file" onChange={e=>handleImageUpload(e,'image_url3')} className="w-full text-[10px]"/><input placeholder="Pic3 URL" value={form.image_url3} onChange={e=>setForm({...form,image_url3:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/></div>
                <div><p className="text-[9px]">Pic 4</p><input type="file" onChange={e=>handleImageUpload(e,'image_url4')} className="w-full text-[10px]"/><input placeholder="Pic4 URL" value={form.image_url4} onChange={e=>setForm({...form,image_url4:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/></div>
              </div>
              <input placeholder="Detail" value={form.detail} onChange={e=>setForm({...form,detail:e.target.value})} className="w-full border rounded-lg px-3 py-2.5"/>
              <input required placeholder="Affiliate Link?cc" value={form.affiliate_link} onChange={e=>setForm({...form,affiliate_link:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 border-orange-300"/>
              <button type="submit" className="w-full bg-[#0f2e26] text-white py-3 rounded-xl font-bold">Save - 4 Pic LIVE</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
