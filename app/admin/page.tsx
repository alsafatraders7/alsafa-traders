"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function AdminPanelDisplayMaster() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("Last 7 Days");
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return; }
      try {
        const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false }).limit(10);
        if (!error && data) {
          setProducts(data);
          setIsLive(true);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const totalProducts = products.length;
  const categories = [...new Set(products.map((p: any) => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-[#0A2218]">
      <aside className={`${sidebarOpen? 'w-[260px]' : 'w-[70px]'} bg-[#0A2218] text-white fixed h-screen z-40 flex flex-col transition-all duration-300 overflow-y-auto`}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3 sticky top-0 bg-[#0A2218]">
          <div className="w-9 h-9 bg-[#C8A95B] rounded-lg flex items-center justify-center text-[#0A2218] font-bold shrink-0">A</div>
          {sidebarOpen && <div><p className="font-bold text-[15px] leading-none">Al Safa Traders</p><p className="text-[10px] text-white/60">Quality Products - Better Living</p></div>}
        </div>
        <nav className="p-3 space-y-1 mt-2">
          {[
            { icon: "🏠", label: "Dashboard", active: true },
            { icon: "📦", label: "Products" },
            { icon: "🗂️", label: "Categories" },
            { icon: "🛒", label: "Orders" },
            { icon: "📈", label: "Sales" },
            { icon: "📊", label: "Analytics" },
            { icon: "🌐", label: "Website Settings" },
            { icon: "🔗", label: "【entity-Daraz¦canonical_name=Daraz】 Affiliate Links" },
            { icon: "🖼️", label: "Product Images & Details" },
            { icon: "📝", label: "Captions" },
            { icon: "👥", label: "Customer Management" },
          ].map((m, i) => (
            <div key={i} className={`${m.active? 'bg-[#C8A95B] text-[#0A2218] font-semibold' : 'text-white/70 hover:bg-white/10'} px-3 py-2.5 rounded-lg text-[13px] flex items-center gap-3 cursor-pointer`}>
              <span className="text-[16px] w-5 text-center">{m.icon}</span>{sidebarOpen && m.label}
            </div>
          ))}
          <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
            {[
              { icon: "🛡️", label: "Admin Account" },
              { icon: "🔑", label: "Change Password" },
              { icon: "❓", label: "Help & Support" },
              { icon: "🚪", label: "Logout" },
            ].map((m, i) => (
              <div key={i} className="text-white/70 hover:bg-white/10 px-3 py-2.5 rounded-lg text-[13px] flex items-center gap-3 cursor-pointer">
                <span className="w-5 text-center">{m.icon}</span>{sidebarOpen && m.label}
              </div>
            ))}
          </div>
        </nav>
      </aside>

      <main className={`${sidebarOpen? 'ml-[260px]' : 'ml-[70px]'} flex-1 min-h-screen transition-all`}>
        <div className="bg-white border-b sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">☰</button>
            <div className="relative hidden md:block">
              <input placeholder="Search products, categories..." className="bg-[#F4F5F7] rounded-full pl-9 pr-4 py-2 text-sm w-[280px] focus:outline-none" />
              <span className="absolute left-3 top-2.5 text-sm">🔍</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="relative text-xl">🔔</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0A2218] rounded-full text-white flex items-center justify-center font-bold text-xs">A</div>
              <div className="hidden md:block leading-none"><p className="text-sm font-bold">Admin</p><p className="text-[10px] text-gray-500">Super Admin</p></div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-8 bg-gradient-to-r from-[#FFF7E6] to-[#FFF] rounded-2xl p-5 md:p-6 flex justify-between items-center border">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Welcome Back, Admin!</h1>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Manage your products, categories, orders and keep your website updated from here.</p>
                <div className="flex gap-2 mt-4">
                  <a href="/" target="_blank" className="bg-[#0A2218] text-white px-4 py-2 rounded-lg text-xs">View Public Website</a>
                  <span className="bg-[#C8A95B] text-[#0A2218] px-4 py-2 rounded-lg text-xs">Admin Dashboard</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-3">https://alsafatraders.pk</p>
              </div>
            </div>
            <div className="md:col-span-2 bg-white rounded-2xl p-4 border">
              <p className="text-xs font-bold">Website Status</p>
              <p className={`text-xs mt-2 font-semibold ${isLive? 'text-green-600' : 'text-gray-400'}`}>● {isLive? 'Live' : 'Not available'}</p>
              <p className="text-[11px] text-gray-500 mt-1">{isLive? 'Your website is live and running smoothly.' : 'Connect Supabase to go live.'}</p>
            </div>
            <div className="md:col-span-2 bg-white rounded-2xl p-4 border">
              <p className="text-xs font-bold">Admin Account</p>
              <p className="text-[11px] text-gray-500 mt-1">Manage your profile & settings</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border"><p className="text-[11px] text-gray-500">Total Products</p><p className="text-xl font-bold">{loading? '--' : totalProducts}</p><p className="text-[10px] text-green-600">● {isLive? 'Published' : 'Not available'}</p></div>
            <div className="bg-white rounded-2xl p-4
