import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const { productId, title } = await req.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Insert click for ORIGINAL account analytics
    await supabase.from("clicks").insert([
      {
        product_id: productId,
        product_title: title,
        country: "PK",
        created_at: new Date().toISOString()
      }
    ])

    return NextResponse.json({ success: true, owner: "Al Safa Traders.pk ORIGINAL" })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
