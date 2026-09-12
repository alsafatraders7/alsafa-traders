"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey)? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', category: 'Kitchen', image: '', daraz_link: '' });

  async function load() {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) { setProducts(data); setIsLive(true); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function addProduct() {
    if (!form.name ||!form.price) return alert('Name & Price likho!');
    if (!supabase) return alert('ENV keys add karo');
    const { error } = await supabase.from('products').insert([form]);
    if (error) alert(error.message); else { alert('Product Added!'); setForm({ name: '', price: '', category: 'Kitchen', image: '', daraz_link: '' }); load(); }
  }
  async function del(id:any) { if (!supabase) return; await supabase.from('products').delete().eq('id', id); load(); }

  const menu = [
    "Dashboard","Products","Categories","Orders","Sales","Analytics","Website Settings","【entity-Daraz¦canonical_name=Daraz】 Affiliate Links","Product Images & Details","Captions","Customer Management","Admin Account","Change Password","Help & Support"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex text-black">
      <aside className={`${sidebarOpen? 'w-64' : 'w-16'} bg-[#0A2218] text-white fixed h-screen z-40 flex flex-col transition-all overflow-y-auto`}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-600 rounded-lg flex items-center justify-center font-bold text-black">A</div>
          {sidebarOpen && <div><p className="font-bold text-sm">Al Safa Traders</p><p className="text-xs opacity-60">Admin Panel</p></div>}
        </div>
        <nav className="p-2 space-y-1 text-sm">
          {menu.map(m => (
            <div key={m} onClick={() => setActive(m)} className={`px-3 py-2.5 rounded-lg cursor-pointer ${active===m? 'bg-yellow-600 text-black font-bold' : 'opacity-70 hover:bg-white/10'}`}>{sidebarOpen? m : m[0]}</div>
          ))}
          <div onClick={() => setActive("Logout")} className="px-3 py-2.5 rounded-lg cursor-pointer opacity-70 hover:bg-white/10">Logout</div>
        </nav>
      </aside>

      <main className={`${sidebarOpen? 'ml-64' : 'ml-16'} flex-1`}>
        <div className="bg-white border-b sticky top-0 z-30 flex justify-between items-center px-6 py-3">
          <div className="flex gap-3 items-center"><button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-gray-100 rounded">Menu</button><p className="font-bold">{active}</p></div>
          <div className="text-xs">alsafatraders.pk - {isLive? 'Live' : 'Not available'}</div>
        </div>

        <div className="p-6">
          {active==="Dashboard" && (
            <>
              <div className="bg-white rounded-2xl p-6 border mb-6"><h1 className="text-2xl font-bold">Welcome Back, Admin!</h1><p className="text-sm text-gray-600">Total Products: {products.length} - View Public Website - Admin Dashboard</p><p className="text-xs text-gray-500 mt-2">Website URL: https://alsafatraders.pk | Status: {isLive? 'Live' : 'Not available'}</p></div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl border"><p className="text-xs">Total Products</p><p className="text-xl font-bold">{products.length}</p></div>
                <div className="bg-white p-4 rounded-2xl border"><p className="text-xs">Categories</p><p className="text-xl font-bold">{[...new Set(products.map((p:any)=>p.category))].length}</p></div>
                <div className="bg-white p-4 rounded-2xl border"><p className="text-xs">Total Clicks</p><p className="text-xl font-bold">0</p><p className="text-xs text-gray-500">Real Daraz data</p></div>
                <div className="bg-white p-4 rounded-2xl border"><p className="text-xs">Commission</p><p className="text-xl font-bold">Rs. 0</p><p className="text-xs text-gray-500">No fake numbers</p></div>
              </div>
              <div className="bg-white p-5 rounded-2xl border"><p className="font-bold text-sm">Recent Products</p>{products.length===0?<p className="text-xs text-gray-500 mt-3">No products - Products tab se add karo</p>:<div className="grid grid-cols-5 gap-3 mt-3">{products.slice(0,5).map((p:any,i:number)=><div key={i} className="border p-2 rounded"><p className="text-xs font-bold truncate">{p.name}</p><p className="text-xs">Rs.{p.price}</p></div>)}</div>}</div>
            </>
          )}

          {active==="Products" && (
            <div className="bg-white rounded-2xl p-6 border">
              <h2 className="font-bold mb-4">Products Management - Add / Delete</h2>
              <div className="grid grid-cols-5 gap-2 mb-4">
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="border p-2 rounded text-sm"/>
                <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price" className="border p-2 rounded text-sm"/>
                <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category Kitchen" className="border p-2 rounded text-sm"/>
                <input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="Image URL" className="border p-2 rounded text-sm"/>
                <input value={form.daraz_link} onChange={e=>setForm({...form,daraz_link:e.target.value})} placeholder="Daraz Link" className="border p-2 rounded text-sm"/>
              </div>
              <button onClick={addProduct} className="bg-black text-white px-4 py-2 rounded text-sm">+ Add Product</button>
              <div className="mt-6">{loading?<p>Loading...</p>:products.map((p:any)=><div key={p.id} className="flex justify-between border-b py-2 text-sm"><span>{p.name} - Rs.{p.price} - {p.category}</span><button onClick={()=>del(p.id)} className="text-red-500">Delete</button></div>)}</div>
            </div>
          )}

          {active==="Categories" && <div className="bg-white p-6 rounded-2xl border"><h2 className="font-bold">Categories</h2><p className="text-sm text-gray-500 mt-2">Top Categories: Shop All, Best Sellers, Kitchen, Bartan, Storage & Organizers - Yahan product count, icon, View All ayega - Data Supabase se genuine</p><div className="mt-4 grid grid-cols-3 gap-3">{[...new Set(products.map((p:any)=>p.category))].map((c:any,i:number)=><div key={i} className="border p-3 rounded">{c} - {products.filter((p:any)=>p.category===c).length} products</div>)}</div></div>}
          {active==="Orders" && <div className="bg-white p-6 rounded-2xl border"><h2 className="font-bold">Recent Orders</h2><p className="text-sm text-gray-500 mt-4 text-center">No orders found - No fake orders - Product, customer, status, date yahan ayega jab orders connected honge</p></div>}
          {active==="Sales" && <div className="bg-white p-6 rounded-2xl border"><h2 className="font-bold">Sales Analytics</h2><p className="text-sm text-gray-500">Not available until Daraz data connected</p></div>}
          {active==="Analytics" && <div className="bg-white p-6 rounded-2xl border"><h2 className="font-bold">Website Overview</h2><p className="text-sm text-gray-500">Traffic, engagement, clicks - Selected period - Not available until analytics connected</p></div>}
          {active==="Website Settings" && <div className="bg-white p-6 rounded-2xl border"><h2 className="font-bold">Website Settings</h2><p className="text-sm">Header with Al Safa branding, Hero section welcome message, Footer Facebook TikTok Instagram Email links - Yahan se edit hoga - Public website shows genuine data only</p></div>}
          {active==="Daraz Affiliate Links" && <div className="bg-white p-6 rounded-2xl border"><h2 className="font-bold">Daraz Affiliate Links</h2><p className="text-sm text-gray-500">Har product ka Daraz link yahan manage hoga - Buy on Daraz button public side pe genuine link show karega</p></div>}
          {active==="Product Images & Details" && <div className="bg-white p-6 rounded-2xl border"><h2 className="font-bold">Product Images & Details</h2><p className="text-sm">Image, name, price, Buy on Daraz button - Categories: Shop All, Best Sellers, Kitchen, Bartan, Storage & Organizers</p></div>}
          {active==="Live Data Connected Status Box" && <div className="bg-white p-6 rounded-2xl border"><p>{isLive? 'All data synced' : 'Not available'}</p></div>}
          {["Captions","Customer Management","Admin Account","Change Password","Help & Support","Logout"].includes(active) && <div className="bg-white p-6 rounded-2xl border"><h2 className="font-bold">{active}</h2><p className="text-sm text-gray-500 mt-2">Ye section ready hai - {active} yahan manage hoga - No fake data</p></div>}
        </div>
      </main>
    </div>
  );
}
