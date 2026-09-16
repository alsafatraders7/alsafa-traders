import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ success: false, message: "Link missing" });

    // Follow s.daraz.pk redirect
    let targetUrl = url;
    try {
      const r = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0" } });
      targetUrl = r.url || url;
    } catch {}

    const htmlRes = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });
    const html = await htmlRes.text();

    // Daraz price extract - multiple patterns
    let price: number | null = null;
    let name: string | null = null;
    let image: string | null = null;

    const patterns = [
      /"salePrice"\s*:\s*\{"text":"Rs\.\s*([\d,]+)"/,
      /"price"\s*:\s*\{"text":"Rs\.\s*([\d,]+)"/,
      /"priceText"\s*:\s*"Rs\.\s*([\d,]+)"/,
      /"currentPrice"\s*:\s*"([\d,]+)"/,
    ];

    for (const p of patterns) {
      const m = html.match(p);
      if (m) {
        price = parseInt(m[1].replace(/,/g, ""));
        break;
      }
    }

    // Name
    const titleMatch = html.match(/<title>(.*?)<\/title>/) || html.match(/"title":"(.*?)"/);
    if (titleMatch) name = titleMatch[1].replace(/ - Daraz.*$/, "").trim();

    // Image
    const imgMatch = html.match(/property="og:image"\s+content="([^"]+)"/) || html.match(/"image":"([^"]+)"/);
    if (imgMatch) image = imgMatch[1];

    if (!price) {
      // last
