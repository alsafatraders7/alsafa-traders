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

  const addProduct = async () => {
    if(!name||!price) return alert("Name Price likho")
    const supabase = await getSupabase()
    await supabase.from("products").insert([{ name, price:Number(price), category:"Kitchen" }])
    setName("");setPrice(""); load()
  }

  if(!isLogin){
    return
