"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Shop(){
  const [pros,setPros]=useState<any[]>([])
  const [cat,setCat]=useState("Shop All")
  const cats=["Shop All","Best Sellers","Kitchen","Bartan","Storage & Organizers"]
  useEffect(()=>{load()},[])
  const load=async()=>{const {data}=await supabase.from("products").select("*").order("id",{ascending:false}); if(data) setPros(data)}
  const filtered = cat==="Shop All"? pros : cat==="Best Sellers"? pros.filter((p:any)=>p.is_best_seller) : pros.filter((p:any)=>p.category===cat)
  return(
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between"><h1 className="font-black text-xl">Al Safa Traders.pk</h1><a href="/admin" className="text-xs border px-4 py-2 rounded-full">Admin</a></div>
      <div className="max-w-[1280px] mx-auto p-6">
        <div className="flex gap-2 overflow-auto pb-2">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-5 py-2 rounded-full text-xs font-bold shrink-0 ${cat===c?"bg-black text-white":"bg-gray-100"}`}>{c}</button>)}</div>
        <h2 className="font-black mt-6">{cat} ({filtered.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {filtered.map((p:any)=>(
            <div key={p.id} className="border rounded-2xl overflow-hidden">
              <img src={p.image_url||"https://via.placeholder.com/300"} className="h-[180px] w-full object-cover"/>
              <div className="p-3"><p className="font-bold text-sm line-clamp-1">{p.name}</p><p className="text-xs text-gray-500">{p.category}</p><p className="font-black mt-1">Rs.{p.price}</p><a href={p.affiliate_link||"#"} target="_blank" className="block text-center bg-[#FFD814] py-2 rounded-full text-xs font-black mt-2">Buy on Daraz</a></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
