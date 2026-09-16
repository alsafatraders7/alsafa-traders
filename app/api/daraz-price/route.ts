import { NextResponse } from 'next/server';
export async function POST(req:Request){
 try{
  const {url} = await req.json();
  if(!url) return NextResponse.json({success:false});
  let finalUrl=url;
  if(url.includes('s.daraz.pk')){
    const r=await fetch(url,{redirect:'follow',headers:{'User-Agent':'Mozilla/5.0'}});
    finalUrl=r.url;
  }
  const res=await fetch(finalUrl,{headers:{'User-Agent':'Mozilla/5.0 Chrome/120'}});
  const html=await res.text();
  let price=0; let name='';
  const t=html.match(/<meta property="og:title" content="([^"]+)"/);
  if(t) name=t[1];
  const p=html.match(/"currentPrice":\{"value":([\d\.]+)/) || html.match(/og:price:amount" content="([\d\.]+)"/) || html.match(/Rs\.\s*([\d,]+)/);
  if(p) price=parseFloat(p[1].replace(/,/g,''));
  const img=html.match(/<meta property="og:image" content="([^"]+)"/);
  if(price) return NextResponse.json({success:true,price,name,image:img?img[1]:''});
  return NextResponse.json({success:false});
 }catch(e:any){ return NextResponse.json({success:false,error:e.message}); }
}
