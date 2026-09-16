import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function toAffiliate(url: string) {
  if (!url) return url;
  const base = url.split("?")[0].split("&")[0];
  return base + "?cc";
}

export async function GET() {
  try {
    const { data: old } = await supabase.from("products").select("id,daraz_link");

    let fixed = 0;
    for (const p of old || []) {
      if (p.daraz_link &&!p.daraz_link.includes("?cc")) {
        await supabase.from("products").update({
          daraz_link: toAffiliate(p.daraz_link),
          daraz_url: toAffiliate(p.daraz_link)
        }).eq("id", p.id);
        fixed++;
      }
    }

    const { count } = await supabase.from("products").select("id", { count: "exact", head: true });

    return NextResponse.json({
      ok: true,
      fixed: fixed,
      total: count || 0,
      message: `DONE! ${fixed} products affiliate?cc se connect! Total ${count} LIVE!`
    });

  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
