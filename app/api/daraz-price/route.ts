import { NextResponse } from "next/server";

const CC_CODE = process.env.DARAZ_CC_CODE || "";

function getSafeUrl(url: string) {
  if (!url) return url;
  if (url.includes("?cc") || url.includes("&cc")) return url;
  if (CC_CODE) {
    return url.includes("?")? url + "&cc=" + CC_CODE : url + "?cc=" + CC_CODE;
  }
  return url;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body.url;
    if (!url) {
      return NextResponse.json({ success: false, error: 'Link nahi hai' });
    }

    const finalUrl = getSafeUrl(url);

    const headers: any = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "text/html,application/xhtml+xml",
    };
    if (process.env.DARAZ_API_KEY) {
      headers["x-api-key"] = process.env.DARAZ_API_KEY;
    }

    const res = await fetch(finalUrl, { headers, redirect: "follow" });
    const html = await res.text();

    let name = "";
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      name = titleMatch[1].split("|")[0].trim().replace(/Daraz.*$/i, "").trim();
    }

    let price = "";
    const patterns = [
      /"price"\s*:\s*"?(\d+)"?/i,
      /"salePrice"[^0-9]*(\d{3,6})/i,
      /Rs\.\s*([\d,]+)/i,
      /"amount"\s*:\s*"?(\d+)"?/i,
      /currentPrice"\s*:\s*(\d+)/i
    ];

    for (let pat of patterns) {
      const m = html.match(pat);
      if (m) {
        price = m[1].replace(/,/g, "");
        if (parseInt(price) > 50) break;
      }
    }

    // LIVE Original + Sale
    let original_price = price;
    let sale_price = price;
    const origMatch = html.match(/"originalPrice"[^0-9]*(\d{3,6})/i);
    if (origMatch) {
      original_price = origMatch[1];
      sale_price = price;
    }

    let image = "";
    const imgMatch = html.match(/"image"\s*:\s*"(https:\/\/[^"]+)"/i) || html.match(/<meta property="og:image" content="([^"]+)"/i);
    if (imgMatch) image = imgMatch[1];

    let image_urls: string[] = [];
    const gal = html.match(/https:\/\/[^"]*alicdn\.com[^"]*\.jpg/gi);
    if (gal) image_urls = [...new Set(gal)].slice(0, 4);
    if (image && image_urls.indexOf(image) === -1) image_urls.unshift(image);
    image_urls = image_urls.slice(0, 4);

    if (!price) {
      return NextResponse.json({ success: false, error: 'Price nahi mila, manual Rs. likh do' });
    }

    return NextResponse.json({
      success: true,
      name: name || 'Daraz Product',
      price: parseInt(sale_price),
      original_price: parseInt(original_price),
      sale_price: parseInt(sale_price),
      image: image,
      image_urls: image_urls.length? image_urls : [image],
      affiliate_link: finalUrl,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Error' });
  }
}
