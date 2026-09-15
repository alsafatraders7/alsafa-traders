import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
export const dynamic = "force-dynamic"

export async function GET(){
  try{
    const { data, error } = await supabase.from("products").select("id,daraz_url,price")
    if(error) throw error
    return NextResponse.json({ ok:true, message:"Daraz fetch ready", count: data?.length || 0, data })
  }catch(e:any){
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
