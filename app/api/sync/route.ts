import { NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"
export const dynamic = "force-dynamic"

async function getDarazPrice(url: string){
 try{
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" })
  const html = await res.text()
  // Daraz pe price 3 jagah hota hai - hum sab check karenge
  const patterns = [
   /"price":\{"text":"Rs\.\s*([\d,]+)"/,
   /"originalPrice":\{"text":"Rs\.\s*([\d,]+)"/,
   /"priceText":"Rs\.\s*([\d,]+)"/,
   /pdp-price[^>]*>Rs\.\s*([\d,]+)/
  ]
  for(const p of patterns){
   const m = html.match(p)
   if(m){ return parseInt(m[1].replace(/,/g,"")) }
  }
  return null
 }catch{ return null }
}

export async function GET(){
 try{
  const { data: products } = await supabase.from("products").select("id,daraz_url,price").not("daraz_url","is",null)
  let updated = 0
  for(const prod of products || []){
   if(!prod.daraz_url) continue
   const darazPrice = await getDarazPrice(prod.daraz_url)
   if(darazPrice){
    const newPrice = Math.round(darazPrice * 1.1) // 10% margin tumhara profit
    await supabase.from("products").update({ price: newPrice }).eq("id", prod.id)
    updated++
   }
  }
  return NextResponse.json({ ok:true, checked: products?.length || 0, updated, time: new Date().toISOString() })
 }catch(e:any){
  return NextResponse.json({ error: e.message }, { status: 500 })
 }
}
