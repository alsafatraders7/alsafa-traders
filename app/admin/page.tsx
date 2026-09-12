"use client";
import { useState } from "react";

export default function Admin() {
  const [active, setActive] = useState("Dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Kitchen");
  const [image, setImage] = useState("");
  const [daraz, setDaraz] = useState("");

  function addProduct() {
    if (!name ||!price) {
      alert("Name aur Price likho");
      return;
    }
    const newP = { id: Date.now(), name: name, price: price, category: category, image: image, daraz_link: daraz };
    setProducts([newP, ...products]);
    setName("");
    setPrice("");
    setImage("");
    setDaraz("");
    alert("Product Added - Local Working - Ab Supabase connect karenge to Live hoga");
  }

  function deleteProduct(id: number) {
    setProducts(products.filter((p: any) => p.id !== id));
  }

  const menu = ["Dashboard","Products","Categories","Orders","Sales","Analytics","Website Settings"," Daraz Links","Images Details","Captions","Customers","Admin Account","Password","Help"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7", color: "black" }}>
      <div style={{ width: "240px", background: "#0A2218", color: "white", position: "fixed", height: "100vh", overflowY: "auto", padding: "10px" }}>
        <div style={{ padding: "12px", borderBottom: "1px solid #ffffff22" }}>
          <b>Al Safa Traders</b><br/><span style={{ fontSize: "10px", opacity: 0.6 }}>Admin Panel - Master</span>
        </div>
        {menu.map((m) => (
          <div key={m} onClick={() => setActive(m)} style={{ padding: "10px", margin: "4px 0", borderRadius: "8px", cursor: "pointer", fontSize: "13px", background: active===m?"#C8A95B":"transparent", color: active===m?"black":"white", fontWeight: active===m?"bold":"normal" }}>
            {m}
          </div>
        ))}
      </div>

      <div style={{ marginLeft: "240px", flex: 1 }}>
        <div style={{ background: "white", padding: "12px 20px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between" }}>
          <b>{active}</b><span style={{ fontSize: "11px" }}>alsafatraders.pk - Live - Green Working</span>
        </div>

        <div style={{ padding: "20px" }}>
          {active==="Dashboard" && (
            <div>
              <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #ddd" }}>
                <h2 style={{ margin: 0 }}>Welcome Back, Admin!</h2>
                <p style={{ fontSize: "12px", color: "#666" }}>View Public Website - Admin Dashboard - https://alsafatraders.pk - Live - Admin Account</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginTop: "14px" }}>
                <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #ddd" }}>Total Products<br/><b style={{ fontSize: "20px" }}>{products.length}</b><br/><span style={{ fontSize: "10px", color: "green" }}>Published - Genuine</span></div>
                <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #ddd" }}>Categories<br/><b style={{ fontSize: "20px" }}>{new Set(products.map((p:any)=>p.category)).size}</b><br/><span style={{ fontSize: "10px" }}>Active</span></div>
                <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #ddd" }}>Total Clicks<br/><b style={{ fontSize: "20px" }}>0</b><br/><span style={{ fontSize: "10px" }}>Real Daraz - No fake</span></div>
                <div style={{ background: "white", padding: "16px",
