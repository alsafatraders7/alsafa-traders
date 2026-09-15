import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
export const dynamic = "force-dynamic"
export const maxDuration = 60

async function getDarazPrice(darazUrl: string) {
  try {
    const res = await fetch(darazUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://www.daraz.pk/",
      },
      cache: "no-store",
    })
    const html = await res.text()
    let current = 0; let original = 0
    const saleMatch = html.match(/"salePrice"[^}]*?"text"\s*:\s*"Rs\.\s*([\d,]+)"/)
    const origMatch = html.match(/"originalPrice"[^}]*?"text"\s*:\s*"Rs\.\s*([\d,]+)"/)
    if (saleMatch) current = parseInt(saleMatch[1].replace(/,/g, ""))
    if (origMatch) original = parseInt(origMatch[1].replace(/,/g, ""))
    if (!current) {
      const matches = [...html.matchAll(/Rs\.\s*([\d,]+)/g)]
      const nums = matches.map((mm:any) => parseInt(mm[1].replace(/,/g, ""))).filter((n:number) => n > 100 && n < 100000)
      if (nums.length >= 2) { nums.sort((a:number,b:number)=>a-b); current = nums[0]; original = nums[nums.length-1] }
    }
    return { current, original }
  } catch { return { current: 0, original: 0 } }
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: products } = await supabase.from("products").select("*")
  if (!products) return NextResponse.json({ error: "No products" }, { status: 404 })
  let updated = 0
  for (const p of products as any[]) {
    let darazUrl = p.daraz_source_url || p.source_url || ""
    if (!darazUrl && p.affiliate_link?.includes("daraz.pk")) darazUrl = p.affiliate_link
    if (!darazUrl) continue
    const { current, original } = await getDarazPrice(darazUrl)
    if (current > 0) {
      const finalOriginal = original > current? original : Math.round(current * 1.6)
      await supabase.from("products").update({
        price: current, original_price: finalOriginal,
        price_discounted: current, price_original: finalOriginal,
        last_synced: new Date().toISOString()
      }).eq("id", p.id)
      updated++
    }
    await new Promise(r => setTimeout(r, 1200))
  }
  return NextResponse.json({ success: true, message: `✅ ${updated} synced`, updated, total: products.length })
}
