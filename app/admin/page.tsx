"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseClient = supabaseUrl && supabaseAnonKey? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function AdminPage() {
  const [active, setActive] = useState("Dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", category: "Kitchen", image: "", daraz_link: "" });

  useEffect(() => {
    async function getData() {
      if (!supabaseClient) return;
      const result = await supabaseClient.from("products").select("*").order("id", { ascending: false });
      if (result.data) {
        setProducts(result.data);
        setIsLive(true);
      }
    }
    getData();
  }, []);

  async function addProduct() {
    if (!form.name ||!form.price) {
      alert("Name and Price likho");
      return;
    }
    if (!supabaseClient) {
      alert("ENV keys add karo Vercel me");
      return;
    }
    const result = await supabaseClient.from("products").insert([form]);
    if (result.error) {
      alert(result.error.message);
    } else {
      alert("Product Added - Live ho gaya");
      setForm({ name: "", price: "", category: "Kitchen", image: "", daraz_link: "" });
      const refreshed = await supabaseClient.from("products").select("*").order("id", { ascending: false });
      if (refreshed.data) setProducts(refreshed.data);
    }
  }

  async function deleteProduct(id: number) {
    if (!supabaseClient) return;
    await supabaseClient.from("products").delete().eq("id", id);
    const refreshed = await supabaseClient.from("products").select("*").order("id", { ascending: false });
    if (refreshed.data) setProducts(refreshed.data);
  }

  const menuItems = ["Dashboard","Products","Categories","Orders","Sales","Analytics","Website Settings","Daraz Links","Images Details","Captions","Customers","Admin Account","Password","Help"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5f5", fontFamily: "sans-serif" }}>
      <div style={{ width: "240px", background: "#0A2218", color: "white", position: "fixed", height: "100vh", overflowY: "auto", padding: "12px" }}>
        <div style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "10px" }}>
          <p style={{ fontWeight: "bold" }}>Al Safa Traders</p>
          <p style={{ fontSize: "10px", opacity: 0.6 }}>Admin Panel</p>
        </div>
        {menuItems.map((item) => (
          <div key={item} onClick={() => setActive(item)} style={{ padding: "10px", marginBottom: "4px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", background: active === item? "#C8A95B" : "transparent", color: active === item? "black" : "white", fontWeight: active === item? "bold" : "normal" }}>
            {item}
          </div>
        ))}
        <div onClick={() => setActive("Logout")} style={{ padding: "10px", marginTop: "20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", opacity: 0.7 }}>Logout</div>
      </div>

      <div style={{ marginLeft: "240px", flex: 1 }}>
        <div style={{ background: "white", padding: "12px 20px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontWeight: "bold" }}>{active}</p>
          <p style={{ fontSize: "12px" }}>alsafatraders.pk - {isLive? "Live" : "Not available"}</p>
        </div>

        <div style={{ padding: "20px" }}>
          {active === "Dashboard" && (
            <div>
              <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #ddd", marginBottom: "16px" }}>
                <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Welcome Back, Admin!</h1>
                <p style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>View Public Website - Admin Dashboard - Website URL - {isLive? "Live" : "Not available"} - Admin Account</p>
                <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>https://www.alsafatraders.pk</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
                <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #ddd" }}><p style={{ fontSize: "11px" }}>Total Products</p><p style={{ fontSize: "20px", fontWeight: "bold" }}>{products.length}</p><p style={{ fontSize: "10px", color: "green" }}>Published</p></div>
                <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #ddd" }}><p style={{ fontSize: "11px" }}>Categories</p><p style={{ fontSize: "20px", fontWeight: "bold" }}>{new Set(products.map((p:any)=>p.category)).size}</p></div>
                <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #
