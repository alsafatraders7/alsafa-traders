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
  const [updatingId,setUpdatingId]=useState<string|null>(null);
  const [editingProduct,setEditingProduct]=useState<any>(null);
  const [categoriesList,setCategoriesList]=useState<any[]>([]);
  const [activeTab,setActiveTab]=useState<'dashboard'|'buttons'>('dashboard');
  const [newCatName,setNewCatName]=useState('');
  const [imageUploading,setImageUploading]=useState(false);
  const [darazFetching,setDarazFetching]=useState(false);

  const emptyForm = {name:'',price:'',category:'',image_url:'',image_url2:'',image_url3:'',image_url4:'',detail:'',affiliate_link:'',fomo_text:'Only 5 Left!',fake_views:'128',fake_sold:'45',timer_hours:'2',bundle_text:'Buy 2 Get 10% OFF',is_best_seller:false,is_featured:false,is_active:true,display_theme:'default'};
  const [form, setForm] = useState(emptyForm);

  useEffect(()=>{
    const init=async()=>{
      const {data}=await supabase.auth.getSession();
      if(data.session){setIsAuthenticated(true);setEmail(data.session.user.email||'');}
      setCheckingAuth(false);
    };
    init();
    const {data:lis}=supabase.auth.onAuthStateChange((_e, session)=>{
      if(session){setIsAuthenticated(true);setEmail(session.user.email||'');}
      else{setIsAuthenticated(false);}
      setCheckingAuth(false);
    });
    return ()=>{lis.subscription.unsubscribe();};
  },[]);

  useEffect(()=>{if(isAuthenticated){fetchProducts();fetchCategories();}},[isAuthenticated]);

  const fetchProducts=async()=>{setLoading(true);const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false}).limit(100);if(data)setProducts(data);setLoading(false);};
  const fetchCategories=async()=>{const {data}=await supabase.from('categories').select('*').order('name');if(data)setCategoriesList(data);};

  const handleImageUpload=async(e:any, key='image_url')=>{
    const file=e.target.files[0]; if(!file) return; setImageUploading(true);
    const fileName=`${Date.now()}-${file.name}`.replace(/\s+/g,'-');
    const {error}=await supabase.storage.from('product-images').upload(fileName,file);
    if(error){alert('Storage Public ON karo: '+error.message);setImageUploading(false);return;}
    const {data}=supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm((f:any)=>({...f,[key]:data.publicUrl}));
    setImageUploading(false);
  };

  const handleFetchDaraz=async()=>{
    if(!form.affiliate_link) return alert('Pehle s.daraz.pk?cc wala link dalo');
    setDarazFetching(true);
    try{
      const res=await fetch('/api/daraz-price',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:form.affiliate_link})});
      const d=await res.json();
      if(d.success && d.price){
        setForm(f=>({...f,name:d.name||f.name,price:String(d.price),image_url:d.image||f.image_url}));
        alert('Daraz Connected! Rs.'+d.price);
      }else alert('Manual Rs likh do -?cc safe');
    }catch{alert('Error - Manual price likh do');}
    setDarazFetching(false);
  };

  const addCategory=async()=>{if(!newCatName.trim())return;const slug=newCatName.toLowerCase().replace(/[^a-z0-9]+/g,'-');await supabase.from('categories').insert([{name:newCatName.trim(),slug}]);await supabase.from('nav_buttons').insert([{label:newCatName.trim(),slug,type:'category',active:true,order_index:0}]);setNewCatName('');fetchCategories();};
  const deleteCategory=async(slug:string)=>{if(!confirm('Delete?'))return;await supabase.from('categories').delete().eq('slug',slug);await supabase.from('nav_buttons').delete().eq('slug',slug);fetchCategories();};
  const handleLogin=async(e:any)=>{e.preventDefault();setAuthLoading(true);setAuthError('');const {error}=await supabase.auth.signInWithPassword({email,password});if(error)setAuthError(error.message);setAuthLoading(false);};

  const handleSave=async(e:any)=>{
    e.preventDefault();
    const toCC=(u:string)=>{ if(!u) return ''; try{ return u.split('?')[0].split('&')[0]+'?cc'; }catch{ return u; } };
    const extraDesc = `${form.detail} || IMG2:${form.image_url2} || IMG3:${form.image_url3} || IMG4:${form.image_url4} || FOMO:${form.fomo_text} || FAKE:${form.fake_views}|${form.fake_sold} || TIMER:${form.timer_hours} || BUNDLE:${form.bundle_text}`;
    const payload={name:form.name,price:parseFloat(form.price),category:form.category,image_url:form.image_url,affiliate_link:toCC(form.affiliate_link),description:extraDesc,is_best_seller:form.is_best_seller,is_featured:form.is_featured,is_active:true,display_theme:form.display_theme};
    if(editingProduct){await supabase.from('products').update(payload).eq('id',editingProduct.id);}
    else{const slug=form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Date.now();await supabase.from('products').insert([{...payload,slug}]);}
    setShowAddForm(false);setEditingProduct(null);setForm(emptyForm);fetchProducts();
  };

  const handleEdit=(p:any)=>{
    setEditingProduct(p);
    const d=p.description||'';
    const get=(k:string)=>{const m=d.match(new RegExp(k+':([^|]+)'));return m?m[1].trim():'';};
    const detailOnly=d.split('||')[0]||'';
    setForm({
      name:p.name,price:String(p.price),category:p.category,image_url:p.image_url||'',image_url2:get('IMG2'),image_url3:get('IMG3'),image_url4:get('IMG4'),detail:detailOnly,affiliate_link:p.affiliate_link||'',fomo_text:get('FOMO')||'Only 5 Left!',fake_views:get('FAKE')?.split('|')[0]||'128',fake_sold:get('FAKE')?.split('|')[1]||'45',timer_hours:get('TIMER')||'2',bundle_text:get('BUNDLE')||'Buy 2 Get 10% OFF',is_best_seller:p.is_best_seller,is_featured:p.is_featured,is_active:true,display_theme:p.display_theme||'default'
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
      else alert(data.error||'Not found');
    }catch(e:any){alert(e.message);}
    setUpdatingId(null);
  };

  const filtered=products.filter((p:any)=>p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const categories=Array.from(new Set(products.map((p:any)=>p.category))) as string[];
  const bestSellers=products.filter((p:any)=>p.is_best_seller);
  const featured=products.filter((p:any)=>p.is_featured);

  if(checkingAuth) return <div className="min-h-screen bg-[#0f2e26] text-white flex items-center justify-center">Checking...</div>;
  if(!isAuthenticated){return(<div className="min-h-screen bg-[#0f2e26] flex items-center justify-center p-4"><div className="bg-white rounded-[20px] p-8 w-full max-w-[400px]"><h1 className="text-[22px] font-bold text-center">Al Safa Traders</h1><p className="text-[11px] text-center text-gray-500 mb-4">Admin Panel Locked</p><form onSubmit={handleLogin} className="space-y-4"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl px-4 py-3"/><div className="relative"><input type={showPassword?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl px-4 py-3"/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-2 top-2 bg-gray-100 px-3 py-1 rounded-full text-xs">{showPassword?'Hide':'Show'}</button></div>{authError&&<p className="text-red-600 text-xs bg-red-50 p-2 rounded">{authError}</p>}<button type="submit" className="w-full bg-[#0f2e26] text-white py-3 rounded-xl font-bold">{authLoading?'Unlocking...':'Unlock'}</button></form></div></div>);}

  return(
    <div className="min-h-screen bg-[#f8f9f6] flex text-[13px]">
      <div className="w-[260px] bg-[#0f2e26] text-white hidden lg:flex flex-col fixed h-screen">
        <div className="p-5 flex items-center gap-3"><div className="w-10 h-10 bg-[#d4a15a] rounded-lg flex items-center justify-center font-bold">AT</div><div><p className="font-bold text-[#f0d9a0]">Al Safa Traders</p><p className="text-[10px] text-gray-400">Quality Products - {form.display_theme}</p></div></div>
        <div className="px-3 space-y-0.5 flex-1 overflow-y-auto">
          <div className="bg-[#c49a4b] text-black px-4 py-2.5 rounded-lg font-semibold">Dashboard - {products.length}</div>
