"use client"
import { useState, useEffect } from "react"

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState("Shop All")
  const [selected, setSelected] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

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

  const loadReviews = async (id: number) => {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!url ||!key) return
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(url, key)
      const { data } = await supabase.from("reviews").select("*").eq("product_id", id).order("created_at", { ascending: false })
      if (data) setReviews(data)
    } catch {}
  }

  const submitReview = async () => {
    if (!name ||!comment) return alert("Naam aur review likho")
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!url ||!key) return
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(url, key)
      const { error } = await supabase.from("reviews").insert({ product_id: selected.id, customer_name: name, rating, comment })
      if (!error) {
        alert("Review add ho gaya")
        setName("")
        setComment("")
        loadReviews(selected.id)
      }
    } catch {}
  }

  const cats = ["Shop All", "Best Sellers", "Kitchen", "Bartan", "Storage & Organizers"]
  function getPrice(p:any){
    return {
      current: p?.price || 1499,
      original: p?.price || 1499,
      discount: 0
    }
  }

  const filtered = products.filter((p: any) => {
    const s = !search || p.name?.toLowerCase()?.includes(search.toLowerCase())
    const c = cat === "Shop All"? true : cat === "Best Sellers"? p.is_best_seller : p.category === cat
    return s && c
  })

  return (
    <div className="min-h-screen bg-[#E8F5E9]">
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
          <h1 className="text-[26px] font-black text-[#1A3C34]">Welcome to Safa traders</h1>
          <h2 className="text-[38px] font-black text-[#1A3C34] leading-[0.9] mt-2">
            Everyday Kitchen<br />Essentials for <span className="bg-[#FFEB3B] px-2">Smart Homes</span>
          </h2>
          <p className="text-[#1A3C34]/80 mt-4 text-[15px]">Ghar ke kaam asan banayen! Premium quality choppers, strainers, storage & organizers - jo har kitchen me chahiye.</p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setCat("Shop All")} className="bg-[#1A3C34] text-white px-6 py-3 rounded-full font-bold text-sm">Shop New Arrivals</button>
            <button onClick={() => setCat("Best Sellers")} className="bg-white px-6 py-3 rounded-full font-bold text-sm">Shop Best Sellers</button>
          </div>

          <div className="mt-8 bg-white rounded-[18px] p-4 border">
            <p className="text-sm font-bold text-center">Email: alsafatraders7@gmail.com</p>
            <div className="flex justify-center gap-3 mt-3">
              <span className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs">♪</span>
              <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">IG</span>
              <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">f</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-3 text-[11px] font-bold">
              <a href="https://www.facebook.com/61593603578150" target="_blank" className="underline">Facebook: Al Safa Traders</a>
              <a href="https://www.tiktok.com/@alsafatraders.pk" target="_blank" className="underline">TikTok @alsafatraders.pk</a>
              <a href="https://instagram.com/alsafatraders.pk" target="_blank" className="underline">Instagram</a>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[24px] overflow-hidden shadow-sm">
          <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800" className="w-full h-[450px] object-cover" alt="Kitchen" />
        </div>
      </main>

      <section className="max-w-6xl mx-auto p-4 mt-6">
        <h2 className="font-black text-[#1A3C34] text-xl">{cat} ({filtered.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {filtered.map((p: any) => {
            
            return (
            <div key={p.id} className="bg-white border rounded-[18px] overflow-hidden shadow-sm">
              <div onClick={() => { setSelected(p); loadReviews(p.id) }} className="cursor-pointer">
                <img src={p.image_url || "https://via.placeholder.com/400"} className="h-[190px] w-full object-cover" alt={p.name} />
                <div className="p-3">
                  <p className="font-bold text-sm line-clamp-1">{p.name}</p>
                  <p className="text-[11px] text-gray-500">{p.category}</p>
                  <div className="flex items-center gap-2 mt-1">           
                    <span className="font-black text-[15px]">Rs.{p.price} PKR</span>
                  </div>
                </div>
              </div>
              <div className="p-3 pt-0">
                <a href={p.affiliate_link || "#"} target="_blank" onClick={(e) => e.stopPropagation()} className="block text-center bg-[#FFD814] py-2.5 rounded-full text-xs font-black">
                  Buy on Daraz
                </a>
              </div>
            </div>
          )})}
        </div>
      </section>

      <footer className="mt-10 bg-white p-4 text-center">
        <p className="text-[10px] text-gray-400">© 2026 Al Safa Traders.pk | Auto Price Sync: ON | Dynamic Cron: Active</p>
      </footer>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-[20px] max-w-[450px] w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image_url} className="w-full h-[320px] object-cover rounded-t-[20px]" alt={selected.name} />
            <div className="p-5">
              <h2 className="text-[18px] font-black text-[#1A3C34]">{selected.name}</h2>
              {(() => { const pr = getPrice(selected); return (
                <p className="text-[13px] mt-1"><span className="line-through text-gray-400">Rs.{pr.original}</span> <b className="ml-2">Rs.{pr.current}</b> <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full ml-2">-{pr.discount}% OFF</span></p>
              )})()}
              <p className="text-[13px] text-[#1A3C34]/80 mt-3">Premium quality - Daraz pe best price me available.</p>
              <div className="mt-5 border-t pt-4">
                <h4 className="font-bold text-sm">Customer Reviews ({reviews.length})</h4>
                <div className="flex gap-1 my-2">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} onClick={() => setRating(s)} className={`text-2xl cursor-pointer ${s <= rating? "text-yellow-400" : "text-gray-300"}`}>★</span>
                  ))}
                </div>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Aapka Naam" className="w-full border p-2 rounded-lg mb-2 text-sm" />
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Review likhein..." className="w-full border p-2 rounded-lg mb-2 text-sm" rows={3}></textarea>
                <button onClick={submitReview} className="w-full bg-black text-white py-2.5 rounded-full font-bold text-sm">Review Submit Karo</button>
                <div className="mt-3 space-y-2 max-h-40 overflow-auto">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="bg-gray-50 p-2 rounded-lg">
                      <p className="font-bold text-xs">{r.customer_name} - {r.rating} Stars</p>
                      <p className="text-xs">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
              <a href={selected.affiliate_link} target="_blank" className="block w-full bg-[#FFD814] text-center font-black py-3 rounded-full mt-5 text-[14px]">Buy on Daraz</a>
              <button onClick={() => setSelected(null)} className="block w-full text-center text-[12px] mt-3 text-gray-500">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
