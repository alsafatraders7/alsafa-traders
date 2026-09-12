"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Category = { id: string; name: string; slug: string; order: number; product_count?: number; is_shop_all?: boolean; };
type Product = { id: string; name: string; price: number; original_price?: number; image: string; category: string; daraz_link: string; caption?: string; is_best_seller?: boolean; clicks?: number; created_at?: string; };
type Settings = { id?: number; top_banner: string; trust_badge: string; hero_urdu: string; hero_image: string; site_name: string; whatsapp?: string; };

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>({
    top_banner: "FREE DELIVERY ON ORDERS OVER RS. 2000",
    trust_badge: "100% ORIGINAL PRODUCTS - AL SAFA TRADERS",
    hero_urdu: "خواتین کے لیے بہترین کچن اور بیوٹی پراڈکٹس",
    hero_image: "https://images.unsplash.com/photo-1585237672814-8f85a8118bf6?w=800",
    site_name: "Al Safa Traders",
    whatsapp: "923001234567"
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [darazUrl, setDarazUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", original_price: "", category: "kitchen-tools", image: "", daraz_link: "", caption: "", is_best_seller: false });
  const [newCategory, setNewCategory] = useState({ name: "", order: "" });

  useEffect(() => { fetchAllData(); }, []);
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const catRes = await supabase.from("categories").select("*").order("order", { ascending: true });
      const prodRes = await supabase.from("products").select("*").order("created_at", { ascending: false });
      const setRes = await supabase.from("settings").select("*").eq("id", 1).single();
      if (catRes.data) setCategories(catRes.data);
      if (prodRes.data) setProducts(prodRes.data);
      if (setRes.data) setSettings(setRes.data);
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const totalClicks = products.reduce((s, p) => s + (p.clicks || 0), 0);
  const commission = totalClicks * 20;
  const bestSellers = products.filter(p => p.is_best_seller).length;

  const handleFetchFromDaraz = () => {
