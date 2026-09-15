import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
export const dynamic = "force-dynamic"

export async function GET(){
  try{
    const { data, error } = await supabase.from("products").select("id,daraz_url,price").limit(5)
    if(error) throw error
    return NextResponse.json({ ok:true, message:"Daraz fetch ready", count: data?.length })
  }catch(e:any){
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
