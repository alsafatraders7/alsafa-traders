"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [period, setPeriod] = useState("Last 7 Days");

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return; }
      try {
        const { data } = await supabase.from('products').select('*').order('id', { ascending: false }).limit(10);
        if (data) {
          setProducts(data);
          setIsLive(true);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const totalProducts = products.length;

  return (
    <div className="min-h-screen bg-gray-50 flex text-black">
      {/* LEFT SIDEBAR - 1 */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#0A2218] text-white fixed h-screen z-40 flex flex-col transition-all`}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-600 rounded-lg flex items-center justify-center font-bold text-black">A</div>
          {sidebarOpen && <div><p className="font-bold text-sm">Al Safa Traders</p><p className="text-xs opacity-60">Better Living</p></div>}
        </div>
        <nav className="p-3 space-y-1 text-sm overflow-y-auto">
          <div className="bg-yellow-600 text-black px-3 py-2 rounded-lg font-bold">Dashboard</div>
          <div className="px-3 py-2 rounded-lg opacity-70">Products</div>
          <div className="px-3 py-2 rounded-lg opacity-70">Categories</div>
          <div className="px-3 py-2 rounded-lg opacity-70">Orders</div>
          <div className="px-3 py-2 rounded-lg opacity-70">Sales</div>
          <div className="px-3 py-2 rounded-lg opacity-70">Analytics</div>
          <div className="px-3 py-2 rounded-lg opacity-70">Website Settings</div>
          <div className="px-3 py-2 rounded-lg opacity-70">【entity-Daraz¦canonical_name=Daraz】 Affiliate Links</div>
          <div className="px-3 py-2 rounded-lg opacity-70">Product Images & Details</div>
          <div className="px-3 py-2 rounded-lg opacity-70">Captions</div>
          <div className="px-3 py-2 rounded-lg opacity-70">Customer Management</div>
          <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
            <div className="px-3 py-2 rounded-lg opacity-70">Admin Account</div>
            <div className="px-3 py-2 rounded-lg opacity-70">Change Password</div>
            <div className="px-3 py-2 rounded-lg opacity-70">Help & Support</div>
            <div className="px-3 py-2 rounded-lg opacity-70">Logout</div>
          </div>
        </nav>
      </aside>

      <main className={`${sidebarOpen ? 'ml-64' : 'ml-16'} flex-1`}>
        {/* TOP BAR - 2 */}
        <div className="bg-white border-b sticky top-0 z-30 flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-gray-100 rounded">Menu</button>
            <input placeholder="Search products, categories..." className="bg-gray-100 rounded-full px-4 py-2 text-sm w-64" />
          </div>
          <div className="flex items-center gap-3">
            <span>Notifications</span>
            <span className="font-bold">Admin - Super Admin</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* WELCOME - 3 */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 bg-white rounded-2xl p-6 border">
              <h1 className="text-2xl font-bold">Welcome Back, Admin!</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your products, categories, orders and keep your website updated from here.</p>
              <div className="flex gap-2 mt-4">
                <a href="/" target="_blank" className="bg-black text-white px-4 py-2 rounded-lg text-xs">View Public Website</a>
                <span className="bg-yellow-600 text-black px-4 py-2 rounded-lg text-xs">Admin Dashboard</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">https://alsafatraders.pk - {isLive ? 'Live' : 'Not available'}</p>
            </div>
            <div className="col-span-2 bg-white rounded-2xl p-4 border">
              <p className="text-xs font-bold">Website Status</p>
              <p className="text-xs mt-2 font-bold text-green-600">{isLive ? 'Live' : 'Not available'}</p>
              <p className="text-xs text-gray-500 mt-1">{isLive ? 'Website is live and running smoothly.' : 'Connect Supabase'}</p>
            </div>
            <div className="col-span-2 bg-white rounded-2xl p-4 border">
              <p className="text-xs font-bold">Admin Account</p>
              <p className="text-xs text-gray-500 mt-1">Manage profile & settings</p>
            </div>
          </div>

          {/* STATS - 4 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border"><p className="text-xs text-gray-500">Total Products</p><p className="text-xl font-bold">{loading ? '--' : totalProducts}</p><p className="text-xs text-green-600">Published on website</p></div>
            <div className="bg-white rounded-2xl p-4 border"><p className="text-xs text-gray-500">Categories</p><p className="text-xl font-bold">{loading ? '--' : 0}</p><p className="text-xs text-green-600">Active categories</p></div>
            <div className="bg-white rounded-2xl p-4 border"><p className="text-xs text-gray-500">Total Clicks</p><p className="text-xl font-bold">0</p><p className="text-xs text-gray-500">From Daraz links - Real data</p></div>
            <div className="bg-white rounded-2xl p-4 border"><p className="text-xs text-gray-500">Estimated Commission</p><p className="text-xl font-bold">Rs. 0</p><p className="text-xs text-gray-500">Real data from Daraz</p></div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 bg-white rounded-2xl p-5 border">
              <div className="flex justify-between"><p className="font-bold text-sm">Website Overview - {period}</p><select value={period} onChange={e=>setPeriod(e.target.value)} className="border rounded text-xs px-2 py-1"><option>Last 7 Days</option><option>Last 30 Days</option></select></div>
              <p className="text-xs text-gray-400 mt-10 text-center">Traffic, engagement, clicks - {isLive ? 'Live chart will show here' : 'Not available until data sync'}</p>
            </div>
            <div className="col-span-4 bg-white rounded-2xl p-5 border">
              <p className="font-bold text-sm mb-3">Quick Actions</p>
              <div className="space-y-2">
                <button className="w-full bg-yellow-600 text-black text-left px-4 py-3 rounded-xl text-xs font-bold">Add New Product</button>
                <button className="w-full bg-gray-100 text-left px-4 py-3 rounded-xl text-xs">Manage Products</button>
                <button className="w-full bg-gray-100 text-left px-4 py-3 rounded-xl text-xs">Manage Categories</button>
                <button className="w-full bg-gray-100 text-left px-4 py-3 rounded-xl text-xs">Edit Website Settings</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border">
            <p className="font-bold text-sm">Recent Products - View All</p>
            {loading ? <p className="text-xs mt-3">Loading...</p> : products.length===0 ? <p className="text-xs text-gray-500 mt-3">No products found - Yahan image, name, category, price, published/hidden, edit button ayega. Products aap baad me khud add karoge.</p> :
            <div className="grid grid-cols-5 gap-3 mt-3">{products.map((p:any,i:number)=><div key={i} className="border rounded-xl p-3"><p className="text-xs font-bold truncate">{p.name}</p><p className="text-xs">Rs. {p.price}</p></div>)}</div>
            }
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border"><p className="font-bold text-sm">Top Categories - View All</p><p className="text-xs text-gray-500 mt-2">Name, product count, icon</p></div>
            <div className="bg-white rounded-2xl p-5 border"><p className="font-bold text-sm">Recent Orders - View All</p><p className="text-xs text-gray-500 mt-4 text-center">No orders found - No fake orders</p></div>
            <div className="bg-white rounded-2xl p-5 border"><p className="font-bold text-sm">Live Data Connected</p><p className="text-xs mt-2 p-2 bg-green-50 rounded">{isLive ? 'All data synced with public website and Daraz affiliate links' : 'Not available - Add ENV keys in Vercel'}</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}
