import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 【entity-Daraz¦canonical_name=Daraz】 se FULL data - Price + Discount + Flash Sale
async function getDarazData(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      cache: "no-store"
    });
    const html = await res.text();

    const priceMatch = html.match(/"price":\{"text":"Rs\.\s*([\d,]+)"/) ||
                       html.match(/pdp-price[^>]*>Rs\.\s*([\d,]+)/);

    const originalMatch = html.match(/"originalPrice":\{"text":"Rs\.\s*([\d,]+)"/);

    const discountMatch = html.match(/"discount":\{"text":"-?(\d+)%"/);

    const isFlash = html.includes("flashSale") || html.includes("flash-sale");

    if (!priceMatch) return null;

    const price = parseInt(priceMatch[1].replace(/,/g, ""));
    const original = originalMatch? parseInt(originalMatch[1].replace(/,/g, "")) : price;

    return { price, original, isFlash };
  } catch {
    return null;
  }
}

function makeAffiliate(link: string) {
  if (!link) return link;
  if (link.includes("?cc") || link.includes("&cc")) return link;
  return link.includes("?")? link + "&cc" : link + "?cc";
}

export async function GET() {
  try {
    const { data: products } = await supabase
    .from("products")
    .select("id,daraz_url,daraz_link,price")
    .or("daraz_url.not.is.null,daraz_link.not.is.null");

    let updated = 0;

    for (const prod of products || []) {
      // @ts-ignore
      const rawUrl = prod.daraz_url || prod.daraz_link;
      if (!rawUrl) continue;

      const data = await getDarazData(rawUrl);
      if (data) {
        const newPrice = Math.round(data.price * 1.1);
        const newOriginal = Math.round(data.original * 1.1);

        await supabase.from("products").update({
          price: newPrice,
          original_price: newOriginal,
          daraz_link: makeAffiliate(rawUrl),
          daraz_url: makeAffiliate(rawUrl)
        }).eq("id", prod.id);

        updated++;
      }
      await new Promise(r => setTimeout(r, 800));
    }

    return NextResponse.json({
      ok: true,
      checked: products?.length || 0,
      updated,
      message: `LIVE DONE! ${updated} Products - Discount Flash Sale LIVE + Affiliate?cc`,
      time: new Date().toISOString()
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
