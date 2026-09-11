"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [ok, setOk] = useState(false)
  const [pass, setPass] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [form, setForm] = useState({ name: "", price: "", cat: "Kitchen", img: "", link: "", best: false })

  useEffect(() => {
    if (localStorage.getItem("safa_ok") === "1") setOk(true)
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false })
    if (data) setProducts(data)
  }

  const login = () => {
    if (pass === "alsafa123" || pass === "Faizan8048") {
      localStorage.setItem("safa_ok", "1")
      setOk(true)
    } else {
      alert("Wrong Password! alsafa123 likho")
    }
  }

  const add = async () => {
    if (!form.name ||!form.price) { alert("Name + Price"); return }
    await supabase.from("products").insert([{
      name: form.name,
      price: Number(form.price),
      image_url: form.img,
      affiliate_link: form.link,
      category: form.cat,
      is_best_seller: form.best || form.cat === "Best Sellers"
    }])
    alert(form.name + " SHOP ALL + " + form.cat + " me LIVE!")
    setForm({ name: "", price: "", cat: "Kitchen", img: "", link: "", best: false })
    load()
  }

  if (!ok) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-[28px] p-7 w-full max-w-[400px]">
          <h1 className="font-black text-xl">Al Safa Admin 100%</h1>
          <p className="text-[10px] text-gray-400">Original Real Supabase</p>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="alsafa123" className="w-full border p-4 rounded-2xl mt-6 text-sm" />
          <button onClick={login} className="w-full bg-black text-white py-4 rounded-full mt-4 font-black">LOGIN</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F5F0] p-4">
      <div className="flex justify-between items-center bg-white px-4 py-3 rounded-full mb-4">
        <h1 className="font-black">Al Safa Final ✅ Original</h1>
        <a href="/" className="border px-4 py-2 rounded-full text-xs font-bold">Shop</a>
      </div>
      <div className="grid lg:grid-cols-2 gap-5 max-w-[1280px] mx-auto">
        <div className="bg-white rounded-[20px] p-5">
          <h2 className="font-black">ADD PRODUCT</h2>
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Product Name" className="w-full border p-3 rounded-full text-sm mt-4" />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price Rs" className="w-full border p-3 rounded-full text-sm" />
            <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} className="w-full border p-3 rounded-full text-sm bg-gray-100 font-bold">
              <option>Kitchen</option><option>Bartan</option><option>Storage & Organizers</option><option>Best Sellers</option>
            </select>
          </div>
          <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="【entity-Daraz¦canonical_name=Daraz】 Affiliate Link s.【entity-daraz¦canonical_name=Daraz】.pk/..." className="w-full border p-3 rounded-full text-sm mt-3 bg-[#FFF9E6]" />
          <input value={form.img} onChange={e=>setForm({...form,img:e.target.value})} placeholder="Image URL" className="w-full border p-3 rounded-full text-sm mt-3" />
          <label className="flex gap-2 mt-3 text-xs font-bold"><input type="checkbox" checked={form.best} onChange={e=>setForm({...form,best:e.target.checked})}/> Best Sellers me bhi dikhao</label>
          <button onClick={add} className="w-full bg-[#FFD814] py-4 rounded-full font-black mt-4">+ ADD - SHOP ALL LIVE</button>
        </div>
        <div className="bg-white rounded-[20px] p-5">
          <h2 className="font-black">MANAGE ({products.length}) - Real</h2>
          <div className="mt-3 space-y-2 max-h-[600px] overflow-auto">
            {products.map((p:any)=>(<div key={p.id} className="border rounded-xl p-2 flex justify-between items-center"><span className="text-xs font-bold">{p.name} - Rs.{p.price}</span><button onClick={async()=>{await supabase.from("products").delete().eq("id",p.id); load()}} className="text-[10px] text-red-500 font-bold">Delete</button></div>))}
          </div>
        </div>
      </div>
    </div>
  )
}
