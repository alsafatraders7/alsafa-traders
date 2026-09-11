"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    supabase.from("products").select("*").order("id", {ascending: false}).then(({ data }) => {
      if (data) setProducts(data)
    })
  }, [])

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      {/* HEADER - Dark Green #1B3A2E */}
      <header style={{ background: "#1B3A2E", padding: "18px 20px", position: "sticky", top: 0, zIndex: 10 }}>
        <h1 style={{ color: "#FFFFFF", margin: 0, fontWeight: 800, letterSpacing: "1px" }}>AL SAFA TRADERS</h1>
        <p style={{ color: "#FFFFFF", margin: "4px 0 0", opacity: 0.8, fontSize: 13 }}>alsafatraders.pk - Everyday Kitchen Essentials</p>
      </header>

      {/* PRODUCTS GRID - 2 col mobile, 4 col desktop */}
      <main style={{ padding: 16, maxWidth: 1280, margin: "0 auto" }}>
        {products.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 80, color: "#2E2E2E" }}>
            <h2>🔒 Abhi koi product nahi</h2>
            <p>/admin se pehla product add karo - 10 sec me yahan dikhega!</p>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 16
          }}>
            {products.map((p: any) => (
              <div key={p.id} style={{ 
                background: "#FFFFFF", 
                borderRadius: 12, 
                overflow: "hidden", 
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                position: "relative"
              }}>
                {/* SALE BADGE - Orange #FF6B35 top-left */}
                {p.is_sale && (
                  <span style={{ 
                    position: "absolute", top: 8, left: 8, 
                    background: "#FF6B35", color: "#FFF", 
                    padding: "3px 8px", borderRadius: 6, 
                    fontSize: 11, fontWeight: 700 
                  }}>SALE</span>
                )}
                <img src={p.image_url} alt={p.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                <div style={{ padding: 12 }}>
                  <h3 style={{ color: "#2E2E2E", fontSize: 14, margin: "0 0 6px", height: 36, overflow: "hidden" }}>{p.name}</h3>
                  <p style={{ color: "#2E2E2E", fontWeight: 800, margin: "0 0 10px" }}>Rs. {p.price}</p>
                  <a href={p.daraz_link} target="_blank" style={{ textDecoration: "none" }}>
                    <button style={{ 
                      width: "100%", background: "#688F71", color: "#FFFFFF", 
                      border: "none", padding: "9px 0", borderRadius: 8, 
                      fontWeight: 700, cursor: "pointer"
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = "#1B3A2E")}
                    onMouseOut={e => (e.currentTarget.style.background = "#688F71")}
                    >Order Now</button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <style>{`@media(min-width: 768px){ main div{ grid-template-columns: repeat(4, 1fr) !important; } }`}</style>
    </div>
  )
}
