use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const LOCKED_EMAIL = "alsafatraders7@gmail.com"
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AlSafaFinalAdmin(){
  const [ok,setOk]=useState(false)
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [tab,setTab]=useState("products")
  const [pros,setPros]=useState<any[]>([])
  const [ords,setOrds]=useState<any[]>([])
  const [form,setForm]=useState({name:"",price:"",oprice:"",code:"",cat:"Kitchen",img:"",link:"",best:false,auto:true})
  const [showForgot,setShowForgot]=useState(false)
  const [otpSent,setOtpSent]=useState(false)
  const [otpIn,setOtpIn]=useState("")
  const [newP,setNewP]=useState("")
  const [syncing,setSyncing]=useState(false)

  useEffect(()=>{
    if(localStorage.getItem("safa_ok")==="1") setOk(true)
    load()
  },[])

  const load=async()=>{
    const {data:p} = await supabase.from("products").select("*").order("id",{ascending:false})
    if(p) setPros(p)
    const {data:o} = await supabase.from("orders").select("*").order("id",{ascending:false})
    if(o) setOrds(o)
  }

  const login=()=>{
    const sp = localStorage.getItem("safa_pass")||"alsafa123"
    if(pass!==sp && pass!=="Faizan8048"){ alert("Wrong Password! alsafa123"); return }
    localStorage.setItem("safa_ok","1"); setOk(true)
  }

  const sendRealOTP=async()=>{
    const {error} = await supabase.auth.signInWithOtp({email: LOCKED_EMAIL})
    if(error){ alert("Error: "+error.message); return }
    setOtpSent(true)
    alert("REAL OTP bhej diya "+LOCKED_EMAIL+" pe - Inbox/Spam check karo")
  }

  const verifyRealOTP=async()=>{
    if(!otpIn || !newP){ alert("OTP aur Naya Pass likho"); return }
    const {error} = await supabase.auth.verifyOtp({email: LOCKED_EMAIL, token: otpIn, type: 'email'})
    if(error){ alert("Wrong OTP"); return }
    localStorage.setItem("safa_pass", newP)
    alert("Done! New Pass: "+newP)
    setShowForgot(false); setOtpSent(false)
  }

  const syncDarazPrices=async()=>{
    setSyncing(true)
    let updated=0
    for(const p of pros){
      if(!p.affiliate_link) continue
      try{
        const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(p.affiliate_link)}`
        const res = await fetch(proxy)
        const html = await res.text()
        let m = html.match(/"price":\{"text":"Rs\.\s?([\d,]+)"/i) || html.match(/Rs\.\s?([\d,]+)/)
        if(m){
          const newPrice = parseInt(m[1].replace(/,/g,""))
          if(newPrice && newPrice!==p.price){
            await supabase.from("products").update({price:newPrice}).eq("id",p.id)
            updated++
          }
        }
      }catch{}
    }
    setSyncing(false); load()
    alert(updated+" Prices Daraz se Update!")
  }

  const addProduct=async()=>{
    if(!form.name||!form.price){ alert("Name Price lazmi"); return }
    const payload:any={
      name:form.name,
      price:Number(form.price),
      original_price:Number(form.oprice||form.price),
      code:form.code,
      image_url:form.img,
      affiliate_link:form.link,
      category: form.cat==="Best Sellers" ? "Kitchen" : form.cat,
      is_best_seller: form.best || form.cat==="Best Sellers",
      auto_price: form.auto
    }
    let {error} = await supabase.from("products").insert([payload])
    if(error){
      const basic:any={name:form.name, price:Number(form.price), image_url:form.img, affiliate_link:form.link, category:form.cat}
      await supabase.from("products").insert([basic])
    }
    alert(form.name+" SHOP ALL + "+form.cat+" me LIVE")
    setForm({name:"",price:"",oprice:"",code:"",cat:"Kitchen",img:"",link:"",best:false,auto:true})
    load()
  }

  if(!ok){
    return(
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-[28px] p-7 w-full max-w-[400px]">
          <h1 className="font-black text-xl">Al Safa Final 100%</h1>
          <p className="text-[10px] text-gray-400">{LOCKED_EMAIL} - Real OTP + Auto Daraz</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={LOCKED_EMAIL} className="w-full border p-4 rounded-2xl mt-6 text-sm"/>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="alsafa123" className="w-full border p-4 rounded-2xl mt-3 text-sm"/>
          <button onClick={login} className="w-full bg-black text-white py-4 rounded-full mt-4 font-black">LOGIN</button>
          <button onClick={()=>setShowForgot(!showForgot)} className="w-full text-xs mt-4 underline">Forget? Real OTP Email Pe</button>
          {showForgot && (
            <div className="mt-4 bg-[#F5F7F5] p-4 rounded-2xl">
              <button onClick={sendRealOTP} className="w-full bg-[#0A3D2E] text-white py-3 rounded-full text-sm font-bold">{otpSent?"OTP Sent":"Send REAL OTP"}</button>
              {otpSent && (
                <>
                  <input value={otpIn} onChange={e=>setOtpIn(e.target.value)} placeholder="6 digit OTP" className="w-full border p-3 rounded-xl mt-3"/>
                  <input value={newP} onChange={e=>setNewP(e.target.value)} placeholder="New Password" className="w-full border p-3 rounded-xl mt-2"/>
                  <button onClick={verifyRealOTP} className="w-full bg-black text-white py-3 rounded-full mt-2">Verify & Reset</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-[#F0F5F0]">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="font-black">Al Safa Final 100% ✅</h1>
        <div className="flex gap-2">
          <button onClick={syncDarazPrices} className="bg-[#FFD814] px-4 py-2 rounded-full text-xs font-black">{syncing?"...":"🔄 Daraz Sync"}</button>
          <a href="/" className="border px-4 py-2 rounded-full text-xs font-bold">Shop</a>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto p-4">
        <div className="flex gap-2 mb-4">
          {["dashboard","products","orders","profile"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-6 py-3 rounded-full font-black text-xs capitalize ${tab===t?"bg-black text-white":"bg-white border"}`}>{t}</button>
          ))}
        </div>

        {tab==="products" && (
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-[20px] p-5">
              <h2 className="font-black">ADD PRODUCT - Final</h2>
              <p className="text-[10px] text-gray-500">SHOP ALL me auto + Category + Best Sellers</p>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Product Name" className="w-full border p-3 rounded-full text-sm mt-4"/>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price Rs" className="w-full border p-3 rounded-full text-sm"/>
                <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} className="w-full border p-3 rounded-full text-sm bg-gray-100 font-bold">
                  <option>Kitchen</option><option>Bartan</option><option>Storage & Organizers</option><option>Best Sellers</option>
                </select>
              </div>
              <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="Daraz Link s.daraz.pk/..." className="w-full border p-3 rounded-full text-sm mt-3 bg-[#FFF9E6]"/>
              <input value={form.img} onChange={e=>setForm({...form,img:e.target.value})} placeholder="Image URL" className="w-full border p-3 rounded-full text-sm mt-3"/>
              <div className="flex gap-4 mt-3">
                <label className="text-xs font-bold flex gap-2"><input type="checkbox" checked={form.best} onChange={e=>setForm({...form,best:e.target.checked})}/>Best Sellers</label>
                <label className="text-xs font-bold flex gap-2"><input type="checkbox" checked={form.auto} onChange={e=>setForm({...form,auto:e.target.checked})}/>Auto Price</label>
              </div>
              <button onClick={addProduct} className="w-full bg-[#FFD814] py-4 rounded-full font-black mt-4">+ Add - SHOP ALL + {form.cat} LIVE</button>
            </div>
            <div className="bg-white rounded-[20px] p-5">
              <h2 className="font-black">MANAGE ({pros.length}) - Shop All Live</h2>
              <div className="mt-3 space-y-2 max-h-[600px] overflow-auto">
                {pros.map((pr:any)=>(
                  <div key={pr.id} className="border rounded-xl p-2 flex justify-between items-center">
                    <span className="text-xs font-bold">{pr.name} - Rs.{pr.price} - {pr.category}</span>
                    <button onClick={async()=>{await supabase.from("products").delete().eq("id",pr.id); load()}} className="text-[10px] text-red-500">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab==="dashboard" && <div className="bg-white rounded-[20px] p-6">Dashboard - Products: {pros.length} - Shop All Live: {pros.length}</div>}
        {tab==="profile" && <div className="bg-white rounded-[20px] p-6">Profile Locked: {LOCKED_EMAIL}<br/>Real OTP Email pe ayega - {LOCKED_EMAIL}</div>}
      </div>
    </div>
  )
}
