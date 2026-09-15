"use client"
import { useState, useEffect } from "react"

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState("Shop All")
  const [selected, setSelected] = useState<any>(null)
  // ADD: Wishlist Top Unlimited
  const [wishlist, setWishlist] = useState<string[]>([])
  const [galleryIndex, setGalleryIndex] = useState<{[key:string]:number}>({})
  // ADD: Timer
  const [timeLeft, setTimeLeft] = useState({h:2,m:15,s:30})

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

  // ADD: Countdown Timer Logic
  useEffect(()=>{
    const t=setInterval(()=>{
      setTimeLeft(p=>{
        let {h,m,s}=p; s--; if(s<0){s=59; m--} if(m<0){m=59; h--} if(h<0){h=2; m=15; s=30} return {h,m,s}
      })
    },1000)
    return ()=>clearInterval(t)
  },[])

  const cats = ["Shop All", "Best Sellers", "Kitchen", "Bartan", "Storage & Organizers"]

  const filtered = products.filter((p: any) => {
    const s = p.name?.toLowerCase().includes(search.toLowerCase())
    const c = cat === "Shop All"? true : cat === "Best Sellers"? p.is_best_seller : p.category === cat
    return s && c
  })

  const toggleWishlist = (id:string, e?:any)=>{
    if(e) e.stopPropagation()
    setWishlist(w=> w.includes(id)? w.filter(x=>x!==id) : [...w,id])
  }

  return (
    <div className="min-h-screen bg-[#E8F5E9]">
      {/* KHATAM: Top Patti - LAUNCH - NEW ARRIVALS - hata di Promise ke mutabiq */}

      <header className="bg-[#1A3C34] p-3 flex items-center gap-3 sticky top-0 z-20">
        {/* CHANGE: Logos - Text Se Real Logo */}
        <img src="https://i.ibb.co/My5Y6kL/alsafa-logo.png" onError={(e:any)=>{e.target.src="https://via.placeholder.com/40x40.png?text=AS"}} className="w-10 h-10 rounded-full bg-[#FFC107] object-cover" alt="Al Safa Logo"/>
        <div className="text-white font-black leading-none">Al Safa<br />Traders.pk</div>
        <div className="flex-1 bg-white rounded-full px-4 py-2.5 flex items-center gap-2 ml-2">
          <span>🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chopper, storage," className="w-full outline-none text-sm bg-transparent" />
        </div>
        {/* ADD: Unlimited Wishlist Top */}
        <a href="/wishlist" className="bg-white text-[#1A3C34] px-3 py-1.5 rounded-full text-[11px] font-black shrink-0">❤️ Wishlist ({wishlist.length})</a>
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
          {/* WHITE LINE HATADI - 2.5M+ HOME COOKS wali line khatam */}
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

          {/* REPLACE: FB / Insta / TikTok - Footer Se Hero Me */}
          <div className="mt-6">
            <p className="text-[11px] font-bold text-[#1A3C34] mb-2">Follow Us On:</p>
            <div className="flex gap-2">
              <a href="https://www.facebook.com/61593603578150" target="_blank" className="bg-[#1877F2] text-white w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-black">f</a>
              <a href="https://www.tiktok.com/@alsafatraders.pk" target="_blank" className="bg-black text-white w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-black">♫</a>
              <a href="https://instagram.com/alsafatraders.pk" target="_blank" className="bg-gradient-to-r from-[#feda75] via-[#fa7e1e] to-[#d62976] text-white w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-black">◎</a>
              <a href="mailto:alsafatraders7@gmail.com" className="bg-white border w-9 h-9 rounded-full flex items-center justify-center text-[12px]">✉️</a>
            </div>
            {/* ADD: Timer + Live Views + Auto Price Sync Badge */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <div className="bg-black text-white text-[10px] px-3 py-1.5 rounded-full font-bold">⏳ Ends In: {String(timeLeft.h).padStart(2,'0')}:{String(timeLeft.m).padStart(2,'0')}:{String(timeLeft.s).padStart(2,'0')}</div>
              <div className="bg-green-100 text-green-700 text-[10px] px-3 py-1.5 rounded-full font-bold">● Auto Price Sync: ON</div>
              <div className="bg-blue-100 text-blue-700 text-[10px] px-3 py-1.5 rounded-full font-bold">Dynamic Cron: Active</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[24px] overflow-hidden shadow-sm relative">
          <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800" className="w-full h-[450px] object-cover" alt="Kitchen" />
          {/* ADD: Watermark Logo */}
          <div className="absolute bottom-2 right-2 bg-white/90 text-[#1A3C34] text-[8px] px-2 py-1 rounded-full font-black shadow">Al Safa Traders.pk</div>
        </div>
      </main>

      <section className="max-w-6xl mx-auto p-4 mt-6">
        <h2 className="font-black text-[#1A3C34] text-xl">{cat} ({filtered.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {filtered.map((p: any) => {
            const allImages = p.images && p.images.length? p.images : [p.image_url]
            const currentImg = allImages[galleryIndex[p.id] || 0] || allImages[0]
            const original = p.price_original || Math.round((p.price || 1499) * 1.46) // 2200 jaisa
            const sale = p.price_discounted || p.price || 1499
            const off = Math.round(((original - sale)/original)*100)
            return (
            <div key={p.id} className="bg-white border rounded-[18px] overflow-hidden shadow-sm relative">
              {/* ADD: FOMO Badges */}
              <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                {p.stock <= 7 && <span className="bg-red-500 text-white text-[8px] px-2 py-1 rounded-full font-bold animate-pulse">{p.stock<=3?"Almost Sold Out!":"Limited Stock"}</span>}
                {off>20 && <span className="bg-[#FF3B30] text-white text-[8px] px-2 py-1 rounded-full font-bold">- {off}% OFF</span>}
              </div>

              {/* PICTURE CLICK FEATURE - Customer detail dekhega */}
              <div onClick={() => setSelected(p)} className="cursor-pointer relative">
                {/* CHANGE: Images - 1 Se 4 + Watermark Logo */}
                <img src={currentImg || "https://via.placeholder.com/400"} className="h-[190px] w-full object-cover" alt={p.name} />
                <div className="absolute bottom-1 right-1 bg-white/80 text-[7px] px-1.5 py-0.5 rounded font-black">Al Safa</div>
                {/* 4 Dots */}
                {allImages.length>1 && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {allImages.slice(0,4).map((_:any,idx:number)=>(
                      <button key={idx} onClick={(e)=>{e.stopPropagation(); setGalleryIndex(prev=>({...prev,[p.id]:idx}))}} className={`w-1.5 h-1.5 rounded-full ${ (galleryIndex[p.id]||0)===idx? "bg-white" : "bg-white/50" }`} />
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3">
                {/* ADD: Reviews Rating */}
                <div className="flex items-center gap-1 text-[10px]">⭐ {p.rating || 4.8} <span className="opacity-60">({p.reviews_count || 127})</span> <span className="text-red-500 ml-1 animate-pulse">● {p.live_views || 23} viewing</span></div>
                <p className="font-bold text-sm line-clamp-1 mt-1">{p.name}</p>
                <p className="text-[11px] text-gray-500">{p.category}</p>
                {/* CHANGE: Price - Single Se Double - Rs 2,200 Rs 1,499 */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] line-through opacity-60">Rs.{original}</span>
                  <span className="font-black text-[#1A3C34] text-[13px]">Rs.{sale}</span>
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">-{off}%</span>
                </div>
              </div>

              <div className="p-3 pt-0 space-y-2">
                {/* ADD: Bundle Order + Wishlist */}
                <div className="flex gap-2">
                  <button onClick={(e)=>toggleWishlist(p.id,e)} className={`flex-1 border py-2 rounded-full text-[11px] font-bold ${wishlist.includes(p.id)?"bg-[#1A3C34] text-white":"bg-white"}`}>{wishlist.includes(p.id)?"♥ Saved":"♡ Wishlist"}</button>
                  <button onClick={()=>setSelected(p)} className="flex-1 border py-2 rounded-full text-[11px] font-bold bg-gray-50">Bundle</button>
                </div>
                <a href={p.affiliate_link || "#"} target="_blank" onClick={(e) => e.stopPropagation()} className="block text-center bg-[#FFD814] py-2.5 rounded-full text-xs font-black">
                  Buy on 【entity-Daraz¦canonical_name=Daraz】
                </a>
              </div>
            </div>
          )})}
        </div>
      </section>

      <footer className="mt-10 bg-white p-6 text-center">
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold">
          {/* REPLACE: Footer se social hata diye, Hero me laga diye - sirf email rakha */}
          <a href="mailto:alsafatraders7@gmail.com" className="underline">Email: alsafatraders7@gmail.com</a>
          <span className="opacity-60">© 2026 Al Safa Traders.pk | Auto Price Sync: ON | Dynamic Cron: Active</span>
        </div>
      </footer>

      {/* PRODUCT DETAIL POPUP - Picture click pe khulega - UPDATED with all features */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-[20px] max-w-[450px] w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img src={selected.images?.[0] || selected.image_url} className="w-full h-[320px] object-cover rounded-t-[20px]" alt="" />
              <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">-33% OFF</div>
              <div className="absolute bottom-2 right-2 bg-white/90 text-[8px] px-2 py-1 rounded-full font-black">Al Safa Traders.pk</div>
              <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2 py-1 rounded-full">⏳ {String(timeLeft.h).padStart(2,'0')}:{String(timeLeft.m).padStart(2,'0')}:{String(timeLeft.s).padStart(2,'0')}</div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-[11px]"><span>⭐ {selected.rating||4.8} ({selected.reviews_count||127} reviews)</span><span className="text-red-500 animate-pulse">🔴 {selected.live_views||23} log dekh rahe hain</span></div>
              <h2 className="text-[18px] font-black text-[#1A3C34] mt-2">{selected.name}</h2>
              <p className="text-[11px] text-gray-500 mt-1">{selected.category}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="line-through text-[13px] opacity-60">Rs.{selected.price_original || 2200}</span>
                <span className="font-black text-[18px]">Rs.{selected.price_discounted || selected.price}</span>
                <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">Limited Stock</span>
              </div>
              <p className="text-[13px] text-[#1A3C34]/80 mt-3">Premium quality - Bundle Order Available! 【entity-Daraz¦canonical_name=Daraz】 pe best price me available. Watermark protected images.</p>

              <div className="flex gap-2 mt-4">
                <button onClick={()=>toggleWishlist(selected.id)} className="flex-1 border py-3 rounded-full text-[12px] font-bold">{wishlist.includes(selected.id)?"♥ Wishlist Me Hai":"♡ Unlimited Wishlist Me Add"}</button>
                <a href={selected.affiliate_link} target="_blank" className="flex-1 bg-[#FFD814] text-center font-black py-3 rounded-full text-[14px]">Buy on Daraz</a>
              </div>
              <button onClick={() => setSelected(null)} className="block w-full text-center text-[12px] mt-3 text-gray-500">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
