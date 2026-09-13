import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ success: false, error: 'Link nahi hai' });

    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();

    // Simple parse - 【entity-Daraz¦canonical_name=Daraz】 se price/name nikalo
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const priceMatch = html.match(/"price":\s*"?(\d+)"?/) || html.match(/Rs\.\s*(\d+)/);

    const name = titleMatch? titleMatch[1].split('|')[0].trim() : '';
    const price = priceMatch? priceMatch[1] : '';

    // Image try
    const imgMatch = html.match(/"image":\s*"(https:\/\/[^"]+)"/);
    const image = imgMatch? imgMatch[1] : '';

    return NextResponse.json({
      success: true,
      name,
      price: price? parseInt(price) : null,
      image,
      affiliate_link: url //?cc wala safe return
    });
  } catch (e:any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
