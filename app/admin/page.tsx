"use client";
import React, { useState, useEffect } from 'react';

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
  productCount: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  darazPrice: number;
  category: string;
  brand: string;
  image: string;
  images: string[];
  darazLink: string;
  caption: string;
  description: string;
  bestSeller: boolean;
  active: boolean;
  priceSync: boolean;
  clicks: number;
  date: string;
}

interface WebsiteSettings {
  topBanner: string;
  trustBadge: string;
  heroWelcome: string;
  heroHeading: string;
  heroHighlight1: string;
  heroHighlight2: string;
  heroUrdu: string;
  heroImage: string;
  siteName: string;
  siteUrl: string;
  shopAllText: string;
}

export default function AlSafaAdminFinal() {
  // Website Settings - Admin controls Home Page
  const [settings, setSettings] = useState<WebsiteSettings>({
    topBanner: "LAUNCH - NEW ARRIVALS - FREE DELIVERY OVER RS.2000 - 16K+ HAPPY CUSTOMERS",
    trustBadge: "2.5M+ HOME COOKS | 155K+ 5 STAR REVIEWS",
    heroWelcome: "Welcome to Safa traders",
    heroHeading: "Everyday Kitchen Essentials for Smart Homes",
    heroHighlight1: "Essentials for",
    heroHighlight2: "Smart Homes",
    heroUrdu: "Ghar ke kaam asan banayen! Premium quality choppers, strainers, storage & organizers - jo har kitchen me chahiye.",
    heroImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800",
    siteName: "Al Safa Traders.pk",
    siteUrl: "https://alsafatraders.pk",
    shopAllText: "Shop All"
  });

  // Categories - ADMIN CONTROLS HOME PAGE CATEGORIES
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Shop All", slug: "shop-all", order: 1, active: true, productCount: 0 },
    { id: "2", name: "Best Sellers", slug: "best-sellers", order: 2, active: true, productCount: 0 },
    { id: "3", name: "Kitchen", slug: "kitchen", order: 3, active: true, productCount: 0 },
    { id: "4", name: "Bartan", slug: "bartan", order: 4, active: true, productCount: 0 },
    { id: "5", name: "Storage & Organizers", slug: "storage", order: 5, active: true, productCount: 0 },
  ]);

  // Products - Shop All shows ALL, Category shows filtered
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Air Fryer 8L Digital",
      price: 12999,
      darazPrice: 12999,
      category: "Kitchen",
      brand: "Safa Premium",
      image: "https://images.unsplash.com/photo-1585515656627-783d6cbd1d2d?q=80&w=400",
      images: [],
      darazLink: "https://www.daraz.pk/products/air-fryer-i123.html?tag=alsafa",
      caption: "Healthy cooking with 85% less oil! Perfect for every home",
      description: "Premium quality air fryer for smart homes",
      bestSeller: true,
      active: true,
      priceSync: true,
      clicks: 45,
      date: "2026-09-10"
    },
  ]);

  const [activeView, setActiveView] = useState("Dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [captionMode, setCaptionMode] = useState<"manual" | "auto">("manual");
  const [isFetchingDaraz, setIsFetchingDaraz] = useState(false);

  // New Product Form
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    category: "Kitchen",
    brand: "",
    image: "",
    darazLink: "",
    caption: "",
    description: "",
    bestSeller: false,
    active: true,
    priceSync: true,
  });
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    order: categories.length + 1,
    active: true
  });

  // Update product counts
  useEffect(() => {
    const updated = categories.map(cat => {
      if (cat.slug === "shop-all") {
        return {...cat, productCount: products.filter(p => p.active).length };
      }
      return {...cat, productCount: products.filter(p => p.category === cat.name && p.active).length };
    });
    setCategories(updated);
  }, [products]);

  // Auto fetch from Daraz (simulated)
  const handleFetchFromDaraz = () => {
    if (!newProduct.darazLink) {
      alert("Pehle Daraz Link dalo Jani!");
      return;
    }
    setIsFetchingDaraz(true);
    setTimeout(() => {
      const mockCaption = `Premium quality ${newProduct.name || 'product'} - Original 【entity-Daraz¦canonical_name=Daraz】 product! High quality, durable, perfect for smart homes. ${newProduct.brand || 'Top brand'} - Best seller on 【entity-Daraz¦canonical_name=Daraz】!`;
      setNewProduct({...newProduct, caption: mockCaption, description: mockCaption });
      setIsFetchingDaraz(false);
      alert("【entity-Daraz¦canonical_name=Daraz】 se caption auto fetch ho gaya! Aap edit kar sakte ho.");
    }, 1500);
  };

  const handleAddProduct = () => {
    if (!newProduct.name ||!newProduct.price ||!newProduct.category ||!newProduct.darazLink ||!newProduct.image) {
      alert("Sab * wale fields bharo Jani!");
      return;
    }
    const product: Product = {
      id: editingProduct? editingProduct.id : Date.now().toString(),
      name: newProduct.name!,
      price: Number(newProduct.price),
      darazPrice: Number(newProduct.price),
      category: newProduct.category!,
      brand: newProduct.brand || "Al Safa",
      image: newProduct.image!,
      images: newProduct.images || [],
      darazLink: newProduct.darazLink!,
      caption: newProduct.caption || "",
      description: newProduct.description || "",
      bestSeller: newProduct.bestSeller || false,
      active: newProduct.active?? true,
      priceSync: newProduct.priceSync?? true,
      clicks: editingProduct? editingProduct.clicks : 0,
      date: new Date().toISOString().split('T')[0]
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id? product : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, product]);
    }

    setNewProduct({ name: "", price: 0, category: "Kitchen", brand: "", image: "", darazLink: "", caption: "", description: "", bestSeller: false, active: true, priceSync: true });
    setShowAddProduct(false);
    alert(`Product ${editingProduct? 'updated' : 'added'}! Ab Shop All + ${product.category} + Search me foran dikhega!`);
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      alert("Category name likho!");
      return;
    }
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id? {...c, name: newCategory.name!, slug: newCategory.name!.toLowerCase().replace(/\s+/g,'-'), order: newCategory.order!, active: newCategory.active! } : c));
      setEditingCategory(null);
    } else {
      const cat: Category = {
        id: Date.now().toString(),
        name: newCategory.name!,
        slug: newCategory.name!.toLowerCase().replace(/\s+/g,'-'),
        order: newCategory.order!,
        active: newCategory.active!,
        productCount: 0
      };
      setCategories([...categories, cat]);
    }
    setNewCategory({ name: "", order: categories.length + 2, active: true });
    setShowAddCategory(false);
    alert("Category saved! Ab Home Page pe pill update ho jayega - No code needed!");
  };

  const totalClicks = products.reduce((sum, p) => sum + p.clicks, 0);
  const activeCategories = categories.filter(c => c.active && c.slug!== "shop-all");

  return (
    <div className="min-h-screen bg-[#FFFCF5] flex font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-[#1A3C34] text-white flex flex-col fixed h-screen overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C5A572] rounded-full flex items-center justify-center font-bold text-[#1A3C34]">🏠</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Al Safa Traders</h1>
              <p className="text-xs text-white/60">Quality Products • Better Living</p>
            </div>
          </div>
        </div>
</div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { name: "Dashboard", icon: "🏠", active: true },
            { name: "Products", icon: "📦", count: products.length },
            { name: "Categories", icon: "⊞", count: categories.length },
            { name: "Orders", icon: "🛒" },
            { name: "Sales", icon: "📊" },
            { name: "Analytics", icon: "📈" },
            { name: "Website Settings", icon: "🌐" },
            { name: "Daraz Affiliate Links", icon: "🔗" },
            { name: "Product Images & Details", icon: "🖼️" },
            { name: "Captions", icon: "📝" },
            { name: "Customer Management", icon: "👤" },
            { name: "Admin Account", icon: "🛡️" },
            { name: "Change Password", icon: "🔒" },
            { name: "Help & Support", icon: "❓" },
          ].map(item => (
            <button
              key={item.name}
              onClick={() => setActiveView(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${activeView === item.name? "bg-[#C5A572] text-[#1A3C34] font-semibold" : "hover:bg-white/10 text-white/80"}`}
            >
              <span className="flex items-center gap-3"><span>{item.icon}</span> {item.name} {item.name === "Products" || item.name === "Categories"? ">" : ""}</span>
              {item.count!== undefined && <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{item.count}</span>}
            </button>
          ))}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white/80 mt-6">
            <span>🚪</span> Logout
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/40">Al Safa Traders</div>
          <div className="text-xs text-white/40">Admin Panel v1.0</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        <div className="bg-white border-b sticky top-0 z-20 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-xl">☰</span>
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products, categories..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-full border text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2">🔔</button>
            <div className="w-8 h-8 bg-[#1A3C34] rounded-full flex items-center justify-center text-white text-sm">A</div>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] rounded-[24px] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 mb-6 border border-green-100">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#1A3C34] mb-2">Welcome Back, Admin!</h1>
              <p className="text-[#1A3C34]/70 mb-6">Manage your products, categories, orders and keep your website updated from here.</p>
              <div className="text-sm font-medium">Categories</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border shadow-sm">
              <div className="text-2xl font-bold">{totalClicks}</div>
              <div className="text-sm font-medium">Total Clicks</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border shadow-sm">
              <div className="text-2xl font-bold">Rs. 0</div>
              <div className="text-sm font-medium">Estimated Commission</div>
            </div>
          </div>

          {activeView === "Dashboard" && (
            <div className="bg-white rounded-2xl p-6 border">
              <h3 className="font-bold mb-4">Quick Actions - Shop All Logic Working</h3>
              <button onClick={() => setShowAddProduct(true)} className="w-full bg-[#C5A572] text-[#1A3C34] font-semibold py-3 rounded-full mb-3">+ Add New Product (Shop All + Category + Search)</button>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {products.map(p => (
                  <div key={p.id} className="border rounded-2xl p-3">
                    <img src={p.image} className="w-full h-24 object-cover rounded-xl mb-2" alt={p.name} />
                    <div className="text-xs font-semibold truncate">{p.name}</div>
                    <div className="text-[10px] text-gray-500">{p.category} | {p.brand}</div>
                    <div className="text-xs font-bold">Rs. {p.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === "Categories" && (
            <div className="bg-white rounded-2xl p-6 border">
              <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold">Categories - Home Page Control (No Code Needed)</h2><button onClick={()=>{setEditingCategory(null); setNewCategory({name:"", order: categories.length+1, active:true}); setShowAddCategory(true);}} className="bg-[#1A3C34] text-white px-6 py-2.5 rounded-full text-sm">+ Add Category</button></div>
              <div className="space-y-2">
                {categories.sort((a,b)=>a.order-b.order).map(c=>(
                  <div key={c.id} className="flex justify-between items-center py-3 border-b"><span>#{c.order} {c.name} ({c.productCount} products)</span><span className="flex gap-2">{c.slug!=="shop-all" && <><button onClick={()=>{setEditingCategory(c); setNewCategory({name:c.name, order:c.order, active:c.active}); setShowAddCategory(true);}} className="text-blue-600 text-sm">Edit</button><button onClick={()=>setCategories(categories.filter(x=>x.id!==c.id))} className="text-red-600 text-sm">Delete</button></>}</span></div>
                ))}
              </div>
            </div>
          )}

          {activeView === "Products" && (
            <div className="bg-white rounded-2xl p-6 border">
              <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold">All Products - Shop All = {products.length} total</h2><button onClick={()=>setShowAddProduct(true)} className="bg-[#1A3C34] text-white px-6 py-2.5 rounded-full text-sm">+ Add Product</button></div>
              {products.map(p=>(
                <div key={p.id} className="flex justify-between border-b py-3"><span>{p.name} - {p.category} - Rs.{p.price} - ✓ Shop All</span><span className="flex gap-2"><button onClick={()=>{setEditingProduct(p); setNewProduct(p); setShowAddProduct(true);}} className="text-blue-600">Edit</button><button onClick={()=>setProducts(products.filter(x=>x.id!==p.id))} className="text-red-600">Delete</button></span></div>
              ))}
            </div>
          )}

          {activeView === "Website Settings" && (
            <div className="bg-white rounded-2xl p-6 border">
              <h2 className="text-xl font-bold mb-6">Website Settings - Home Page Control (No Code)</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="text-xs font-semibold">Top Banner Text</label><input value={settings.topBanner} onChange={e=>setSettings({...settings, topBanner:e.target.value})} className="w-full mt-1 border rounded-xl px-4 py-2.5 text-sm" /></div>
                <div><label className="text-xs font-semibold">Trust Badge</label><input value={settings.trustBadge} onChange={e=>setSettings({...settings, trustBadge:e.target.value})} className="w-full mt-1 border rounded-xl px-4 py-2.5 text-sm" /></div>
                <div className="md:col-span-2"><label className="text-xs font-semibold">Hero Heading</label><input value={settings.heroHeading} onChange={e=>setSettings({...settings, heroHeading:e.target.value})} className="w-full mt-1 border rounded-xl px-4 py-2.5 text-sm" /></div>
                <div className="md:col-span-2"><label className="text-xs font-semibold">Hero Image URL - Home Page Woman Image</label><input value={settings.heroImage} onChange={e=>setSettings({...settings, heroImage:e.target.value})} className="w-full mt-1 border rounded-xl px-4 py-2.5 text-sm" /></div>
              </div>
            </div>
          )}

          {(activeView === "Orders" || activeView === "Sales" || activeView === "Analytics") && (
            <div className="bg-white rounded-2xl p-12 border text-center">
              <h2 className="text-xl font-bold">{activeView}</h2>
              <p className="text-sm text-gray-500 mt-2">No orders found - No fake data. Real data will appear.</p>
            </div>
          )}
        </div>
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingProduct? "Edit Product" : "Add New Product"} - Shop All + Category + Search</h3>
              <button onClick={()=>{setShowAddProduct(false); setEditingProduct(null);}} className="w-8 h-8 bg-gray-100 rounded-full">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <input value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name:e.target.value})} placeholder="Product Name* - Shop All me dikhega" className="w-full border rounded-xl px-4 py-3 text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={newProduct.price || ""} onChange={e=>setNewProduct({...newProduct, price:Number(e.target.value)})} placeholder="Price Rs.*" className="border rounded-xl px-4 py-3 text-sm" />
                <select value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category:e.target.value})} className="border rounded-xl px-4 py-3 text-sm">
                  {categories.filter(c=>c.slug!=="shop-all").map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <input value={newProduct.brand} onChange={e=>setNewProduct({...newProduct, brand:e.target.value})} placeholder="Brand/Seller" className="w-full border rounded-xl px-4 py-3 text-sm" />
              <input value={newProduct.image} onChange={e=>setNewProduct({...newProduct, image:e.target.value})} placeholder="Image URL*" className="w-full border rounded-xl px-4 py-3 text-sm" />
              <input value={newProduct.darazLink} onChange={e=>setNewProduct({...newProduct, darazLink:e.target.value})} placeholder="Daraz Link* - Earning" className="w-full border rounded-xl px-4 py-3 text-sm" />
              <div className="border rounded-xl p-4 bg-gray-50">
                <div className="flex gap-2 mb-3">
                  <button onClick={()=>setCaptionMode("manual")} className={`px-4 py-2 rounded-full text-xs ${captionMode==="manual"? "bg-[#1A3C34] text-white" : "bg-white border"}`}>✏️ Khud Likho</button>
                  <button onClick={()=>setCaptionMode("auto")} className={`px-4 py-2 rounded-full text-xs ${captionMode==="auto"? "bg-[#C5A572] text-[#1A3C34]" : "bg-white border"}`}>🤖 Daraz Se Auto Fetch</button>
                </div>
                {captionMode==="auto" && <button onClick={handleFetchFromDaraz} disabled={isFetchingDaraz} className="w-full bg-[#C5A572] py-2.5 rounded-full text-sm mb-3">{isFetchingDaraz? "Fetching..." : "🔗 Fetch Caption from Daraz Link"}</button>}
                <textarea value={newProduct.caption} onChange={e=>setNewProduct({...newProduct, caption:e.target.value})} placeholder="Caption" className="w-full border rounded-xl px-4 py-3 text-sm" rows={3} />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={()=>{setShowAddProduct(false); setEditingProduct(null);}} className="flex-1 border py-3 rounded-full">Cancel</button>
                <button onClick={handleAddProduct} className="flex-1 bg-[#C5A572] font-bold py-3 rounded-full">Add to Live - Shop All + {newProduct.category}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md">
            <div className="p-6 border-b flex justify-between"><h3 className="font-bold">Add/Edit Category</h3><button onClick={()=>setShowAddCategory(false)} className="w-8 h-8 bg-gray-100 rounded-full">✕</button></div>
            <div className="p-6 space-y-4">
              <input value={newCategory.name} onChange={e=>setNewCategory({...newCategory, name:e.target.value})} placeholder="Kitchen, Bartan, Cleaning" className="w-full border rounded-xl px-4 py-3 text-sm" />
              <input type="number" value={newCategory.order} onChange={e=>setNewCategory({...newCategory, order:Number(e.target.value)})} placeholder="Order" className="w-full border rounded-xl px-4 py-3 text-sm" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={newCategory.active} onChange={e=>setNewCategory({...newCategory, active:e.target.checked})} /> Active on Home Page</label>
              <div className="flex gap-3 pt-2"><button onClick={()=>setShowAddCategory(false)} className="flex-1 border py-3 rounded-full">Cancel</button><button onClick={handleAddCategory} className="flex-1 bg-[#1A3C34] text-white py-3 rounded-full">Save</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
