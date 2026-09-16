"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MY_AFFILIATE_TAG = "alsafatraders";

function getAffiliateLink(originalLink: string) {
  if (!originalLink) return "";
  const separator = originalLink.includes("?") ? "&" : "?";
  return `${originalLink}${separator}aff_id=${MY_AFFILIATE_TAG}`;
}

export default function PendingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPending() {
    setLoading(true);
    const { data } = await supabase.from("pending_products").select("*").eq("status", "pending").order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }

  useEffect(() => { fetchPending(); }, []);

  const allSelected = products.length > 0 && selected.length === products.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(products.map((p: any) => p.id));
  };
  const toggleOne = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  async function approveSelected() {
    if (selected.length === 0) return;
    const selectedProducts = products.filter((p) => selected.includes(p.id));
    const productsWithAffiliate = selectedProducts.map((p) => ({
      product_name: p.product_name,
      daraz_price: p.daraz_price,
      category: p.category,
      daraz_link: p.daraz_link,
      affiliate_link: getAffiliateLink(p.daraz_link),
      image_url: p.image_url,
      seller_name: p.seller_name,
      status: 'live'
    }));

    const { error: insertError } = await supabase.from("products").insert(productsWithAffiliate);
    if (insertError) { alert(insertError.message); return; }

    await supabase.from("pending_products").update({ status: "approved" }).in("id", selected);
    alert(`${selected.length} LIVE!`);
    setSelected([]);
    fetchPending();
  }

  if (loading) return <div className="p-6 bg-black text-white min-h-screen">Loading...</div>;

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Pending - {products.length}</h1>
      <div className="mb-4 flex gap-4 bg-zinc-900 p-4 rounded">
        <label className="flex gap-2 font-bold"><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-5 h-5" /> Select All</label>
        <span>{selected.length} selected</span>
        {selected.length > 0 && <button onClick={approveSelected} className="ml-auto bg-green-600 px-6 py-2 rounded font-bold">Approve ({selected.length}) - Make Live</button>}
      </div>
      <div className="grid gap-3">
        {products.map((p: any) => (
          <div key={p.id} className="flex gap-3 bg-zinc-900 p-3 rounded border border-zinc-800">
            <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleOne(p.id)} className="w-5 h-5" />
            <div><p className="font-bold">{p.product_name}</p><p className="text-sm text-zinc-400">{p.seller_name} - Rs. {p.daraz_price}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
