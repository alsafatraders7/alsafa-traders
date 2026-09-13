import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ success: false, error: 'Link nahi hai' });

    // s.daraz.pk short link ko follow karo - redirect
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      redirect: 'follow',
    });
    const html = await res.text();

    // Name - Title se
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    let name = '';
    if (titleMatch) {
      name = titleMatch[1].split('|')[0].trim();
    }

    // Price - Daraz ke 3 tarah ke price
    let price = '';
    const m1 = html.match(/"price"\s*:\s*"?(\d+)"?/i);
    const m2 = html.match(/Rs\.\s*(\d+)/i);
    const m3 = html.match(/salePrice.*?(\d+)/i);
    if (m1) price = m1[1];
    else if (m2) price = m2[1];
    else if (m3) price = m3[1];

    // Image
    let image = '';
    const imgM = html.match(/"image"\s*:\s*"(https:\/\/[^"]+)"/i);
    if (imgM) image = imgM[1];

    // Aapka?cc wala link waisa ka waisa safe - hum change nahi karenge
    return NextResponse.json({
      success: true,
      name,
      price: price? parseInt(price) : null,
      image,
      affiliate_link: url
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
