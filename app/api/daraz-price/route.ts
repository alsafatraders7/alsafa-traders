import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    let { url } = await req.json();
    if (!url) return NextResponse.json({ success: false });

    // short link ko follow karo
    let finalUrl = url;
    if (url.includes('s.daraz.pk')) {
      const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
      finalUrl = r.url;
    }

    const res = await fetch(finalUrl, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120', 'Accept-Language': 'en-US,en' } });
    const html = await res.text();

    // price nikalne ki 3 koshish
    let price = 0;
    let name = '';

    // 1. og:title
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    if (titleMatch) name = titleMatch[1];

    // 2. price from JSON
    const priceMatch = html.match(/"currentPrice":\{"value":([\d\.]+)/) ||
                       html.match(/"price":\{"text":"Rs\. ([\d,]+)"/) ||
                       html.match(/"priceText":"Rs\. ([\d,]+)"/) ||
                       html.match(/og:price:amount" content="([\d\.]+)"/);

    if (priceMatch) {
      price = parseFloat(priceMatch[1].replace(/,/g,''));
    }

    // 3. fallback regex Rs.
    if (!price) {
      const fallback = html.match(/Rs\.\s*([\d,]+)/);
      if (fallback) price = parseFloat(fallback[1].replace(/,/g,''));
    }

    // image
    const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const image = imgMatch? imgMatch[1] : '';

    if (price) {
      return NextResponse.json({ success: true, price, name, image });
    } else {
      return NextResponse.json({ success: false, error: 'price not found', debugUrl: finalUrl });
    }
  } catch (e:any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
