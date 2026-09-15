"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase: any = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  useEffect(() => {
    supabase.from("products").select("*").order("id", { ascending: false }).then((res: any) => {
      if (res.data) setProducts(res.data)
    })
    try { setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]")) } catch {}
  }, [])

  const loadReviews = async (id: number) => {
    const { data } = await supabase.from("reviews").select("*").eq("product_id", id).order("created_at", { ascending: false })
    if (data) setReviews(data)
  }

  const submitReview = async () => {
    if (!name ||!comment) return alert("Naam aur review likho")
    const { error } = await supabase.from("reviews").insert({ product_id: selected.id, customer_name: name, rating, comment })
    if (!error) { alert("Review add ho gaya"); setName(""); setComment(""); loadReviews(selected.id) }
  }

  const toggleWishlist = (p: any) => {
    let cur: any[] = []
    try { cur = JSON.parse(localStorage.getItem("wishlist") || "[]") } catch { cur = [] }
    if (cur.find((x: any) => x.id === p.id)) cur = cur.filter((x: any) => x.id!== p.id)
    else cur.push(p)
    localStorage.setItem("wishlist", JSON.stringify(cur))
    setWishlist(cur)
  }

  return (
    <main className="min-h-screen bg-[#E8F5E9]">
      <div className="bg-[#E8F5E9] text-[#0A3327] text-[11px] font-bold tracking-widest text-center py-2 px-2">
        LAUNCH - NEW ARRIVALS - FREE DELIVERY OVER RS.2000 - 16K+ HAPPY CUSTOMERS
      </div>

      <header className="bg-[#0A3327] px-4 py-3">
        <div className="flex items-center justify-between gap-3 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FFC107] rounded-full flex items-center justify-center font-black text-black">AS</div>
            <span className="text-white font-bold leading-tight text-[16px]">Al Safa<br/>Traders.pk</span>
          </div>
          <div className="flex-1 max-w-[320px]">
            <div className="bg-white rounded-full flex items-center px-4 py-2.5">
              <span className="mr-2">🔍</span>
              <input placeholder="Search chopper, storage," className="w-full outline-none text-sm" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 overflow-auto max-w-6xl mx-auto">
          <button className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm">Shop All</button>
          <button className="text-white/70 px-5 py-2 rounded-full font-bold text-sm">Best Sellers</button>
          <button className="text-white/70 px-5 py-2 rounded-full font-bold text-sm">Kitchen</button>
          <button className="text-white/70 px-5 py-2 rounded-full font-bold text-sm">Bartan</button>
        </div>
      </header>

      <section className="bg-[#E8F5E9] px-5 pt-6 pb-6 max-w-6xl mx-auto">
        <p className="text-[#0A3327] font-bold text-[22px]">Welcome to Safa traders</p>
        <h1 className="text-[#0A3327] font-black text-[36px] leading-[1.1] mt-2">
          Everyday Kitchen Essentials for <span className="bg-[#FFEB3B] px-2">Smart</span> <span className="bg-[#FFEB3B] px-2">Homes</span>
        </h1>
        <p className="text-[#0A3327]/70 text-[15px] mt-4 leading-relaxed">
          Ghar ke kaam asan banayen! Premium quality choppers, strainers, storage & organizers - jo har kitchen me chahiye.
        </p>
        <div className="flex gap-3 mt-6">
          <button className="bg-[#0A3327] text-white px-6 py-3.5 rounded-full font-bold text-sm">Shop New Arrivals</button>
          <button className="bg-white text-black px-6 py-3.5 rounded-full font-bold text-sm shadow-sm">Shop Best Sellers</button>
        </div>
        <div className="mt-6 relative rounded-[24px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800" className="w-full h-[380px] object-cover" alt="" />
          <div className="absolute bottom-4 right-4 w-14 h-14 bg-[#00C853] rounded-full flex items-center justify-center">💬</div>
        </div>
      </section>

      <section className="bg-white p-3 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto rounded-t-[24px] -mt-2 pt-6">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="relative cursor-pointer" onClick={() => { setSelected(product); loadReviews(product.id) }}>
              <img src={product.image_url} className="w-full h-[300px] object-cover" alt="" />
              <span className="absolute top-3 left-3 bg-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">-32% OFF</span>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 text-[11px] text-gray-600">
                <span>⭐ {product.rating || "4.8"} ({product.reviews_count || 127})</span>
                <span className="text-red-500">● {product.live_views || 23} viewing</span>
              </div>
              <h3 className="font-bold text-[13px] mt-1">{product.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-black text-sm">Rs.{product.price_discounted || 1499}</span>
                <span className="text-[11px] line-through text-gray-400">Rs.{product.price_original || 2200}</span>
              </div>
              <div className="flex justify-between mt-3 text-[12px]">
                <button onClick={() => toggleWishlist(product)}>{wishlist.find((x: any) => x.id === product.id)? "❤️ Wishlist" : "♡ Wishlist"}</button>
                <span className="text-gray-400">Bundle</span>
              </div>
              <a href={product.affiliate_link} target="_blank" className="mt-3 w-full bg-[#FFD814] text-black py-3 rounded-full font-bold text-center block text-[14px] border border-[#F2C200]">
                Buy on Daraz
              </a>
            </div>
          </div>
        ))}
      </section>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image_url} className="w-full h-
