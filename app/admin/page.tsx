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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const init=async()=>{
      const {data}=await supabase.auth.getSession();
      if(data.session){ setIsAuthenticated(true); setEmail(data.session.user.email||''); }
      setCheckingAuth(false);
    };
    init();
  },[]);

  useEffect(()=>{ if(isAuthenticated) fetchProducts(); },[isAuthenticated]);

  const fetchProducts=async()=>{
    setLoading(true);
    const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false}).limit(100);
    if(data) setProducts(data);
    setLoading(false);
  };

  const handleLogin=async(e:React.FormEvent)=>{
    e.preventDefault();
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(!error) setIsAuthenticated(true);
  };

  if(checkingAuth) return <div className="min-h-screen bg-[#0f2e26] text-white flex items-center justify-center">Checking...</div>;

  if(!isAuthenticated){
    return (
      <div className="min-h-screen bg-[#0f2e26] flex items-center justify-center p-4">
        <div className="bg-white rounded-[20px] p-8 w-full max-w-[400px]">
          <h1 className="text-[22px] font-bold text-center">Al Safa Traders - Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl px-4 py-3" />
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl px-4 py-3" />
            <button type="submit" className="w-full bg-[#0f2e26] text-white py-3 rounded-xl font-bold">Unlock</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9f6] p-6">
      <h1 className="text-[22px] font-bold">Dashboard - Total Products: {products.length}</h1>
      <p className="text-[12px] text-gray-500">{email} - Agar ye {products.length} show kar raha hai to data safe hai!</p>
      <div className="mt-4 bg-white rounded-xl p-4 border">
        {loading? <p>Loading...</p> : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {products.map((p:any)=>(
              <div key={p.id} className="border rounded-xl p-2.5">
                <img src={p.image_url} className="w-full h-[100px] object-cover rounded-lg bg-gray-50" alt="" />
                <p className="text-[11px] font-medium mt-2">{p.name}</p>
                <p className="text-[12px] font-bold">Rs. {p.price}</p>
                <p className="text-[10px] text-gray-500">{p.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
