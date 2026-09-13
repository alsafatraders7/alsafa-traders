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
  // --- NEW FEATURES - ADD KIYE - KUCH CUT NAHI - Jaisa Hai Waisa ---
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [navButtons, setNavButtons] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard'|'buttons'>('dashboard');
  const [imageUploading, setImageUploading] = useState(false);
  const [darazFetching, setDarazFetching] = useState(false);
  const [form, setForm] = useState({
    name:'',
    price:'',
    category:'',
    image_url:'',
    affiliate_link:'',
    is_best_seller:false,
    is_featured:false,
    is_active:true,
    display_theme:'default'
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

  useEffect(()=>{ if(isAuthenticated){ fetchProducts(); fetchCategoriesAndButtons(); } },[isAuthenticated]);

  const fetchProducts=async()=>{
    setLoading(true);
    const {data, error}=await supabase.from('products').select('*').order('created_at',{ascending:false}).limit(100);
    if(data) setProducts(data);
    if(error) console.log(error);
    setLoading(false);
  };

  const fetchCategoriesAndButtons=async()=>{
    const {data: cats} = await supabase.from('categories').select('*').order('name');
    if(cats) setCategoriesList(cats);
    else {
      const unique = Array.from(new Set(products.map((p:any)=>p.category).filter(Boolean)));
      setCategoriesList(unique.map((n:any)=>({name:n, slug:n.toLowerCase()})));
    }
    const {data: btns} = await supabase.from('nav_buttons').select('*').order('order_index');
    if(btns) setNavButtons(btns);
  };

  const handleImageUpload=async(e:any)=>{
    const file=e.target.files[0];
    if(!file) return;
    setImageUploading(true);
    const fileName=`${Date.now()}-${file.name}`;
    const {error} = await supabase.storage.from('product-images').upload(fileName, file);
    if(error){ alert('Supabase me Bucket banao: product-images (Public) - '+error.message); setImageUploading(false); return; }
    const {data}=supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm(f=>({...f, image_url: data.publicUrl}));
    setImageUploading(false);
  };

  const handleFetchDaraz=async()=>{
    if(!form.affiliate_link) return alert('Pehle Affiliate Link Daalo! s.daraz.pk wala?cc ke saath');
    setDarazFetching(true);
    try{
      const res=await fetch('/api/daraz-price',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url: form.affiliate_link})});
      const data=await res.json();
      if(data.success){
        setForm(f=>({...f, name: data.name || f.name, price: data.price? String(data.price) : f.price, image_url: data.image || f.image_url}));
        alert('Daraz se mil gaya! Name/Price auto fill - Affiliate?cc safe hai!');
      } else {
        alert(data.error||'Daraz se data nahi mila - Manual fill karo,?cc safe rahega');
      }
    }catch(e:any){ alert('Fetch error: '+e.message); }
    setDarazFetching(false);
  };

  const addCategory=async()=>{
    if(!newCatName.trim()) return;
    const slug=newCatName.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    const {error} = await supabase.from('categories').insert([{name:newCatName.trim(), slug}]);
    if(error){
      setCategoriesList(prev=>[...prev, {name:newCatName.trim(), slug}]);
    } else {
      await supabase.from('nav_buttons').insert([{label:newCatName.trim(), slug, type:'category', active:true, order_index: navButtons.length}]);
      fetchCategoriesAndButtons();
    }
    setNewCatName('');
    alert(`Category ${newCatName} add! Public page pe button auto ayega!`);
  };
  const deleteCategory=async(slug:string, name:string)=>{
    if(!confirm(`${name} delete? Public page se button hat jayega!`)) return;
    await supabase.from('categories').delete().eq('slug', slug);
    await supabase.from('nav_buttons').delete().eq('slug', slug);
    fetchCategoriesAndButtons();
  };

  const handleLogin=async(e:React.FormEvent)=>{
    e.preventDefault();
    setAuthLoading(true); setAuthError('');
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error){ setAuthError(error.message); setAuthLoading(false); }
    else { setIsAuthenticated(true);
