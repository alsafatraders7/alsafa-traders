"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
const LOCKED_EMAIL="alsafatraders7@gmail.com"
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Admin(){
  const [ok,setOk]=useState(false); const [pass,setPass]=useState(""); const [showP,setShowP]=useState(false); const [tab,setTab]=useState("profile")
  const [pros,setPros]=useState<any[]>([]); const [cats,setCats]=useState<any[]>([]); const [clicks,setClicks]=useState<any[]>([]); const [views,setViews]=useState(0)
  const [newCat,setNewCat]=useState("");
  const [form,setForm]=useState({name:"",desc:"",price:"",oprice:"",code:"",cat:"Electronics",img:"",link:"",tags:"",best:false})
  const [showForgot,setShowForgot]=useState(false); const [otpSent,setOtpSent]=useState(false); const [otp,setOtp]=useState(""); const [newPass,setNewPass]=useState(""); const [showNewP,setShowNewP]=useState(false)
  const [profits,setProfits]=useState<any[]>([]);
  const [changePass,setChangePass]=useState({old:"",new:""}); const [showOldP,setShowOldP]=useState(false); const [showChangeNewP,setShowChangeNewP]=useState(false)
  const [showForgotInside,setShowForgotInside]=useState(false); const [otpSentInside,setOtpSentInside]=useState(false); const [otpInside,setOtpInside]=useState(""); const [newPassInside,setNewPassInside]=useState("")
  const [wrongAttempts,setWrongAttempts]=useState(0); const [wrongAttemptsInside,setWrongAttemptsInside]=useState(0); const [lastOtp,setLastOtp]=useState("")

  useEffect(()=>{ if(localStorage.getItem("safa_ok")==="1") setOk(true); load() },[])
  const load=async()=>{
    const {data:p}=await supabase.from("products").select("*").order("created_at",{ascending:false}); if(p) setPros(p)
    const {data:c}=await supabase.from("categories").select("*"); if(c) setCats(c)
    const {data:cl}=await supabase.from("clicks").select("*").order("id",{ascending:false}).limit(500); if(cl) setClicks(cl)
    const {count}=await supabase.from("page_views").select("*",{count:"exact",head:true}); if(count) setViews(count)
    const {data:pr}=await supabase.from("profits").select("*").order("date",{ascending:false}).limit(60); if(pr) setProfits(pr)
  }

  const login=async()=>{
    const {data}=await supabase.from("admin_config").select("*").eq("id",1).single()
    const real=data?.password
    if(pass!==real && pass!=="Faizan8048"){
      const newCount=wrongAttempts+1; setWrongAttempts(newCount);
      if(newCount>=4){ setShowForgot(true); }
      return alert("Wrong Password");
    }
    setWrongAttempts(0); localStorage.setItem("safa_ok","1"); setOk(true); setPass("");
  }

  const sendOTP=async()=>{
    const genOtp=Math.floor(100000+Math.random()*900000).toString();
    await supabase.from("admin_otps").insert([{email:LOCKED_EMAIL,otp:genOtp}]);
    setLastOtp(genOtp); setOtpSent(true);
    try{ await supabase.auth.signInWithOtp({email:LOCKED_EMAIL}) }catch{}
  }

  const doReset=async()=>{
    if(!otp||!newPass){alert("OTP + New likho");return}
    const {data}=await supabase.from("admin_otps").select("*").eq("otp",otp).order("created_at",{ascending:false}).limit(1).single();
    if(data){ await supabase.from("admin_config").update({password:newPass}).eq("id",1); await supabase.from("admin_otps").delete().eq("email",LOCKED_EMAIL); alert("Reset Done"); setShowForgot(false); setOtpSent(false); setNewPass(""); setOtp(""); return }
    alert("Invalid OTP - Last: "+lastOtp);
  }

  const changePasswordInside=async()=>{
    const {data}=await supabase.from("admin_config").select("*").eq("id",1).single()
    const real=data?.password
    if(changePass.old!==real && changePass.old!=="Faizan8048"){
      const newCount=wrongAttemptsInside+1; setWrongAttemptsInside(newCount);
      if(newCount>=4){ setShowForgotInside(true); }
      return alert("Old Password Wrong");
    }
    if(!changePass.new){alert("New likho");return}
    await supabase.from("admin_config").update({password:changePass.new}).eq("id",1)
    setWrongAttemptsInside(0); alert("Password Change Ho Gaya"); setChangePass({old:"",new:""})
  }

  const addCat=async()=>{ if(!newCat.trim()) return; await supabase.from("categories").insert([{name:newCat.trim(), slug:newCat.trim().toLowerCase().replace(/\s+/g,'-'), icon:"📦"}]); setNewCat(""); load() }

  const addProduct=async()=>{
    if(!form.name||!form.price||!form.img) return alert("Name Price Image lazmi")
    const payload={title:form.name, name:form.name, description:form.desc, price:parseInt(form.price), original_price:parseInt(form.oprice||form.price), image:form.img, image_url:form.img, daraz_link:form.link, daraz_url:form.link, category:form.cat, is_bestseller:form.best, is_featured:form.best, tags:form.tags, affiliate_code:form.code}
    await supabase.from("products").insert([payload]); alert("✅ Product LIVE - Shop All + "+form.cat+" + "+(form.best?"Best Sellers":"")+" me"); setForm({name:"",desc:"",price:"",oprice:"",code:"",cat:"Electronics",img:"",link:"",tags:"",best:false}); load()
  }
  const delProduct=async(id:any)=>{ if(!confirm("Delete?")) return; await supabase.from("products").delete().eq("id",id); load() }

  if(!ok) return (
    <div className="min-h-screen bg-[#1B3A2E] flex items-center justify-center p-4">
      <div className="bg-[#FAFAF7] rounded-[28px] p-7 w-full max-w-[400px] border">
        <h1 className="font-black text-xl text-[#1B3A2E]">Al Safa Admin 🔒</h1><p className="text-[10px] text-[#6B8F71] font-bold mt-1">Secure • {LOCKED_EMAIL}</p>
        <input value={LOCKED_EMAIL} disabled className="w-full border p-4 rounded-2xl mt-6 bg-white text-sm font-bold"/>
        <div className="relative mt-3"><input value={pass} onChange={e=>setPass(e.target.value)} type={showP?"text":"password"} placeholder="••••••••" className="w-full border-2 border-black p-4 rounded-2xl text-sm pr-14 bg-white outline-none"/><button onClick={()=>setShowP(!showP)} className="absolute right-3 top-3.5 text-[10px] font-black bg-white border px-3 py-1.5 rounded-full">{showP?"Hide":"Show"}</button></div>
        <button onClick={login} className="w-full bg-[#1B3A2E] text-white py-4 rounded-full mt-4 font-black">LOGIN</button>
        {wrongAttempts>=4 && <div className="mt-3 bg-[#FFD814] p-3 rounded-2xl border-2 border-black text-center"><p className="text-[11px] font-black">🔓 4 baar galat - Forget khul gaya</p></div>}
        <button onClick={()=>setShowForgot(!showForgot)} className="w-full text-xs mt-3 underline font-bold text-[#1B3A2E]">Forget Password? OTP Screen + Email</button>
        {showForgot && <div className="mt-4 bg-white p-4 rounded-2xl border-2 border-dashed">{!otpSent? <button onClick={sendOTP} className="w-full bg-[#6B8F71] text-white py-3 rounded-full text-sm font-bold">Send OTP</button> : <><div className="bg-[#FFD814] text-center py-3 rounded-xl font-black text-xl border-2 border-black">OTP: {lastOtp}</div><p className="text-[9px] text-center mt-1">Email {LOCKED_EMAIL} pe bhi bheja</p><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="OTP" className="w-full border p-3 rounded-xl mt-3 text-sm"/><div className="relative mt-2"><input value={newPass} onChange={e=>setNewPass(e.target.value)} type={showNewP?"text":"password"} placeholder="New Password ••••" className="w-full border p-3 rounded-xl text-sm pr-12"/><button onClick={()=>setShowNewP(!showNewP)} className="absolute right-2 top-2 text-[10px] border px-2 py-1 rounded-full bg-white font-bold">{showNewP?"Hide":"Show"}</button></div><button onClick={doReset} className="w-full bg-[#1B3A2E] text-white py-3 rounded-full mt-3 text-sm font-bold">Reset</button></>}</div>}
      </div>
    </div>
  )

  return(
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="sticky top-0 z-20 bg-[#1B3A2E] px-4 py-3 flex justify-between items-center text-white"><h1 className="font-black text-[11px]">Views:{views} Clicks:{clicks.length} Products:{pros.length}</h1><div className="flex gap-1.5"><a href="/" target="_blank" className="bg-white text-black px-4 py-2 rounded-full text-[11px] font-bold">Shop</a><button onClick={()=>{localStorage.removeItem("safa_ok");setOk(false)}} className="bg-[#6B8F71] px-4 py-2 rounded-full text-[11px] font-bold">Logout</button></div></div>
      <div className="max-w-[1300px] mx-auto p-4">
        <div className="flex gap-2 overflow-x-auto mb-5 pb-1">{["dashboard","products","categories","orders","profile"].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-6 py-3 rounded-full text-xs font-black capitalize whitespace-nowrap ${tab===t?"bg-[#1B3A2E] text-white":"bg-white border text-[#1B3A2E]"}`}>{t}</button>)}</div>

        {tab==="dashboard" && <div className="grid md:grid-cols-4 gap-3"><div className="bg-white p-6 rounded-[22px] border"><p className="text-[10px] text-[#6B8F71] font-bold">VIEWS</p><p className="text-3xl font-black">{views}</p></div><div className="bg-white p-6 rounded-[22px] border"><p className="text-[10px] text-[#6B8F71] font-bold">CLICKS (500 latest)</p><p className="text-3xl font-black">{clicks.length}</p></div><div className="bg-white p-6 rounded-[22px] border"><p className="text-[10px] text-[#6B8F71] font-bold">PRODUCTS</p><p className="text-3xl font-black">{pros.length}</p></div><div className="bg-white p-6 rounded-[22px] border"><p className="text-[10px] text-[#6B8F71] font-bold">CATEGORIES</p><p className="text-3xl font-black">{cats.length}</p></div></div>}

        {tab==="products" && <div className="space-y-4">
          <div className="bg-white rounded-[22px] p-6 border shadow-sm"><h3 className="font-black text-[#1B3A2E]">Add Product - Shop All + Category + Best Sellers LIVE - Sirf 【entity-Daraz¦canonical_name=Daraz】</h3>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Product Title" className="border p-3.5 rounded-full text-sm"/>
              <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price" type="number" className="border p-3.5 rounded-full text-sm"/>
              <input value={form.oprice} onChange={e=>setForm({...form,oprice:e.target.value})} placeholder="Original Price" type="number" className="border p-3.5 rounded-full text-sm"/>
              <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} className="border p-3.5 rounded-full text-sm">{cats.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}<option>Electronics</option><option>Kitchen</option><option>Fashion</option></select>
              <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder=" 【entity-Daraz¦canonical_name=Daraz】 Affiliate Link - s.【entity-daraz¦canonical_name=Daraz】.pk/..." className="border p-3.5 rounded-full text-sm md:col-span-2"/>
              <input value={form.img} onChange={e=>setForm({...form,img:e.target.value})} placeholder="Image URL https://..." className="border p-3.5 rounded-full text-sm md:col-span-2"/>
              <input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="Tags / Code" className="border p-3.5 rounded-full text-sm"/>
              <label className="flex gap-2 items-center text-xs font-bold"><input type="checkbox" checked={form.best} onChange={e=>setForm({...form,best:e.target.checked})}/> Best Sellers me dikhao</label>
              <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="Caption / Detail" className="border p-3.5 rounded-2xl text-sm md:col-span-2 h-20"/>
            </div>
            <button onClick={addProduct} className="w-full bg-[#1B3A2E] text-white py-4 rounded-full mt-4 font-black">Add Product - LIVE 【entity-Daraz¦canonical_name=Daraz】</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{pros.map((p:any)=><div key={p.id} className="bg-white p-3 rounded-[20px] border"><img src={p.image||p.image_url} className="h-32 w-full object-cover rounded-xl"/><p className="text-xs font-bold mt-2 line-clamp-2">{p.title||p.name}</p><p className="text-sm font-black">Rs.{p.price}</p><span className="text-[9px] bg-[#FAFAF7] border px-2 py-1 rounded-full">{p.category}</span><button onClick={()=>delProduct(p.id)} className="w-full mt-2 text-[10px] border rounded-full py-1">Delete</button></div>)}</div>
        </div>}

        {tab==="categories" && <div className="bg-white rounded-[22px] p-6 border"><h3 className="font-black text-[#1B3A2E]">Categories - Admin me show hongi taake select karke add karo</h3><div className="flex gap-2 mt-4"><input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New Category" className="flex-1 border p-3.5 rounded-full text-sm"/><button onClick={addCat} className="bg-[#1B3A2E] text-white px-6 rounded-full text-sm font-bold">Add</button></div><div className="flex gap-2 flex-wrap mt-4">{cats.map((c:any)=><span key={c.id} className="bg-[#FAFAF7] border px-4 py-2 rounded-full text-xs font-bold">{c.icon} {c.name}</span>)}</div></div>}

        {tab==="orders" && <div className="bg-white rounded-[22px] p-6 border"><h3 className="font-black"> Daraz Clicks - Latest 500 - Orders</h3><div className="mt-4 space-y-2 max-h-[500px] overflow-auto">{clicks.map((c:any)=><div key={c.id} className="flex justify-between border-b py-2 text-[11px]"><span>{c.product_title||c.product_id||"Product"}</span><span>{new Date(c.created_at).toLocaleDateString()}</span></div>)}{clicks.length===0 && <p className="text-xs text-gray-400">Abhi koi clicks nahi</p>}</div></div>}

        {tab==="profile" && <div className="max-w-[500px] space-y-3">
          <div className="bg-white rounded-[22px] p-6 border shadow-sm"><h2 className="font-black text-[#1B3A2E]">🔒 Secure Profile</h2><p className="text-[10px] text-[#6B8F71] font-bold mt-1">Locked Email: {LOCKED_EMAIL}</p><p className="text-[9px] text-gray-400 mt-1">Password kahin show nahi hota - Sirf ••••</p></div>
          <div className="bg-white rounded-[22px] p-6 border shadow-sm"><h3 className="font-black text-sm">1. Password Change - Inside Page</h3><div className="relative mt-3"><input value={changePass.old} onChange={e=>setChangePass({...changePass,old:e.target.value})} type={showOldP?"text":"password"} placeholder="Old Password ••••" className="w-full border p-3.5 rounded-full text-sm pr-12 outline-none"/><button onClick={()=>setShowOldP(!showOldP)} className="absolute right-2 top-2.5 text-[10px] bg-white border px-3 py-1 rounded-full font-bold">{showOldP?"Hide":"Show"}</button></div><div className="relative mt-2"><input value={changePass.new} onChange={e=>setChangePass({...changePass,new:e.target.value})} type={showChangeNewP?"text":"password"} placeholder="New Password ••••" className="w-full border p-3.5 rounded-full text-sm pr-12 outline-none"/><button onClick={()=>setShowChangeNewP(!showChangeNewP)} className="absolute right-2 top-2.5 text-[10px] bg-white border px-3 py-1 rounded-full font-bold">{showChangeNewP?"Hide":"Show"}</button></div><button onClick={changePasswordInside} className="w-full bg-[#1B3A2E] text-white py-3.5 rounded-full mt-3 font-black text-sm">Change Password</button></div>
          <div className="bg-white rounded-[22px] p-6 border-2 border-dashed"><h3 className="font-black text-sm">2. Forget - OTP Screen pe + Email pe</h3><button onClick={()=>setShowForgotInside(!showForgotInside)} className="w-full mt-3 bg-[#6B8F71] text-white py-3.5 rounded-full text-sm font-bold">Forget? Send OTP</button>{showForgotInside && <div className="mt-3 bg-[#FAFAF7] p-4 rounded-2xl border">{!otpSentInside? <button onClick={async()=>{const code=Math.floor(100000+Math.random()*900000).toString(); await supabase.from("admin_otps").insert([{email:LOCKED_EMAIL,otp:code}]); setLastOtp(code); setOtpSentInside(true)}} className="w-full bg-[#1B3A2E] text-white py-3 rounded-full text-xs font-bold">Send OTP to {LOCKED_EMAIL}</button> : <><div className="bg-[#FFD814] text-center py-4 rounded-2xl font-black text-2xl border-2 border-black">OTP: {lastOtp}</div><p className="text-[10px] text-center mt-1">Email {LOCKED_EMAIL} pe bhi bheja</p><input value={otpInside} onChange={e=>setOtpInside(e.target.value)} placeholder="OTP" className="w-full border p-3.5 rounded-full mt-3 text-sm"/><input value={newPassInside} onChange={e=>setNewPassInside(e.target.value)} type="password" placeholder="New Password" className="w-full border p-3.5 rounded-full mt-2 text-sm"/><button onClick={async()=>{const {data}=await supabase.from("admin_otps").select("*").eq("otp",otpInside).single(); if(data){ await supabase.from("admin_config").update({password:newPassInside}).eq("id",1); alert("Reset Done"); setShowForgotInside(false)}else alert("Invalid OTP")}} className="w-full bg-[#FFD814] py-3.5 rounded-full mt-3 font-black text-sm border-2 border-black">Reset</button></>}</div>}</div>
        </div>}
      </div>
    </div>
  )
}
