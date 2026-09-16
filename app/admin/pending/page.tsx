'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PendingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  async function fetchPending() {
    const { data } = await supabase.from('pending_products').select('*').eq('status', 'pending').order('id', { ascending: false });
    if (data) setProducts(data);
  }

  useEffect(() => { fetchPending(); }, []);

  const toggle = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === products.length) setSelected([]);
    else setSelected(products.map(p => p.id));
  };

  async function approveSelected() {
    if (selected.length === 0) return alert("Koi product select nahi kiya!");
    
    // Direct status approved - affiliate auto /go page lagayega
    const { error } = await supabase.from('pending_products').update({ status: 'approved' }).in('id', selected);
    
    if (!error) {
      alert(`${selected.length} Products Approved LIVE! Affiliate Auto Active 💰`);
      setSelected([]);
      fetchPending();
    }
  }

  async function deleteSelected() {
    if (selected.length === 0) return;
    await supabase.from('pending_products').delete().in('id', selected);
    setSelected([]);
    fetchPending();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daraz Pending - {products.length} Products</h1>
      
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2"><input type="checkbox" checked={selected.length === products.length && products.length > 0} onChange={toggleAll} /> Select All | {selected.length} selected</label>
        <button onClick={approveSelected} className="bg-green-600 text-white px-4 py-2 rounded">Approve Selected ({selected.length}) - Make Live</button>
        <button onClick={deleteSelected} className="bg-red-600 text-white px-4 py-2 rounded">Delete Selected</button>
      </div>

      <div className="grid gap-3">
        {products.map(p => (
          <div key={p.id} className="border p-3 flex gap-4 items-center">
            <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />
            <img src={p.image_url} className="w-16 h-16 object-cover" />
            <div>
              <p className="font-semibold">{p.product_name}</p>
              <p className="text-sm text-gray-500">{p.store_name} - Rs.{p.daraz_price}</p>
              <p className="text-xs truncate w-96">{p.daraz_link}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
