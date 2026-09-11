"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [showOwner, setShowOwner] = useState(false);
  const [pass, setPass] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [darazLink, setDarazLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (data) setProducts(data);
  }

  async function handleOrderClick(p: any) {
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: p.name, price: p.price, link: p.daraz_link }),
      });
    } catch (e) {}
    if (p.daraz_link) window.open(p.daraz_link, "_blank");
  }

  function handleLogoClick() {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) { setShowOwner(true); setClickCount(0); }
    setTimeout(() => setClickCount(0), 3000);
  }

  function unlockOwner() {
    if (pass === "alsafa123") setIsOwner(true);
    else alert("Galat password!");
  }

  async function addProduct() {
    if (!title || !price || !darazLink || !imageUrl) { alert("Sare boxes bharo!"); return; }
    const { error } = await supabase.from("products").insert([{ name: title, price: price, daraz_link: darazLink, image_url: imageUrl }]);
    if (error) alert("Error: " + error.message);
    else {
      alert("Product Add Ho Gaya! ✅");
      setTitle(""); setPrice(""); setDarazLink(""); setImageUrl("");
      fetchProducts();
    }
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      {/* HEADER */}
      <header style={{ background: "#183A2E", padding: "18px 20px", position: "sticky", top: 0, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 onClick={handleLogoClick} style={{ color: "#FFFFFF", margin: 0, fontWeight: 800, letterSpacing: "1px", cursor: "pointer" }}>AL SAFA TRADERS.pk</h1>
        <p style={{ color: "#FFFFFF", margin: "4px 0 0", opacity: 0.8, fontSize: 13 }}>alsafatraders.pk - Everyday</p>
      </header>

      {/* SEARCH BAR - Hamesha dikhega */}
      <div style={{ padding: "16px", background: "white" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chopper, storage, etc." style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd" }} />
      </div>

      {/* CATEGORIES - Hamesha dikhega */}
      <div style={{ display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto", background: "white" }}>
        {["Shop All", "Best Sellers", "Kitchen", "Storage & Organizers"].map(c=>(
          <span key={c} style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: 20, background: c==="Shop All" ? "#183A2E" : "#f1f1f1", color: c==="Shop All" ? "white" : "black", fontSize: 13, fontWeight: 600 }}>{c}</span>
        ))}
      </div>

      {/* HERO - Hamesha dikhega - Side pe picture wali */}
      <div style={{ margin: "16px", background: "#D6E8D0", borderRadius: 16, padding: 20, display: "flex", flexWrap: "wrap", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <p style={{ fontSize: 11, fontWeight: 700, background: "white", display: "inline-block", padding: "4px 8px", borderRadius: 12 }}>2.5M+ HOME COOKS | 155K+ 5-STAR REVIEWS</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#183A2E", marginTop: 10 }}>Everyday Kitchen Essentials for <span style={{ background: "#FFD700", padding: "0 6px" }}>Smart Homes</span></h2>
          <p style={{ fontSize: 13, marginTop: 6 }}>اسمارٹ ہومز کے لیے روزمرہ کے کچن کے ضروری سامان - معیاری، سستا، قابل اعتماد</p>
          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <button style={{ background: "#183A2E", color: "white", padding: "10px 16px", borderRadius: 8, border: "none", fontWeight: 700 }}>Shop New Arrivals</button>
            <button style={{ background: "white", color: "#183A2E", padding: "10px 16px", borderRadius: 8, border: "1px solid #183A2E", fontWeight: 700 }}>Shop Best Sellers</button>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 260, background: "white", borderRadius: 12, overflow: "hidden", position: "relative" }}>
          <img src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600" alt="kitchen" style={{ width: "100%", height: 220, objectFit: "cover" }} />
          <span style={{ position: "absolute", top: 8, right: 8, background: "#E8F5E9", padding: "4px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>FREE DELIVERY &gt; RS.2000</span>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <main style={{ padding: 16, maxWidth: 1280, margin: "0 auto" }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, color: "#183A2E" }}>Featured Products</h2>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 30, color: "#2E2E2E", background: "white", padding: 30, borderRadius: 12 }}>
            <h2>🙏 Abhi koi product nahi</h2>
            <p>admin se pehla product add karo - 10 sec me yahan dikhega!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginTop: 16 }}>
            {filtered.map((p: any) => (
              <div key={p.id} style={{ background: "#FFFFFF", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", position: "relative" }}>
                {p.is_sale && <span style={{ position: "absolute", top: 8, left: 8, background: "#FF6835", color: "#fff", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>SALE</span>}
                <img src={p.image_url} alt={p.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                <div style={{ padding: 12 }}>
                  <h3 style={{ color: "#2E2E2E", fontSize: 14, margin: "0 0 6px", height: 36, overflow: "hidden" }}>{p.name}</h3>
                  <p style={{ color: "#2E2E2E", fontWeight: 800, margin: "0 0 10px" }}>Rs. {p.price}</p>
                  <button onClick={() => handleOrderClick(p)} style={{ width: "100%", background: "#668F71", color: "#FFFFFF", border: "none", padding: "9px 0", borderRadius: 8, fontWeight: 700, cursor: "pointer" }} onMouseOver={(e) => (e.currentTarget.style.background = "#1B3A2E")} onMouseOut={(e) => (e.currentTarget.style.background = "#668F71")}>Order Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <style>{`@media(min-width: 768px){ main div{ grid-template-columns: repeat(4, 1fr) !important; } }`}</style>
      </main>

      {/* OWNER PANEL */}
      {showOwner && (
        <div style={{ padding: 16, background: "#fff", borderTop: "2px dashed #ccc", marginTop: 20 }}>
          {!isOwner ? (
            <div><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Owner password" style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} /><button onClick={unlockOwner} style={{ marginLeft: 8, padding: "8px 12px" }}>Unlock</button></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Product Title" style={{ padding: 8 }} />
              <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price e.g 899" style={{ padding: 8 }} />
              <input value={darazLink} onChange={e=>setDarazLink(e.target.value)} placeholder="Daraz Link https://s.daraz.pk/..." style={{ padding: 8 }} />
              <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="Image URL" style={{ padding: 8 }} />
              <button onClick={addProduct} style={{ background: "#183A2E", color: "white", padding: 10, borderRadius: 8 }}>Add Product</button>
            </div>
          )}
        </div>
      )}

      {/* FOOTER WITH ORIGINAL LOGOS */}
      <footer style={{ background: "#183A2E", color: "white", padding: "30px 16px", marginTop: 30, textAlign: "center" }}>
        <h3 style={{ marginBottom: 12 }}>Follow Us</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <a href="https://www.facebook.com/share/1Gk2xgPiMF/?mibextid=wwXIfr" target="_blank" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" width="24" /> Facebook</a>
          <a href="https://www.instagram.com/alsafatraders.pk?stkn=MXd0MGRlYzF4MXhvbg%3D%3D&utm_source=qr" target="_blank" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" width="24" /> Instagram</a>
          <a href="https://www.tiktok.com/@faizanjutt6686?_r=1&_t=ZS-99df7jRqXWX" target="_blank" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}><img src="https://cdn.simpleicons.org/tiktok/white" width="24" /> TikTok</a>
          <a href="mailto:alsafatraders7@gmail.com" style={{ color: "white", textDecoration: "none" }}>✉️ alsafatraders7@gmail.com</a>
        </div>
        <p style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>© 2024 Al Safa Traders.pk — All Rights Reserved</p>
      </footer>
    </div>
  );
}
