import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
      next: { revalidate: 0 }
    });

    const html = await res.text();
    let price = null;

    const patterns = [
      /"price"\s*:\s*"Rs\.\s*([\d,]+)"/i,
      /"currentPrice"\s*:\s*"?([\d,]+)"?/i,
      /"salePrice"\s*:\s*"?([\d,]+)"?/i,
      /pdp-price[^>]*>\s*Rs\.\s*([\d,]+)/i,
      /Rs\.\s*([\d,]{2,})/i
    ];

    for (const p of patterns) {
      const m = html.match(p);
      if (m && m[1]) {
        price = m[1].replace(/,/g, '');
        if (parseInt(price) > 50) break;
      }
    }

    if (!price) {
      return NextResponse.json({ success: false, error: 'Price not found - Manual karo' });
    }

    return NextResponse.json({ success: true, price: parseInt(price) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
