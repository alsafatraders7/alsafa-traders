import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(){
  return NextResponse.json({ success: true, message:"?cc Safe" });
}
export async function GET(){
  return NextResponse.json({ ok:true, msg:"API LIVE" });
}
