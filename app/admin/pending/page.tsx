"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PendingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPending(); }, []);

  async function fetchPending() {
    setLoading(true);
    const { data, error } = await supabase
      .from('pending_products')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  }

  const allSelected = products.length > 0 && selected.length === products.length;
  
  function toggleSelectAll() {
    if (allSelected) setSelected([]);
    else setSelected(products.map((p: any) => p.id));
  }

  function toggleOne(id: number) {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  async function approveSelected() {
    const { error } = await supabase
      .from('pending_products')
      .update({ status: 'approved' })
      .in('id', selected);
    
    if (!error) {
      alert(`${selected.length} Products Approved - LIVE!`);
      setSelected([]);
      fetchPending();
    }
  }

  if (loading) return <div className="p-6 text-white bg-black min-h-screen">Loading Pending Products...</div>;

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">【entity-Daraz¦canonical_name=Daraz】 Pending - {products.length} Products</h1>
      
      <div className="mb-6 flex gap-4 items-center bg-zinc-900 p-4 rounded border border-zinc-800">
        <label className="flex items-center gap-2 cursor-pointer font-bold">
          <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-5 h-5 accent-green-600" />
          Select All
        </label>
        <span className="text-zinc-500">|</span>
        <span className="text-sm text-zinc-400">{selected.length} selected</span>
        {selected.length > 0 && (
          <button onClick={approveSelected} className="ml-auto bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-bold">
            Approve Selected ({selected.length}) - Make Live
          </button>
        )}
      </div>

      <div className="grid gap-3">
        {products.length === 0 ? (
          <p className="text-zinc-500">Koi pending product nahi hai - Bot abhi add karega!</p>
        ) : (
          products.map((p: any) => (
            <div key={p.id} className="flex items-center gap-3 bg-zinc-900 p-3 rounded border border-zinc-800">
              <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleOne(p.id)} className="w-5 h-5 accent-green-600" />
              <div className="flex-1">
                <p className="font-bold">{p.product_name}</p>
                <p className="text-sm text-zinc-400">{p.seller_name} - Rs. {p.daraz_price} - {p.category}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
