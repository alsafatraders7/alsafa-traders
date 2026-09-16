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
  const [products,setProducts]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAddForm,setShowAddForm]=useState(false);
  const [searchQuery,setSearchQuery]=useState('');
  const [editingProduct,setEditingProduct]=useState<any>(null);
  const [categoriesList,setCategoriesList]=useState<any[]>([]);
  const [activeTab,setActiveTab]=useState<'dashboard'|'buttons'>('dashboard');
  const [newCatName,setNewCatName]=useState('');
  const [imageUploading,setImageUploading]=useState(false);
  const [form,setForm]=useState({
    name:'',price:'',category:'',
    image_url:'',image_url2:'',image_url3:'',image_url4:'',
    detail:'',affiliate_link:'',
    is_best_seller:false,is_featured:false,
    is_active:true,display_theme:'default'
  });

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
  },[]);

  useEffect(()=>{
    if(isAuthenticated){
      fetchProducts();
      fetchCategories();
    }
  },[isAuthenticated]);

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

  const toCC = (url:string) => {
    if(!url) return '';
    try { return url
