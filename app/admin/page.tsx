"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [darazLink, setDarazLink] = useState("");
  const [category, setCategory] = useState("kitchen-tools");
  const [catName, setCatName] = useState("");

  useEffect(function() {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const catRes = await supabase.from("categories").select("*").order("order", { ascending: true });
    const prodRes = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (catRes.data) { setCategories(catRes.data); }
    if (prodRes.data) { setProducts(prodRes.data); }
    setLoading(false);
  }

  async function addProduct() {
    if (!name ||!price) { alert("Name Price dalo Jani!"); return; }
    const payload = {
      id: Date.now().toString(),
      name: name,
      price: Number(price),
      image: image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      category: category,
      daraz_link: darazLink,
      clicks: 0
    };
    const result = await supabase.from("products").insert([payload]);
    if (result.error) { alert(result.error.message); return; }
    setName(""); setPrice(""); setImage(""); setDarazLink("");
    setShowAddProduct(false);
    fetchData();
  }

  async function addCategory() {
    if (!catName) { alert("Name dalo!"); return; }
    const slug = catName.toLowerCase().replace(/\s+/g, "-");
    const payload = { id: Date.now().toString(), name: catName, slug: slug, order: categories.length };
    const result = await supabase.from("categories").insert([payload]);
    if (result.error) { alert(result.error.message); return; }
    setCatName(""); setShowAddCategory(false); fetchData();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete Original?")) { return; }
    await supabase.from("products").delete().eq("id", id);
    fetchData();
  }

  if (loading) {
    return <div className="p-20 text-center">Loading ORIGINAL 514 - Supabase - Plan Same...</div>;
  }

  const totalClicks = products
