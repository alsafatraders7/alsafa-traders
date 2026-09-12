"use client"
import { useState, useEffect } from "react"

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState("Shop All")

  useEffect(() => {
    const load = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (!url ||!key) return
        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(url, key)
        const { data } = await supabase.from("products").select("*").order("id", { ascending: false })
        if (data) setProducts(data)
      } catch {}
    }
    load()
  }, [])

  const cats = ["Shop All", "Best Sellers", "Kitchen", "Bartan", "Storage & Organizers"]

  const filtered = products.filter((p: any) => {
    const s = p.name?.toLowerCase().includes(search.toLowerCase())
    const c = cat === "Shop All"? true : cat === "Best Sellers"? p.is_best_seller : p.category === cat
    return s && c
  })

  return (
    <div className="min-h-screen bg-[#E8F5E9]">
      <div className="bg-[#E8F5E9] text-[11px] text-center py-1.5 tracking-widest font-bold text-[#1A3C34]">
        LAUNCH - NEW ARRIVALS - FREE DELIVERY OVER RS.2000 - 16K+ HAPPY CUSTOMERS
      </div>

      <header className="bg-[#1A3C34] p-3 flex items-center gap-3 sticky top-0 z-20">
        <div className="bg-[#FFC107] w-10 h-10 rounded-full flex items-center justify-center font-black">AS</div>
        <div className="text-white font-black leading-none">Al Safa<br />Traders.pk</div>
        <div className="flex-1 bg-white rounded-full px-4 py-2.5 flex items-center gap-2 ml-2">
          <span>🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chopper, storage," className="w-full outline-none text-sm bg-transparent" />
        </div>
      </header>

      <div className="bg-[#1A3C34] flex gap-2 p-2 overflow-x-auto">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`${cat === c? "bg-white text-[#1A3C34]" : "text-white/70"} px-5 py-2 rounded-full text-sm font-bold shrink-0`}>
            {c}
          </button>
        ))}
      </div>

      <main className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-6 items-start">
        <div>
          <div className="bg-white/80 inline-block px-4 py-1 rounded-full text-[11px] font-bold mb-4">2.5M+ HOME COOKS | 155K+ 5 STAR REVIEWS</div>
          <h1 className="text-[26px] font-black text-[#1A3C34]">Welcome to Safa traders</h1>
          <h2 className="text-[38px] font-black text-[#1A3C34] leading-[0.9] mt-2">
            Everyday Kitchen<br />Essentials for <span className="bg-[#FFEB3B] px-2">Smart Homes</span>
          </h2>
          <p className="text-[#1A3C34]/80 mt-4 text-[15px]">
            Ghar ke kaam asan banayen! Premium quality choppers, strainers, storage & organizers - jo har kitchen me chahiye.
          </p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setCat("Shop All")} className="bg-[#1A3C34] text-white px-6 py-3 rounded-full font-bold text-sm">Shop New Arrivals</button>
            <button onClick={() => setCat("Best Sellers")} className="bg-white px-6 py-3 rounded-full font-bold text-sm">Shop Best Sellers</button>
          </div>
        </div>
        <div className="bg-white rounded-[24px] overflow-hidden shadow-sm">
          <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800" className="w-full h-[450px] object-cover" alt="Kitchen" />
        </div>
      </main>

      <section className="max-w-6xl mx-auto p-4 mt-6">
        <h2 className="font-black text-[#1A3C34] text-xl">{cat} ({filtered.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {filtered.map((p: any) => (
            <div key={p.id} className="bg-white border rounded-[18px] overflow-hidden shadow-sm">
              <img src={p.image_url || "https://via.placeholder.com/400"} className="h-[190px] w-full object-cover" alt={p.name} />
              <div className="p-3">
                <p className="font-bold text-sm line-clamp-1">{p.name}</p>
                <p className="text-[11px] text-gray-500">{p.category}</p>
                <p className="font-black mt-1">Rs.{p.price}</p>
                <a href={p.affiliate_link || "#"} target="_blank" className="block text-center bg-[#FFD814] py-2.5 rounded-full text-xs font-black mt-2">Buy on 【entity-Daraz¦canonical_name=Daraz】</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-10 bg-white p-6 text-center">
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold">
          <a href="https://www.facebook.com/61593603578150" target="_blank" className="underline">Facebook: Al Safa Traders</a>
          <a href="https://www.tiktok.com/@alsafatraders.pk" target="_blank" className="underline">TikTok @alsafatraders.pk</a>
          <a href="https://instagram.com/alsafatraders.pk" target="_blank" className="underline">Instagram</a>
          <a href="mailto:alsafatraders7@gmail.com" className="underline">Email: alsafatraders7@gmail.com</a>
        </div>
      </footer>
    </div>
  )
}
