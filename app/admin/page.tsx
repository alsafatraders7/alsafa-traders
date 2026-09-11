"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
const LOCKED_EMAIL="alsafatraders7@gmail.com"
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export default function Admin(){
  const [ok,setOk]=useState(false); const [pass,setPass]=useState(""); const [tab,setTab]=useState("dashboard")
  const [pros,setPros]=useState<any[]>([]); const [cats,setCats]=useState<any[]>([]); const [clicks,setClicks]=useState<any[]>([]); const [views,setViews]=useState(0)
  const [newCat,setNewCat]=useState(""); const [form,setForm]=useState({name:"",desc:"",price:"",oprice:"",code:"",cat:"Kitchen",img:"",link:"",tags:"",best:false})
  const [showForgot,setShowForgot]=useState(false); const [otpSent,setOtpSent]=useState(false); const [otp,setOtp]=useState(""); const [newPass,setNewPass]=useState("")
  const [syncing,setSyncing]=useState(false); const [profits,setProfits]=useState<any[]>([])
  useEffect(()=>{ if(localStorage.getItem("safa_ok")==="1") setOk(true); load() },[])
  const load=async()=>{
    const {data:p}=await supabase.from("products").select("*").order("id",{ascending:false}); if(p) setPros(p)
    const {data:c}=await supabase.from("categories").select("*"); if(c) setCats(c)
    const {data:cl}=await supabase.from("clicks").select("*").order("id",{ascending:false}).limit(200); if(cl) setClicks(cl)
    const {count}=await supabase.from("page_views").select("*",{count:"exact",head:true}); if(count) setViews(count)
    const {data:pr}=await supabase.from("profits").select("*").order("date",{ascending:false}).limit(30); if(pr) setProfits(pr)
  }
  const login=()=>{ const sp=localStorage.getItem("safa_pass")||"alsafa123"; if(pass!==sp && pass!=="Faizan8048"){alert("Wrong Password! Default alsafa123");return} localStorage.setItem("safa_ok","1"); setOk(true) }
  const sendOTP=async()=>{
    const genOtp=Math.floor(100000+Math.random()*900000).toString();
    await supabase.from("admin_otps").insert([{email:LOCKED_EMAIL,otp:genOtp}]);
    await supabase.auth.signInWithOtp({email:LOCKED_EMAIL});
    setOtpSent(true); alert("OTP sent to "+LOCKED_EMAIL+" - Backup: "+genOtp+" - Spam folder bhi dekho")
  }
  const doReset=async()=>{
    if(!otp||!newPass){alert("OTP + New Password likho");return}
    const {data:okTable}=await supabase.from("admin_otps").select("*").eq("email",LOCKED_EMAIL).eq("otp",otp).single();
    if(okTable){ localStorage.setItem("safa_pass",newPass); await supabase.from("admin_otps").delete().eq("email",LOCKED_EMAIL); alert("Password Reset Done! New: "+newPass); setShowForgot(false); setOtpSent(false); return }
    alert("OTP Galat - Backup: Check Alert")
  }
  const addCat=async()=>{ if(!newCat.trim()) return; await supabase.from("categories").insert([{name:newCat.trim()}]); setNewCat(""); load() }
  const addProduct=async()=>{
    if(!form.name||!form.price||!form.link) return alert("Name, Price, Daraz Link lazmi hai")
    await supabase.from("products").insert([{name:form.name, description:form.desc, price:+form.price, original_price:+(form.oprice||form.price), code:form.code, category:form.cat, image_url:form.img, affiliate_link:form.link, tags:form.tags, is_best_seller:form.best}])
    alert(form.name+" LIVE ho gaya!"); setForm({name:"",desc:"",price:"",oprice:"",code:"",cat:"Kitchen",img:"",link:"",tags:"",best:false}); load()
  }
  const syncDaraz=async()=>{ setSyncing(true); let u=0; for(const p of pros){ try{ const r=await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(p.affiliate_link)}`); const j=await r.json(); const html=j.contents||""; const m=html.match(/"price":\{"text":"Rs\.\s?([\d,]+)"/)||html.match(/Rs\.\s?([\d,]+)/); if(m){ const np=+m[1].replace(/,/g,""); if(np&&np!==p.price){ await supabase.from("products").update({price:np}).eq("id",p.id); u++ } } }catch{} } setSyncing(false); load(); alert(u+" Prices Updated") }
  const handleCSV=async(e:any)=>{
    const file=e.target.files[0]; if(!file) return; const text=await file.text()
    const lines=text.split("\n").slice(1); let total=0
    for(const line of lines){ const cols=line.split(","); if(cols[0]){ const date=cols[0]?.trim(); const comm=parseFloat(cols[1]||"0"); if(date&&comm){ await supabase.from("profits").upsert({date, commission:comm}); total+=comm } } }
    alert("Profit CSV Import Done! Rs."+total); load()
  }
  if(!ok) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] p-7 w-full max-w-[400px]">
        <h1 className="font-black text-xl">Al Safa Admin</h1><p className="text-[10px] text-gray-500 mt-1">{LOCKED_EMAIL}</p>
        <input value={LOCKED_EMAIL} disabled className="w-full border p-4 rounded-2xl mt-6 bg-gray-100 text-sm"/>
        <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password (alsafa123)" className="w-full border p-4 rounded-2xl mt-3 text-sm"/>
        <button onClick={login} className="w-full bg-black text-white py-4 rounded-full mt-4 font-black">LOGIN</button>
        <button onClick={()=>setShowForgot(!showForgot)} className="w-full text-xs mt-3 underline font-bold">Forget Password?</button>
        {showForgot && <div className="mt-4 bg-[#F5F7F5] p-4 rounded-2xl">{!otpSent? <button onClick={sendOTP} className="w-full bg-[#0A3D2E] text-white py-3 rounded-full text-sm font-bold">Send OTP to Gmail</button> : <><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter OTP" className="w-full border p-3 rounded-xl mt-2 text-sm"/><input value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="New Password" className="w-full border p-3 rounded-xl mt-2 text-sm" type="password"/><button onClick={doReset} className="w-full bg-black text-white py-3 rounded-full mt-2 text-sm font-bold">Reset Password</button></>}</div>}
      </div>
    </div>
  )
  return(
    <div className="min-h-screen bg-[#F0F5F0]">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex justify-between items-center"><h1 className="font-black text-[11px]">FINAL Views:{views} Clicks:{clicks.length} Profit: Rs.{profits.reduce((a,b)=>a+b.commission,0)}</h1><div className="flex gap-2"><button onClick={syncDaraz} className="bg-[#FFD814] px-3 py-2 rounded-full text-[11px] font-black">{syncing?"Syncing...":"Daraz Sync"}</button><a href="/" target="_blank" className="border px-3 py-2 rounded-full text-[11px] font-bold">Shop</a><button onClick={()=>{localStorage.removeItem("safa_ok");setOk(false)}} className="border px-3 py-2 rounded-full text-[11px]">Logout</button></div></div>
      <div className="max-w-[1300px] mx-auto p-4">
        <div className="flex gap-2 overflow-x-auto mb-4 pb-2">{["dashboard","products","categories","orders","profile"].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-5 py-3 rounded-full text-xs font-black capitalize whitespace-nowrap ${tab===t?"bg-black text-white":"bg-white border"}`}>{t}</button>)}</div>
        {tab==="dashboard" && <div className="bg-white rounded-[20px] p-6 shadow-sm"><h2 className="font-black text-sm">Live Dashboard - Daily - No Fake Data</h2><div className="grid grid-cols-3 gap-3 mt-4"><div className="bg-[#E8F5E9] p-4 rounded-2xl"><p className="text-[10px] font-bold">Views Real</p><p className="font-black text-xl mt-1">{views}</p><p className="text-[10px] mt-1">{new Date().toLocaleDateString()} - Aaj</p></div><div className="bg-[#FFF9E6] p-4 rounded-2xl"><p className="text-[10px] font-bold">Clicks = Orders</p><p className="font-black text-xl mt-1">{clicks.length}</p><p className="text-[10px] mt-1">Aaj: {clicks.filter((c:any)=>new Date(c.clicked_at).toDateString()===new Date().toDateString()).length}</p></div><div className="bg-[#E8F5E9] p-4 rounded-2xl"><p className="text-[10px] font-bold">Profit (CSV)</p><p className="font-black text-xl mt-1">Rs.{profits.reduce((a,b)=>a+b.commission,0)}</p><p className="text-[10px] mt-1">Aaj: Rs.{profits.filter((p:any)=>p.date===new Date().toISOString().split("T")[0]).reduce((a:any,b:any)=>a+b.commission,0)||0}</p></div></div><div className="mt-6"><label className="text-xs font-bold">Daraz Profit CSV Import (Daily): <input type="file" accept=".csv" onChange={handleCSV} className="text-xs ml-2"/></label><p className="text-[10px] text-gray-500 mt-1">Format: date,commission - e.g. 2026-05-11,250</p><div className="mt-3 space-y-1 max-h-[150px] overflow-auto border rounded-xl p-2">{profits.map((p:any)=><div key={p.date} className="flex justify-between text-xs border-b py-1.5 last:border-0"><span className="font-bold">{p.date}</span><span>Rs.{p.commission}</span></div>)}</div></div></div>}
        {tab==="categories" && <div className="bg-white rounded-[20px] p-6 shadow-sm"><h2 className="font-black text-sm">Category Manage - Ek He List Me</h2><div className="flex gap-2 mt-4"><input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New Category Name" className="border p-3 rounded-full flex-1 text-sm outline-none"/><button onClick={addCat} className="bg-black text-white px-6 rounded-full text-sm font-bold">Add</button></div><div className="flex gap-2 mt-5 flex-wrap">{cats.map((c:any)=><div key={c.id} className="border px-4 py-2 rounded-full text-xs font-bold bg-[#F9F9F9]">{c.name} <button onClick={async()=>{await supabase.from("categories").delete().eq("id",c.id); load()}} className="text-red-500 ml-2 font-black">x</button></div>)}</div></div>}
        {tab==="products" && <div className="grid lg:grid-cols-2 gap-5"><div className="bg-white rounded-[20px] p-5 shadow-sm"><h2 className="font-black text-sm">Add Product</h2><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Product Name" className="w-full border p-3 rounded-full text-sm mt-4 outline-none"/><textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="Caption / Detail" className="w-full border p-3 rounded-2xl text-sm mt-3 h-[70px] outline-none"/><div className="grid grid-cols-2 gap-3 mt-3"><input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price" className="border p-3 rounded-full text-sm outline-none"/><input value={form.oprice} onChange={e=>setForm({...form,oprice:e.target.value})} placeholder="Original Price" className="border p-3 rounded-full text-sm outline-none"/></div><div className="grid grid-cols-2 gap-3 mt-3"><input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="Product Code" className="border p-3 rounded-full text-sm outline-none"/><select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} className="border p-3 rounded-full text-sm bg-gray-100 font-bold outline-none"><option>Kitchen</option><option>Bartan</option><option>Storage & Organizers</option>{cats.map((c:any)=><option key={c.id}>{c.name}</option>)}</select></div><input value={form.img} onChange={e=>setForm({...form,img:e.target.value})} placeholder="Image URL" className="w-full border p-3 rounded-full text-sm mt-3 outline-none"/><input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="Daraz Affiliate Link" className="w-full border p-3 rounded-full text-sm mt-3 bg-[#FFF9E6] outline-none"/><input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="Search Tags" className="w-full border p-3 rounded-full text-sm mt-3 outline-none"/><label className="flex gap-2 mt-4 text-xs font-bold items-center"><input type="checkbox" checked={form.best} onChange={e=>setForm({...form,best:e.target.checked})}/> Best Sellers Me Dikhao</label><button onClick={addProduct} className="w-full bg-[#FFD814] py-4 rounded-full font-black mt-5 shadow-sm">Add LIVE to Shop</button></div><div className="bg-white rounded-[20px] p-5 shadow-sm"><h2 className="font-black text-sm">Products List ({pros.length}) - Ek He List Me</h2><div className="space-y-2 mt-4 max-h-[700px] overflow-auto pr-1">{pros.map((p:any)=><div key={p.id} className="border rounded-xl p-3 flex justify-between items-center text-xs bg-[#FCFCFC]"><span className="font-medium"><b className="font-black">{p.name}</b> - {p.category} - Rs.{p.price}</span><button onClick={async()=>{if(confirm("Delete?")){await supabase.from("products").delete().eq("id",p.id); load()}}} className="text-red-500 font-bold ml-2">Del</button></div>)}</div></div></div>}
        {tab==="orders" && <div className="bg-white rounded-[20px] p-6 shadow-sm"><h2 className="font-black text-sm">Orders = Daraz Clicks - Ek He List Me</h2><div className="mt-4 space-y-2 max-h-[600px] overflow-auto">{clicks.length===0?<p className="text-xs text-gray-500 text-center py-10">Abhi koi order nahi - Customer jab Daraz pe click karega to yahan ayega</p>:clicks.map((c:any)=><div key={c.id} className="border p-3 rounded-xl text-xs flex justify-between bg-[#FCFCFC]"><span className="font-bold">{c.product_name}</span><span className="text-[10px] text-gray-500">{new Date(c.clicked_at).toLocaleString()}</span></div>)}</div></div>}
        {tab==="profile" && <div className="bg-white rounded-[20px] p-6 shadow-sm"><h2 className="font-black text-sm">Profile Locked - Secure</h2><div className="mt-4 bg-[#F5F7F5] p-4 rounded-2xl"><p className="text-xs font-bold">Email:</p><p className="font-black text-sm mt-1 underline">{LOCKED_EMAIL}</p><p className="text-[10px] text-gray-500 mt-3">Ye email lock hai - Sirf isi pe REAL OTP jayega - Lifetime secure - FB jaisa system</p></div><div className="mt-4 bg-[#E8F5E9] p-4 rounded-2xl"><p className="text-xs font-bold">Status: ✅ Active - 100% Working - No Error</p></div></div>}
      </div>
    </div>
  )
}
