'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminPage(){
  const [ok,setOk]=useState(false);
  const [check,setCheck]=useState(true);
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [products,setProducts]=useState<any[]>([]);
  const [form,setForm]=useState({name:'',price:'',category:'',image_url:'',affiliate_link:''});

  useEffect(()=>{supabase.auth.getSession().then(r=>{if(r.data.session){setOk(true);setEmail(r.data.session.user.email||'')} setCheck(false)})},[]);

  useEffect(()=>{if(ok){supabase.from('products').select('*').order('created_at',{ascending:false}).then(r=>{if(r.data) setProducts(r.data)})}},[ok]);

  const login=async(e:any)=>{e.preventDefault(); const {error}=await supabase.auth.signInWithPassword({email,password:pass}); if(!error) setOk(true); else alert(error.message)};
  const save=async(e:any)=>{
    e.preventDefault();
    const slug=form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Date.now();
    const {error}=await supabase.from('products').insert([{...form,price:parseFloat(form.price),slug}]);
    if(!error){alert('Product Added!'); window.location.reload()} else alert(error.message)
  };

  if(check) return <div>Loading...</div>;
  if(!ok) return <div style={{padding:20}}><h1>Al Safa Traders - Admin Login</h1><form onSubmit={login}><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /><br/><br/><input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} required /><br/><br/><button>Login</button></form></div>;

  return <div style={{padding:20}}>
    <h1>Admin - {products.length} Products</h1>
    <button onClick={async()=>{await supabase.auth.signOut(); setOk(false)}}>Logout</button>
    <hr/>
    <h2>Add Product</h2>
    <form onSubmit={save}>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /><br/>
      <input placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required /><br/>
      <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required /><br/>
      <input placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} required /><br/>
      <input placeholder="Affiliate Link" value={form.affiliate_link} onChange={e=>setForm({...form,affiliate_link:e.target.value})} required /><br/>
      <button>Add</button>
    </form>
    <hr/>
    {products.map(p=><div key={p.id}>{p.name} - Rs.{p.price} - <a href={p.affiliate_link} target="_blank">Buy</a></div>)}
  </div>
}
