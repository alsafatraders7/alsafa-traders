import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
export const dynamic = "force-dynamic"

async function getDarazPrice(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store"
    })
    const html = await res.text()
    let cur = 0, org = 0
    const s = html.match(/"salePrice"[^}]*"text"\s*:\s*"Rs\.\s*([\d,]+)"/)
    const o = html.match(/"originalPrice"[^}]*"text"\s*:\s*"Rs\.\s*([\d,]+)"/)
    if (s) cur = parseInt(s[1].replace(/,/g, ""))
    if (o) org = parseInt(o[1].replace(/,/g, ""))
    return { cur, org }
  } catch { return { cur: 0, org: 0 } }
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.from("products").select("*")
  let upd = 0
  for (const p of data as any[]) {
    const dUrl = p.daraz_source_url
    if (!dUrl) continue
    const { cur, org } = await getDarazPrice(dUrl)
    if (cur > 0) {
      await supabase.from("products").update({
        price_discounted: cur,
        price_original: org || cur + 500,
        last_synced: new Date().toISOString()
      }).eq("id", p.id)
      upd++
    }
  }
  return NextResponse.json({ success: true, updated: upd })
}
