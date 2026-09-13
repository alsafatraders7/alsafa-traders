import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body.url;

    if (!url) {
      return NextResponse.json({ success: false, error: 'Link nahi hai' });
    }

    // s.【entity-daraz¦canonical_name=Daraz】.pk ko follow karo
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      },
      redirect: 'follow',
    });

    const html = await res.text();

    // Title se name
    let name = '';
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      name = titleMatch[1].split('|')[0].trim().replace(/Daraz.*$/i, '').trim();
    }

    // Price ke 5 tareeqe try karo - Rs. 1,439 wala bhi pakdega
    let price = '';
    const patterns = [
      /"price"\s*:\s*"?(\d+)"?/i,
      /"salePrice".*?(\d{3,6})/i,
      /Rs\.\s*([\d,]+)/i,
      /price.*Rs\.\s*([\d,]+)/i,
      /"amount"\s*:\s*"?(\d+)"?/i
    ];

    for (let pat of patterns) {
      const m = html.match(pat);
      if (m) {
        price = m[1].replace(/,/g, '');
        if (parseInt(price) > 50) break; // 50 se kam price nahi hoga
      }
    }

    // Image
    let image = '';
    const imgMatch = html.match(/"image"\s*:\s*"(https:\/\/[^"]+)"/i) ||
                     html.match(/<meta property="og:image" content="([^"]+)"/i);
    if (imgMatch) image = imgMatch[1];

    if (!price) {
      return NextResponse.json({ success: false, error: 'Price nahi mila, manual Rs. likh do' });
    }

    return NextResponse.json({
      success: true,
      name: name || 'Daraz Product',
      price: parseInt(price),
      image: image,
      affiliate_link: url
    });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Error' });
  }
}
