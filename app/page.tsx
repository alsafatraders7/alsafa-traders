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
    try {
      setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"))
    } catch {}
  }, [])

  const loadReviews = async (id: number) => {
    const { data } = await supabase.from("reviews").select("*").eq("product_id", id).order("created_at", { ascending: false })
    if (data) setReviews(data)
  }

  const submitReview = async () => {
    if (!name || !comment) return alert("Naam aur review likho")
    const { error } = await supabase.from("reviews").insert({ product_id: selected.id, customer_name: name, rating, comment })
    if (!error) {
      alert("Shukriya! Review add ho gaya")
      setName("")
      setComment("")
      loadReviews(selected.id)
    } else {
      alert(error.message)
    }
  }

  const toggleWishlist = (p: any) => {
    let cur: any[] = []
    try { cur = JSON.parse(localStorage.getItem("wishlist") || "[]") } catch { cur = [] }
    if (cur.find((x: any) => x.id === p.id)) {
      cur = cur.filter((x: any) => x.id !== p.id)
    } else {
      cur.push(p)
    }
    localStorage.setItem("wishlist", JSON.stringify(cur))
    setWishlist(cur)
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="p-6 text-center">
        <h1 className="text-4xl font-black leading-tight">Everyday Kitchen Essentials for</h1>
        <p className="text-gray-600 mt-2 text-sm">Ghar ke kaam asan banayen! Premium quality organizers.</p>
        <div className="mt-4 flex justify-center gap-3">
          <button className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm">Shop New Arrivals</button>
          <button className="bg-pink-100 text-black px-6 py-3 rounded-full font-bold text-sm">Shop Best Sellers</button>
        </div>
        <div className="mt-4 flex justify-center items-center gap-3 text-xs">
          <span className="bg-black text-white px-3 py-1 rounded-full">Ends In: 02:13:11</span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px]">Auto Price Sync: ON</span>
          <span className="text-blue-600 text-[10px]">Dynamic Cron: Active</span>
        </div>
      </section>

      <section className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="relative cursor-pointer" onClick={() => { setSelected(product); loadReviews(product.id) }}>
              <img src={product.image_url} className="w-full h-[300px] object-cover" alt={product.name} />
              <span className="absolute top-3 left-3 bg-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">-32% OFF</span>
              <span className="absolute bottom-3 right-3 bg-white text-[11px] px-2 py-1 rounded-full shadow font-bold">Al Safa</span>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 text-[11px] text-gray-600">
                <span>⭐ {product.rating || "4.8"} ({product.reviews_count || 127})</span>
                <span className="text-red-500">● {product.live_views || 23} viewing</span>
              </div>
              <h3 className="font-bold text-[13px] mt-1 leading-tight line-clamp-2">{product.name}</h3>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                Ab sabziyan, pyaz, aloo aik jagah — neat & clean! Har side se asani se access. Wheels ke sath - Jahan chahen move karen. Strong & Space Saving.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-black text-sm">Rs.{product.price_discounted || 1499}</span>
                <span className="text-[11px] line-through text-gray-400">Rs.{product.price_original || 2200}</span>
                <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full">-32%</span>
              </div>
              <div className="flex items-center justify-between mt-3 text-[12px]">
                <button onClick={() => toggleWishlist(product)} className="flex items-center gap-1">
                  {wishlist.find((x: any) => x.id === product.id) ? "❤️ Wishlist" : "♡ Wishlist"}
                </button>
                <span className="text-gray-400">Bundle</span>
              </div>
              <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer" className="mt-3 w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black py-3 rounded-full font-bold text-center block text-[14px] border border-[#F2C200]">
                Buy on Daraz
              </a>
            </div>
          </div>
        ))}
      </section>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image_url} className="w-full h-72 object-cover rounded-xl" alt="" />
            <h2 className="font-bold mt-3 text-sm">{selected.name}</h2>
            <p className="text-sm mt-1">Rs.{selected.price_original} <b>Rs.{selected.price_discounted}</b></p>

            <div className="mt-4 border-t pt-3">
              <h4 className="font-bold text-sm">⭐ Customer Reviews ({reviews.length})</h4>
              <div className="flex gap-1 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} onClick={() => setRating(s)} className={`text-2xl cursor-pointer ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                ))}
              </div>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Aapka Naam" className="w-full border p-2 rounded-lg mb-2 text-sm" />
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Apna 5 star review likhein..." className="w-full border p-2 rounded-lg mb-2 text-sm" rows={3}></textarea>
              <button onClick={submitReview} className="w-full bg-black text-white py-2.5 rounded-full font-bold text-sm">Review Submit Karo</button>

              <div className="mt-4 space-y-2 max-h-60 overflow-auto">
                {reviews.map((r: any) => (
                  <div key={r.id} className="bg-gray-50 p-2 rounded-lg">
                    <p className="font-bold text-xs">{r.customer_name} — <span className="text-yellow-500">{"★".repeat(r.rating)}</span></p>
                    <p className="text-xs mt-1">{r.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-xs text-gray-400">Abhi koi review nahi — pehla aap likhein!</p>}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <a href={selected.affiliate_link} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#FFD814] text-center py-3 rounded-full font-bold text-sm border">Buy on Daraz</a>
              <button onClick={() => setSelected(null)} className="flex-1 border py-3 rounded-full text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 border-t pt-6 pb-10 text-center bg-white">
        <div className="space-y-3">
          <p className="text-sm font-semibold">Email: alsafatraders7@gmail.com</p>
          <div className="flex justify-center gap-3">
            <span className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs">♪</span>
            <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">IG</span>
            <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">f</span>
          </div>
          <p className="text-[11px] text-gray-500">© 2026 Al Safa Traders.pk | Auto Price Sync: ON | Dynamic Cron: Active</p>
          <a href="/wishlist" className="text-xs underline">View Wishlist ({wishlist.length})</a>
        </div>
      </footer>
    </main>
  )
}
