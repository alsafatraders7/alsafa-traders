import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // LOCKED Categories - Kitchen + Home Gadgets
  const CATEGORIES = [
    "kitchen-dining",
    "kitchen-appliances",
    "home-appliances",
    "home-decor",
    "storage-organisation",
    "cleaning-tools",
    "bath",
    "bedding"
  ];

  // Kitchen + Home Gadgets ke 4 Products
  const products = [
    {
      product_name: "Kitchen Storage Box 3 Pcs Set - Ghar ke liye",
      daraz_price: 1299,
      image_url: "https://via.placeholder.com/400",
      daraz_link: "https://www.daraz.pk/products/kitchen-storage-i1.html",
      seller_name: "Kitchen World",
      category: "kitchen-dining",
      status: "pending"
    },
    {
      product_name: "Home Gadget - Vegetable Chopper 12 in 1",
      daraz_price: 899,
      image_url: "https://via.placeholder.com/400",
      daraz_link: "https://www.daraz.pk/products/chopper-i2.html",
      seller_name: "Home Gadgets PK",
      category: "kitchen-appliances",
      status: "pending"
    },
    {
      product_name: "Bathroom Organizer - Ghar ki cheez",
      daraz_price: 599,
      image_url: "https://via.placeholder.com/400",
      daraz_link: "https://www.daraz.pk/products/bath-i3.html",
      seller_name: "Home Decor",
      category: "bath",
      status: "pending"
    },
    {
      product_name: "Cleaning Brush - Home Cleaning Gadget",
      daraz_price: 450,
      image_url: "https://via.placeholder.com/400",
      daraz_link: "https://www.daraz.pk/products/clean-i4.html",
      seller_name: "Cleaning Expert",
      category: "cleaning-tools",
      status: "pending"
    }
  ];

  const { error } = await supabase.from('pending_products').insert(products);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    success: true,
    message: "LOCKED! Kitchen + Home Gadgets Pending me add!",
    count: products.length,
    categories: CATEGORIES
  });
}
