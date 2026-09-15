import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"
async function getDarazPrice(darazUrl: string) {
  try {
    const res = await fetch(darazUrl, {
      headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://www.daraz.pk/" },
      cache: "no-store",
    })
    const html = await res.text()
    let current = 0; let original = 0; let title = ""
    const titleMatch = html.match(/<title>(.*?)<\/title>/)
    if (titleMatch) title = titleMatch[1].split("|")[0].trim()
    const saleMatch = html.match(/"salePrice"[^}]*?"text"\s*:\s*"Rs\.\s*([\d,]+)"/)
    const origMatch = html.match(/"originalPrice"[^}]*?"text"\s*:\s*"Rs\.\s*([\d,]+)"/)
    if (saleMatch) current = parseInt(saleMatch[1].replace(/,/g, ""))
    if (origMatch) original = parseInt(origMatch[1].replace(/,/g, ""))
    if (!current) {
      const matches = [...html.matchAll(/Rs\.\s*([\d,]+)/g)]
      const nums = matches.map((mm:any) => parseInt(mm[1].replace(/,/g, ""))).filter((n:number) => n > 100 && n < 100000)
      if (nums.length >= 2) { nums.sort((a:number,b:number)=>a-b); current = nums[0]; original = nums[nums.length-1] }
    }
    return { current, original, title }
  } catch { return { current: 0, original: 0, title: "" } }
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 })
  const data = await getDarazPrice(url)
  return NextResponse.json(data)
}
