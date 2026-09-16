"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PendingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => { fetchPending(); }, []);

  async function fetchPending() {
    const { data } = await supabase.from('pending_products').select('*').eq('status','pending').order('created_at',{ascending:false});
    if(data) setProducts(data);
  }

  const allSelected = products.length>0 && selected.length===products.length;
  function toggleSelectAll(){ if(allSelected) setSelected([]); else setSelected(products.map(p=>p.id)); }
  function toggleOne(id:number){ setSelected(selected.includes(id)?selected.filter(s=>s!==id):[...selected,id]); }
  async function approveSelected(){
    await supabase.from('pending_products').update({status:'approved'}).in('id',selected);
    setSelected([]); fetchPending(); alert(`${selected.length} Approved!`);
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Daraz Pending - {products.length}</h1>
      <div className="mb-4 flex gap-4 items-center">
        <label className="flex gap-2 items-center cursor-pointer"><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-5 h-5"/><span className="font-bold">Select All</span></label>
        {selected.length>0 && <button onClick={approveSelected} className="bg-green-600 px-4 py-2 rounded font-bold">Approve Selected ({selected.length})</button>}
      </div>
      <div className="grid gap-3">
        {products.map(p=>(
          <div key={p.id} className="flex gap-3 bg-zinc-900 p-3 rounded border border-zinc-800 items-center">
            <input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggleOne(p.id)} className="w-5 h-5"/>
            <div className="flex-1"><p className="font-bold">{p.product_name}</p><p className="text-sm text-zinc-400">{p.seller_name} - Rs.{p.daraz_price}</p></div>
            <span className="text-xs bg-yellow-600 px-2 py-1 rounded">{p.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
