"use client"
import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [email, setEmail] = useState("admin@alsafatraders.pk")
  const [password, setPassword] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [darazUrl, setDarazUrl] = useState("")

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      setLoggedIn(true)
      fetchProducts()
    } else {
      alert("Login failed: " + error.message)
    }
  }

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false })
    if (data) setProducts(data)
  }

  const addProduct = async () => {
    const { error } = await supabase.from("products").insert([{ title, price: Number(price), daraz_url: darazUrl, is_active: true }])
    if (!error) {
      setTitle(""); setPrice(""); setDarazUrl("")
      fetchProducts()
      alert("ORIGINAL Product Added!")
    }
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f3d2e] p-4">
        <div className="bg-white p-8 rounded-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-[#0f3d2e] mb-1">Al Safa Traders.pk</h1>
          <p className="text-sm mb-6">Pakistan Based • ORIGINAL Owner Login</p>
          <input className="w-full border p-3 rounded mb-3" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input className="w-full border p-3 rounded mb-4" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your Password" />
          <button onClick={login} className="w-full bg-[#0f3d2e] text-white p-3 rounded font-bold">Login to ORIGINAL Account</button>
          <p className="text-xs mt-4 text-gray-500">Login: admin@alsafatraders.pk / Your Supabase Password</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Al Safa Traders.pk • ORIGINAL Admin • Pakistan Based</h1>
      <div className="bg-white p-6 rounded-xl mb-6">
        <h2 className="font-bold mb-4">+ Add ORIGINAL Product</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Product Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Price PKR" value={price} onChange={e=>setPrice(e.target.value)} />
        <input className="border p-2 rounded w-full mb-3" placeholder="Daraz Affiliate URL" value={darazUrl} onChange={e=>setDarazUrl(e.target.value)} />
        <button onClick={addProduct} className="bg-[#0f3d2e] text-white px-6 py-2 rounded">Add Product</button>
      </div>
      <div className="bg-white p-6 rounded-xl">
        <h2 className="font-bold mb-4">Products ({products.length})</h2>
        {products.map(p=>(
          <div key={p.id} className="border-b py-2 flex justify-between">
            <span>{p.title} - PKR {p.price}</span>
            <span className="text-xs text-green-600">Live</span>
          </div>
        ))}
      </div>
    </div>
  )
}
