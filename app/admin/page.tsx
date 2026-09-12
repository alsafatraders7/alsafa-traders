"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminMaster() {
  const [isLogin, setIsLogin] = useState(false);
  const [pass, setPass] = useState("");
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name:"", price:"", image:"", images:[], daraz_link:"", category_id:"", description:"", best_seller:false, active:true, caption_fb:"", caption_ig:"", caption_tiktok:"" });
  const [catName, setCatName] = useState("");

  useEffect(()=>{ fetchAll(); },[]);
  const fetchAll = async ()=>{
    const {data:p}= await supabase.from("products").select("*, categories(name)").order("created_at",{ascending:false});
    const {data:c}= await supabase.from("categories").select("*");
    if(p) setProducts(p); if(c) setCategories(c);
  };

  const login = ()=>{ if(pass==="AlSafa@2024") setIsLogin(true); else alert("Wrong!"); };

  const addProduct = async ()=>{
    if(!form.name) return alert("Name required");
    const {error}= await supabase.from("products").insert([{...form, images: form.images.length?form.images:[form.image], category_id: form.category_id||null }]);
    if(error) alert(error.message); else { alert("LIVE HO GAYA!"); setForm({ name:"", price:"", image:"", images:[], daraz_link:"", category_id:"", description:"", best_seller:false, active:true, caption_fb:"", caption_ig:"", caption_tiktok:"" }); fetchAll(); }
  };
  const deleteProduct = async (id:any)=>{ await supabase.from("products").delete().eq("id",id); fetchAll(); };
  const addCategory = async ()=>{ if(!catName) return; await supabase.from("categories").insert([{name:catName}]); setCatName(""); fetchAll(); };

  if(!isLogin) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#E8F5E9"}}>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border-t-4" style={{borderColor:"#1A3C34"}}>
        <h1 className="text-2xl font-bold" style={{color:"#1A3C34"}}>AL SAFA TRADERS</h1><p className="text-sm mb-6">Admin Panel Locked</p>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" className="w-full border p-3 rounded-lg mb-3"/>
        <button onClick={login} className="w-full py-3 rounded-lg text-white font-bold" style={{background:"#1A3C34"}}>Unlock Dashboard</button>
        <p className="text-xs mt-3 text-gray-400">Password: AlSafa@2024</p>
      </div>
    </div>
  );

  const stats = [
    {label:"Total Products", value: products.length, color:"#1A3C34"},
    {label:"Categories", value: categories.length, color:"#1A3C34"},
    {label:"Total Clicks", value:"Not available", color:"#FFC107"},
    {label:"Est. Commission", value:"Not available", color:"#FFC107"},
  ];

  return (
    <div className="min-h-screen flex" style={{background:"#E8F5E9"}}>
      {/* Sidebar */}
      <div className="w-64 text-white p-5 flex flex-col" style={{background:"#1A3C34"}}>
        <h2 className="text-xl font-bold mb-8">AL SAFA TRADERS</h2>
        {["Dashboard","Products","Categories","Daraz Affiliate Links","Product Images & Details","Captions","Orders","Sales","Analytics","Website Settings","Customer Management","Admin Account","Help & Support"].map(tab=>(
          <button key={tab} onClick={()=>setActiveTab(tab)} className={`text-left py-2.5 px-3 rounded-lg mb-1 text-sm ${activeTab===tab?"bg-white text-[#1A3C34] font-bold":"hover:bg-white/10"}`}>{tab}</button>
        ))}
        <button onClick={()=>setIsLogin(false)} className="mt-auto text-left py-2 px-3 rounded bg-red-500/20">Logout</button>
      </div>

      {/* Main */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white p-4 flex justify-between items-center shadow">
          <div className="flex items-center gap-4"><span className="font-bold" style={{color:"#1A3C34"}}>Welcome Back, Admin!</span><a href="/" target="_blank" className="text-sm px-3 py-1 rounded-full text-white" style={{background:"#1A3C34"}}>View Public Website</a></div>
          <div className="flex items-center gap-4"><input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="border p-2 rounded-lg text-sm"/><div className="w-8 h-8 rounded-full bg-[#FFC107]"></div></div>
        </div>

        <div className="p-6">
          {/* Live Status Box */}
          <div className="bg-white p-3 rounded-lg mb-6 flex justify-between items-center border-l-4" style={{borderColor: products.length>=0?"#1A3C34":"red"}}>
            <span>Live Data Connected: {process.env.NEXT_PUBLIC_SUPABASE_URL?"✅ Synced with Supabase":"❌ Not available"}</span><span className="text-xs">www.alsafatraders.pk • {products.length>0?"Live":"Offline"}</span>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map(s=>(
              <div key={s.label} className="bg-white p-5 rounded-xl shadow">
                <p className="text-sm text-gray-500">{s.label}</p><p className="text-2xl font-bold" style={{color:s.color}}>{s.value}</p>
              </div>
            ))}
          </div>

          {activeTab==="Dashboard" && (
            <>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  {t:"Add New Product",a:"Products"},
                  {t:"Manage Products",a:"Products"},
                  {t:"Manage Categories",a:"Categories"},
                  {t:"Edit Website Settings",a:"Website Settings"},
                ].map(b=>(
                  <button key={b.t} onClick={()=>setActiveTab(b.a)} className="bg-white p-4 rounded-xl shadow font-bold hover:shadow-lg" style={{borderBottom:"4px solid #FFC107"}}>{b.t}</button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl shadow">
                  <div className="flex justify-between mb-4"><h3 className="font-bold">Recent Products</h3><button onClick={()=>setActiveTab("Products")} className="text-sm" style={{color:"#1A3C34"}}>View All</button></div>
                  <div className="space-y-3">{products.slice(0,3).map(p=>(
                    <div key={p.id} className="flex gap-3 items-center"><img src={p.image||p.images?.[0]} className="w-12 h-12 rounded object-cover"/><div><p className="font-bold text-sm">{p.name}</p><p className="text-xs">{p.categories?.name} • {p.price} • {p.active?"Published":"Hidden"}</p></div></div>
                  ))}{products.length===0&&<p>No products</p>}</div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow">
                  <h3 className="font-bold mb-4">Top Categories</h3>
                  <div className="space-y-2">{categories.map(c=>(
                    <div key={c.id} className="flex justify-between p-2 rounded" style={{background:"#E8F5E9"}}><span>{c.icon} {c.name}</span><span className="text-sm">{products.filter(pr=>pr.category_id===c.id).length} products</span></div>
                  ))}</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow mt-6">
                <h3 className="font-bold mb-3">Recent Orders</h3>
                <p className="text-center py-10 text-gray-400">No orders found — Orders system not connected yet (No fake orders)</p>
              </div>
            </>
          )}

          {activeTab==="Products" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold mb-4">Add/Edit Products</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border p-2 rounded"/>
                <input placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="border p-2 rounded"/>
                <input placeholder="Main Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} className="border p-2 rounded"/>
                <select value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})} className="border p-2 rounded"><option value="">Select Category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <input placeholder="Daraz Affiliate Link" value={form.daraz_link} onChange={e=>setForm({...form,daraz_link:e.target.value})} className="border p-2 rounded col-span-2"/>
                <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="border p-2 rounded col-span-2"/>
                <label className="flex gap-2"><input type="checkbox" checked={form.best_seller} onChange={e=>setForm({...form,best_seller:e.target.checked})}/> Best Seller</label>
                <label className="flex gap-2"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/> Active/Published</label>
              </div>
              <button onClick={addProduct} className="px-6 py-3 rounded font-bold text-white" style={{background:"#1A3C34"}}>ADD TO LIVE WEBSITE</button>

              <div className="mt-8 grid grid-cols-1 gap-3">
                {products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())).map(p=>(
                  <div key={p.id} className="flex justify-between items-center border p-3 rounded"><div className="flex gap-3"><img src={p.image||p.images?.[0]} className="w-12 h-12 rounded"/><div><p className="font-bold">{p.name} {p.best_seller&&"⭐"}</p><p className="text-xs">{p.price} • {p.active?"Active":"Hidden"} • {p.daraz_link?.slice(0,30)}</p></div></div><button onClick={()=>deleteProduct(p.id)} className="text-red-500">Delete</button></div>
                ))}
              </div>
            </div>
          )}

          {activeTab==="Categories" && (
            <div className="bg-white p-6 rounded-xl shadow"><h3 className="font-bold mb-4">Manage Categories</h3><div className="flex gap-2 mb-6"><input value={catName} onChange={e=>setCatName(e.target.value)} placeholder="New Category" className="border p-2 rounded"/><button onClick={addCategory} className="px-4 py-2 rounded text-white" style={{background:"#1A3C34"}}>Add</button></div>{categories.map(c=><div key={c.id} className="flex justify-between p-2 border-b"><span>{c.name}</span><span>{products.filter(p=>p.category_id===c.id).length} products</span></div>)}</div>
          )}

          {activeTab==="Daraz Affiliate Links" && (
            <div className="bg-white p-6 rounded-xl shadow"><h3 className="font-bold mb-4">Affiliate Links Manage</h3>{products.map(p=><div key={p.id} className="flex justify-between p-2 border-b text-sm"><span>{p.name}</span><a href={p.daraz_link} target="_blank" className="text-blue-600 truncate w-1/2">{p.daraz_link||"No link"}</a></div>)}</div>
          )}

          {activeTab==="Captions" && (
            <div className="bg-white p-6 rounded-xl shadow"><h3 className="font-bold">Captions / Marketing Notes (【entity-Facebook¦canonical_name=Facebook】, 【entity-Instagram¦canonical_name=Instagram】, TikTok)</h3>{products.map(p=><div key={p.id} className="border p-3 rounded mt-3"><p className="font-bold">{p.name}</p><p className="text-xs mt-1">FB: {p.caption_fb||"—"} | IG: {p.caption_ig||"—"} | TikTok: {p.caption_tiktok||"—"}</p></div>)}</div>
          )}

          {(activeTab==="Orders"||activeTab==="Sales"||activeTab==="Analytics") && (
            <div className="bg-white p-10 rounded-xl shadow text-center text-gray-400">{activeTab} — Placeholder (No fake data) — Future system will show real {activeTab.toLowerCase()} here.</div>
          )}
        </div>
      </div>
    </div>
  );
}
