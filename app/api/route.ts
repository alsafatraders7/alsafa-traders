import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
export const dynamic = "force-dynamic"
export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data: products } = await supabase.from("products").select("*")
  let updated = 0
  for (const p of products as any[]) {
    const url = p.daraz_source_url || p.source_url || ""
    if (!url) continue
    try {
      const html = await (await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })).text()
      const m = html.match(/Rs\.\s*([\d,]+)/)
      if (m) {
        const price = parseInt(m[1].replace(/,/g,""))
        await supabase.from("products").update({ price }).eq("id", p.id)
        updated++
      }
    } catch {}
    await new Promise(r=>setTimeout(r,1000))
  }
  return NextResponse.json({ success: true, updated })
}
