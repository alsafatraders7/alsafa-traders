"use client"
import { useState, useEffect } from "react"

const LOCKED_EMAIL = "alsafatraders7@gmail.com"

export default function Admin() {
  const [isLogin, setIsLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [tab, setTab] = useState("dashboard")
  const [showShop, setShowShop] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(()=>{
    if(typeof window!== 'undefined' && localStorage.getItem("safa_admin")==="true") setIsLogin(true)
  },[])

  const login = ()=>{
    const savedPass = typeof window!== 'undefined'? localStorage.getItem("safa_pass") || "alsafa123" : "alsafa123"
    if(email.toLowerCase()!==LOCKED_EMAIL){ alert("Sirf "+LOCKED_EMAIL+" allowed hai!"); return }
    if(pass!==savedPass){ alert("Wrong Password!"); return }
    localStorage.setItem("safa_admin","true"); setIsLogin(true)
  }

  if(!isLogin){
    return (
      <div className="min-h-screen bg-[#E8F5E9] flex items-center justify-center p-4">
        <div className="bg-white rounded-[24px] p-7 w-full max-w-[380px]">
          <h1 className="font-black text-xl">Al Safa - Personal Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Locked to {LOCKED_EMAIL}</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="alsafatraders7@gmail.com" className="border w-full p-3 rounded-xl mt-5 text-sm"/>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="border w-full p-3 rounded-xl mt-3 text-sm"/>
          <button onClick={login} className="bg-black text-white w-full py-3 rounded-full mt-4 font-bold">Login</button>
          <p className="text-[10px] text-gray-400 mt-3 text-center">Default: alsafa123</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col md:flex-row">
      {/* ADMIN - Laptop 60% / Phone 100% */}
      <div className={`${showShop? 'hidden md:block' : 'block'} w-full md:w-[60%] p-3 h-screen overflow-auto`}>
        <div className="flex justify-between items-center">
          <h1 className="font-black">Al Safa - Full Admin</h1>
          <div className="flex gap-2">
            <button onClick={()=>setShowShop(!showShop)} className="md:hidden bg-white px-3 py-1.5 rounded-full text-xs font-bold"> {showShop? "Admin" : "Shop Dekho"} </button>
            <button onClick={()=>{localStorage.removeItem("safa_admin"); setIsLogin(false)}} className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs">Logout</button>
          </div>
        </div>

        <div className="flex gap-2 mt-4 overflow-auto">
          {["dashboard","products","orders","profile"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${tab===t?"bg-black text-white":"bg-white"}`}>{t}</button>
          ))}
        </div>

        {tab==="dashboard" && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white rounded-2xl p-4"><p className="text-xs">Total Orders</p><p className="text-2xl font-black">{orders.length}</p></div>
            <div className="bg-white rounded-2xl p-4"><p className="text-xs">Views</p><p className="text-2xl font-black">187</p></div>
          </div>
        )}
        {tab==="products" && <div className="bg-white rounded-2xl p-4 mt-4 text-sm">Products yahan add honge - Supabase connect karke. Filhal build fix ho gaya hai!</div>}
        {tab==="profile" && <div className="bg-white rounded-2xl p-4 mt-4 text-sm">Email: {LOCKED_EMAIL} (Locked) <br/> Phone & Password LocalStorage me save hai.</div>}
      </div>

      {/* SHOP - Laptop 40% / Phone toggle */}
      <div className={`${showShop? 'block' : 'hidden md:block'} w-full md:w-[40%] bg-white border-l h-screen md:sticky top-0`}>
        <div className="p-2 bg-black text-white text-xs flex justify-between"><span>Live Shop</span><button onClick={()=>setShowShop(false)} className="md:hidden bg-white text-black px-2 rounded-full">Admin</button></div>
        <iframe src="https://alsafa-traders.vercel.app" className="w-full h-[92%] border-0"></iframe>
      </div>
    </div>
  )
}
