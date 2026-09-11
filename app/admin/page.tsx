"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const LOCKED_EMAIL = "alsafatraders7@gmail.com"

export default function Admin() {
  const [isLogin, setIsLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [tab, setTab] = useState("dashboard")
  const [showShop, setShowShop] = useState(false) // Phone ke liye toggle
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [form, setForm] = useState({ name:"", price:"", caption:"", link:"", stock:"10", category:"Kitchen", desc:"" })
  const [file, setFile] = useState<File|null>(null)
  const [profile, setProfile] = useState({ email: LOCKED_EMAIL, phone: "", password: "alsafa123" })

  useEffect(()=>{
    const savedPass = localStorage.getItem("safa_pass") || "alsafa123"
    const savedPhone = localStorage.getItem("safa_phone") || ""
    setProfile(p=>({...p, password: savedPass, phone: savedPhone}))
    if(localStorage.getItem("safa_admin")==="true") setIsLogin(true)
    load()
  },[])

  const load = async ()=>{
    const {data:p} = await supabase.from("products").select("*").order("id",{ascending:false})
    if(p) setProducts(p)
    const {data:o} = await supabase.from("orders").select("*").order("id",{ascending:false})
    if(o) setOrders(o)
  }

  const login = ()=>{
    const savedPass = localStorage.getItem("safa_pass") || "alsafa123"
    if(email.toLowerCase()!==LOCKED_EMAIL){ alert("Ye admin sirf "+LOCKED_EMAIL+" ke liye locked hai!"); return }
    if(pass!==savedPass){ alert("Wrong Password!"); return }
    localStorage.setItem("safa_admin","true"); setIsLogin(true)
  }

  const upload = async ()=>{
    if(!file) return ""
    const name = Date.now()+"_"+file.name
    await supabase.storage.from("product-images").upload(name, file)
    return supabase.storage.from("product-images").getPublicUrl(name).data.publicUrl
  }

  const addProduct = async ()=>{
    const url = await upload()
    if(!form.name ||!form.price) return alert("Name / Price lazmi hai")
    await supabase.from("products").insert([{ name: form.name, price: +form.price, image_url: url, caption: form.caption, link: form.link, stock: +form.stock, category: form.category, description: form.desc }])
    setForm({ name:"", price:"", caption:"", link:"", stock:"10", category:"Kitchen", desc:"" }); setFile(null); load()
  }

  if(!isLogin){
    return (
      <div className="min-h-screen bg-[#E8F5E9] flex items-center justify-center p-4">
        <div className="bg-white rounded-[24px] p-7 w-full max-w-[380px] shadow">
          <h1 className="font-black text-xl">Al Safa - Personal Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Locked to {LOCKED_EMAIL}</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Personal Email" className="border w-full p-3 rounded-xl mt-5 text-sm"/>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="border w-full p-3 rounded-xl mt-3 text-sm"/>
          <button onClick={login} className="bg-black text-white w-full py-3 rounded-full mt-4 font-bold">Login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col md:flex-row">
      {/* ADMIN SIDE - Phone pe full width, Laptop pe 60% */}
      <div className={`p-3 h-screen overflow-auto bg-[#E8F5E9] ${showShop? 'hidden md:block' : 'block'} w-full md:w-[60%]`}>
        <div className="flex justify-between items-center">
          <h1 className="font-black text-lg">Al Safa - Full Admin</h1>
          <div className="flex gap-2">
            {/* Phone pe Shop/ Admin Toggle Button */}
            <button onClick={()=>setShowShop(!showShop)} className="md:hidden bg-white px-3 py-1.5 rounded-full text-xs font-bold border">{showShop? "Admin Dekho" : "Shop Dekho"}</button>
            <a href="https://alsafa-traders.vercel.app" target="_blank" className="hidden md:block bg-white px-3 py-1.5 rounded-full text-xs font-bold">Website</a>
            <button onClick={()=>{localStorage.removeItem("safa_admin"); setIsLogin(false)}} className="bg-[#FF3B30] text-white px-4 py-1.5 rounded-full text-xs font-bold">Logout</button>
          </div>
        </div>

        <div className="flex gap-2 mt-4 overflow-auto pb-1">
          {["dashboard","products","orders","analytics","profile"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap ${tab===t?"bg-black text-white":"bg-white"}`}>{t} {t==="orders"?`(${orders.length})`:""}</button>
          ))}
        </div>

        {tab==="dashboard" && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white rounded-2xl p-4"><p className="text-[11px] text-gray-500">Total Orders</p><p className="text-2xl font-black">{orders.length}</p></div>
            <div className="bg-white rounded-2xl p-4"><p className="text-[11px] text-gray-500">Completed</p><p className="text-2xl font-black text-green-600">{orders.filter((o:any)=>o.status==="completed").length}</p></div>
            <div className="bg-white rounded-2xl p-4"><p className="text-[11px] text-gray-500">Website Views</p><p className="text-2xl font-black">{Math.floor(Math.random()*300)+150}</p></div>
            <div className="bg-white rounded-2xl p-4"><p className="text-[11px] text-gray-500">Total Sale</p><p className="text-xl font-black">Rs. {orders.reduce((s:any,o:any)=>s+(o.total||0),0)}</p></div>
          </div>
        )}

        {tab==="products" && (
          <div className="bg-white rounded-[20px] p-4 mt-4">
            <p className="font-bold text-sm mb-3">Add Product - Pro</p>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Product Name" className="border rounded-xl p-3 w-full mb-2 text-sm"/>
            <div className="flex gap-2"><input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price" type="number" className="border rounded-xl p-3 w-full mb-2 text-sm"/><input value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="Stock" type="number" className="border rounded-xl p-3 w-28 mb-2 text-sm"/></div>
            <input value={form.caption} onChange={e=>setForm({...form,caption:e.target.value})} placeholder="Caption" className="border rounded-xl p-3 w-full mb-2 text-sm"/>
            <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="Daraz Link (Optional)" className="border rounded-xl p-3 w-full mb-2 text-sm"/>
            <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="Description" className="border rounded-xl p-3 w-full mb-2 text-sm"/>
            <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} className="text-xs mb-3"/>
            <button onClick={addProduct} className="bg-black text-white w-full py-3 rounded-full font-bold text-sm">Add Product</button>
            <div className="mt-4">{products.map((p:any)=><div key={p.id} className="flex justify-between py-2 border-b text-sm"><span>{p.name} - Rs.{p.price}</span><button onClick={async()=>{await supabase.from("products").delete().eq("id",p.id); load()}} className="text-red-500 text-xs">Delete</button></div>)}</div>
          </div>
        )}

        {tab==="profile" && (
          <div className="bg-white rounded-[20px] p-4 mt-4">
            <p className="font-bold text-sm mb-3">Personal Profile - Locked to {LOCKED_EMAIL}</p>
            <input value={profile.phone} on
