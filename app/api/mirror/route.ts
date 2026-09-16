import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function toAffiliate(url: string) {
  if (!url) return "";
  const base = url.split("?")[0].split("&")[0];
  return base + "?cc";
}

export async function GET() {
  try {
    const CATEGORIES: any = {
      "Kitchen": ["kitchen gadgets", "kitchen tools", "kitchen accessories"],
      "Bartan": ["bartan set steel", "crockery set", "dinner set"],
      "Storage & Organizers": ["kitchen storage", "spice jar organizer", "storage box"],
      "Cleaning": ["kitchen cleaning", "dish rack", "cleaning brush"],
      "Home Essentials": ["home kitchen essentials", "household gadgets"]
    };

    let totalAdded = 0;
    for (const [category, queries] of Object.entries(CATEGORIES)) {
      for (const q of (queries as string[])) {
        for (let page = 1; page <= 10; page++) {
          try {
            const url = `https://www.daraz.pk/catalog/?q=${encodeURIComponent(q)}&page=${page}`;
            const res = await fetch(url, {
              headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
              cache: "no-store"
            });
            const html = await res.text();
            const regex = /"name":"([^"]+)".*?"price":\{"text":"Rs\.\s*([^"]+)".*?"image":"([^"]+)".*?"itemUrl":"([^"]+)"/g;
            let m;
            let pageCount = 0;
            while ((m = regex.exec(html))!== null) {
              const name = m[1].replace(/\\u002F/g, "/");
              const price = parseInt(m[2].replace(/,/g, ""));
              let image = m[3].replace(/\\u002F/g, "/").replace(/\\/g, "").replace(/^\/\//, "https://");
              let durl = m[4].replace(/\\u002F/g, "/").replace(/\\/g, "").replace(/^\/\//, "https://");
              if (!name ||!price || price < 150 || price > 15000) continue;
              const affLink = toAffiliate(durl);
              const { data: exists } = await supabase.from("products").select("id").eq("daraz_link", affLink).maybeSingle();
              if (exists) continue;
              await supabase.from("products").insert({
                name: name.substring(0, 180),
                price: Math.round(price * 1.05),
                original_price: Math.round(price * 1.30),
                image: image,
                image_url: image,
                daraz_link: affLink,
                daraz_url: affLink,
                category: category
              });
              totalAdded++; pageCount++;
            }
            if (pageCount === 0) break;
            await new Promise(r => setTimeout(r, 800));
          } catch (err) { continue; }
        }
      }
    }
    const { count } = await supabase.from("products").select("id", { count: "exact", head: true });
    return NextResponse.json({ ok: true, added_now: totalAdded, total_in_store: count, message: `MIRROR DONE! ${totalAdded} naye products! Total ${count} LIVE!` });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
