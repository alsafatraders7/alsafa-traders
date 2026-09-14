import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body.url;
    if (!url) {
      return NextResponse.json({ success: false, error: "Link nahi hai" });
    }

    let finalUrl = url;
    const cc = process.env.DARAZ_CC_CODE;
    if (cc &&!url.includes("cc=")) {
      finalUrl = url.includes("?")? url + "&cc=" + cc : url + "?cc=" + cc;
    }

    const res = await fetch(finalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html",
      },
    });

    const html = await res.text();

    let name = "";
    const t = html.match(/<title>(.*?)<\/title>/i);
    if (t) name = t[1].split("|")[0].trim();

    let price = "";
    const m1 = html.match(/"salePrice"[^0-9]*(\d{3,6})/i) || html.match(/"price"\s*:\s*"?(\d+)"?/i) || html.match(/Rs\.\s*([\d,]+)/i);
    if (m1) price = m1[1].replace(/,/g, "");

    let original_price = price;
    let sale_price = price;
    const m2 = html.match(/"originalPrice"[^0-9]*(\d{3,6})/i);
    if (m2) {
      original_price = m2[1];
      sale_price = price;
    }

    let image = "";
    const im = html.match(/"image"\s*:\s*"(https:\/\/[^"]+)"/i) || html.match(/<meta property="og:image" content="([^"]+)"/i);
    if (im) image = im[1];

    let image_urls: string[] = [];
    const gal = html.match(/https:\/\/[^"]*alicdn\.com[^"]*\.jpg/gi);
    if (gal) {
      image_urls = Array.from(new Set(gal)).slice(0, 4);
    }
    if (image &&!image_urls.includes(image)) {
      image_urls.unshift(image);
    }

    if (!price) {
      return NextResponse.json({ success: false, error: "Price nahi mila" });
    }

    return NextResponse.json({
      success: true,
      name: name || "Daraz Product",
      price: parseInt(sale_price),
      original_price: parseInt(original_price),
      sale_price: parseInt(sale_price),
      image: image,
      image_urls: image_urls.length? image_urls : [image],
      affiliate_link: finalUrl,
    });
  } catch (err) {
    const message = err instanceof Error? err.message : "Error";
    return NextResponse.json({ success: false, error: message });
  }
}
