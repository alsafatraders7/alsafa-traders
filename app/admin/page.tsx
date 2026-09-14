"use client"
import { useState, useEffect } from "react"

export default function Admin(){
  const [products,setProducts]=useState<any[]>([])
  const [search,setSearch]=useState("")
  const [active,setActive]=useState("Dashboard")
  const [showAdd,setShowAdd]=useState(false)
  // ORIGINAL ME YE 5 THE - AB SIRF 3 ADD KIYE - ORIGINAL_PRICE, SALE_PRICE, IMAGE_URLS
  const [form,setForm]=useState({name:"",price:"",original_price:"",sale_price:"",category:"Kitchen",image_url:"",image_urls:[] as string[],affiliate_link:"",is_best_seller:false,is_active:true})
  const [imgLoading,setImgLoading]=useState(false)

  useEffect(()=>{
    const load=async()=>{
      try{
        const {createClient}=await import("@supabase/supabase-js")
        const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
        const {data}=await supabase.from("products").select("*").order("created_at",{ascending:false})
        if(data) setProducts(data)
      }catch{}
    }
    load()
  },[])

  const uploadImages=async(e:any)=>{
    const files=e.target.files; if(!files) return;
    setImgLoading(true);
    try{
      const {createClient}=await import("@supabase/supabase-js")
      const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      let urls=[...form.image_urls];
      for(let i=0;i<files.length && urls.length<4;i++){
        const fn=Date.now()+"-"+files[i].name.replace(/[^a-z0-9.]/gi,"-")
        const {error}=await supabase.storage.from("product-images").upload(fn,files[i])
        if(!error){
          const {data}=supabase.storage.from("product-images").getPublicUrl(fn)
          urls.push(data.publicUrl)
        }
      }
      setForm({...form,image_url:urls[0]||form.image_url,image_urls:urls.slice(0,4)})
    }catch{}
    setImgLoading(false)
  }

  const save=async()=>{
    if(!form.name||!form.price) return alert("Name & Price required")
    const {createClient}=await import("@supabase/supabase-js")
    const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const slug=form.name.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+Date.now()
    const fp=form.sale_price?parseFloat(form.sale_price):parseFloat(form.price)
    const op=form.original_price?parseFloat(form.original_price):fp+500
    const payload={name:form.name,price:fp,original_price:op,sale_price:fp,category:form.category,image_url:form.image_url,image_urls:form.image_urls.length?form.image_urls:[form.image_url],affiliate_link:form.affiliate_link,is_best_seller:form.is_best_seller,is_active:true,slug}
    const {data,error}=await supabase.from("products").insert([payload]).select()
    if(error) return alert(error.message);
    setProducts([data[0],...products])
    setShowAdd(false)
    setForm({name:"",price:"",original_price:"",sale_price:"",category:"Kitchen",image_url:"",image_urls:[],affiliate_link:"",is_best_seller:false,is_active:true})
  }

  const filtered=products.filter((p:any)=>p.name.toLowerCase().includes(search.toLowerCase()))

  return(
  <div className="flex min-h-screen bg-[#F7F8F9]">
    <aside className="w-[260px] bg-[#0F2622] text-white fixed h-screen p-4 overflow-y-auto">
      <div className="font-bold text-[16px] mb-6">Al Safa Traders<br/><span className="text-[11px] font-normal opacity-70">Admin Panel</span></div>
      <nav className="space-y-1 text-[13px]">
        {["Dashboard","Orders","Sales","Analytics","Website Settings"].map((n)=>(
          <button key={n} onClick={()=>setActive(n)} className={`w-full text-left px-3 py-2.5 rounded-lg ${active===n?"bg-white text-black":"hover:bg-white/10"}`}>{n}</button>
        ))}
      </nav>
      <div className="border-t border-white/10 my-3"></div>
      <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/10">Logout</button>
    </aside>

    <main className="ml-[260px] flex-1">
      <div className="h-[60px] bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." className="h-8 w-60 rounded-full bg-[#F1F3F5] px-3 text-sm outline-none"/>
        <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#143A34]"></div></div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-8 bg-white rounded-xl p-6 font-bold text-[#1A3C34] text-2xl">Welcome Back, Admin!<p className="text-sm font-normal mt-1">Here is today&apos;s report.</p></div>
          <div className="col-span-4 space-y-4">
            <div className="bg-white rounded-xl p-4 border"><b className="text-sm">Website Status</b><br/>Live</div>
            <div className="bg-white rounded-xl p-4 border"><b className="text-sm">Admin Account</b><br/>Al Safa</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border"><b className="text-sm">Total Products</b><br/><b className="text-xl">{products.length}</b></div>
          <div className="bg-white p-4 rounded-xl border"><b className="text-sm">Categories</b><br/><b className="text-xl">4</b></div>
          <div className="bg-white p-4 rounded-xl border"><b className="text-sm">Total Clicks</b><br/><b className="text-xl">0</b></div>
          <div className="bg-white p-4 rounded-xl border"><b className="text-sm">Estimated Commission</b><br/><b className="text-xl">0</b></div>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <div className="flex justify-between mb-4"><b>Recent Products ({filtered.length})</b><button onClick={()=>setShowAdd(true)} className="bg-[#FFC107] px-4 py-1.5 rounded-lg text-sm font-bold">+ Add Product</button></div>
          <div className="grid grid-cols-5 gap-3">
            {filtered.slice(0,10).map((p:any)=>(
              <div key={p.id} className="border rounded-xl p-2"><img src={p.image_url||"https://via.placeholder.com/150"} className="h-24 w-full object-cover rounded"/><div className="text-xs mt-1 font-bold truncate">{p.name}</div><div className="text-xs"><span className="line-through text-gray-400 text-[10px] mr-1">Rs {p.original_price||Number(p.price)+500}</span><span className="font-bold">Rs {p.sale_price||p.price}</span></div></div>
            ))}
          </div>
        </div>
      </div>
    </main>

    {showAdd && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-[500px] p-6 space-y-3 max-h-[90vh] overflow-y-auto">
        <h2 className="font-bold">Add New Product - Name, Price, Images, Category, Affiliate</h2>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Product Name" className="w-full border p-2 rounded"/>
        <div className="grid grid-cols-2 gap-3">
          <input value={form.original_price} onChange={e=>setForm({...form,original_price:e.target.value})} placeholder="Original Price e.g. 2200" className="w-full border p-2 rounded"/>
          <input value={form.sale_price} onChange={e=>setForm({...form,sale_price:e.target.value,price:e.target.value})} placeholder="Sale Price e.g. 1499" className="w-full border p-2 rounded bg-green-50 font-bold"/>
        </div>
        <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category Kitchen" className="w-full border p-2 rounded"/>
        <div className="border p-3 rounded bg-gray-50">
          <div className="text-[11px] font-bold">Gallery - 4 Images</div>
          <input type="file" multiple accept="image/*" onChange={uploadImages} className="w-full mt-2 text-xs"/>
          {imgLoading&&<div className="text-[10px] text-blue-600">Uploading...</div>}
          <div className="grid grid-cols-4 gap-2 mt-2">{form.image_urls.map((u:string,i:number)=><img key={i} src={u} className="w-full h-12 rounded border object-cover"/>)}</div>
        </div>
        <input value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} placeholder="Image URL https://..." className="w-full border p-2 rounded"/>
        <input value={form.affiliate_link} onChange={e=>setForm({...form,affiliate_link:e.target.value})} placeholder="Affiliate Link (Daraz/Amazon)" className="w-full border p-2 rounded"/>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={form.is_best_seller} onChange={e=>setForm({...form,is_best_seller:e.target.checked})}/> Best Seller</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})}/> Active</label>
        <button onClick={save} className="w-full bg-[#FFC107] py-3 rounded-lg font-bold">Save Product</button>
        <button onClick={()=>setShowAdd(false)} className="w-full border py-2 rounded-lg text-sm">Cancel</button>
      </div>
    </div>
    )}
  </div>
  )
}
