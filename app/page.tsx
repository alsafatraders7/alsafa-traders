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
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(url, key)
      const { error } = await supabase.from("reviews").insert({ product_id: selected.id, customer_name: name, rating, comment })
      if (!error) { alert("Review add ho gaya"); setName(""); setComment(""); loadReviews(selected.id) }
    } catch {}
  }

  const cats = ["Shop All", "Best Sellers", "Kitchen", "Bartan", "Storage & Organizers"]
  const filtered = products.filter((p: any) => {
    const s =!search || p.name?.toLowerCase()?.includes(search.toLowerCase())
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
          <button key={c} onClick={() => setCat(c)} className={`${cat === c? "bg-white text-[#1A3C34]" : "text-white/70"} px-5 py-2 rounded-full text-sm font-bold shrink-0`}>{c}</button>
        ))}
      </div>

      <main className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-6 items-start">
        <div>
          <h1 className="text-[26px] font-black text-[#1A3C34]">Welcome to Safa traders</h1>
          <h2 className="text-[38px] font-black text-[#1A3C34] leading-[0.9] mt-2">Everyday Kitchen<br />Essentials for <span className="bg-[#FFEB3B] px-2">Smart Homes</span></h2>
          <p className="text-[#1A3C34]/80 mt-4 text-[15px]">Ghar ke kaam asan banayen! Premium quality choppers, strainers, storage & organizers - jo har kitchen me chahiye.</p>
