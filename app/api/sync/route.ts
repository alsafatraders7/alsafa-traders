import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";

// 【entity-Daraz¦canonical_name=Daraz】 se FULL data - Price + Discount + Flash Sale
async function getDarazData(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      cache: "no-store"
    });
    const html = await res.text();

    // 1. Current Price (Flash Sale wala)
    const priceMatch = html.match(/"price":\{"text":"Rs\.\s*([\d,]+)"/) ||
                       html.match(/pdp-price[^>]*>Rs\.\s*([\d,]+)/);

    // 2. Original Price (Cut wala)
    const originalMatch = html.match(/"originalPrice":\{"text":"Rs\.\s*([\d,]+)"/) ||
                          html.match(/"priceText":"Rs\.\s*([\d,]+)"/);

    // 3. Discount %
    const discountMatch = html.match(/"discount":\{"text":"-?(\d+)%"/) ||
                          html.match(/"-(\d+)%"\}/);

    // 4. Flash Sale Check
    const isFlash = html.includes("flashSale") || html.includes("flash-sale") || html.includes("Flash Sale");

    if (!priceMatch) return null;

    const price = parseInt(priceMatch[1].replace(/,/g, ""));
