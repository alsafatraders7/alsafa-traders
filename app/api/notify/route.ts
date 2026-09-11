import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body.title || body.name || "Product";
    const price = body.price || "0";
    
    const number = process.env.WHATSAPP_NUMBER;
    const key = process.env.WHATSAPP_API_KEY;

    if (!number || !key) {
      return NextResponse.json({ ok: false, error: "Number or Key missing" });
    }

    const msg = `🔔 NEW CLICK!\nProduct: ${name}\nPrice: Rs.${price}\n\nCustomer Daraz pe gaya hai!`;

    const url = `https://api.callmebot.com/whatsapp.php?phone=${number}&text=${encodeURIComponent(msg)}&apikey=${key}`;

    // Wait for result
    const res = await fetch(url);
    const data = await res.text();
    console.log("CallMeBot:", data);

    return NextResponse.json({ ok: true, result: data });
  } catch (e: any) {
    console.log("Error:", e);
    return NextResponse.json({ ok: false, error: e.message });
  }
}
