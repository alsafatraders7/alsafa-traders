"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Admin() {
  const [form, setForm] = useState({ name:"", price:"", op:"", cat:"Kitchen", link:"", detail:"", img1:"", img2:"", img3:"", img4:"" });
  const [msg, setMsg] = useState("");

  const save = async () => {
    if(!form.name ||!form.price ||!form.img1 ||!form.link){ setMsg("Name, Price, Image 1, Link lazmi hai!"); return; }
    let dlink = form.link.split("?")[0].split("&")[0] + "?cc";
    const { error } = await supabase.from("products").insert({
      name: form.name,
      price: parseInt(form.price),
      original_price: form.op? parseInt(form.op) : parseInt(form.price)*1.3,
      category: form.cat,
      image: form.img1,
      image_url: form.img1,
      daraz_link: dlink,
      daraz_url: dlink,
      description: `${form.detail} | IMG2:${form.img2} | IMG3:${form.img3} | IMG4:${form.img4}`
    });
    if(error) setMsg("Error: "+error.message);
    else { setMsg(`MASHALLAH! ${form.name} LIVE ho gaya!?cc ke sath!`); setForm({ name:"", price:"", op:"", cat:"Kitchen", link:"", detail:"", img1:"", img2:"", img3:"", img4:"" }); }
  };

  return (
    <div style={{padding:20, maxWidth:500, margin:"auto", fontFamily:"sans-serif"}}>
      <h2>Al Safa Traders - Product Add</h2>
      <p>Category Select Karo - 4 Picture - Link Auto?cc</p>

      <select value={form.cat} onChange={e=>setForm({...form, cat:e.target.value})} style={{width:"100%", padding:10, margin:"5px 0"}}>
        <option>Kitchen</option><option>Bartan</option><option>Storage & Organizers</option><option>Cleaning</option><option>Home Essentials</option>
      </select>
      <input placeholder="Product Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={{width:"100%", padding:10, margin:"5px 0"}}/>
      <input placeholder="Price (e.g 1299)" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} style={{width:"100%", padding:10, margin:"5px 0"}}/>
      <input placeholder="Original Price (e.g 1999)" value={form.op} onChange={e=>setForm({...form, op:e.target.value})} style={{width:"100%", padding:10, margin:"5px 0"}}/>
      <input placeholder="【entity-Daraz¦canonical_name=Daraz】 Link Paste Karo - Auto?cc lagega" value={form.link} onChange={e=>setForm({...form, link:e.target.value})} style={{width:"100%", padding:10, margin:"5px 0"}}/>
      <textarea placeholder="Detail / Type" value={form.detail} onChange={e=>setForm({...form, detail:e.target.value})} style={{width:"100%", padding:10, margin:"5px 0"}}/>
      <input placeholder="Picture 1 Link (Main)" value={form.img1} onChange={e=>setForm({...form, img1:e.target.value})} style={{width:"100%", padding:10, margin:"5px 0"}}/>
      <input placeholder="Picture 2 Link" value={form.img2} onChange={e=>setForm({...form, img2:e.target.value})} style={{width:"100%", padding:10, margin:"5px 0"}}/>
      <input placeholder="Picture 3 Link" value={form.img3} onChange={e=>setForm({...form, img3:e.target.value})} style={{width:"100%", padding:10, margin:"5px 0"}}/>
      <input placeholder="Picture 4 Link" value={form.img4} onChange={e=>setForm({...form, img4:e.target.value})} style={{width:"100%", padding:10, margin:"5px 0"}}/>

      <button onClick={save} style={{width:"100%", padding:15, background:"green", color:"white", border:"none", fontSize:16, marginTop:10}}>Product LIVE Karo - Price Live</button>
      <p style={{color: form.name? "green":"red", fontWeight:"bold"}}>{msg}</p>

      <hr/>
      <p><b>Tarika:</b> 【entity-Daraz¦canonical_name=Daraz】 pe jao > Product ka Link copy karo > Yahan paste karo > System auto <b>?cc</b> laga dega > Aap ka profit!</p>
      <a href="/" style={{display:"block", textAlign:"center", marginTop:20}}>Web Dekho - www.alsafatraders.pk</a>
    </div>
  );
}
