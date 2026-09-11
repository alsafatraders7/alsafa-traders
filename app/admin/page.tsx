"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const LOCKED_EMAIL = "alsafatraders7@gmail.com"

export default function AdminFull() {
  const [isLogin, setIsLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [tab, setTab] = useState("dashboard")
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [form, setForm] = useState({ name:"", price:"", stock:"10", category:"Kitchen", desc:"", caption:"", link:"" })
  const [file, setFile] = useState<File|null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(localStorage.getItem("safa_admin")==="true") setIsLogin(true)
    loadAll()
  },[])

  const loadAll = async ()=>{
    const {data:p} = await supabase.from("products").select("*").order("id",{ascending:false})
    if(p) setProducts(p)
    const {data:o} = await supabase.from("orders").select("*").order("id",{ascending:false})
    if(o) setOrders(o)
  }

  const login = ()=>{
    const savedPass = localStorage.getItem("safa_pass") || "alsafa123"
    if(email.toLowerCase()!==LOCKED_EMAIL){ alert("Sirf "+LOCKED_EMAIL+" allowed!"); return }
    if(pass!==savedPass){ alert("Wrong Password!"); return }
    localStorage.setItem("safa_admin","true"); setIsLogin(true)
  }

  const uploadImage = async ()=>{
    if(!file) return ""
    const name = Date.now()+"_"+file.name
    const {error} = await supabase.storage.from("product-images").upload(name, file)
    if(error){ alert(error.message); return "" }
    return supabase.storage.from("product-images").getPublicUrl(name).data.publicUrl
  }

  const addProduct = async ()=>{
    if(!form.name ||!form.price) return alert("Name/Price lazmi!")
    setLoading(true)
    const url = await uploadImage()
    await supabase.from("products").insert([{
      name: form.name, price: Number(form.price), image_url: url,
      caption: form.caption, link: form.link, stock: Number(form.stock),
      category: form.category, description: form.desc
    }])
    setForm({ name:"", price:"", stock:"10", category:"Kitchen", desc:"", caption:"", link:"" })
    setFile(null); setLoading(false); loadAll(); setTab("products")
  }

  if(!isLogin){
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-[24px] p-8 w-full max-w-[400px]">
          <h1 className="font-black text-2xl">Al Safa Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Personal — Locked to {LOCKED_EMAIL}</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={LOCKED_EMAIL} className="border w-full p-3.5 rounded-xl mt-6 text-sm"/>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password: alsafa123" className="border w-full p-3.5 rounded-xl mt-3 text-sm"/>
          <button onClick={login} className="bg-black text-white w-full py-3.5 rounded-full mt-5 font-bold">Login to Full Admin</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] p-3 md:p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
          <h1 className="font-black text-lg md:text-xl">Al Safa - Full Admin</h1>
          <div className="flex gap-2">
            <a href="/" target="_blank" className="bg-white border px-4 py-2 rounded-full text-xs md:text-sm font-bold">Shop Dekho</a>
            <button onClick={()=>{localStorage.removeItem("safa_admin"); setIsLogin(false)}} className="bg-red-500 text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold">Logout</button>
          </div>
        </div>

        <div className="flex gap-2 mt-5 overflow-auto pb-2">
          {["dashboard","products","orders","profile"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-6 py-3 rounded-full text-sm font-bold capitalize whitespace-nowrap ${tab===t?"bg-black text-white":"bg-white border"}`}>{t}</button>
          ))}
        </div>

        {tab==="dashboard" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-5">
            <div className="bg-white rounded-[20px] p-5 md:p-6"><p className="text-xs text-gray-500">Total Orders</p><p className="text-3xl font-black mt-2">{orders.length}</p></div>
            <div className="bg-white rounded-[20px] p-5 md:p-6"><p className="text-xs text-gray-500">Total Products</p><p className="text-3xl font-black mt-2">{products.length}</p></div>
            <div className="bg-white rounded-[20px] p-5 md:p-6"><p className="text-xs text-gray-500">Total Sale</p><p className="text-2xl font-black mt-2">Rs. {orders.reduce((s:any,o:any)=>s+(o.total||0),0)}</p></div>
            <div className="bg-white rounded-[20px] p-5 md:p-6"><p className="text-xs text-gray-500">Views</p><p className="text-3xl font-black mt-2">187+</p></div>
          </div>
        )}

        {tab==="products" && (
          <div className="grid md:grid-cols-2 gap-5 mt-5">
            <div className="bg-white rounded-[20px] p-5">
              <h2 className="font-bold mb-4">Add New Product - Full Screen</h2>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Product Name" className="border rounded-xl p-3 w-full mb-3 text-sm"/>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price" type="number" className="border rounded-xl p-3 w-full mb-3 text-sm"/>
                <input value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="Stock" type="number" className="border rounded-xl p-3 w-full mb-3 text-sm"/>
              </div>
              <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category: Kitchen, Storage" className="border rounded-xl p-3 w-full mb-3 text-sm"/>
              <input value={form.caption} onChange={e=>setForm({...form,caption:e.target.value})} placeholder="Caption" className="border rounded-xl p-3 w-full mb-3 text-sm"/>
              <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="Daraz Link" className="border rounded-xl p-3 w-full mb-3 text-sm"/>
              <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="Description" className="border rounded-xl p-3 w-full mb-3 text-sm h-20"/>
              <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} className="text-xs mb-4"/>
              <button onClick={addProduct} disabled={loading} className="bg-black text-white w-full py-3.5 rounded-full font-bold text-sm">{loading?"Uploading...":"Add Product (Working)"}</button>
            </div>
            <div className="bg-white rounded-[20px] p-5 h-fit">
              <h2 className="font-bold mb-4">All Products ({products.length})</h2>
              <div className="space-y-2 max-h-[600px] overflow-auto">
                {products.map((p:any)=><div key={p.id} className="flex justify-between items-center py-3 border-b text-sm"><div><p className="font-bold">{p.name}</p><p className="text-xs text-gray-500">Rs.{p.price} - Stock:{p.stock}</p></div><button onClick={async()=>{await supabase.from("products").delete().eq("id",p.id); loadAll()}} className="text-red-500 font-bold text-xs border px-3 py-1 rounded-full">Delete</button></div>)}
              </div>
            </div>
          </div>
        )}

        {tab==="orders" && (
          <div className="bg-white rounded-[20px] p-5 mt-5">
            <h2 className="font-bold mb-4">All Orders - Full Working ({orders.length})</h2>
            {orders.length===0? <p className="text-sm text-gray-500 py-10 text-center">Abhi koi order nahi — Jab order ayega yahan full detail ayegi: Name, Phone, Address, Total</p> :
            <div className="space-y-3">{orders.map((o:any)=><div key={o.id} className="border rounded-xl p-4 text-sm"><p className="font-bold">Order #{o.id} - Rs.{o.total}</p><p className="text-xs text-gray-600 mt-1">{o.customer_name} | {o.customer_phone} | {o.customer_address}</p><p className="text-xs mt-1">{JSON.stringify(o.items||[]).slice(0,100)}</p></div>)}</div>}
          </div>
        )}

        {tab==="profile" && (
          <div className="bg-white rounded-[20px] p-6 mt-5 max-w-[600px]">
            <h2 className="font-bold text-lg">Personal Profile - Locked</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="bg-[#F5F7F5] p-4 rounded-xl"><p className="text-xs text-gray-500">Email (Locked - Change nahi hoga)</p><p className="font-bold mt-1">{LOCKED_EMAIL}</p></div>
              <div className="bg-[#F5F7F5] p-4 rounded-xl"><p className="text-xs text-gray-500">Phone</p><input id="phoneInput" placeholder="+92 3XX XXXXXXX" defaultValue={localStorage.getItem("safa_phone")||""} className="bg-transparent font-bold mt-1 w-full outline-none"/></div>
              <div className="bg-[#F5F7F5] p-4 rounded-xl"><p className="text-xs text-gray-500">New Password</p><input id="passInput" placeholder="New Password" className="bg-transparent font-bold mt-1 w-full outline-none"/></div>
              <button onClick={()=>{const ph=(document.getElementById("phoneInput") as any).value; const ps=(document.getElementById("passInput") as any).value; if(ph) localStorage.setItem("safa_phone",ph); if(ps) localStorage.setItem("safa_pass",ps); alert("Saved!");}} className="bg-black text-white w-full py-3 rounded-full font-bold mt-2">Save Profile</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
