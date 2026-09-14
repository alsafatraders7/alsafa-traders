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
  // UPDATE - 3 BOX ADD
  const [form,setForm]=useState({name:'',price:'',original_price:'',sale_price:'',category:'',image_url:'',image_urls:[] as string[],affiliate_link:'',is_best_seller:false,is_featured:false,is_active:true,display_theme:'default'});

  useEffect(()=>{
    const init=async()=>{
      const {data}=await supabase.auth.getSession();
      if(data.session){setIsAuthenticated(true);setEmail(data.session.user.email||'');}
      setCheckingAuth(false);
    };
    init();
    const {data:lis}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(session){setIsAuthenticated(true);setEmail(session.user?.email||'');}
      else{setIsAuthenticated(false);}
    });
    return()=>{lis.subscription.unsubscribe();};
  },[]);

  useEffect(()=>{if(isAuthenticated){fetchProducts();fetchCategories();}},[isAuthenticated]);

  const fetchProducts=async()=>{setLoading(true);const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false}).limit(100);if(data)setProducts(data);setLoading(false);};
  const fetchCategories=async()=>{const {data}=await supabase.from('categories').select('*').order('name');if(data)setCategoriesList(data);};

  const handleImageUpload=async(e:any)=>{
    const files=e.target.files; if(!files||files.length===0) return;
    setImageUploading(true);
    try{
      let urls=[...form.image_urls];
      for(let i=0;i<files.length && urls.length<4;i++){
        const fileName=`${Date.now()}-${files[i].name.replace(/[^a-z0-9.]/gi,'-')}`;
        const {error}=await supabase.storage.from('product-images').upload(fileName,files[i]);
        if(!error){
          const {data}=supabase.storage.from('product-images').getPublicUrl(fileName);
          urls.push(data.publicUrl);
        }
      }
      setForm(f=>({...f,image_url:urls[0]||f.image_url,image_urls:urls.slice(0,4)}));
    }catch{}
    setImageUploading(false);
  };

  const handleFetchDaraz=async()=>{
    if(!form.affiliate_link) return alert('Pehle s.daraz.pk?cc wala link dalo');
    setDarazFetching(true);
    try{
      const res=await fetch('/api/daraz-price',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:form.affiliate_link})});
      const d=await res.json();
      if(d.success && d.price){
        setForm(f=>({...f,name:d.name||f.name,price:String(d.price),sale_price:String(d.price),original_price:String(Number(d.price)+500),image_url:d.image||f.image_url}));
        alert('Daraz Connected! Rs.'+d.price);
      }else alert('Manual Rs likh do -?cc safe');
    }catch{alert('Error - Manual price likh do');}
    setDarazFetching(false);
  };
