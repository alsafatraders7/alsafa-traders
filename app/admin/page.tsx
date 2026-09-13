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
    if(error){ alert('Supabase > Storage > New Bucket > product-images > Public ON karo'); setImageUploading(false); return; }
    const {data}=supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm(f=>({...f, image_url:data.publicUrl}));
    setImageUploading(false);
  };

  const handleFetchDaraz=async()=>{
    if(!form.affiliate_link) return alert('Pehle s.【entity-daraz¦canonical_name=Daraz】.pk?cc wala link dalo');
    setDarazFetching(true);
    try{
      const res=await fetch('/api/【entity-daraz¦canonical_name=Daraz】-price',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url:form.affiliate_link})});
      const d=await res.json();
      if(d.success && d.price){
        setForm(f=>({...f, name: d.name || f.name, price: String(d.price), image_url: d.image || f.image_url}));
        alert('【entity-Daraz¦canonical_name=Daraz】 Connected! Rs. '+d.price+' PKR Auto Aagaya - Manual bhi change kar sakte ho');
      }
      else alert('Price nahi mila - Manual Rs. likh do -?cc safe rahega');
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
      const res=await fetch('/api/【entity-daraz¦canonical_name=Daraz】-price',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url:p.affiliate_link})});
      const data=await res.json();
      if(data.success && confirm('New: Rs. '+data.price+' PKR Old: Rs.'+p.price+' Update?')){ await supabase.from('products').update({price:data.price}).eq('id',p.id); fetchProducts(); }
      else alert(data.error||'Price not found - 【entity-Daraz¦canonical_name=Daraz】 link check karo');
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
