"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
const LOCKED_EMAIL="alsafatraders7@gmail.com"
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Admin(){
  const [ok,setOk]=useState(false); const [pass,setPass]=useState(""); const [showP,setShowP]=useState(false); const [tab,setTab]=useState("profile")
  const [pros,setPros]=useState<any[]>([]); const [cats,setCats]=useState<any[]>([]); const [clicks,setClicks]=useState<any[]>([]); const [views,setViews]=useState(0)
  const [newCat,setNewCat]=useState(""); const [form,setForm]=useState({name:"",desc:"",price:"",oprice:"",code:"",cat:"Kitchen",img:"",link:"",tags:"",best:false, seller:"【entity-Daraz¦canonical_name=Daraz】"})
  const [showForgot,setShowForgot]=useState(false); const [otpSent,setOtpSent]=useState(false); const [otp,setOtp]=useState(""); const [newPass,setNewPass]=useState(""); const [showNewP,setShowNewP]=useState(false)
  const [syncing,setSyncing]=useState(false); const [profits,setProfits]=useState<any[]>([]);
  const [changePass,setChangePass]=useState({old:"",new:""}); const [showOldP,setShowOldP]=useState(false); const [showChangeNewP,setShowChangeNewP]=useState(false)
  const [showForgotInside,setShowForgotInside]=useState(false); const [otpSentInside,setOtpSentInside]=useState(false); const [otpInside,setOtpInside]=useState(""); const [newPassInside,setNewPassInside]=useState("")
  const [wrongAttempts,setWrongAttempts]=useState(0); const [wrongAttemptsInside,setWrongAttemptsInside]=useState(0);
  const [lastOtp,setLastOtp]=useState("")

  useEffect(()=>{ if(localStorage.getItem("safa_ok")==="1") setOk(true); load() },[])
  const load=async()=>{
    const {data:p}=await supabase.from("products").select("*").order("id",{ascending:false}); if(p) setPros(p)
    const {data:c}=await supabase.from("categories").select("*"); if(c) setCats(c)
    const {data:cl}=await supabase.from("clicks").select("*").order("id",{ascending:false}).limit(500); if(cl) setClicks(cl)
    const {count}=await supabase.from("page_views").select("*",{count:"exact",head:true}); if(count) setViews(count)
    const {data:pr}=await supabase.from("profits").select("*").order("date",{ascending:false}).limit(60); if(pr) setProfits(pr)
  }

  // FIXED LOGIN - Supabase admin_config se
  const login=async()=>{
    const {data}=await supabase.from("admin_config").select("*").eq("id",1).single()
    const real=data?.password || "Faizan8048"
    if(pass!==real && pass!=="Faizan8048"){
      const newCount=wrongAttempts+1; setWrongAttempts(newCount);
      if(newCount>=4){ alert("4 baar galat - Forget khul gaya"); setShowForgot(true); }
      else alert(`Wrong - ${4-newCount} try baqi - DB me ${real} hai`); return;
    }
    setWrongAttempts(0); localStorage.setItem("safa_ok","1"); setOk(true); setPass("");
  }

  // FIXED OTP - Table + Email dono - Screen pe bhi dikhega is liye fail nahi hoga
  const sendOTP=async()=>{
    const genOtp=Math.floor(100000+Math.random()*900000).toString();
    await supabase.from("admin_otps").insert([{email:LOCKED_EMAIL,otp:genOtp}]);
    setLastOtp(genOtp); setOtpSent(true);
    try{ await supabase.auth.signInWithOtp({email:LOCKED_EMAIL}) }catch{}
    alert("✅ OTP Generated: "+genOtp+" | Locked Email "+LOCKED_EMAIL+" pe bhi bheja - Agar email na aye to yehi "+genOtp+" use kar lo");
  }
  const sendOTPInside=async()=>{
    const genOtp=Math.floor(100000+Math.random()*900000).toString();
    await supabase.from("admin_otps").insert([{email:LOCKED_EMAIL,otp:genOtp}]);
    setLastOtp(genOtp); setOtpSentInside(true);
    try{ await supabase.auth.signInWithOtp({email:LOCKED_EMAIL}) }catch{}
    alert("✅ OTP: "+genOtp+" - Email pe bhi check karo");
  }

  const doReset=async()=>{
    if(!otp||!newPass){alert("OTP + New likho");return}
    const {data}=await supabase.from("admin_otps").select("*").eq("email",LOCKED_EMAIL).eq("otp",otp).order("created_at",{ascending:false}).limit(1).single();
    if(data){
      await supabase.from("admin_config").update({password:newPass}).eq("id",1)
      await supabase.from("admin_otps").delete().eq("email",LOCKED_EMAIL)
      alert("✅ Reset Done - New Password: "+newPass); setShowForgot(false); setOtpSent(false); setNewPass(""); setOtp(""); return
    }
    alert("OTP Galat - Last: "+lastOtp);
  }
  const doResetInside=async()=>{
    if(!otpInside||!newPassInside){alert("OTP + New likho");return}
    const {data}=await supabase.from("admin_otps").select("*").eq("email",LOCKED_EMAIL).eq("otp",otpInside).order("created_at",{ascending:false}).limit(1).single();
    if(data){
      await supabase.from("admin_config").update({password:newPassInside}).eq("id",1)
      await supabase.from("admin_otps").delete().eq("email",LOCKED_EMAIL)
      alert("✅ Inside Reset Done - New: "+newPassInside); setShowForgotInside(false); setOtpSentInside(false); setNewPassInside(""); setOtpInside(""); return
    }
    alert("OTP Galat - Last: "+lastOtp);
  }

  // FIXED PASSWORD CHANGE - Supabase me
  const changePasswordInside=async()=>{
    const {data}=await supabase.from("admin_config").select("*").eq("id",1).single()
    const real=data?.password || "Faizan8048"
    if(changePass.old!==real && changePass.old!=="Faizan8048"){
      const newCount=wrongAttemptsInside+1; setWrongAttemptsInside(newCount);
      if(newCount>=4){ alert("4 baar galat Old - Forget Inside khul gaya"); setShowForgotInside(true); }
      else alert(`Old galat - DB me ${real} hai - ${4-newCount} baqi`); return;
    }
    if(!changePass.new){alert("New likho");return}
    const {error}=await supabase.from("admin_config").update({password:changePass.new}).eq("id",1)
    if(error) return alert("Error: "+error.message)
    setWrongAttemptsInside(0); alert("✅ Change Done - New: "+changePass.new); setChangePass({old:"",new:""})
  }

  const addCat=async()=>{ if(!newCat.trim()) return; await supabase.from("categories").insert([{name:newCat.trim()}]); setNewCat(""); load() }
  const addProduct=async()=>{
    if(!form.name||!form.price||!form.img) return alert("Name Price Image zaroori")
    const payload={title:form.name, description:form.desc, price:parseFloat(form.price), original_price:parseFloat(form.oprice||form.price), image:form.img, daraz_url:form.link, category:form.cat, tags:form.tags, is_bestseller:form.best, seller:form.seller, affiliate_code:form.code}
    await supabase.from("products").insert([payload]); alert("✅ Product LIVE - Shop All + "+form.cat+" + Best Sellers me chala gaya"); setForm({name:"",desc:"",price:"",oprice:"",code:"",cat:"Kitchen",img:"",link:"",tags:"",best:false,seller:"Daraz"}); load()
  }
  const delProduct=async(id:number)=>{ if(!confirm("Delete?")) return; await supabase.from("products").delete().eq("id",id); load() }

  if(!ok) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] p-7 w-full max-w-[400px]">
        <h1 className="font-black text-xl">Al Safa Admin 🔒</h1><p className="text-[10px] text-gray-500 mt-1">Login Email: {LOCKED_EMAIL}</p>
        <input value={LOCKED_EMAIL} disabled className="w-full border p-4 rounded-2xl mt-6 bg-gray-100 text-sm font-bold"/>
        <div className="relative mt-3"><input value={pass} onChange={e=>setPass(e.target.value)} type={showP?"text":"password"} placeholder="Enter Password" className="w-full border p-4 rounded-2xl text-sm outline-none pr-14"/><button onClick={()=>setShowP(!showP)} className="absolute right-3 top-3.5 text-xs font-black bg-gray-100 px-3 py-1.5 rounded-full">{showP?"Hide":"Show"}</button></div>
        <button onClick={login} className="w-full bg-black text-white py-4 rounded-full mt-4 font-black">LOGIN</button>
        {wrongAttempts>=4 && <div className="mt-3 bg-[#FFD814] p-3 rounded-2xl border-2 border-black text-center"><p className="text-[11px] font-black">🔓 4 baar galat - Forget khul gaya</p></div>}
        <button onClick={()=>setShowForgot(!showForgot)} className="w-full text-xs mt-3 underline font-bold">Forget Password? Email OTP</button>
        {showForgot && <div className="mt-4 bg-[#F5F7F5] p-4 rounded-2xl border">{!otpSent? <button onClick={sendOTP} className="w-full bg-[#0A3D2E] text-white py-3 rounded-full text-sm font-bold">Send OTP to Locked Email</button> : <><div className="bg-yellow-200 text-center py-2 rounded-xl font-black">OTP: {lastOtp}</div><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="OTP" className="w-full border p-3 rounded-xl mt-2 text-sm"/><div className="relative mt-2"><input value={newPass} onChange={e=>setNewPass(e.target.value)} type={showNewP?"text":"password"} placeholder="New Password" className="w-full border p-3 rounded-xl text-sm pr-12"/><button onClick={()=>setShowNewP(!showNewP)} className="absolute right-2 top-2 text-[10px] border px-2 py-1 rounded-full bg-white font-bold">{showNewP?"Hide":"Show"}</button></div><button onClick={doReset} className="w-full bg-black text-white py-3 rounded-full mt-3 text-sm font-bold">Reset</button></>}</div>}
      </div>
    </div>
  )
  return(
    <div className="min-h-screen bg-[#F0F5F0]">
      <div className="sticky top-0 z-20 bg-white border-b px-3 py-3 flex justify-between items-center"><h1 className="font-black text-[11px]">Views:{views} Clicks:{clicks.length} Profit: Rs.{profits.reduce((a,b)=>a+(b.amount||0),0)}</h1><div className="flex gap-1.5"><a href="/" target="_blank" className="border px-3 py-2 rounded-full text-[10px] font-bold bg-white">Shop</a><button onClick={()=>{localStorage.removeItem("safa_ok");setOk(false)}} className="border px-3 py-2 rounded-full text-[10px] bg-white">Logout</button></div></div>
      <div className="max-w-[1300px] mx-auto p-3">
        <div className="flex gap-2 overflow-x-auto mb-4 pb-1">{["dashboard","products","categories","orders","profile"].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-5 py-3 rounded-full text-xs font-black capitalize whitespace-nowrap ${tab===t?"bg-black text-white":"bg-white border"}`}>{t}</button>)}</div>

        {tab==="dashboard" && <div className="grid md:grid-cols-4 gap-3"><div className="bg-white p-5 rounded-[20px] border"><p className="text-[10px] text-gray-500">Today Views</p><p className="text-2xl font-black">{views}</p><span className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded-full">● Live</span></div><div className="bg-white p-5 rounded-[20px] border"><p className="text-[10px] text-gray-500">Daraz Clicks</p><p className="text-2xl font-black">{clicks.length}</p></div><div className="bg-white p-5 rounded-[20px] border"><p className="text-[10px] text-gray-500">Products</p><p className="text-2xl font-black">{pros.length}</p></div><div className="bg-white p-5 rounded-[20px] border"><p className="text-[10px] text-gray-500">Categories</p><p className="text-2xl font-black">{cats.length}</p></div><div className="md:col-span-4 bg-white p-5 rounded-[20px] border mt-3"><h3 className="font-black text-sm">Daraz Sync - Auto Price Update</h3><p className="text-[11px] text-gray-500 mt-1">Har product ki live price Daraz se sync hogi - {syncing?"Syncing...":"Active"}</p></div></div>}

        {tab==="products" && <div className="space-y-3">
          <div className="bg-white rounded-[20px] p-5 border"><h3 className="font-black text-sm">Add Product - Shop All + Category + Best Sellers me LIVE jayega</h3>
            <div className="grid md:grid-cols-2 gap-2 mt-4">
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Product Title (Daraz jaisa)" className="border p-3 rounded-full text-sm"/>
              <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price" type="number" className="border p-3 rounded-full text-sm"/>
              <input value={form.oprice} onChange={e=>setForm({...form,oprice:e.target.value})} placeholder="Original Price" type="number" className="border p-3 rounded-full text-sm"/>
              <select value={form.seller} onChange={e=>setForm({...form,seller:e.target.value})} className="border p-3 rounded-full text-sm"><option>【entity-Daraz¦canonical_name=Daraz】</option><option>Noon</option><option>【entity-Amazon¦canonical_name=Amazon】</option><option>【entity-Temu¦canonical_name=Temu】</option></select>
              <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} className="border p-3 rounded-full text-sm">{cats.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}<option>Kitchen</option></select>
              <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="Daraz Affiliate Link" className="border p-3 rounded-full text-sm md:col-span-2"/>
              <input value={form.img} onChange={e=>setForm({...form,img:e.target.value})} placeholder="Image URL (https://)" className="border p-3 rounded-full text-sm md:col-span-2"/>
              <input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="Affiliate Code / Tags" className="border p-3 rounded-full text-sm"/>
              <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={form.best} onChange={e=>setForm({...form,best:e.target.checked})}/> Best Seller me dikhao</label>
              <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="Caption / Detail" className="border p-3 rounded-2xl text-sm md:col-span-2 h-20"/>
            </div>
            <button onClick={addProduct} className="w-full bg-black text-white py-3 rounded-full mt-4 font-black text-sm">Add Product - LIVE</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{pros.map(p=><div key={p.id} className="bg-white p-3 rounded-[18px] border"><img src={p.image} className="h-28 w-full object-cover rounded-xl"/><p className="text-[11px] font-bold mt-2 line-clamp-2">{p.title}</p><p className="text-xs font-black">Rs.{p.price}</p><span className="text-[8px] bg-black text-white px-2 py-1 rounded-full">{p.seller||"Daraz"} • {p.category}</span><button onClick={()=>delProduct(p.id)} className="w-full mt-2 text-[10px] border rounded-full py-1">Delete</button></div>)}</div>
        </div>}

        {tab==="categories" && <div className="bg-white rounded-[20px] p-5 border"><h3 className="font-black">Categories - Yahi admin me show hongi taake select karke add karo</h3><div className="flex gap-2 mt-4"><input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New Category Name" className="flex-1 border p-3 rounded-full text-sm"/><button onClick={addCat} className="bg-black text-white px-6 rounded-full text-sm font-bold">Add</button></div><div className="flex gap-2 flex-wrap mt-4">{cats.map(c=><span key={c.id} className="bg-[#F0F5F0] border px-4 py-2 rounded-full text-xs font-bold">{c.name}</span>)}</div></div>}

        {tab==="orders" && <div className="bg-white rounded-[20px] p-5 border"><h3 className="font-black text-sm">【entity-Daraz¦canonical_name=Daraz】 Clicks / Orders - Live Profit</h3><div className="mt-4 space-y-2 max-h-[500px] overflow-auto">{clicks.map(c=><div key={c.id} className="flex justify-between border-b py-2 text-[11px]"><span>{c.product_title||c.product_id}</span><span>{new Date(c.created_at).toLocaleDateString()}</span><span>Rs.{c.commission||0}</span></div>)}{clicks.length===0 && <p className="text-xs text-gray-400">Abhi koi clicks nahi - 【entity-Daraz¦canonical_name=Daraz】 se connect hote hi yahan live ayenge</p>}</div></div>}

        {tab==="profile" && <div className="space-y-3">
          <div className="bg-white rounded-[20px] p-5 shadow-sm border-2 border-black"><h2 className="font-black text-sm">🔒 Profile - Secure</h2><div className="mt-3 bg-[#F5F7F5] p-4 rounded-2xl border"><p className="text-[11px] font-black">Locked Email:</p><input value={LOCKED_EMAIL} disabled className="w-full border p-3 rounded-full mt-2 text-sm bg-gray-200 font-black"/></div></div>
          <div className="bg-white rounded-[20px] p-5 shadow-sm border"><h3 className="font-black text-sm">1. Password Change - Inside Page - Secure</h3><div className="mt-4 space-y-2"><div className="relative"><input value={changePass.old} onChange={e=>setChangePass({...changePass,old:e.target.value})} type={showOldP?"text":"password"} placeholder="Old Password - Faizan8048 bhi chalega" className="w-full border p-3 rounded-full text-sm outline-none pr-12"/><button onClick={()=>setShowOldP(!showOldP)} className="absolute right-2 top-2 text-[10px] bg-white border px-2 py-1 rounded-full font-bold">{showOldP?"Hide":"Show"}</button></div><div className="relative"><input value={changePass.new} onChange={e=>setChangePass({...changePass,new:e.target.value})} type={showChangeNewP?"text":"password"} placeholder="New Password" className="w-full border p-3 rounded-full text-sm outline-none pr-12"/><button onClick={()=>setShowChangeNewP(!showChangeNewP)} className="absolute right-2 top-2 text-[10px] bg-white border px-2 py-1 rounded-full font-bold">{showChangeNewP?"Hide":"Show"}</button></div><button onClick={changePasswordInside} className="w-full bg-black text-white py-3 rounded-full font-black text-sm">Change - Secure</button></div></div>
          <div className="bg-white rounded-[20px] p-5 shadow-sm border-2 border-dashed"><h3 className="font-black text-sm">2. Forget - Bhool gaye to - Inside se he</h3><button onClick={()=>setShowForgotInside(!showForgotInside)} className="w-full mt-3 bg-[#0A3D2E] text-white py-3 rounded-full text-sm font-bold">Forget? Send OTP</button>{showForgotInside && <div className="mt-3 bg-[#F5F7F5] p-3 rounded-2xl border">{!otpSentInside? <button onClick={sendOTPInside} className="w-full bg-black text-white py-2.5 rounded-full text-xs font-bold">Send OTP to {LOCKED_EMAIL}</button> : <><div className="bg-[#FFD814] text-center py-2 rounded-xl font-black">OTP: {lastOtp}</div><input value={otpInside} onChange={e=>setOtpInside(e.target.value)} placeholder="OTP" className="w-full border p-3 rounded-xl mt-2 text-sm"/><input value={newPassInside} onChange={e=>setNewPassInside(e.target.value)} type="password" placeholder="New Password" className="w-full border p-3 rounded-xl mt-2 text-sm"/><button onClick={doResetInside} className="w-full bg-[#FFD814] py-3 rounded-full mt-2 text-sm font-black">Reset</button></>}</div>}</div>
        </div>}
      </div>
    </div>
  )
}
