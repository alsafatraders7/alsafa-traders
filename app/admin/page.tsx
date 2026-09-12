"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminMaster() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [products, setProducts] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [form, setForm] = useState({ name: "", price: "", image: "", daraz_link: "", category_id: "", description: "", best_seller: false, active: true });

  useEffect(() => {
    checkUser();
    fetchAll();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) setIsLogin(true);
    setLoading(false);
  };

  const fetchAll = async () => {
    const { data: p } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    const { data: c } = await supabase.from("categories").select("*");
    if (p) setProducts(p);
    if (c) setCategories(c);
  };

  const login = async () => {
    if (!email ||!pass) return alert("Email aur Password likho!");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
    if (error) {
      alert("Login Failed: " + error.message);
    } else {
      setIsLogin(true);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLogin(false);
  };

  const addProduct = async () => {
    if (!form.name) return alert("Name required");
    const { error } = await supabase.from("products").insert([{...form, category_id: form.category_id || null }]);
    if (error) alert(error.message); else { alert("LIVE HO GAYA!"); fetchAll(); }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  if (!isLogin) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#EBF5E9" }}>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px] border-t-4" style={{ borderColor: "#1A3C34" }}>
        <h1 className="text-2xl font-bold" style={{ color: "#1A3C34" }}>AL SAFA TRADERS</h1>
        <p className="text-sm mb-6 text-gray-500">Secure Admin Login</p>

        <label className="text-sm font-bold">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@alsafatraders.pk" className="w-full border p-3 rounded-lg mb-3" />

        <label className="text-sm font-bold">Password</label>
        <div className="relative mb-6">
          <input type={showPass? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" className="w-full border p-3 rounded-lg pr-16" autoComplete="new-password" />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-xs font-bold px-2 py-1 rounded" style={{ background: "#EBF5E9", color: "#1A3C34" }}>
            {showPass? "Hide" : "Show"}
          </button>
        </div>

        <button onClick={login} className="w-full py-3 rounded-lg text-white font-bold" style={{ background: "#1A3C34" }}>Log In</button>

        <div className="flex justify-center mt-4 text-sm">
          <a href="/" className="text-gray-500 underline">View Website</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#EBF5E9" }}>
      <div className="w-64 text-white p-5 flex flex-col" style={{ background: "#1A3C34" }}>
        <h2 className="text-xl font-bold mb-8">AL SAFA TRADERS</h2>
        {["Dashboard", "Products", "Categories", "Daraz"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`text-left py-2.5 px-3 rounded-lg mb-1 text-sm ${activeTab === tab? "bg-white text-[#1A3C34] font-bold" : ""}`}>
            {tab}
          </button>
        ))}
        <button onClick={logout} className="mt-auto text-left py-2 px-3 rounded bg-red-500/20">Logout</button>
      </div>
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg mb-6 border-l-4 flex justify-between" style={{ borderColor: "#1A3C34" }}>
          <span>Secure Login: {email} | Synced with Supabase</span>
          <a href="/" target="_blank" className="text-sm px-3 py-1 rounded-full text-white" style={{ background: "#1A3C34" }}>View Public Website</a>
        </div>
        {activeTab === "Dashboard" && <div className="bg-white p-6 rounded-xl shadow"><h3 className="font-bold">Welcome Back, Admin!</h3><p>Total Products: {products.length}</p></div>}
        {activeTab === "Products" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold mb-4">Add Product - Live</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value })} className="border p-2 rounded" />
              <input placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value })} className="border p-2 rounded" />
              <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({...form, image: e.target.value })} className="border p-2 rounded" />
              <input placeholder="Daraz Link" value={form.daraz_link} onChange={(e) => setForm({...form, daraz_link: e.target.value })} className="border p-2 rounded" />
            </div>
            <button onClick={addProduct} className="px-6 py-3 rounded font-bold text-white" style={{ background: "#1A3C34" }}>ADD TO LIVE WEBSITE</button>
          </div>
        )}
      </div>
    </div>
  );
}
