"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return; }
      const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">
      <aside className={`${sidebarOpen ? 'w-[270px]' : 'w-[70px]'} bg-[#0A2218] text-white fixed h-screen flex flex-col transition-all`}>
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#C8A95B] rounded-lg flex items-center justify-center text-[#0A2218] font-bold">A</div>
          {sidebarOpen && <span className="font-bold">Al Safa Admin</span>}
        </div>
        <div className="p-4">
          <div className="bg-white/10 p-3 rounded-lg text-sm">📊 Dashboard</div>
        </div>
      </aside>

      <main className={`${sidebarOpen ? 'ml-[270px]' : 'ml-[70px]'} flex-1 p-8`}>
        <h1 className="text-3xl font-bold text-[#0A2218]">Al Safa Traders - Admin</h1>
        <p className="text-gray-500 mt-1">Display Master Settings - Total Products: {products.length}</p>
        {loading ? <p className="mt-6">Loading...</p> : (
          <div className="mt-6 bg-white rounded-xl p-6 shadow">
            {products.map((p:any,i:number)=><div key={i} className="border-b py-2 flex justify-between text-sm"><span>{p.name}</span><span>{p.price}</span></div>)}
            {products.length===0 && <p className="text-sm text-gray-500">Supabase se products load honge - ENV keys add karo Vercel me</p>}
          </div>
        )}
      </main>
    </div>
  );
}
