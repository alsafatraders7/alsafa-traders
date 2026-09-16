import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: "Kitchen + Home Gadgets LOCKED!",
    categories: ["kitchen-dining","home-appliances","kitchen-appliances","home-decor","storage-organisation","cleaning-tools","bath","bedding"],
    count: 0
  });
}
