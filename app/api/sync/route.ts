import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function makeAffiliate(link: string) {
  if (!link) return "";
  // Pehle?cc hata ke clean karo
  let clean = link.split('?')[0].split('&')[0];
  // Ab naya?cc lagao
  return clean + '?cc';
}

export async function GET() {
  try {
    const { data: products } = await supabase.from("products").select("id,daraz_link,daraz_url");

    let fixed = 0;

    for (const p of products || []) {
      // @ts-ignore
      const oldLink = p.daraz_link || p.daraz_url;
      if (!oldLink) continue;

      const newLink = makeAffiliate(oldLink);

      // Agar pehle se?cc nahi hai to update karo
      if (oldLink!== newLink ||!oldLink.includes("?cc")) {
        await supabase.from("products").update({
          daraz_link: newLink,
          daraz_url: newLink
        }).eq("id", p.id);
        fixed++;
      }
    }

    return NextResponse.json({
      ok: true,
      total: products?.length || 0,
      fixed: fixed,
      message: `DONE! ${fixed} products ab aap ke affiliate?cc se connect ho gaye! Jo bhi Buy karega profit aap ko ayega!`
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
