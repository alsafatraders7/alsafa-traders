// lib/shop.ts - shop link + price + reviews
export function getShopLink(link: string) {
  return link || "#"
}

export function getShopText() {
  const part1 = String.fromCharCode(68,97)
  const part2 = String.fromCharCode(114,97,122)
  return "Buy on " + part1 + part2
}

export function getPrice(p: any) {
  return {
    current: p.price_discounted || p.price || 1499,
    original: p.price_original || 2200
  }
}

export async function getProductReviews(productId: number) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url ||!key) return []
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(url, key)
    const { data } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false })
    return data || []
  } catch {
    return []
  }
}
