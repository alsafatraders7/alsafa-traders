import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const products = [
      {
        product_name: "Kitchen Storage Box 3 Pcs - Ghar ke liye",
        daraz_price: 1299,
        image_url: "https://images.unsplash.com/photo-1584305574586-0a957793566b?w=400",
        daraz_link: "https://www.daraz.pk/tag/kitchen-storage/",
        seller_name: "Kitchen World",
        category: "kitchen-dining",
        status: "pending"
      },
      {
        product_name: "Vegetable Chopper 12 in 1 - Home Gadget",
        daraz_price: 899,
        image_url: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400",
        daraz_link: "https://www.daraz.pk/tag/chopper/",
        seller_name: "Home Gadgets PK",
        category: "kitchen-appliances",
        status: "pending"
      },
      {
        product_name: "Bathroom Organizer Rack",
        daraz_price: 599,
        image_url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400",
        daraz_link: "https://www.daraz.pk/tag/bath/",
        seller_name: "Home Decor",
        category: "bath",
        status: "pending"
      },
      {
        product_name: "Cleaning Brush 2 in 1 Gadget",
        daraz_price: 450,
        image_url: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400",
        daraz_link: "https://www.daraz.pk/tag/cleaning-tools/",
        seller_name: "Cleaning Expert",
        category: "cleaning-tools",
        status: "pending"
      }
    ];

    const { error } = await supabase.from('pending_products').insert(products);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "4 Products Pending me add ho gaye! Kitchen + Home LOCKED!", count: 4 });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
