"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PendingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('pending_products').select('*').eq('status','pending').order('id', {ascending: false});
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (p: any) => {
    // Stealth Profit: Daraz Price + 30% = Aap ka Price
    const myPrice = Math.round(p.daraz_price * 1.3);
    await supabase.from('products').insert({
      name: p.product_name,
      price: myPrice,
      original_price: p.daraz_price,
      image: p.image_url,
      daraz_link: p.daraz_link,
      category: p.category,
      is_stealth: true
    });
    await supabase.from('pending_products').update({ status: 'approved' }).eq('id', p.id);
    alert(`Approved! ${p.product_name} - Profit: Rs.${myPrice - p.daraz_price}`);
    load();
  };

  const reject = async (id: number) => {
    await supabase.from('pending_products').update({ status: 'rejected' }).eq('id', id);
    load();
  };

  const fetchDaraz = async () => {
    const res = await fetch('/api/fetch-【entity-daraz¦canonical_name=Daraz】');
    const d = await res.json();
    alert(d.message);
    load();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Al Safa Traders - Pending (Kitchen + Home Gadgets)</h1>
      <button onClick={fetchDaraz} style={{ marginTop: '15px', padding: '10px 20px', background: 'black', color: 'white', borderRadius: '8px' }}>Fetch 【entity-Daraz¦canonical_name=Daraz】 Products</button>
      <button onClick={load} style={{ marginLeft: '10px', padding: '10px 20px', background: '#eee', borderRadius: '8px' }}>Refresh</button>
      
      {loading ? <p style={{marginTop: '20px'}}>Loading...</p> : (
        <div style={{ marginTop: '20px', display: 'grid', gap: '15px' }}>
          {products.length === 0 ? <p>No Pending Products - Fetch Karo!</p> : products.map((p) => (
            <div key={p.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px', display: 'flex', gap: '15px' }}>
              <img src={p.image_url} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold' }}>{p.product_name}</p>
                <p>【entity-Daraz¦canonical_name=Daraz】: Rs.{p.daraz_price} | Category: {p.category}</p>
                <p style={{ fontSize: '12px', color: 'green' }}>My Price (30% Profit): Rs.{Math.round(p.daraz_price * 1.3)}</p>
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => approve(p)} style={{ padding: '6px 15px', background: 'green', color: 'white', borderRadius: '5px', marginRight: '10px' }}>Approve + Add Profit</button>
                  <button onClick={() => reject(p.id)} style={{ padding: '6px 15px', background: 'red', color: 'white', borderRadius: '5px' }}>Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
