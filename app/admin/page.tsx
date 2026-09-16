'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminPage(){
  const [isAuthenticated,setIsAuthenticated]=useState(false);
  const [checkingAuth,setCheckingAuth]=useState(true);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [products,setProducts]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAddForm,setShowAddForm]=useState(false);
  const [searchQuery,setSearchQuery]=useState('');
  const [categoriesList,setCategoriesList]=useState<any[]>([]);
  const [newCatName,setNewCatName]=useState('');
  const [editingProduct,setEditingProduct]=useState<any>(null);

  // 4 Pictures ka system
  const [form,setForm]=useState({
    name:'', price:'', category:'',
    img1:'', img2:'', img3:'', img4:'',
    affiliate_link:'', detail:'', is_best_seller:false, is_featured:false, display_theme:'default'
  });

  useEffect(()=>{const init=async()=>{const {data}=await supabase.auth.getSession();if(data.session){setIsAuthenticated(true);setEmail(data.session.user.email||'');}setCheckingAuth(false);};init();},[]);
  useEffect(()=>{if(isAuthenticated){fetchProducts();fetchCategories();}},[isAuthenticated]);

  const fetchProducts=async()=>{setLoading(true);const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false}).limit(100);if(data)setProducts(data);setLoading(false);};
  const fetchCategories=async()=>{const {data}=await supabase.from('categories').select('*').order('name');if(data)setCategoriesList(data);};

  //?cc auto lagane wala function
  const toAffiliate = (url:string) => {
    if(!url) return "";
    let base = url.split('?')[0];
    if(url.includes('daraz.pk')) return base + '?cc';
    return url.includes('?')? url + '&cc' : url + '?cc';
  }

  const handleImageUpload = async (e:any, key:string) => {
    const file = e.target.files[0]; if(!file) return;
    const fileName = `${Date.now()}-${file.name}`;
    const {error} = await supabase.storage.from('product-images').upload(fileName, file);
    if(error){ alert('Storage Bucket Public karo: product-images'); return; }
    const {data} = supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm(f=>({...f, [key]: data.publicUrl}));
  }

  const addCategory=async()=>{if(!newCatName.trim())return;const slug=newCatName.toLowerCase().replace(/[^a-z0-9]+/g,'-');await supabase.from('categories').insert([{name:newCatName.trim(),slug}]);setNewCatName('');fetchCategories();};

  const handleLogin=async(e:any)=>{e.preventDefault();const {error}=await supabase.auth.signInWithPassword({email,password});if(!error) setIsAuthenticated(true);};

  const handleSave=async(e:any)=>{
    e.preventDefault();
    const aff = toAffiliate(form.affiliate_link);
    const payload={
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      image_url: form.img1,
      image: form.img1,
      affiliate_link: aff,
      daraz_link: aff,
      description: `${form.detail} || IMG2:${form.img2} || IMG3:${form.img3} || IMG4:${form.img4}`,
      is_best_seller: form.is_best_seller,
      is_featured: form.is_featured,
      display_theme: form.display_theme,
      is_active: true
    };
    if(editingProduct){ await supabase.from('products').update(payload).eq('id',editingProduct.id); }
    else{ const slug=form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Date.now(); await supabase.from('products').insert([{...payload, slug}]); }
    setShowAddForm(false); setEditingProduct(null);
    setForm({name:'',price:'',category:'',img1:'',img2:'',img3:'',img4:'',affiliate_link:'',detail:'',is_best_seller:false,is_featured:false,display_theme:'default'});
    fetchProducts();
  };

  const handleEdit=(p:any)=>{
    const parts = (p.description||'').split('||');
    setEditingProduct(p);
    setForm({
      name:p.name, price:String(p.price), category:p.category,
      img1:p.image_url,
      img2: parts[1]?.replace('IMG2:','')||'',
      img3: parts[2]?.replace('IMG3:','')||'',
      img4: parts[3]?.replace('IMG4:','')||'',
      affiliate_link:p.affiliate_link, detail:parts[0]||'',
      is_best_seller:p.is_best_seller, is_featured:p.is_featured, display_theme:p.display_theme||'default'
    });
    setShowAddForm(true);
  }

  if(checkingAuth) return <div className="min-h-screen bg-[#0f2e26] text-white flex items-center justify-center">Checking...</div>;
  if(!isAuthenticated){ return(<div className="min-h-screen bg-[#0f2e26] flex items-center justify-center p-4"><div className="bg-white rounded-[20px] p-8 w-full max-w-[400px]"><h1 className="text-[22px] font-bold text-center">Al Safa Traders - Locked</h1><form onSubmit={handleLogin} className="space-y-4 mt-4"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl px-4 py-3"/><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl px-4 py-3"/><button type="submit" className="w-full bg-[#0f2e26] text-white py-3 rounded-xl font-bold">Unlock - Price LIVE</button></form></div></div>); }

  const filtered = products.filter((p:any)=>p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return(
    <div className="min-h-screen bg-[#f8f9f6] flex">
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4"><h1 className="font-bold text-[18px]">Al Safa - {products.length} Products - Price LIVE ✅</h1><button onClick={()=>setShowAddForm(true)} className="bg-[#0f2e26] text-white px-5 py-2.5 rounded-xl font-bold">+ Product Add - 4 Pic + Link</button></div>

        <div className="bg-white p-4 rounded-xl border mb-4 flex gap-2"><input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Nayi Category Likho - Jaise Electronics" className="flex-1 border rounded-lg px-3 py-2"/><button onClick={addCategory} className="bg-black text-white px-4 rounded-lg">+ Category Add</button></div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {filtered.map((p:any)=>(<div key={p.id} className="bg-white border rounded-xl p-2"><img src={p.image_url} className="w-full h-[120px] object-cover rounded-lg"/><p className="text-[12px] font-bold mt-1 line-clamp-1">{p.name}</p><p className="text-[11px]">{p.category}</p><p className="font-bold">Rs. {p.price} - LIVE</p><div className="flex gap-1 mt-1"><button onClick={()=>handleEdit(p)} className="flex-1 border rounded-full text-[10px] py-1">Edit</button><button onClick={async()=>{if(confirm('Delete?')){await supabase.from('products').delete().eq('id',p.id);fetchProducts();}}} className="flex-1 border rounded-full text-[10px] py-1">Del</button></div></div>))}
        </div>
      </div>

      {showAddForm&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-[550px] p-6">
            <h3 className="font-bold mb-3">Add Product - Category Select - 4 Pic - Link?cc Auto - Price LIVE</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <select required value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="w-full border rounded-lg px-3 py-3 bg-yellow-50 font-bold"><option value="">Category Select Karo</option>{categoriesList.map((c:any)=><option key={c.slug} value={c.name}>{c.name}</option>)}<option value="Kitchen">Kitchen</option><option value="Bartan">Bartan</option><option value="Storage & Organizers">Storage & Organizers</option><option value="Cleaning">Cleaning</option><option value="Home Essentials">Home Essentials</option></select>
              <input required placeholder="Product Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2.5"/>
              <div className="grid grid-cols-2 gap-2"><input required type="number" placeholder="Price Rs. LIVE" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 bg-green-50 font-bold"/><input placeholder="Detail / Type" value={form.detail} onChange={e=>setForm({...form,detail:e.target.value})} className="w-full border rounded-lg px-3 py-2.5"/></div>
              <input required placeholder="Daraz Link Paste Karo - Auto?cc lagega - Profit aap ko" value={form.affiliate_link} onChange={e=>setForm({...form,affiliate_link:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 border-orange-400"/>

              {/* 4 Pictures */}
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded-lg p-2"><p className="text-[10px] font-bold">Pic 1 - Main - Gallery Se</p><input type="file" accept="image/*" onChange={e=>handleImageUpload(e,'img1')} className="text-[10px] w-full"/><input placeholder="Pic 1 URL" value={form.img1} onChange={e=>setForm({...form,img1:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/>{form.img1&&<img src={form.img1} className="w-full h-16 object-cover rounded mt-1"/>}</div>
                <div className="border rounded-lg p-2"><p className="text-[10px] font-bold">Pic 2 - Gallery Se</p><input type="file" accept="image/*" onChange={e=>handleImageUpload(e,'img2')} className="text-[10px] w-full"/><input placeholder="Pic 2 URL" value={form.img2} onChange={e=>setForm({...form,img2:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/>{form.img2&&<img src={form.img2} className="w-full h-16 object-cover rounded mt-1"/>}</div>
                <div className="border rounded-lg p-2"><p className="text-[10px] font-bold">Pic 3 - Gallery Se</p><input type="file" accept="image/*" onChange={e=>handleImageUpload(e,'img3')} className="text-[10px] w-full"/><input placeholder="Pic 3 URL" value={form.img3} onChange={e=>setForm({...form,img3:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/>{form.img3&&<img src={form.img3} className="w-full h-16 object-cover rounded mt-1"/>}</div>
                <div className="border rounded-lg p-2"><p className="text-[10px] font-bold">Pic 4 - Gallery Se</p><input type="file" accept="image/*" onChange={e=>handleImageUpload(e,'img4')} className="text-[10px] w-full"/><input placeholder="Pic 4 URL" value={form.img4} onChange={e=>setForm({...form,img4:e.target.value})} className="w-full border rounded px-2 py-1 mt-1 text-[11px]"/>{form.img4&&<img src={form.img4} className="w-full h-16 object-cover rounded mt-1"/>}</div>
              </div>

              <button type="submit" className="w-full bg-[#0f2e26] text-white py-3 rounded-xl font-bold">SAVE - Price LIVE - 4 Pic -?cc Connected</button>
              <button type="button" onClick={()=>setShowAddForm(false)} className="w-full border py-2 rounded-xl">Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
