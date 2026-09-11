"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (data) setProducts(data);
  }

  async function handleOrderClick(p: any) {
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: p.name, price: p.price }),
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
      fetch
