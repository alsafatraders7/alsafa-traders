'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseAnonKey? createClient(supabaseUrl, supabaseAnonKey) : null

export default function AdminPanelMaster() {
  const [stats, setStats] = useState({ products: null as any, categories: null as any, clicks: null as any, commission: null as any })
  const [recentProducts, setRecentProducts] = useState<any[]>([])
  const [topCategories, setTopCategories] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [liveStatus, setLiveStatus] = useState('Checking...')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [period, setPeriod] = useState('Last 7 Days')
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setLiveStatus('Not available - Add Supabase keys in Vercel')
        setLoading(false)
        return
      }
      try {
        const { count: pCount, data: pData } = await supabase.from('products').select('id,name,category,price,image_url,status,created_at', { count: 'exact' }).order('created_at', { ascending: false }).limit(6)
        setStats(s => ({...s, products: pCount })); setRecentProducts(pData || [])
        const { count: cCount, data: cData } = await supabase.from('categories').select('id,name,product_count,icon', { count: 'exact' }).limit(6)
        setStats(s => ({...s, categories: cCount })); setTopCategories(cData || [])
        const { count: clickCount } = await supabase.from('affiliate_clicks').select('id', { count: 'exact', head: true })
        setStats(s => ({...s, clicks: clickCount, commission: null }))
        const { data: orderData } = await supabase.from('orders').select('id,product_name,customer_name,status,created_at').order('created_at', { ascending: false }).limit(5)
        setOrders(orderData || [])
        setLiveStatus('Live Data Connected - Supabase Synced ✓')
      } catch { setLiveStatus('Not available - Check Supabase tables') }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const display = (v: any) => (v === null || v === undefined? '~' : v)
  const sidebarItems = ['Dashboard','Products','Categories','Orders','Sales','Analytics','Website Settings','【entity-Daraz¦canonical_name=Daraz】 Affiliate Links','Product Images & Details','Captions','Customer Management','Admin Account','Change Password','Help & Support','Logout']

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex font-sans">
      <aside className={`${sidebarOpen? 'w-[270px]' : 'w-[70px]'} bg-[#0A2218] text-white fixed h-screen z-30 flex flex-col transition-all`}>
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#C8A95B] rounded-lg flex items-center justify-center text-[#0A2218] font-bold">A</div>
          {sidebarOpen && <div><h1 className="font-bold text-[14px]">Al Safa Traders</h1><p className="text-[10px] text-white/50">Quality Products - Better Living</p></div>}
        </div>
        <nav className="flex-1 p-3 space-y-1 text-[12.5px] overflow-y-auto">
          {sidebarItems.map((label,i)=>(
            <div key={label} className={`px-3 py-2.5 rounded-lg flex gap-3 items-center cursor-pointer ${i===0?'bg-[#C8A95B] text-[#0A2218] font-semibold':'text-white/60 hover:bg-white/10'}`}>
              <span>{['◫','📦','🗂️','🧾','💰','📊','⚙️','🔗','🖼️','💬','👥','👤','🔑','❓','🚪'][i]}</span>{sidebarOpen && label}
            </div>
          ))}
        </nav>
      </aside>

      <main className={`${sidebarOpen? 'ml-[270px]' : 'ml-[70px]'} flex-1`}>
        <header className="h-[64px] bg-white border-b flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded">☰</button>
            <div className="relative hidden md:block"><span className="absolute left-3 top-2.5 text-sm">🔍</span><input placeholder="Search products, categories..." className="pl-9 py-2 bg-gray-50 border rounded-full text-sm w-[280px]" /></div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full relative">🔔<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
            <div className="relative"><div onClick={()=>setShowProfile(!showProfile)} className="flex items-center gap-2 cursor-pointer"><div className="w-8 h-8 bg-[#0A2218] rounded-full flex items-center justify-center text-white text-xs font-bold">A</div><div className="hidden md:block text-left text-xs"><b>Admin</b><br/><span className="text-gray-400 text-[10px]">Super Admin</span></div><span className="text-xs">▼</span></div>
              {showProfile && <div className="absolute right-0 top-12 w-52 bg-white border rounded-xl shadow-lg text-xs z-50"><div className="p-3 border-b"><b>Admin Account</b><br/>admin@alsafatraders.pk</div><div className="p-2 hover:bg-gray-50">Admin Account</div><div className="p-2 hover:bg-gray-50">Change Password</div><div className="p-2 hover:bg-gray-50">Help & Support</div><div className="p-2 hover:bg-gray-50 text-red-500">Logout</div></div>}
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="bg-white rounded-[20px] p-6 flex flex-col md:flex-row justify-between gap-4 shadow-sm border">
            <div><h2 className="text-2xl font-bold text-[#0A2218]">Welcome Back, Admin!</h2><p className="text-sm text-gray-500 mt-1">Manage your products, categories, orders and keep your website updated from here.</p>
              <div className="flex gap-2 mt-4"><a href="https://alsafatraders.pk" target="_blank" className="bg-[#0A2218] text-white px-4 py-2 rounded-lg text-sm">↗ View Public Website</a><button className="bg-[#C8A95B] px-4 py-2 rounded-lg text-sm font-semibold">Admin Dashboard</button></div>
              <p className="text-[11px] text-gray-400 mt-3">🔗 https://alsafatraders.pk - <span className={liveStatus.includes('✓')?'text-green-600':'text-amber-600'}>{liveStatus}</span></p><p className="text-[11px] text-gray-400">Admin Account: Super Admin | Public Website: Genuine Data Only</p>
            </div><img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500" className="w-full md:w-[340px] h-[160px] object-cover rounded-xl" alt="" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[16px] border shadow-sm"><p className="text-[11px] text-gray-400">Total Products</p><p className="text-2xl font-bold mt-1">{loading?'...':display(stats.products)}</p><p className="text-[10px] text-green-600 mt-1">● Published on website</p></div>
            <div className="bg-white p-5 rounded-[16px] border shadow-sm"><p className="text-[11px] text-gray-400">Categories</p><p className="text-2xl font-bold mt-1">{loading?'...':display(stats.categories)}</p><p className="text-[10px] text-green-600 mt-1">● Active categories</p></div>
            <div className="bg-white p-5 rounded-[16px] border shadow-sm"><p className="text-[11px] text-gray-400">Total Clicks</p><p className="text-2xl font-bold mt-1">{loading?'...':display(stats.clicks)}</p><p className="text-[10px] text-gray-400 mt-1">● From 【entity-Daraz¦canonical_name=Daraz】 links - No fake numbers</p></div>
            <div className="bg-white p-5 rounded-[16px] border shadow-sm"><p className="text-[11px] text-gray-400">Estimated Commission</p><p className="text-2xl font-bold mt-1">Rs. {display(stats.commission)}</p><p className="text-[10px] text-gray-400 mt-1">● Real data - No fake</p></div>
          </div>

          <div className="bg-white rounded-[16px] p-5 border shadow-sm">
            <div className="flex justify-between items-center"><b className="text-sm">Website Overview</b><select value={period} onChange={e=>setPeriod(e.target.value)} className="text-xs border rounded-lg px-2 py-1 bg-gray-50"><option>Last 7 Days</option><option>Last 30 Days</option><option>This Month</option></select></div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-[#F8F7F4] p-4 rounded-xl text-center"><p className="text-xs text-gray-400">Traffic</p><p className="font-bold mt-1">{stats.clicks!==null?display(stats.clicks):'Not available'}</p></div>
              <div className="bg-[#F8F7F4] p-4 rounded-xl text-center"><p className="text-xs text-gray-400">Engagement</p><p className="font-bold mt-1">{recentProducts.length?`${recentProducts.length} Products viewed`:'Not available'}</p></div>
              <div className="bg-[#F8F7F4] p-4 rounded-xl text-center"><p className="text-xs text-gray-400">Clicks ({period})</p><p className="font-bold mt-1">{display(stats.clicks)}</p></div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-5 border shadow-sm"><b className="text-sm">Quick Actions</b><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3"><button className="bg-[#0A2218] text-white py-3 rounded-xl text-xs font-semibold">+ Add New Product</button><button className="border border-[#0A2218] py-3 rounded-xl text-xs font-semibold">Manage Products</button><button className="border py-3 rounded-xl text-xs">Manage Categories</button><button className="bg-[#C8A95B]/20 border border-[#C8A95B] py-3 rounded-xl text-xs font-semibold">Edit Website Settings</button></div></div>

          <div className="bg-white rounded-[16px] p-5 border shadow-sm"><div className="flex justify-between"><b className="text-sm">Recent Products</b><span className="text-xs text-[#C8A95B] font-semibold">View All</span></div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">{loading?<p className="text-xs col-span-6">Loading...</p>:recentProducts.length===0?<p className="text-xs text-gray-400 col-span-6">~ Not available - Add products in Supabase. Har card me image, name, category, price, Buy on Daraz public pe.</p>:recentProducts.map((p:any)=><div key={p.id} className="border rounded-xl p-2"><img src={p.image_url||'https://via.placeholder.com/150'} className="h-[90px] w-full object-cover rounded-lg" alt=""/><p className="text-xs font-semibold truncate mt-2">{p.name}</p><p className="text-[10px] text-gray-400">{p.category}</p><div className="flex justify-between mt-1"><p className="text-xs font-bold">Rs. {p.price||'~'}</p><span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{p.status||'published'}</span></div><button className="w-full mt-2 text-[10px] bg-[#F8F7F4] border py-1 rounded-lg">Edit</button></div>)}</div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-[16px] p-5 border shadow-sm"><div className="flex justify-between"><b className="text-sm">Top Categories</b><span className="text-xs text-[#C8A95B]">View All</span></div><div className="mt-4 space-y-3">{topCategories.length===0?<p className="text-xs text-gray-400">~ Not available - Shop All, Best Sellers, Kitchen, Bartan, Storage & Organizers</p>:topCategories.map((c:any)=><div key={c.id} className="flex justify-between bg-[#F8F7F4] p-3 rounded-xl"><div className="flex gap-2 items-center"><span className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-xs">{c.icon||'🗂️'}</span><span className="text-xs font-semibold">{c.name}</span></div><span className="text-[11px] text-gray-500">{c.product_count||'~'} products</span></div>)}</div></div>
            <div className="bg-white rounded-[16px] p-5 border shadow-sm"><b className="text-sm">Recent Orders</b>{orders.length===0?<div className="text-center py-10"><p className="text-xs text-gray-400">No orders found</p><p className="text-[10px] text-gray-300 mt-1">No fake orders - Real orders will show: product, customer, status, date</p></div>:<table className="w-full text
