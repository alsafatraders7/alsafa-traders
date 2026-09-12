'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AdminPanelFinalLive() {
  const [stats, setStats] = useState({ products: null as any, categories: null as any, clicks: null as any, commission: 0 })
  const [recentProducts, setRecentProducts] = useState<any[]>([])
  const [topCategories, setTopCategories] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [liveStatus, setLiveStatus] = useState('Checking...')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { count: pCount, data: pData } = await supabase.from('products').select('id,name,category,price,image_url,status,created_at', { count: 'exact' }).order('created_at', { ascending: false }).limit(5)
        setStats(s => ({...s, products: pCount }))
        setRecentProducts(pData || [])

        const { count: cCount, data: cData } = await supabase.from('categories').select('id,name,product_count,icon', { count: 'exact' }).limit(4)
        setStats(s => ({...s, categories: cCount }))
        setTopCategories(cData || [])

        const { count: clickCount } = await supabase.from('affiliate_clicks').select('id', { count: 'exact', head: true })
        setStats(s => ({...s, clicks: clickCount }))

        const { data: orderData } = await supabase.from('orders').select('id,product_name,customer_name,status,created_at').order('created_at', { ascending: false }).limit(5)
        setOrders(orderData || [])
        setLiveStatus('Live Data Connected - Supabase Synced ✓')
      } catch (e) {
        setLiveStatus('Not available - Check Supabase connection')
      } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const display = (val: any) => (val === null || val === undefined? '~' : val)

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex font-sans">
      <aside className={`${sidebarOpen? 'w-[270px]' : 'w-[70px]'} bg-[#0A2218] text-white transition-all fixed h-screen z-20 flex flex-col`}>
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#C8A95B] rounded-lg flex items-center justify-center text-[#0A2218] font-bold">A</div>
          {sidebarOpen && <div><h1 className="font-bold text-[15px]">Al Safa Traders</h1><p className="text-[10px] text-white/50">Quality Products - Better Living</p></div>}
        </div>
        <nav className="flex-1 p-3 space-y-1 text-[13px] overflow-y-auto">
          {[
            ['Dashboard', true], ['Products', false], ['Categories', false], ['Orders', false], ['Sales', false], ['Analytics', false], ['Website Settings', false], ['Daraz Affiliate Links', false], ['Product Images & Details', false], ['Captions', false], ['Customer Management', false], ['Admin Account', false], ['Change Password', false], ['Help & Support', false], ['Logout', false]
          ].map(([label, active]: any) => (
            <div key={label} className={`px-3 py-2.5 rounded-lg cursor-pointer flex gap-3 ${active? 'bg-[#C8A95B] text-[#0A2218] font-semibold' : 'text-white/60 hover:bg-white/10'}`}><span>◫</span>{sidebarOpen && label}</div>
          ))}
        </nav>
      </aside>
      <main className={`${sidebarOpen? 'ml-[270px]' : 'ml-[70px]'} flex-1`}>
        <header className="h-[64px] bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded">☰</button>
            <div className="relative"><span className="absolute left-3 top-2.5">🔍</span><input placeholder="Search products, categories..." className="pl-9 py-2 bg-gray-50 border rounded-full text-sm w-[280px]" /></div>
          </div>
        </header>
        <div className="p-6 space-y-6">
          <div className="bg-white rounded-[20px] p-6 flex justify-between shadow-sm">
            <div>
              <h2 className="text-2xl font-bold">Welcome Back, Admin!</h2>
              <p className="text-sm text-gray-500">Manage your products, categories, orders and keep your website updated from here.</p>
              <div className="flex gap-2 mt-4"><a href="https://alsafatraders.pk" target="_blank" className="bg-[#0A2218] text-white px-4 py-2 rounded
