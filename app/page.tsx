"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

type Product = {
  id: number
  name: string
  image_url: string
  images?: string[]
  price: number
  price_original: number
  price_discounted: number
  affiliate_link: string
  rating: number
  reviews_count: number
  live_views: number
  stock: number
  category: string
}

function ReviewsBox({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const loadReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false })
    if (data) setReviews(data)
  }
  useEffect(() => { loadReviews() }, [productId])

  const submitReview = async () => {
    if (!name ||!comment) return alert("Naam aur Review likhna zaroori hai")
    setLoading(true)
    const { error } = await supabase.from("reviews").insert({ product_id: productId, customer_name: name, rating, comment })
    setLoading(false)
    if (!error) {
      alert("Shukriya! Aapka 5 star review add ho gaya ⭐")
      setName(""); setComment(""); setRating(5)
      loadReviews()
    } else {
      alert("Error: "+error.message)
    }
  }

  return (
    <div className="mt-4 border-t pt-3">
      <h4 className="font-bold text-sm mb-2">⭐ Customer Reviews ({reviews.length})</h4>
      <div className="flex gap-1 mb-2">
        {[1,2,3,4,5].map(s=>(
          <span key={s} onClick={()=>setRating(s)} className={`text-2xl cursor-pointer ${s<=rating? "text-yellow-400" : "text-gray-300"}`}>★</span>
        ))}
      </div>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Aapka Naam" className="w-full border p-2 rounded-lg mb-2 text-sm" />
      <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Apna review likhein..." className="w-full border p-2 rounded-lg mb-2 text-sm" rows={2}></textarea>
      <button onClick={submitReview} disabled={loading} className="w-full bg-black text-white py-2 rounded-full text-sm font-bold">{loading? "..." : "Review Submit Karo"}</button>

      <div className="mt-3 space-y-2 max-h-40 overflow-auto">
        {reviews.map(r=>(
          <div key={r.id} className="bg-gray-50 p-2 rounded-lg">
            <p className="font-bold text-xs">{r.customer_name} — <span className="text-yellow-500">{"★".repeat(r.rating)}</span></p>
            <p className="text-xs">{r.comment}</p>
          </div>
        ))}
        {reviews.length===0 && <p className="text-xs text-gray-400">Abhi koi review nahi — pehla review aap likhein!</p>}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("id", { ascending: false })
      if (data) setProducts(data as any)
    }
    fetchProducts()
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setWishlist(saved.map((p:any)=>p.id || p))
  }, [])

  const toggleWishlist = (p: Product) => {
    let current = JSON.parse(localStorage.getItem("wishlist") || "[]")
    const exists = current.find((x:any)=> (x.id||x) === p.id)
    if (exists) {
      current = current.filter((x:any)=> (x.id||x)!== p.id)
    } else {
      current.push(p)
    }
    localStorage.setItem("wishlist", JSON.stringify(current))
    setWishlist(current.map((x:any)=>x.id||x))
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="p-6 text-center">
        <h1 className="text-4xl font-black">Everyday Kitchen Essentials for</h1>
        <p className="text-gray-600 mt-2">Ghar ke kaam asan banayen! Premium quality organizers - jo har kitchen me chahiye.</p>
        <div className="mt-4 flex justify-center gap-3">
          <button className="bg-black text-white px-6 py-3 rounded-full font-bold">Shop New Arrivals</button>
          <button className="bg-pink-100 px-6 py-3 rounded-full">Shop Best Sellers</button>
        </div>
        <div className="mt-4 flex justify-center items-center gap-3">
          <span className="text-xs">Follow Us On:</span>
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">f</span>
          <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center">♪</span>
          <span className="bg-gradient-to-br from-yellow-400 to-pink-500 w-8 h-8 rounded-full"></span>
        </div>
        <div className="mt-3 flex justify-center gap-4 text-xs">
          <span className="bg-black text-white px-3 py-1 rounded-full">⏳ Ends In: 02:13:11</span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">● Auto Price Sync: ON</span>
          <span className="text-blue-600">Dynamic Cron: Active</span>
        </div>
      </section>

      {/* Products */}
      <section className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="border rounded-2xl overflow-hidden shadow-sm">
            <div className="relative cursor-pointer" onClick={()=>setSelectedProduct(product)}>
              <img src={product.image_url} className="w-full h-72 object-cover" />
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">-32% OFF</span>
              <span className="absolute bottom-2 right-2 bg-white text-xs px-2 py-1 rounded shadow">Al Safa</span>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 text-xs">
                <span>⭐ {product.rating || 4.8} ({product.reviews_count || 127})</span>
                <span className="text-red-500">● {product.live_views || 23} viewing</span>
              </div>
              <h3 className="font-bold text-sm mt-1 line-clamp-1">{product.name}</h3>
              <p className="text-xs text-gray-500">Storage & Organizers</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs line-through text-gray-400">Rs.{product.price_original || 2200}</span>
                <span className="font-black">Rs.{product.price_discounted || product.price || 1499}</span>
                <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full">-32%</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={()=>toggleWishlist(product)} className="text-xs flex items-center gap-1">{wishlist.includes(product.id)? "❤️ Wishlist" : "♡ Wishlist"}</button>
                <span className="text-xs ml-auto">Bundle</span>
              </div>
              <a href={product.affiliate_link} target="_blank" className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2.5 rounded-full font-bold text-center block text-sm">
                Buy on Daraz
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Product Modal with Reviews */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4" onClick={()=>setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto p-4" onClick={e=>e.stopPropagation()}>
            <img src={selectedProduct.image_url} className="w-full h-64 object-cover rounded-xl"/>
            <h2 className="font-bold mt-3">{selectedProduct.name}</h2>
            <p className="text-sm">Rs.{selectedProduct.price_original} <b>Rs.{selectedProduct.price_discounted}</b></p>
            <ReviewsBox productId={selectedProduct.id} />
            <div className="mt-3 flex gap-2">
              <a href={selectedProduct.affiliate_link} target="_blank" className="flex-1 bg-yellow-400 text-center py-2 rounded-full font-bold">Buy on Daraz</a>
              <button onClick={()=>setSelectedProduct(null)} className="flex-1 border py-2 rounded-full">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER - EMAIL FIXED ABOVE SOCIAL */}
      <footer className="mt-12 border-t pt-6 pb-10 text-center">
        <div className="space-y-3">
          <p className="text-sm font-semibold">Email: alsafatraders7@gmail.com</p>
          <div className="flex justify-center gap-3">
            <a className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">f</a>
            <a className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs">♪</a>
            <a className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">IG</a>
          </div>
          <p className="text-[11px] text-gray-500">© 2026 Al Safa Traders.pk | Auto Price Sync: ON | Dynamic Cron: Active</p>
          <Link href="/wishlist" className="text-xs underline">View Wishlist ({wishlist.length})</Link>
        </div>
      </footer>
    </main>
  )
}
