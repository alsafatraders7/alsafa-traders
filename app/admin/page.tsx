"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function AdminMaster() {
  const [active, setActive] = useState("Dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", price: "", category: "Kitchen", image: "", daraz_link: "" });
  const [settings, setSettings] = useState({ heroTitle: "Welcome to Al Safa Traders", heroSub: "Quality Kitchen & Home Products", footerFb: "", footerInsta: "", footerTiktok: "", footerEmail: "" });
  const [pwd, setPwd] = useState({ old: "", new: "", confirm: "" });

  useEffect(() => {
    async function load() {
      if (!supabase) return;
      const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
      if (data) setProducts(data);
    }
    load();
  }, []);

  async function addProduct() {
    if (!form.name ||!form.price) return alert("Name & Price likho bhai!");
    if (!supabase) return alert("ENV keys add karo Vercel me");
    const { error } = await supabase.from("products").insert([form]);
    if (error) alert(error.message);
    else {
      alert("Product Added Live!");
      setForm({ name: "", price: "", category: "Kitchen", image: "", daraz_link: "" });
      const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
      if (data) setProducts(data);
    }
  }

  async function delProduct(id: number) {
    if (!supabase) return;
    await supabase.from("products").delete().eq("id", id);
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (data) setProducts(data);
  }

  const menu = ["Dashboard","Products","Categories","Orders","Sales","Analytics","Website Settings","Daraz Links","Images Details","Captions","Customers","Admin Account","Password","Help"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7" }}>
      <div style={{ width: "250px", background: "#0A2218", color: "white", position: "fixed", height: "100vh", overflowY: "auto", padding: "10px" }}>
        <p style={{ fontWeight: "bold", padding: "12px", borderBottom: "1px solid #ffffff22" }}>Al Safa Traders<br/><span style={{ fontSize: "10px", opacity: 0.6 }}>Admin Panel v1.0</span></p>
        {menu.map(m => (
          <div key={m} onClick={() => setActive(m)} style={{ padding: "11px", margin: "3px 0", borderRadius: "8px", cursor: "pointer", background: active===m?"#C8A95B":"transparent", color: active===m?"black":"#ccc", fontWeight: active===m?"bold":"normal", fontSize: "13px" }}>{m}</div>
        ))}
      </div>

      <div style={{ marginLeft: "250px", flex: 1 }}>
        <div style={{ background: "white", padding: "14px 20px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between" }}>
          <b>{active}</b><span style={{ fontSize: "11px" }}>alsafatraders.pk - {products.length>0?"Live":"Not available"}</span>
        </div>

        <div style={{ padding: "20px" }}>
          {active==="Dashboard" && (
            <div>
              <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #ddd" }}>
                <h2>Welcome Back, Admin!</h2>
                <p style={{ fontSize: "12px", color: "#666" }}>View Public Website | Admin Dashboard | https://alsafatraders.pk | Status: {products.length>0?"Live":"Not available"}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginTop: "14px" }}>
                <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #ddd" }}>Total Products<br/><b style={{ fontSize: "20px"
