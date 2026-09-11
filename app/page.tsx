"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const getProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("id", { ascending: false })
      if (data) setProducts(data)
    }
    getProducts()
  }, [])

  const filtered = products.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#E8F5E9]">
      {/* Top strip - original */}
      <div className="bg-[#E8F5E9] text-[11px] text-center py-1.5 tracking-widest text-[#1A3C34]">
        LAUNCH • NEW ARRIVALS - FREE DELIVERY OVER RS.2000 - 16K+ HAPPY CUSTOMERS
      </div>

      {/* Header - original */}
      <header className="bg-[#1A3C34] p-3 flex items-center gap-3 sticky top-0 z-20">
        <div className="bg-[#FFC107] w-10 h-10 rounded-full flex items-center justify-center font-black text-[#1A3C34]">AS</div>
        <div className="text-white font-black leading-none text-[16px]">Al Safa<br/>Traders.pk</div>
        <div className="flex-1 bg-white rounded-full px-4 py-2.5 flex items-center gap-2 ml-2">
          <span className="text-gray-400">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chopper, storage, " className="w-full outline-none text-sm bg-transparent" />
        </div>
        {/* Wishlist hata di - sirf chat icon */}
        <a href="/admin" className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-sm">💬</a>
      </header>

      <div className="bg-[#1A3C34] flex gap-2 p-2 overflow-x-auto">
        <button className="bg-white px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap">Shop All</button>
        <button className="text-white/70 px-4 py-2 text-sm whitespace-nowrap">Best Sellers</button>
        <button className="text-white/70 px-4 py-2 text-sm whitespace-nowrap">Kitchen</button>
        <button className="text-white/70 px-4 py-2 text-sm whitespace-nowrap">Storage & Organizers</button>
      </div>

      <main className="max-w-6xl mx-auto p-4">
        {/* YEHI ADD KIYA HAI - BAAD MEIN KUCH CHANGE NAHI */}
        <div className="mt-2">
          <div className="inline-block bg-white/80 px-4 py-1.5 rounded-full text-[11px] tracking-widest mb-4 font-bold text-[#1A3C34]">
            2.5M+ HOME COOKS | 155K+ 5 STAR REVIEWS
          </div>

          {/* ADD 1: Welcome */}
          <h1 className="text-[28px] font-black text-[#1A3C34]">Welcome to Safa traders ♥️</h1>

          {/* ADD 2: Original promo - same size */}
          <h2 className="text-[38px] md:text-[48px] font-black text-[#1A3C34] leading-[0.95] mt-1">
            Everyday Kitchen<br/>
            Essentials for <span className="bg-[#FFEB3B] px-2
