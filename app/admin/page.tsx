"use client"
import { useState, useEffect } from "react"

export default function Admin() {
  const [isLogin, setIsLogin] = useState(false)
  const [pass, setPass] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [tab, setTab] = useState("products")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")

  // 👇 YAHAN APNA PASSWORD CHANGE KAR SAKTE HO
  const ADMIN_PASSWORD = "alsafa123"

  useEffect(()=>{
    if(localStorage.getItem("admin")=="true") setIsLogin(true)
    load()
  },[])

  const getSupabase = async () => {
    const { createClient } = await import("@supabase/supabase-js")
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }

  const load = async () => {
    try{
      const supabase = await getSupabase()
      const { data: p } = await supabase.from("products").select("*").order("id",{ascending:false})
      if(p) setProducts(p)
      const { data: o } = await supabase.from("orders").select("*").order("id",{ascending:false})
      if(o) setOrders(o)
    }catch(e){}
  }

  const login = () => {
    if(pass === ADMIN_PASSWORD){ localStorage.setItem("admin","true"); setIsLogin(true) }
    else alert("Wrong Password!")
  }
  const logout = () => { localStorage.removeItem("admin"); setIsLogin(false) }

  const addProduct = async () => {
    if(!name||!price) return alert("Name Price likho")
    const supabase = await getSupabase()
    await supabase.from("products").insert([{ name, price:Number(price), image_url:image, category:"Kitchen" }])
    setName("");setPrice("");setImage(""); load()
  }
  const deleteProduct = async (id:number) => {
    if(!confirm("Delete?")) return
    const supabase = await getSupabase()
    await supabase.from("products").delete().eq("id",id); load()
  }
  const deleteOrder = async (id:number) => {
    if(!confirm("Order delete?")) return
    const supabase = await getSupabase()
    await supabase.from("orders").delete().eq("id",id); load()
  }

  if(!isLogin){
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8F5E9] p-4">
        <div className="bg-white p-8 rounded-[24px] w-96 shadow">
          <h1 className="text-2xl font-black">Al Safa Admin</h1>
          <p className="text-xs mb-4 text-gray-500">alsafatraders7@gmail.com</p>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password: @SARIAfaizan123" className="border p-3 rounded-xl w-full" />
          <button onClick={login} className="mt-4 bg-black text-white w-full py-3 rounded-full font-bold">Login</button>
          <a href="/" className="text-xs underline mt-4 inline-block">Back to Home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8F5E9] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black">Al Safa - Full Admin</h1>
          <div className="flex gap-2">
            <a href="/" className="bg-white px-4 py-2 rounded-full text-xs font-bold">Website</a>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold">Logout</button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={()=>setTab("products")} className={`px-5 py-2 rounded-full font-bold text-sm ${tab=="products"?"bg-black text-white":"bg-white"}`}>Products Add / Delete</button>
          <button onClick={()=>setTab("orders")} className={`px-5 py-2 rounded-full font-bold text-sm ${tab=="orders"?"bg-black text-white":"bg-white"}`}>Orders ({orders.length})</button>
        </div>

        {tab=="products" && (
          <>
            <div className="bg-white p-5 rounded-[20px] mb-6">
              <div className="flex gap-2 flex-wrap">
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Product Name" className="border p-2 rounded" />
                <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" type="number" className="border p-2 rounded" />
                <input value={image} onChange={e=>setImage(e.target.value)} placeholder="Image URL" className="border p-2 rounded w-64" />
                <button onClick={addProduct} className="bg-black text-white px-6 py-2 rounded-full font-bold">Add</button>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[20px]">
              {products.map((p:any)=>(
                <div key={p.id} className="flex justify-between border-b py-3">
                  <span className="font-bold">{p.name} - Rs.{p.price}</span>
                  <button onClick={()=>deleteProduct(p.id)} className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">Delete</button>
                </div>
              ))}
              {products.length==0 && <p className="text-sm text-gray-400">Koi product nahi</p>}
            </div>
          </>
        )}

        {tab=="orders" && (
          <div className="bg-white p-5 rounded-[20px]">
            {orders.length==0 && <p className="text-sm text-gray-400">Abhi koi order nahi hai - Customer order karega to yahan ayega</p>}
            {orders.map((o:any)=>(
              <div key={o.id} className="flex justify-between border-b py-3">
                <div>
                  <p className="font-bold text-sm">{o.customer_name} - {o.phone}</p>
                  <p className="text-xs text-gray-600">{o.product_name} - Rs.{o.total} - {o.address}</p>
                </div>
                <button onClick={()=>deleteOrder(o.id)} className="bg-red-500 text-white px-3 py-1 rounded-full text-xs h-fit">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
