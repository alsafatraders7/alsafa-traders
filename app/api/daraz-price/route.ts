import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body.url;
    if (!url) return NextResponse.json({ success: false });

    let finalUrl = url;
    try {
      const r = await fetch(url, { redirect: "follow" });
      finalUrl = r.url || url;
    } catch {}

    const res = await fetch(finalUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    const html = await res.text();

    let price: number | null = null;

    // Simple and safe regex
    const m1 = html.match(/salePrice[^0-9]*Rs\.\s*([0-9,]+)/);
    const m2 = html.match(/"priceText":"Rs\.\s*([0-9,]+)"/);
    const m3 = html.match(/Rs\.\s*([0-9,]{3,6})/);

    const found = m1?.[1] || m2?.[1] || m3?.[1];
    if (found) price = parseInt(found.replace(/,/g, ""));

    if (!price) {
      return NextResponse.json({ success: false, message: "Price not found" });
    }

    return NextResponse.json({
      success: true,
      price: price,
      name: "Daraz Product",
      image: "",
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, msg: "API LIVE" });
}
