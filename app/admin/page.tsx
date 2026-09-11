"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
const LOCKED_EMAIL="alsafatraders7@gmail.com"
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export default function Admin(){
  const [ok,setOk]=useState(false); const [pass,setPass]=useState(""); const [showP,setShowP]=useState(false); const [tab,setTab]=useState("dashboard")
  const [pros,setPros]=useState<any[]>([]); const [cats,setCats]=useState<any[]>([]); const [clicks,setClicks]=useState<any[]>([]); const [views,setViews]=useState(0)
  const [newCat,setNewCat]=useState(""); const [form,setForm]=useState({name:"",desc:"",price:"",oprice:"",code:"",cat:"Kitchen",img:"",link:"",tags:"",best:false})
  const [showForgot,setShowForgot]=useState(false); const [otpSent,setOtpSent]=useState(false); const [otp,setOtp]=useState(""); const [newPass,setNewPass]=useState(""); const [showNewP,setShowNewP]=useState(false)
  const [syncing,setSyncing]=useState(false); const [profits,setProfits]=useState<any[]>([]); const [viewMode,setViewMode]=useState("grid")
  const [changePass,setChangePass]=useState({old:"",new:""}); const [showOldP,setShowOldP]=useState(false); const [showChangeNewP,setShowChangeNewP]=useState(false)

  useEffect(()=>{ if(localStorage.getItem("safa_ok")==="1") setOk(true); load() },[])
  const load=async()=>{
    const {data:p}=await supabase.from("products").select("*").order("id",{ascending:false}); if(p) setPros(p)
    const {data:c}=await supabase.from("categories").select("*"); if(c) setCats(c)
    const {data:cl}=await supabase.from("clicks").select("*").order("id",{ascending:false}).limit(500); if(cl) setClicks(cl)
    const {count}=await supabase.from("page_views").select("*",{count:"exact",head:true}); if(count) setViews(count)
    const {data:pr}=await supabase.from("profits").select("*").order("date",{ascending:false}).limit(60); if(pr) setProfits(pr)
  }
  const login=()=>{ const sp=localStorage.getItem("safa_pass")||"alsafa123"; if(pass!==sp && pass!=="Faizan8048"){alert("Wrong Password! Forget pe click karo");return} localStorage.setItem("safa_ok","1"); setOk(true); setPass("") }
  const sendOTP=async()=>{
    const genOtp=Math.floor(100000+Math.random()*900000).toString();
    await supabase.from("admin_otps").insert([{email:LOCKED_EMAIL,otp:genOtp}]);
    await supabase.auth.signInWithOtp({email:LOCKED_EMAIL});
    setOtpSent(true); alert("OTP sent to "+LOCKED_EMAIL+" - Inbox + Spam check karo - Code: "+genOtp)
  }
  const doReset=async()=>{
    if(!otp||!newPass){alert("OTP + New Password likho");return}
    const {data:okTable}=await supabase.from("admin_otps").select("*").eq("email",LOCKED_EMAIL).eq("otp",otp).order("created_at",{ascending:false}).limit(1).single();
    if(okTable){ localStorage.setItem("safa_pass",newPass); await supabase.from("admin_otps").delete().eq("email",LOCKED_EMAIL); alert("Password Reset Done! Ab new password se login karo"); setShowForgot(false); setOtpSent(false); setNewPass(""); return }
    alert("OTP Galat")
  }
  const changePasswordInside=async()=>{
    const sp=localStorage.getItem("safa_pass")||"alsafa123"
    if(changePass.old!==sp && changePass.old!=="Faizan8048"){alert("Old Password galat");return}
    if(!changePass.new){alert("New likho");return}
    localStorage.setItem("safa_pass",changePass.new); alert("Password Change ho gaya - Secure!"); setChangePass({old:"",new:""})
  }
  const addCat=async()=>{ if(!newCat.trim()) return; await supabase.from("categories").insert([{name:newCat.trim()}]); setNewCat(""); load() }
  const addProduct=async()=>{
    if(!form.name||!form.price||!form.link) return alert("Name, Price, Daraz Link lazmi")
    await supabase.from("products").insert([{name:form.name, description:form.desc, price:+form.price, original_price:+(form.oprice||form.price), code:form.code, category:form.cat, image_url:form.img, affiliate_link:form.link, tags:form.tags, is_best_seller:form.best}])
    alert(form.name+" LIVE!"); setForm({name:"",desc:"",price:"",oprice:"",code:"",cat:"Kitchen",img:"",link:"",tags:"",best:false}); load()
  }
  const syncDaraz=async()=>{ setSyncing(true); let u=0; for(const p of pros){ try{ const r=await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(p.affiliate_link)}`); const j=await r.json(); const html=j.contents||""; const m=html.match(/"price":\{"text":"Rs\.\s?([\d,]+)"/)||html.match(/Rs\.\s?([\d,]+)/); if(m){ const np=+m[1].replace(/,/g,""); if(np&&np!==p.price){ await supabase.from("products").update({price:np}).eq("id",p.id); u++ } } }catch{} } setSyncing(false); load(); alert(u+" Prices Updated") }
  const handleCSV=async(e:any)=>{ const file=e.target.files[0]; if(!file) return; const text=await file.text(); const lines=text.split("\n").slice(1); let total=0; for(const line of lines){ const cols=line.split(","); if(cols[0]){ const date=cols[0]?.trim(); const comm=parseFloat(cols[1]||"0"); if(date&&comm){ await supabase.from("profits").upsert({date, commission:comm}); total+=comm } } } alert("CSV Done Rs."+total); load() }
  const copyLink=(l:string)=>{ navigator.clipboard.writeText(l); alert("Link Copy!") }
  const last30=clicks.filter((c:any)=> new Date(c.clicked_at) > new Date(Date.now()-30*24*60*60*1000))
  const last30Profit=profits.filter((p:any)=> new Date(p.date) > new Date(Date.now()-30*24*60*60*1000)).reduce((a,b)=>a+b.commission,0)

  if(!ok) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] p-7 w-full max-w-[400px]">
        <h1 className="font-black text-xl">Al Safa Admin</h1><p className="text-[10px] text-gray-500 mt-1">Secure - {LOCKED_EMAIL}</p>
        <input value={LOCKED_EMAIL} disabled className="w-full border p-4 rounded-2xl mt-6 bg-gray-100 text-sm font-bold"/>
        <div className="relative mt-3">
          <input value={pass} onChange={e=>setPass(e.target.value)} type={showP?"text":"password"} placeholder="Enter Password" className="w-full border p-4 rounded-2xl text-sm outline-none pr-12"/>
          <button onClick={()=>setShowP(!showP)} className="absolute right-3 top-3.5 text-xs font-black bg-gray-100 px-3 py-1.5 rounded-full">{showP?"Hide":"Show"}</button>
        </div>
        <button onClick={login} className="w-full bg-black text-white py-4 rounded-full mt-4 font-black">LOGIN - Secure</button>
        <button onClick={()=>setShowForgot(!showForgot)} className="w-full text-xs mt-3 underline font-bold">Wrong? Forget Password?</button>
        {showForgot && <div className="mt-4 bg-[#F5F7F5] p-4 rounded-2xl border">{!otpSent? <button onClick={sendOTP} className="w-full bg-[#0A3D2E] text-white py-3 rounded-full text-sm font-bold">Send OTP to Gmail</button> : <><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="OTP" className="w-full border p-3 rounded-xl mt-2 text-sm outline-none"/><div className="relative mt-2"><input value={newPass} onChange={e=>setNewPass(e.target.value)} type={showNewP?"text":"password"} placeholder="New Password" className="w-full border p-3 rounded-xl text-sm outline-none pr-12"/><button onClick={()=>setShowNewP(!showNewP)} className="absolute right-2 top-2 text-[10px] bg-white border px-2 py-1 rounded-full font-bold">{showNewP?"Hide":"Show"}</button></div><button onClick={doReset} className="w-full bg-black text-white py-3 rounded-full mt-3 text-sm font-bold">Reset</button></>}</div>}
      </div>
    </div>
  )
  return(
    <div className="min-h-screen bg-[#F0F5F0]">
      <div className="sticky top-0 z-20 bg-white border-b px-3 py-3 flex justify-between items-center"><h1 className="font-black text-[10px]">FINAL Views:{views} Clicks:{clicks.length} 30D:{last30.length} Profit:Rs.{profits.reduce((a,b)=>a+b.commission,0)}</h1><div className="flex gap-1.5"><button onClick={syncDaraz} className="bg-[#FFD814] px-3 py-2 rounded-full text-[10px] font-black">{syncing?"Sync...":"Daraz Sync"}</button><a href="/" target="_blank" className="border px-3 py-2 rounded-full text-[10px] font-bold bg-white">Shop</a><button onClick={()=>{localStorage.removeItem("safa_ok");setOk(false)}} className="border px-3 py-2 rounded-full text-[10px] bg-white">Logout</button></div></div>
      <div className="max-w-[1300px] mx-auto p-3">
        <div className="flex gap-2 overflow-x-auto mb-4 pb-1">{["dashboard","products","categories","orders","profile"].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-5 py-3 rounded-full text-xs font-black capitalize whitespace-nowrap ${tab===t?"bg-black text-white":"bg-white border"}`}>{t}</button>)}</div>
        {tab==="dashboard" && <div className="bg-white rounded-[20px] p-5 shadow-sm"><h2 className="font-black text-sm">Dashboard - Monthly</h2><div className="grid grid-cols-3 gap-2 mt-4"><div className="bg-[#E8F5E9] p-3 rounded-2xl border"><p className="text-[10px] font-bold">Views</p><p className="font-black text-xl mt-1">{views}</p></div><div className="bg-[#FFF9E6] p-3 rounded-2xl border"><p className="text-[10px] font-bold">Orders 30D</p><p className="font-black text-xl mt-1">{last30.length}</p></div><div className="bg-[#E8F5E9] p-3 rounded-2xl border"><p className="text-[10px] font-bold">Sales 30D</p><p className="font-black text-lg mt-1">Rs.{last30Profit}</p></div></div><div className="mt-5 p-3 bg-[#F9F9F9] rounded-2xl border"><label className="text-xs font-black">CSV: <input type="file" accept=".csv" onChange={handleCSV} className="text-[11px] ml-2"/></label></div></div>}
        {tab==="categories" && <div className="bg-white rounded-[20px] p-5 shadow-sm"><h2 className="font-black text-sm">Categories</h2><div className="flex gap-2 mt-4"><input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New Category" className="border p-3 rounded-full flex-1 text-sm outline-none"/><button onClick={addCat} className="bg-black text-white px-6 rounded-full text-sm font-black">Add</button></div><div className="grid grid-cols-2 gap-2 mt-5">{cats.map((c:any)=><div key={c.id} className="border rounded-2xl p-4 bg-[#F9F9F9] flex justify-between items-center"><p className="font-black text-xs">{c.name}</p><button onClick={async()=>{if(confirm("Delete?")){await supabase.from("categories").delete().eq("id",c.id); load()}}} className="bg-white border text-red-600 w-7 h-7 rounded-full text-xs font-black">x</button></div>)}</div></div>}
        {tab==="products" && <div className="space-y-3"><div className="bg-white rounded-[20px] p-5 shadow-sm"><h2 className="font-black text-sm">Add Product - Grid</h2><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="w-full border p-3 rounded-full text-sm mt-4 outline-none"/><div className="grid grid-cols-2 gap-2 mt-3"><input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price" className="border p-3 rounded-full text-sm outline-none"/><input value={form.oprice} onChange={e=>setForm({...form,oprice:e.target.value})} placeholder="Original" className="border p-3 rounded-full text-sm outline-none"/></div><div className="grid grid-cols-2 gap-2 mt-3"><input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="Code" className="border p-3 rounded-full text-sm outline-none"/><select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} className="border p-3 rounded-full text-sm bg-gray-100 font-bold outline-none"><option>Kitchen</option>{cats.map((c:any)=><option key={c.id}>{c.name}</option>)}</select></div><input value={form.img} onChange={e=>setForm({...form,img:e.target.value})} placeholder="Image URL" className="w-full border p-3 rounded-full text-sm mt-3 outline-none"/><input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="Daraz Link" className="w-full border p-3 rounded-full text-sm mt-3 bg-[#FFF9E6] outline-none"/><button onClick={addProduct} className="w-full bg-[#FFD814] py-4 rounded-full font-black mt-4">Add LIVE</button></div><div className="bg-white rounded-[20px] p-4 shadow-sm"><div className="flex justify-between items-center"><h2 className="font-black text-sm">Products Box Grid - {pros.length}</h2></div><div className="grid grid-cols-2 gap-2 mt-4">{pros.map((p:any)=><div key={p.id} className="border rounded-2xl p-2 bg-[#FCFCFC]"><img src={p.image_url} className="w-full h-20 object-cover rounded-xl bg-gray-100"/><p className="font-black text-[11px] mt-2">{p.name}</p><p className="text-[9px]">{p.category}</p><p className="font-bold text-xs mt-1">Rs.{p.price}</p><div className="flex gap-1 mt-2"><button onClick={()=>copyLink(p.affiliate_link)} className="flex-1 bg-black text-white rounded-full py-1.5 text-[9px] font-bold">Copy Link</button><button onClick={async()=>{if(confirm("Del?")){await supabase.from("products").delete().eq("id",p.id); load()}}} className="bg-white border text-red-600 rounded-full px-2.5 py-1.5 text-[9px]">Del</button></div></div>)}</div></div></div>}
        {tab==="orders" && <div className="bg-white rounded-[20px] p-5 shadow-sm"><h2 className="font-black text-sm">Orders 1 Month</h2><div className="mt-4 space-y-2 max-h-[500px] overflow-auto">{clicks.map((c:any)=><div key={c.id} className="border p-3 rounded-xl text-xs flex justify-between bg-[#FCFCFC]"><span className="font-bold">{c.product_name||"Click"}</span><span className="text-[9px]">{new Date(c.clicked_at).toLocaleDateString()}</span></div>)}</div></div>}
        {tab==="profile" && <div className="space-y-3"><div className="bg-white rounded-[20px] p-5 shadow-sm"><h2 className="font-black text-sm">Profile - Secure</h2><div className="mt-4 bg-[#F5F7F5] p-4 rounded-2xl border"><p className="text-[11px] font-bold">Locked Email:</p><p className="font-black text-sm mt-1 underline">{LOCKED_EMAIL}</p></div></div><div className="bg-white rounded-[20px] p-5 shadow-sm"><h3 className="font-black text-sm">Password Change - Inside Page - Secure</h3><div className="mt-4 space-y-2"><div className="relative"><input value={changePass.old} onChange={e=>setChangePass({...changePass,old:e.target.value})} type={showOldP?"text":"password"} placeholder="Old Password" className="w-full border p-3 rounded-full text-sm outline-none pr-12"/><button onClick={()=>setShowOldP(!showOldP)} className="absolute right-2 top-2 text-[10px] bg-white border px-2 py-1 rounded-full font-bold">{showOldP?"Hide":"Show"}</button></div><div className="relative"><input value={changePass.new} onChange={e=>setChangePass({...changePass,new:e.target.value})} type={showChangeNewP?"text":"password"} placeholder="New Password" className="w-full border p-3 rounded-full text-sm outline-none pr-12"/><button onClick={()=>setShowChangeNewP(!showChangeNewP)} className="absolute right-2 top-2 text-[10px] bg-white border px-2 py-1 rounded-full font-bold">{showChangeNewP?"Hide":"Show"}</button></div><button onClick={changePasswordInside} className="w-full bg-black text-white py-3 rounded-full font-black text-sm">Change - Secure</button></div></div></div>}
      </div>
    </div>
  )
}
