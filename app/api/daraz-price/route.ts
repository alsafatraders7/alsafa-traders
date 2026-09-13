import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, auto } = body;

    // Agar auto bulk sync hai to Supabase se sara kaam hoga
    if (auto === true) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data: products } = await supabaseAdmin
       .from('products')
       .select('id, affiliate_link')
       .eq('auto_update', true);

      if (!products) return NextResponse.json({ success: true, updated: 0 });

      let updatedCount = 0;
      for (const p of products) {
        try {
          if (!p.affiliate_link) continue;
          const res = await fetch(p.affiliate_link, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            redirect: 'follow' as any,
          });
          const html = await res.text();
          let price = '';
          const m1 = html.match(/"price"\s*:\s*"?(\d+)"?/i);
          const m2 = html.match(/Rs\.\s*(\d+)/i);
          const m3 = html.match(/salePrice.*?(\d+)/i);
          if (m1) price = m1[1];
          else if (m2) price = m2[1];
          else if (m3) price = m3[1];

          if (price) {
            await supabaseAdmin.from('products').update({
              price: parseInt(price),
              last_price_sync: new Date().toISOString()
            }).eq('id', p.id);
            updatedCount++;
          }
        } catch (e) {}
      }
      return NextResponse.json({ success: true, updated: updatedCount });
    }

    // ====== TUMHARA PURANA CODE - Waisa ka waisa - Kuch delete nahi kiya ======
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

    // Aapka cc wala link waisa ka waisa safe - hum change nahi karenge
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
