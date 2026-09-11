"use client"
import { useState, useEffect } from "react"

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")

  // Safe fetch - error nahi dega
  useEffect(() => {
    const load = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (!url ||!key) return // Agar env nahi hai to chup chap return, crash nahi
        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(url, key)
        const { data } = await supabase.from("products").select("*").order("id", { ascending: false })
        if (data) setProducts(data)
      } catch (e) {
        console.log("Supabase not connected yet")
      }
    }
    load()
  }, [])

  const filtered = products.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#E8F5E9]">
      <div className="bg-[#E8F5E9] text-[11px] text-center py-1.5 tracking-widest text-[#1A3C34]">
        LAUNCH • NEW ARRIVALS - FREE DELIVERY OVER RS.2000 - 16K+ HAPPY CUSTOMERS
      </div>

      <header className="bg-[#1A3C34] p-3 flex items-center gap-3 sticky top-0 z-20">
        <div className="bg-[#FFC107] w-10 h-10 rounded-full flex items-center justify-center font-black text-[#1A3C34]">AS</div>
        <div className="text-white font-black leading-none text-[16px]">Al Safa<br/>Traders.pk</div>
        <div className="flex-1 bg-white rounded-full px-4 py-2.5 flex items-center gap-2 ml-2">
          <span className="text-gray-400">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chopper, storage, " className="w-full outline-none text-sm bg-transparent" />
        </div>
        <a href="/admin" className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-sm">💬</a>
      </header>

      <div className="bg-[#1A3C34] flex gap-2 p-2 overflow-x-auto">
        <button className="bg-white px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap">Shop All</button>
        <button className="text-white/70 px-4 py-2 text-sm whitespace-nowrap">Best Sellers</button>
        <button className="text-white/70 px-4 py-2 text-sm whitespace-nowrap">Kitchen</button>
        <button className="text-white/70 px-4 py-2 text-sm whitespace-nowrap">Storage & Organizers</button>
      </div>

      <main className="max-w-6xl mx-auto p-4">
        <div className="mt-2">
          <div className="inline-block bg-white/80 px-4 py-1.5 rounded-full text-[11px] tracking-widest mb-4 font-bold text-[#1A3C34]">
            2.5M+ HOME COOKS | 155K+ 5 STAR REVIEWS
          </div>

          <h1 className="text-[28px] font-black text-[#1A3C34]">Welcome to Safa traders ♥️</h1>

          <h2 className="text-[38px] md:text-[48px] font-black text-[#1A3C34] leading-[0.95] mt-1">
            Everyday Kitchen<br/>
            Essentials for <span className="bg-[#FFEB3B] px-2">Smart Homes</span>
          </h2>

          <p className="text-[#1A3C34]/80 mt-4 text-[16px] leading-[1.5] max-w-[600px]">
            Ghar ke kaam asan banayen! Premium quality choppers, strainers, storage & organizers - jo har kitchen me chahiye. 16K+ gharon me trusted, rozana khana banana ab aur easy.
          </p>

          <div className="flex gap-3 mt-6">
            <button className="bg-[#1A3C34] text-white px-6 py-3 rounded-full font-bold text-sm">Shop New Arrivals</button>
            <button className="bg-white px-6 py-3 rounded-full font-bold text-sm shadow-sm">Shop Best Sellers</button>
          </div>
        </div>

        {filtered.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4">
            {filtered.map((p:any)=>(
              <div key={p.id} className="bg-white rounded-[20px] p-3 flex gap-3 items-center">
                <img src={p.image_url} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="text-[10px] font-bold tracking-widest text-[#1A3C34]/50">NEW • BEST SELLER</div>
                  <h3 className="font-bold text-sm">{p.title}</h3>
                  <p className="text-orange-500 font-black">Rs.{p.price}</p>
                </div>
                <a href={p.daraz_link} target="_blank" className="bg-[#FFC107] px-3 py-1 rounded-full text-xs font-black">4.8★</a>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-10 bg-white p-6 text-center">
        <div className="flex justify-center gap-4 text-xs font-bold">
          <a href="https://www.tiktok.com/@alsafatraders.pk?_r=1&_t=ZN-99di87hgjKA" target="_blank" className="underline">TikTok</a>
          <a href="https://instagram.com/alsafatraders.pk" target="_blank">Instagram</a>
        </div>
      </footer>
    </div>
  )
}
