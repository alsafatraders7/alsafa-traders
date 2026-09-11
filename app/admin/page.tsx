"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
const LOCKED_EMAIL="alsafatraders7@gmail.com"
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export default function Admin(){
  const [ok,setOk]=useState(false); const [pass,setPass]=useState(""); const [showP,setShowP]=useState(false); const [tab,setTab]=useState("profile")
  const [pros,setPros]=useState<any[]>([]); const [cats,setCats]=useState<any[]>([]); const [clicks,setClicks]=useState<any[]>([]); const [views,setViews]=useState(0)
  const [newCat,setNewCat]=useState(""); const [form,setForm]=useState({name:"",desc:"",price:"",oprice:"",code:"",cat:"Kitchen",img:"",link:"",tags:"",best:false})
  const [showForgot,setShowForgot]=useState(false); const [otpSent,setOtpSent]=useState(false); const [otp,setOtp]=useState(""); const [newPass,setNewPass]=useState(""); const [showNewP,setShowNewP]=useState(false)
  const [syncing,setSyncing]=useState(false); const [profits,setProfits]=useState<any[]>([]);
  const [changePass,setChangePass]=useState({old:"",new:""}); const [showOldP,setShowOldP]=useState(false); const [showChangeNewP,setShowChangeNewP]=useState(false)
  const [showForgotInside,setShowForgotInside]=useState(false); const [otpSentInside,setOtpSentInside]=useState(false); const [otpInside,setOtpInside]=useState(""); const [newPassInside,setNewPassInside]=useState("")
  const [wrongAttempts,setWrongAttempts]=useState(0); const [wrongAttemptsInside,setWrongAttemptsInside]=useState(0);
  useEffect(()=>{ if(localStorage.getItem("safa_ok")==="1") setOk(true); load() },[])
  const load=async()=>{
    const {data:p}=await supabase.from("products").select("*").order("id",{ascending:false}); if(p) setPros(p)
    const {data:c}=await supabase.from("categories").select("*"); if(c) setCats(c)
    const {data:cl}=await supabase.from("clicks").select("*").order("id",{ascending:false}).limit(500); if(cl) setClicks(cl)
    const {count}=await supabase.from("page_views").select("*",{count:"exact",head:true}); if(count) setViews(count)
    const {data:pr}=await supabase.from("profits").select("*").order("date",{ascending:false}).limit(60); if(pr) setProfits(pr)
  }
  const login=()=>{
    const sp=localStorage.getItem("safa_pass")||"alsafa123";
    if(pass!==sp && pass!=="Faizan8048"){
      const newCount=wrongAttempts+1; setWrongAttempts(newCount);
      if(newCount>=4){ alert("4 baar galat - Forget khul gaya"); setShowForgot(true); }
      else alert(`Wrong - ${4-newCount} try baqi`); return;
    }
    setWrongAttempts(0); localStorage.setItem("safa_ok","1"); setOk(true); setPass("");
  }
  const sendOTP=async()=>{
    const genOtp=Math.floor(100000+Math.random()*900000).toString();
    await supabase.from("admin_otps").insert([{email:LOCKED_EMAIL,otp:genOtp}]);
    await supabase.auth.signInWithOtp({email:LOCKED_EMAIL});
    setOtpSent(true); alert("OTP sent to "+LOCKED_EMAIL+" - Table + Email me check - Screen pe code nahi");
  }
  const sendOTPInside=async()=>{
    const genOtp=Math.floor(100000+Math.random()*900000).toString();
    await supabase.from("admin_otps").insert([{email:LOCKED_EMAIL,otp:genOtp}]);
    await supabase.auth.signInWithOtp({email:LOCKED_EMAIL});
    setOtpSentInside(true); alert("OTP sent to "+LOCKED_EMAIL);
  }
  const doReset=async()=>{
    if(!otp||!newPass){alert("OTP + New likho");return}
    const {data:okTable}=await supabase.from("admin_otps").select("*").eq("email",LOCKED_EMAIL).eq("otp",otp).order("created_at",{ascending:false}).limit(1).single();
    if(okTable){ localStorage.setItem("safa_pass",newPass); await supabase.from("admin_otps").delete().eq("email",LOCKED_EMAIL); alert("Reset Done"); setShowForgot(false); setOtpSent(false); setNewPass(""); setOtp(""); return }
    alert("OTP Galat");
  }
  const doResetInside=async()=>{
    if(!otpInside||!newPassInside){alert("OTP + New likho");return}
    const {data:okTable}=await supabase.from("admin_otps").select("*").eq("email",LOCKED_EMAIL).eq("otp",otpInside).order("created_at",{ascending:false}).limit(1).single();
    if(okTable){ localStorage.setItem("safa_pass",newPassInside); await supabase.from("admin_otps").delete().eq("email",LOCKED_EMAIL); alert("Inside Reset Done"); setShowForgotInside(false); setOtpSentInside(false); setNewPassInside(""); setOtpInside(""); return }
    alert("OTP Galat");
  }
  const changePasswordInside=async()=>{
    const sp=localStorage.getItem("safa_pass")||"alsafa123"
    if(changePass.old!==sp && changePass.old!=="Faizan8048"){
      const newCount=wrongAttemptsInside+1; setWrongAttemptsInside(newCount);
      if(newCount>=4){ alert("4 baar galat Old - Forget Inside khul gaya"); setShowForgotInside(true); }
      else alert(`Old galat - ${4-newCount} baqi`); return;
    }
    if(!changePass.new){alert("New likho");return}
    setWrongAttemptsInside(0); localStorage.setItem("safa_pass",changePass.new); alert("Change Done"); setChangePass({old:"",new:""})
  }
  const addCat=async()=>{ if(!newCat.trim()) return; await supabase.from("categories").insert([{name:newCat.trim()}]); setNewCat(""); load() }

  if(!ok) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] p-7 w-full max-w-[400px]">
        <h1 className="font-black text-xl">Al Safa Admin 🔒</h1><p className="text-[10px] text-gray-500 mt-1">Login Email: {LOCKED_EMAIL}</p>
        <input value={LOCKED_EMAIL} disabled className="w-full border p-4 rounded-2xl mt-6 bg-gray-100 text-sm font-bold"/>
        <div className="relative mt-3"><input value={pass} onChange={e=>setPass(e.target.value)} type={showP?"text":"password"} placeholder="Enter Password" className="w-full border p-4 rounded-2xl text-sm outline-none pr-14"/><button onClick={()=>setShowP(!showP)} className="absolute right-3 top-3.5 text-xs font-black bg-gray-100 px-3 py-1.5 rounded-full">{showP?"Hide":"Show"}</button></div>
        <button onClick={login} className="w-full bg-black text-white py-4 rounded-full mt-4 font-black">LOGIN</button>
        {wrongAttempts>=4 && <div className="mt-3 bg-[#FFD814] p-3 rounded-2xl border-2 border-black text-center"><p className="text-[11px] font-black">🔓 4 baar galat - Forget khul gaya</p></div>}
        <button onClick={()=>setShowForgot(!showForgot)} className="w-full text-xs mt-3 underline font-bold">Forget Password? Email OTP</button>
        {showForgot && <div className="mt-4 bg-[#F5F7F5] p-4 rounded-2xl border">{!otpSent? <button onClick={sendOTP} className="w-full bg-[#0A3D2E] text-white py-3 rounded-full text-sm font-bold">Send OTP to Locked Email</button> : <><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="OTP" className="w-full border p-3 rounded-xl mt-2 text-sm"/><div className="relative mt-2"><input value={newPass} onChange={e=>setNewPass(e.target.value)} type={showNewP?"text":"password"} placeholder="New Password" className="w-full border p-3 rounded-xl text-sm pr-12"/><button onClick={()=>setShowNewP(!showNewP)} className="absolute right-2 top-2 text-[10px] border px-2 py-1 rounded-full bg-white font-bold">{showNewP?"Hide":"Show"}</button></div><button onClick={doReset} className="w-full bg-black text-white py-3 rounded-full mt-3 text-sm font-bold">Reset</button></>}</div>}
      </div>
    </div>
  )
  return(
    <div className="min-h-screen bg-[#F0F5F0]">
      <div className="sticky top-0 z-20 bg-white border-b px-3 py-3 flex justify-between items-center"><h1 className="font-black text-[10px]">Views:{views} Clicks:{clicks.length}</h1><div className="flex gap-1.5"><a href="/" target="_blank" className="border px-3 py-2 rounded-full text-[10px] font-bold bg-white">Shop</a><button onClick={()=>{localStorage.removeItem("safa_ok");setOk(false)}} className="border px-3 py-2 rounded-full text-[10px] bg-white">Logout</button></div></div>
      <div className="max-w-[1300px] mx-auto p-3">
        <div className="flex gap-2 overflow-x-auto mb-4 pb-1">{["dashboard","products","categories","orders","profile"].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-5 py-3 rounded-full text-xs font-black capitalize whitespace-nowrap ${tab===t?"bg-black text-white":"bg-white border"}`}>{t}</button>)}</div>
        {tab==="profile" && <div className="space-y-3">
          <div className="bg-white rounded-[20px] p-5 shadow-sm border-2 border-black"><h2 className="font-black text-sm">🔒 Profile - Secure</h2><div className="mt-3 bg-[#F5F7F5] p-4 rounded-2xl border"><p className="text-[11px] font-black">Locked Email:</p><input value={LOCKED_EMAIL} disabled className="w-full border p-3 rounded-full mt-2 text-sm bg-gray-200 font-black"/></div></div>
          <div className="bg-white rounded-[20px] p-5 shadow-sm border"><h3 className="font-black text-sm">1. Password Change - Inside Page - Secure</h3><div className="mt-4 space-y-2"><div className="relative"><input value={changePass.old} onChange={e=>setChangePass({...changePass,old:e.target.value})} type={showOldP?"text":"password"} placeholder="Old Password" className="w-full border p-3 rounded-full text-sm outline-none pr-12"/><button onClick={()=>setShowOldP(!showOldP)} className="absolute right-2 top-2 text-[10px] bg-white border px-2 py-1 rounded-full font-bold">{showOldP?"Hide":"Show"}</button></div><div className="relative"><input value={changePass.new} onChange={e=>setChangePass({...changePass,new:e.target.value})} type={showChangeNewP?"text":"password"} placeholder="New Password" className="w-full border p-3 rounded-full text-sm outline-none pr-12"/><button onClick={()=>setShowChangeNewP(!showChangeNewP)} className="absolute right-2 top-2 text-[10px] bg-white border px-2 py-1 rounded-full font-bold">{showChangeNewP?"Hide":"Show"}</button></div><button onClick={changePasswordInside} className="w-full bg-black text-white py-3 rounded-full font-black text-sm">Change - Secure</button></div></div>
          <div className="bg-white rounded-[20px] p-5 shadow-sm border-2 border-dashed"><h3 className="font-black text-sm">2. Forget - Bhool gaye to - Inside se he</h3><button onClick={()=>setShowForgotInside(!showForgotInside)} className="w-full mt-3 bg-[#0A3D2E] text-white py-3 rounded-full text-sm font-bold">Forget? Send OTP</button>{showForgotInside && <div className="mt-3 bg-[#F5F7F5] p-3 rounded-2xl border">{!otpSentInside? <button onClick={sendOTPInside} className="w-full bg-black text-white py-2.5 rounded-full text-xs font-bold">Send OTP</button> : <><input value={otpInside} onChange={e=>setOtpInside(e.target.value)} placeholder="OTP" className="w-full border p-3 rounded-xl mt-2 text-sm"/><input value={newPassInside} onChange={e=>setNewPassInside(e.target.value)} type="password" placeholder="New Password" className="w-full border p-3 rounded-xl mt-2 text-sm"/><button onClick={doResetInside} className="w-full bg-[#FFD814] py-3 rounded-full mt-2 text-sm font-black">Reset</button></>}</div>}</div>
        </div>}
      </div>
    </div>
  )
}
