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

  const getPrice = (p:any) => {
    return {
      current: p.price,
      original: p.price,
      discount: 0
    }
  }

  const filtered = products.filter((p: any) => {
    const s =!search || p.name?.toLowerCase()?.includes(search.toLowerCase())
    const c = cat === "Shop All"? true : cat === "Best Sellers"? p.is_best
