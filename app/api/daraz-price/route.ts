import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ success: false, message: "Link khali hai" });

    // 1. Resolve short link
    let finalUrl = url;
    try {
      const r = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0" } });
      finalUrl = r.url;
    } catch {}

    // 2. Fetch Daraz page
    const resp = await fetch(finalUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36" },
      cache: "no-store",
      next: { revalidate: 0 }
    });
    const html = await resp.text();

    // 3. Price nikalna - sabse safe tareeka
    const m = html.match(/"salePrice"\s*:\s*\{[^}]*"text"\s*:\s*"Rs\.\s*([0-9,]+)"/)
           || html.match(/"priceText"\s*:\s*"Rs\.\s*([0-9,]+)"/)
           || html.match(/currentPrice":"Rs\.\s*([0-9,]+)"/);

    if (!m) return NextResponse.json({ success: false, message: "Daraz ne HTML block kar diya, manual likho" });

    const price = parseInt(m[1].replace(/,/g, ""));

    return NextResponse.json({ success: true, price });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message });
  }
}
