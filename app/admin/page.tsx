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
  const [form,setForm]=useState({name:'',price:'',original_price:'',sale_price:'',category:'',image_url:'',image_urls:[] as string[],affiliate_link:'',is_best_seller:false,is_featured:false,is_active:true,display_theme:'default'});

  useEffect(()=>{
    const init=async()=>{
      const {data}=await supabase.auth.getSession();
      if(data.session){
        setIsAuthenticated(true);
        setEmail(data.session.user.email||'');
      }
      setCheckingAuth(false);
    };
    init();
    const {data:listener}=supabase.auth.onAuthStateChange((_e,session)=>{
      if(session){
        setIsAuthenticated(true);
        setEmail(session.user.email||'');
      }else{
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    });
    return ()=>{listener.subscription.unsubscribe();};
  },[]);
  useEffect(()=>{if(isAuthenticated){fetchProducts();fetchCategories();}},[isAuthenticated]);

  const fetchProducts=async()=>{setLoading(true);const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false}).limit(100);if(data)setProducts(data);setLoading(false);};
  const fetchCategories=async()=>{const {data}=await supabase.from('categories').select('*').order('name');if(data)setCategoriesList(data);};

  const handleImageUpload=async(e:any)=>{
    const file=e.target.files[0]; if(!file) return; setImageUploading(true);
    const fileName=`${Date.now()}-${file.name}`;
    const {error}=await supabase.storage.from('product-images').upload(fileName,file);
    if(error){alert('Storage Public ON karo: '+error.message);setImageUploading(false);return;}
    const {data}=supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm(f=>{
      const newUrls = f.image_urls && f.image_urls.length>0? [...f.image_urls, data.publicUrl] : [data.publicUrl];
      return {...f,image_url:f.image_url || data.publicUrl, image_urls: newUrls.slice(0,4)};
    });
    setImageUploading(false);
  };

  const handleMultiImageUpload=async(e:any)=>{
    const files=e.target.files; if(!files) return; setImageUploading(true);
    let newUrls:string[] = [...(form.image_urls||[])];
    for(let i=0;i<files.length && newUrls.length<4;i++){
      const file=files[i];
      const fileName=`${Date.now()}-${i}-${file.name}`;
      const {error}=await supabase.storage.from('product-images').upload(fileName,file);
      if(!error){
        const {data}=supabase.storage.from('product-images').getPublicUrl(fileName);
        newUrls.push(data.publicUrl);
      }
    }
    setForm(f=>({...f, image_url: f.image_url || newUrls[0] || '', image_urls: newUrls.slice(0,4)}));
    setImageUploading(false);
  };

  const handleFetchDaraz=async()=>{
    if(!form.affiliate_link) return alert('Pehle s.daraz.pk?cc wala link dalo');
    setDarazFetching(true);
    try{
      const res=await fetch('/api/daraz-price',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:form.affiliate_link})});
      const d=await res.json();
      if(d.success && d.price){
        setForm(f=>({...f,name:d.name||f.name,price:String(d.price),sale_price:String(d.price),image_url:d.image||f.image_url}));
        alert('Daraz Connected! Rs.'+d.price);
      }else alert('Manual Rs likh do -?cc safe');
    }catch{alert('Error - Manual price likh do');}
    setDarazFetching(false);
  };

  const addCategory=async()=>{if(!newCatName.trim())return;const slug=newCatName.toLowerCase().replace(/[^a-z0-9]+/g,'-');await supabase.from('categories').insert([{name:newCatName.trim(),slug}]);await supabase.from('nav_buttons').insert([{label:newCatName.trim(),slug,type:'category',active:true,order_index:0}]);setNewCatName('');fetchCategories();};
  const deleteCategory=async(slug:string)=>{if(!confirm('Delete?'))return;await supabase.from('categories').delete().eq('slug',slug);await supabase.from('nav_buttons').delete().eq('slug',slug);fetchCategories();};

  const handleLogin=async(e:any)=>{e.preventDefault();setAuthLoading(true);setAuthError('');const {error}=await supabase.auth.signInWithPassword({email,password});if(error){setAuthError(error.message);setAuthLoading(false);}else{setIsAuthenticated(true);setAuthLoading(false);}};

  const handleSave=async(e:any)=>{
    e.preventDefault();
    const finalPrice = form.sale_price? parseFloat(form.sale_price) : parseFloat(form.price);
    const payload={name:form.name,price:finalPrice,original_price: form.original_price? parseFloat(form.original_price) : finalPrice + 500, sale_price: finalPrice, category:form.category,image_url:form.image_url,image_urls: form.image_urls && form.image_urls.length>0? form.image_urls : [form.image_url],affiliate_link:form.affiliate_link,is_best_seller:form.is_best_seller,is_featured:form.is_featured,is_active:true,display_theme:form.display_theme};
    if(editingProduct){await supabase.from('products').update(payload).eq('id',editingProduct.id);}
    else{const slug=form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Date.now();await supabase.from('products').insert([{...payload,slug}]);}
    setShowAddForm(false);setEditingProduct(null);setForm({name:'',price:'',original_price:'',sale_price:'',category:'',image_url:'',image_urls:[],affiliate_link:'',is_best_seller:false,is_featured:false,is_active:true,display_theme:'default'});fetchProducts();
  };

  const handleEdit=(p:any)=>{
    setEditingProduct(p);
    setForm({
      name:p.name,
      price:String(p.price),
      original_price: p.original_price? String(p.original_price) : String(p.price+500),
      sale_price: p.sale_price? String(p.sale_price) : String(p.price),
      category:p.category,
      image_url:p.image_url,
      image_urls: p.image_urls || (p.image_url? [p.image_url] : []),
      affiliate_link:p.affiliate_link,
      is_best_seller:p.is_best_seller||false,
      is_featured:p.is_featured||false,
