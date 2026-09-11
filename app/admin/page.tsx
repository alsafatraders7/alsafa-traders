"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const LOCKED = "alsafatraders7@gmail.com"

export default function FullAdmin(){
  const [ok,setOk]=useState(false); const [email,setEmail]=useState(""); const [pass,setPass]=useState("")
  const [tab,setTab]=useState("dashboard"); const [pros,setPros]=useState<any[]>([]); const [ords,setOrds]=useState<any[]>([])
  const [cats,setCats]=useState<string[]>(["Kitchen","Bartan","Storage & Organizers"])
  const [newCat,setNewCat]=useState(""); const [file,setFile]=useState<File|null>(null)
  const [form,setForm]=useState({name:"",price:"",oprice:"",code:"",cat:"Kitchen",img:"",link:"",desc:""})
  const [showForgot,setShowForgot]=useState(false); const [otpSent,setOtpSent]=useState(""); const [otpIn,setOtpIn]=useState(""); const [newP,setNewP]=useState("")
  const [views,setViews]=useState(187)

  useEffect(()=>{
    if(localStorage.getItem("safa_ok")==="1") setOk(true)
    const savedCats=localStorage.getItem("safa_cats"); if(savedCats) setCats(JSON.parse(savedCats))
    const v=Number(localStorage.getItem("safa_views")||"187"); setViews(v+1); localStorage.setItem("safa_views",String(v+1))
    load()
  },[])
  const load=async()=>{
    const {data:p}=await supabase.from("products").select("*").order("id",{ascending:false}); if(p) setPros(p)
    const {data:o}=await supabase.from("orders").select("*").order("id",{ascending:false}); if(o) setOrds(o)
  }
  const saveCats=(c:string[])=>{ setCats(c); localStorage.setItem("safa_cats",JSON.stringify(c)) }

  const login=()=>{ const sp=localStorage.getItem("safa_pass")||"alsafa123"; if(email.toLowerCase()!==LOCKED) return alert("Sirf "+LOCKED); if(pass!==sp) return alert("Wrong Password! Forget pe click karo"); localStorage.setItem("safa_ok","1"); setOk(true) }

  const sendOTP=()=>{
    if(email.toLowerCase()!==LOCKED) return alert("Email locked: "+LOCKED)
    const otp=Math.floor(100000+Math.random()*900000).toString(); setOtpSent(otp)
    alert(`OTP Bheja Gaya!\nEmail: ${LOCKED}\nWhatsApp: 03001813429\nSIM OTP: ${otp}\n(Ye demo OTP hai - Real me Email/WhatsApp pe jayega)`)
  }
  const verifyOTP=()=>{
    if(otpIn!==otpSent) return alert("Wrong OTP")
    if(!newP) return alert("Naya password likho")
    localStorage.setItem("safa_pass",newP); alert("Password Reset! New: "+newP); setShowForgot(false); setOtpSent(""); setOtpIn(""); setNewP(""); setPass(newP)
  }

  const upload=async()=>{ if(!file) return form.img; const n=Date.now()+"_"+file.name; const {error}=await supabase.storage.from("product-images").upload(n,file); if(error) return form.img; return supabase.storage.from("product-images").getPublicUrl(n).data.publicUrl }

  const addProd=async()=>{
    if(!form.name||!form.price) return alert("Name/Price lazmi")
    const url=await upload()
    await supabase.from("products").insert([{name:form.name,price:Number(form.price),original_price:Number(form.oprice||form.price),code:form.code,image_url:url,affiliate_link:form.link,category:form.cat,description:form.desc,stock:10}])
    setForm({name:"",price:"",oprice:"",code:"",cat:cats[0],img:"",link:"",desc:""}); setFile(null); load(); alert("Product Website Pe Live Ho Gaya!")
  }

  if(!ok) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] p-7 w-full max-w-[400px]">
        <h1 className="font-black text-2xl">Al Safa - Full Admin</h1><p className="text-[11px] text-gray-400">Locked: {LOCKED}</p>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={LOCKED} className="w-full border p-4 rounded-2xl mt-6 text-sm"/>
        <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full border p-4 rounded-2xl mt-3 text-sm"/>
        <button onClick={login} className="w-full bg-black text-white py-4 rounded-full mt-4 font-black">LOGIN</button>
        <button onClick={()=>setShowForgot(!showForgot)} className="w-full text-center text-xs mt-4 underline text-gray-600">Password Bhool Gaye? Forget Password - WhatsApp/Email OTP</button>
        {showForgot && (<div className="mt-4 bg-[#F5F7F5] p-4 rounded-2xl">
          <p className="text-[11px] font-black">RESET VIA OTP</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={LOCKED} className="w-full border p-3 rounded-xl mt-3 text-sm"/>
          <button onClick={sendOTP} className="w-full bg-[#0A3D2E] text-white py-3 rounded-full mt-3 text-sm font-bold">Send OTP - WhatsApp / Email / SIM</button>
          {otpSent && (<><input value={otpIn} onChange={e=>setOtpIn(e.target.value)} placeholder="OTP likho e.g. 123456" className="w-full border p-3 rounded-xl mt-3 text-sm"/><input value={newP} onChange={e=>setNewP(e.target.value)} placeholder="Naya Password" className="w-full border p-3 rounded-xl mt-3 text-sm"/><button onClick={verifyOTP} className="w-full bg-black text-white py-3 rounded-full mt-3 text-sm font-bold">Verify & Reset</button></>)}
        </div>)}
      </div>
    </div>
  )

  const monthOrders=ords.filter((o:any)=>{ const d=new Date(o.created_at||Date.now()); const n=new Date(); return d.getMonth()===n.getMonth() }).length
  const monthSales=ords.filter((o:any)=>{ const d=new Date(o.created_at||Date.now()); const n=new Date(); return d.getMonth()===n.getMonth() }).reduce((s:any,o:any)=>s+(o.total||0),0)

  return(
    <div className="min-h-screen bg-[#F0F5F0]">
      <div className="sticky top-0 z-50 bg-white border-b px-3 md:px-6 py-3 flex justify-between items-center"><h1 className="font-black text-sm md:text-lg">Al Safa - Full Admin</h1><div className="flex gap-2"><a href="/" className="border px-4 py-2 rounded-full text-xs font-bold">Shop Dekho</a><button onClick={()=>{localStorage.removeItem("safa_ok"); setOk(false)}} className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold">Logout</button></div></div>
      <div className="max-w-[1280px] mx-auto px-3 md:px-6">
        <div className="flex gap-2 mt-4 overflow-auto pb-2">{["dashboard","products","orders","profile"].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-6 py-3 rounded-full font-black text-xs md:text-sm capitalize shrink-0 ${tab===t?"bg-black text-white":"bg-white border"}`}>{t}</button>)}</div>

        {tab==="dashboard" && (<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          <div className="bg-white p-6 rounded-[20px] shadow-sm"><p className="text-[11px] text-gray-500">TOTAL ORDER - 1 MONTH</p><p className="text-3xl font-black mt-2">{monthOrders}</p><p className="text-[10px] text-gray-400 mt-1">Is mahine ke orders</p></div>
          <div className="bg-white p-6 rounded-[20px] shadow-sm"><p className="text-[11px] text-gray-500">1 MONTH SALES</p><p className="text-2xl font-black mt-2">Rs.{monthSales}</p></div>
          <div className="bg-white p-6 rounded-[20px] shadow-sm"><p className="text-[11px] text-gray-500">WEBSITE VIEWS</p><p className="text-3xl font-black mt-2">{views}</p><p className="text-[10px] text-gray-400">Kitny log aye</p></div>
          <div className="bg-white p-6 rounded-[20px] shadow-sm"><p className="text-[11px] text-gray-500">TOTAL PRODUCTS</p><p className="text-3xl font-black mt-2">{pros.length}</p></div>
        </div>)}

        {tab==="products" && (
          <div className="mt-5 grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-[20px] p-5 shadow-sm">
              <h2 className="font-black mb-4">E) ADD NEW PRODUCT</h2>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Product Name e.g. Steel Kettle" className="w-full border p-3 rounded-full text-sm mb-3"/>
              <div className="grid grid-cols-2 gap-3"><input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price Rs e.g. 1450" className="w-full border p-3 rounded-full text-sm mb-3"/><input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="Code e.g. XAbc1" className="w-full border p-3 rounded-full text-sm mb-3"/></div>
              <div className="grid grid-cols-2 gap-3"><select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} className="w-full border p-3 rounded-full text-sm mb-3">{cats.map(c=><option key={c}>{c}</option>)}</select><input value={form.oprice} onChange={e=>setForm({...form,oprice:e.target.value})} placeholder="Original Price Rs. 699" className="w-full border p-3 rounded-full text-sm mb-3"/></div>
              <input value={form.img} onChange={e=>setForm({...form,img:e.target.value})} placeholder="Image URL (paste or leave blank)" className="w-full border p-3 rounded-full text-sm mb-3"/>
              <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} className="text-[11px] mb-3"/>
              <p className="text-[12px] font-bold text-orange-600 mb-2">Affiliate Link (【entity-Daraz¦canonical_name=Daraz】 s.【entity-daraz¦canonical_name=Daraz】.pk)</p>
              <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="https://s.daraz.pk/s.XLF0U?cc" className="w-full border p-3 rounded-full text-sm mb-3 bg-[#FFF9E6]"/>
              <div className="bg-[#FFF9E6] p-3 rounded-xl text-[11px] text-gray-600 mb-4">Yahan apna s.【entity-daraz¦canonical_name=Daraz】.pk link paste karo - customer sidha isi product pe jayega. Link copy paste working!</div>
              <button onClick={addProd} className="w-full bg-[#FFD814] text-black py-4 rounded-full font-black">+ Add Product</button>

              <div className="mt-8 border-t pt-5"><h3 className="font-black text-sm">Apni Category Banao / Delete Karo</h3><div className="flex gap-2 mt-3"><input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New Category e.g. Glass" className="flex-1 border p-3 rounded-full text-sm"/><button onClick={()=>{ if(!newCat) return; saveCats([...cats,newCat]); setNewCat("")}} className="bg-black text-white px-5 rounded-full text-sm font-bold">Add</button></div><div className="flex flex-wrap gap-2 mt-3">{cats.map(c=><span key={c} className="bg-[#F5F5F5] px-3 py-1.5 rounded-full text-xs flex items-center gap-2">{c}<button onClick={()=>saveCats(cats.filter(x=>x!==c))} className="text-red-500 font-black">x</button></span>)}</div></div>
            </div>

            <div className="bg-white rounded-[20px] p-5 shadow-sm h-fit">
              <h2 className="font-black">MANAGE PRODUCTS - GRID ({pros.length})</h2>
              <div className="grid grid-cols-1 gap-3 mt-4">
                {pros.map((pr:any)=><div key={pr.id} className="border rounded-2xl p-3 flex gap-3 items-center"><img src={pr.image_url||"https://via.placeholder.com/80"} className="w-[60px] h-[60px] rounded-xl object-cover"/><div className="flex-1"><p className="font-bold text-sm line-clamp-1">{pr.name}</p><p className="text-[11px] text-gray-500">Rs.{pr.price} • {pr.category} • Code: {pr.code||"—"}</p><p className="text-[10px] text-green-600">{pr.affiliate_link?"Affiliate Active":"No Link"}</p></div><div className="flex flex-col gap-1"><button onClick={()=>navigator.clipboard.writeText(pr.affiliate_link||"")} className="text-[10px] border px-2 py-1 rounded-full">Copy Link</button><button onClick={async()=>{await supabase.from("products").delete().eq("id",pr.id); load()}} className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-full">Delete</button></div></div>)}
              </div>
            </div>
          </div>
        )}

        {tab==="orders" && (<div className="bg-white rounded-[20px] p-6 mt-5"><h2 className="font-black">Orders + Sales (Box Grid)</h2><div className="grid md:grid-cols-3 gap-3 mt-5"><div className="bg-[#F5F7F5] p-5 rounded-2xl"><p className="text-xs">Option 1 - Total Orders</p><p className="text-2xl font-black mt-1">{monthOrders} Orders</p></div><div className="bg-[#F5F7F5] p-5 rounded-2xl"><p className="text-xs">Option 2 - Sales</p><p className="text-2xl font-black mt-1">Rs.{monthSales}</p></div><div className="bg-[#F5F7F5] p-5 rounded-2xl"><p className="text-xs">Option 3 - Views</p><p className="text-2xl font-black mt-1">{views} Log Aye</p></div></div><div className="mt-6">{ords.length===0? <p className="text-sm text-gray-500 text-center py-10">Abhi order nahi</p> : <div className="space-y-2">{ords.map((o:any)=><div key={o.id} className="border p-4 rounded-xl text-sm"><b>#{o.id} - Rs.{o.total}</b> | {o.customer_name} | {o.customer_phone}</div>)}</div>}</div></div>)}

        {tab==="profile" && (<div className="bg-white rounded-[20px] p-6 mt-5 max-w-[600px]">
          <h2 className="font-black text-lg">Personal Profile - Locked + Forget Inside</h2>
          <div className="mt-5 bg-[#F5F7F5] p-4 rounded-xl"><p className="text-[11px] text-gray-500">Email (Locked)</p><p className="font-bold text-sm mt-1">{LOCKED}</p></div>
          <div className="mt-3 bg-[#F5F7F5] p-4 rounded-xl"><p className="text-[11px] text-gray-500">Phone - 03001813429</p><input id="phInner" defaultValue={localStorage.getItem("safa_phone")||"03001813429"} className="w-full bg-transparent font-bold outline-none text-sm mt-1"/></div>
          <div className="mt-3 bg-[#F5F7F5] p-4 rounded-xl"><p className="text-[11px] text-gray-500">New Password - Login karke bhi change kar sakte ho</p><input id="pwInner" placeholder="New Password" className="w-full bg-transparent outline-none text-sm mt-1"/></div>
          <button onClick={()=>{const ph=(document.getElementById("phInner") as any).value; const pw=(document.getElementById("pwInner") as any).value; if(ph) localStorage.setItem("safa_phone",ph); if(pw) localStorage.setItem("safa_pass",pw); alert("Profile Saved!");}} className="w-full bg-black text-white py-4 rounded-full font-black mt-4">Save Profile + Change Password Inside</button>
          <div className="mt-6 border-t pt-4"><p className="text-xs font-bold">Forget Password - Inside Page (OTP via SIM/Email/WhatsApp)</p><button onClick={()=>setShowForgot(!showForgot)} className="w-full border py-3 rounded-full text-xs font-bold mt-3">Forgot Password - Get OTP</button>{showForgot && (<div className="mt-3 bg-[#F5F7F5] p-4 rounded-xl"><button onClick={sendOTP} className="w-full bg-[#0A3D2E] text-white py-3 rounded-full text-xs font-bold">Send OTP to WhatsApp / SIM / Email</button>{otpSent && (<><input value={otpIn} onChange={e=>setOtpIn(e.target.value)} placeholder="OTP" className="w-full border p-3 rounded-xl mt-3 text-sm"/><input value={newP} onChange={e=>setNewP(e.target.value)} placeholder="New Password" className="w-full border p-3 rounded-xl mt-3 text-sm"/><button onClick={verifyOTP} className="w-full bg-black text-white py-3 rounded-full mt-3 text-xs font-bold">Verify OTP & Reset - Start Business</button></>)}</div>)}</div>
        </div>)}
      </div>
    </div>
  )
}
