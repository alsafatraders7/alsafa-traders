import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, price } = await req.json();
    
    const number = process.env.WHATSAPP_NUMBER;
    const key = process.env.WHATSAPP_API_KEY;

    if (!number || !key) {
      return NextResponse.json({ ok: false });
    }

    const msg = `🔔 NEW CLICK!\n\nProduct: ${name}\nPrice: Rs.${price}\n\nCustomer Daraz pe gaya hai!`;
    
    const url = `https://api.callmebot.com/whatsapp.php?phone=${number}&text=${encodeURIComponent(msg)}&apikey=${key}`;
    
    // Fire and forget
    fetch(url).catch(()=>{});

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false });
  }
}
