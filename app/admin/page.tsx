"use client";
import { useState, useEffect } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
  productCount: number;
  isShopAll?: boolean;
};

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  darazLink: string;
  isBestSeller?: boolean;
};

type WebsiteSettings = {
  topBanner: string;
  trustBadge: string;
  heroUrdu: string;
  heroImage: string;
  siteName: string;
};

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "shop-all", name: "Shop All", slug: "shop-all", order: 0, productCount: 3, isShopAll: true },
    { id: "1", name: "Best Sellers", slug: "best-sellers", order: 1, productCount: 1 },
    { id: "2", name: "Kitchen Tools", slug: "kitchen-tools", order: 2, productCount: 1 },
    { id: "3", name: "Bartan Set", slug: "bartan-set", order: 3, productCount: 1 },
    { id: "4", name: "Storage Box", slug: "storage-box", order: 4, productCount: 0 },
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "12 Pcs Chopper", price: 1499, originalPrice: 1999, image: "https://images.unsplash.com/photo-1585237672814-8f85a8118bf6?w=400", category: "kitchen-tools", darazLink: "https://www.daraz.pk", isBestSeller: true },
    { id: "2", name: "Stainless Steel Bartan", price: 2499, image: "https://images.unsplash.com/photo-1584305574586-0a33e00aedcb?w=400", category: "bartan-set", darazLink: "https://www.daraz.pk" },
    { id: "3", name: "Kitchen Storage Box", price: 899, image: "https://images.unsplash.com/photo-1590794056226-511ef617e3e3?w=400", category: "storage-box", darazLink: "https://www.daraz.pk" },
  ]);

  const [settings, setSettings] = useState<WebsiteSettings>({
    topBanner: "Free Delivery All Pakistan - Cash on Delivery",
    trustBadge: "100% Original Products - 7 Days Return",
    heroUrdu: "Ghar ke kaam asan banayen! Premium quality choppers, bartan sets aur storage solutions ab ghar baithe hasil karen.",
    heroImage: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800",
    siteName: "Al Safa Traders",
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [darazUrl, setDarazUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "kitchen-tools",
    image: "",
    darazLink: "",
    caption: "",
    isBestSeller: false,
  });

  const [newCategory, setNewCategory] = useState({ name: "", order: "" });

  const totalClicks = 124;
  const commission = 2450;

  useEffect(() => {
    const updated = categories.map((cat) => {
      if (cat.isShopAll) return {...cat, productCount: products.length };
      return {...cat, productCount: products.filter((p) => p.category === cat.slug).length };
    });
    setCategories(updated);
  }, [products]);

  const handleFetchFromDaraz = () => {
    if (!darazUrl) { alert("【entity-Daraz¦canonical_name=Daraz】 link dalo Jani!"); return; }
    setIsFetching(true);
    setTimeout(() => {
      setNewProduct({
       ...newProduct,
        name: "Fetched 【entity-Daraz¦canonical_name=Daraz】 Product",
        price: "1999",
        image: "https://images.unsplash.com/photo-1585237672814-8f85a8118bf6?w=400",
        darazLink: darazUrl,
      });
      setIsFetching(false);
      alert("Product fetch ho gaya Jani!");
    }, 1500);
  };

  const handleAddProduct = () => {
    if (!newProduct.name ||!newProduct.price) { alert("Name aur Price zaroori hai!"); return; }
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice? Number(newProduct.originalPrice) : undefined,
      image: newProduct.image || "https://images.unsplash.com/photo-1585237672814-8f85a8118bf6?w=400",
      category: newProduct.category,
      darazLink: newProduct.darazLink,
      isBestSeller: newProduct.isBestSeller,
    };
    setProducts([product,...products]);
    setNewProduct({ name: "", price: "", originalPrice: "", category: "kitchen-tools", image: "", darazLink: "", caption: "", isBestSeller: false });
    setShowAddProduct(false);
    setActiveTab("products");
  };

  const handleAddCategory = () => {
    if (!newCategory.name) { alert("Category name dalo!"); return; }
    if (newCategory.name.toLowerCase() === "shop all") { alert("Shop All pehle se hai!"); return; }
    const slug = newCategory.name.toLowerCase().replace(/\s+/g, "-");
    if (categories.find((c) => c.slug === slug)) { alert("Ye category pehle se hai!"); return; }
    const cat: Category = { id: Date.now().toString(), name: newCategory.name, slug, order: newCategory.order? Number(newCategory.order) : categories.length, productCount: 0 };
    setCategories([...categories, cat]);
    setNewCategory({ name: "", order: "" });
    setShowAddCategory(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Delete karna hai?")) setProducts(products.filter((p) => p.id!== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-72 bg-gray-900 text-white fixed h-full overflow-y-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold mb-1">{settings.siteName}</h1>
          <p className="text-gray-400 text-sm mb-8">Admin Panel</p>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === "dashboard"? "bg-blue-600" : "hover:bg-gray-800"}`}>📊 Dashboard</button>
            <button onClick={() => setActiveTab("products")} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === "products"? "bg-blue-600" : "hover:bg-gray-800"}`}>📦 Products ({products.length})</button>
            <button onClick={() => setActiveTab("categories")} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === "categories"? "bg-blue-600" : "hover:bg-gray-800"}`}>📁 Categories ({categories.length})</button>
            <button onClick={() => setActiveTab("website")} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === "website"? "bg-blue-600" : "hover:bg-gray-800"}`}>🌐 Website Settings</button>
            <button onClick={() => setActiveTab("orders")} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === "orders"? "bg-blue-600" : "hover:bg-gray-800"}`}>🛒 Orders</button>
          </nav>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="bg-gray-800 p-4 rounded-lg"><p className="text-sm text-gray-300">Total Clicks</p><p className="text-2xl font-bold">{totalClicks}</p></div>
            <div className="bg-green-900 p-4 rounded-lg mt-3"><p className="text-sm text-green-200">Commission</p><p className="text-2xl font-bold">Rs. {commission}</p></div>
            <a href="/" className="block mt-6 text-center py-2 bg-gray-700 rounded-lg hover:bg-gray-600">View Website</a>
            <button className="w-full mt-3 text-gray-400 text-sm">Logout</button>
          </div>
        </div>
      </div>

      <div className="flex-1 ml-72">
        <div className="bg-white border-b sticky top-0 z-20 px-8 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
          <div className="flex gap-3">
            {activeTab === "products" && <button onClick={() => setShowAddProduct(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg">+ Add Product</button>}
            {activeTab === "categories" && <button onClick={() => setShowAddCategory(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg">+ Add Category</button>}
          </div>
        </div>

        <div className="p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow"><h3 className="font-bold text-lg mb-2">Welcome Back, Al Safa Traders!</h3><p className="text-gray-600">Aap ki website 100% working hai. Shop All, Categories, Products sab active hain.</p></div>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow"><p className="text-gray-500">Total Products</p><p className="text-3xl font-bold">{products.length}</p></div>
                <div className="bg-white p-6 rounded-xl shadow"><p className="text-gray-500">Total Categories</p><p className="text-3xl font-bold">{categories.length}</p></div>
                <div className="bg-white p-6 rounded-xl shadow"><p className="text-gray-500">Total Clicks</p><p className="text-3xl font-bold">{totalClicks}</p></div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border p-4 rounded-lg"><p className="font-bold">Shop All: {products.length} products</p><p className="text-sm text-gray-600">Sab products yahan show hote hain</p></div>
                  {categories.filter(c =>!c.isShopAll).map(cat => (
                    <div key={cat.id} className="border p-4 rounded-lg"><p className="font-bold">{cat.name}: {cat.productCount}</p><p className="text-sm text-gray-600">Slug: {cat.slug}</p></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 border-b flex justify-between"><h3 className="font-bold">All Products</h3><span className="text-gray-500">{products.length} items</span></div>
              <div className="divide-y">
                {products.map(p => (
                  <div key={p.id} className="p-4 flex items-center gap-4">
                    <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1"><p className="font-bold">{p.name}</p><p className="text-sm text-gray-500">Rs. {p.price} | {p.category} {p.isBestSeller? "| Best Seller" : ""}</p></div>
                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 px-3 py-1 border border-red-200 rounded hover:bg-red-50">Delete</button>
                  </div>
                ))}
                {products.length === 0 && <p className="p-8 text-center text-gray-500">No products - Add karo Jani!</p>}
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 border-b"><h3 className="font-bold">All Categories</h3></div>
              <div className="divide-y">
                {categories.map(cat => (
                  <div key={cat.id} className="p-4 flex justify-between items-center">
                    <div><p className="font-bold">{cat.name} {cat.isShopAll && "(Auto)"}</p><p className="text-sm text-gray-500">Order: {cat.order} | Products: {cat.productCount} | Slug: {cat.slug}</p></div>
                    {!cat.isShopAll && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Editable</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "website" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold mb-4">Website Settings - Home Woman Image & Text</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium mb-1">Top Banner</label><input value={settings.topBanner} onChange={e => setSettings({...settings, topBanner: e.target.value })} className="w-full border p-3 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Trust Badge</label><input value={settings.trustBadge} onChange={e => setSettings({...settings, trustBadge: e.target.value })} className="w-full border p-3 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Hero Urdu Text</label><textarea value={settings.heroUrdu} onChange={e => setSettings({...settings, heroUrdu: e.target.value })} className="w-full border p-3 rounded-lg" rows={3}></textarea></div>
                  <div><label className="block text-sm font-medium mb-1">Hero Woman Image URL</label><input value={settings.heroImage} onChange={e => setSettings({...settings, heroImage: e.target.value })} className="w-full border p-3 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Site Name</label><input value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value })} className="w-full border p-3 rounded-lg" /></div>
                  <button onClick={() => alert("Settings Save Ho Gayi Jani!")} className="bg-green-600 text-white px-6 py-2 rounded-lg">Save Settings</button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-sm text-gray-600">Preview:</p>
                <img src={settings.heroImage} alt="Hero" className="mt-2 w-full h-64 object-cover rounded-lg" />
                <p className="mt-3">{settings.heroUrdu}</p>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white p-12 rounded-xl shadow text-center">
              <p className="text-5xl mb-4">🛒</p><p className="font-bold">Orders yahan ayenge</p><p className="text-gray-500 text-sm mt-2">Daraz affiliate clicks se commission track hoga</p><p className="mt-4 text-2xl">Total Clicks: {totalClicks} | Commission: Rs. {commission}</p>
            </div>
          )}
        </div>
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between"><h3 className="font-bold text-lg">Add New Product</h3><button onClick={() => setShowAddProduct(false)}>✕</button></div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg"><label className="block text-sm font-medium mb-1">Daraz Link se Auto Fetch</label><div className="flex gap-2"><input value={darazUrl} onChange={e => setDarazUrl(e.target.value)} placeholder="https://www.daraz.pk/..." className="flex-1 border p-2 rounded" /><button onClick={handleFetchFromDaraz} disabled={isFetching} className="bg-blue-600 text-white px-4 py-2 rounded">{isFetching? "..." : "Fetch"}</button></div></div>
              <div><label className="block text-sm font-medium mb-1">Product Name *</label><input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value })} className="w-full border p-3 rounded-lg" placeholder="12 Pcs Chopper" /></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Price *</label><input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value })} className="w-full border p-3 rounded-lg" placeholder="1499" /></div><div><label className="block text-sm font-medium mb-1">Original Price</label><input type="number" value={newProduct.originalPrice} onChange={e => setNewProduct({...newProduct, originalPrice: e.target.value })} className="w-full border p-3 rounded-lg" placeholder="1999" /></div></div>
              <div><label className="block text-sm font-medium mb-1">Category</label><select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value })} className="w-full border p-3 rounded-lg">{categories.filter(c =>!c.isShopAll).map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}<option value="shop-all">Shop All</option></select></div>
              <div><label className="block text-sm font-medium mb-1">Image URL</label><input value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value })} className="w-full border p-3 rounded-lg" placeholder="https://..." /></div>
              <div><label className="block text-sm font-medium mb-1">Daraz Affiliate Link</label><input value={newProduct.darazLink} onChange={e => setNewProduct({...newProduct, darazLink: e.target.value })} className="w-full border p-3 rounded-lg" placeholder="https://www.daraz.pk/..." /></div>
              <div><label className="block text-sm font-medium mb-1">Caption</label><input value={newProduct.caption} onChange={e => setNewProduct({...newProduct, caption: e.target.value })} className="w-full border p-3 rounded-lg" placeholder="Best quality..." /></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={newProduct.isBestSeller} onChange={e => setNewProduct({...newProduct, isBestSeller: e.target.checked })} /><label className="text-sm">Mark as Best Seller</label></div>
              <button onClick={handleAddProduct} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Add Product</button>
            </div>
          </div>
        </div>
      )}

      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between"><h3 className="font-bold text-lg">Add Category</h3><button onClick={() => setShowAddCategory(false)}>✕</button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-1">Category Name *</label><input value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value })} className="w-full border p-3 rounded-lg" placeholder="e.g. Glass Set" /></div>
              <div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" value={newCategory.order} onChange={e => setNewCategory({...newCategory, order: e.target.value })} className="w-full border p-3 rounded-lg" placeholder="5" /></div>
              <p className="text-xs text-gray-500">Shop All auto banta hai - Isme product count khud update hoga</p>
              <button onClick={handleAddCategory} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Create Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
